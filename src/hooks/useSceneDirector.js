import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from './useLenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scene Director
 * ==============
 * Drives the scroll-based wedding film as smooth, intentional cinematic scenes:
 *
 * - Forward gesture:
 *   1. Strictly one scene per deliberate gesture: a forward gesture is ONLY
 *      accepted after the current scene has completely finished and settled
 *      (never queued or auto-chained mid-animation).
 *   2. Controlled, elegant scene transition (`~1.05s`, `sine.inOut`) into the
 *      next section's pinned stage (`scene.start`).
 *   3. Unhurried, progressive in-scene reveal (`~3.3s - 4.2s`, `sine.inOut`)
 *      from `scene.start` to `scene.complete`.
 *
 * - Backward gesture:
 *   Kept exactly as-is — fast, feather-light glide (`0.68s`, `power3.out`)
 *   directly back to the previous section's completed state, with instant
 *   swipe-chaining on mobile.
 */

const SCENE_PREFIX = 'scene:';
const STOP_EPSILON = 4; // px tolerance when comparing scroll to a stop
const HANDOFF_DURATION = 1.05; // seconds for controlled, cinematic section-to-section transition
const OVERLAP_HANDOFF_DURATION = 0.85; // seconds for Ceremony -> Reception cross-dissolve
const SCENE_PLAY_DURATION = 3.5; // seconds for progressive in-section element reveal
const BACKWARD_DURATION = 0.68; // seconds for fast, silky reverse navigation (UNCHANGED)
const FORWARD_SETTLE = 0.32; // seconds pause after a forward scene completes before next forward scroll
const BACKWARD_SETTLE = 0.04; // seconds settle buffer after backward tween completes
const SWIPE_THRESHOLD = 16; // px of finger travel that triggers a mobile swipe
const WHEEL_THRESHOLD = 5; // ignore micro wheel noise
const WHEEL_IDLE_GAP = 180; // ms of wheel silence that starts a fresh gesture

function getMaxScroll() {
  return Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
}

function getScenes() {
  const max = getMaxScroll();
  const scenes = [];

  ScrollTrigger.getAll().forEach((st) => {
    const id = st.vars && st.vars.id;
    if (typeof id !== 'string' || !id.startsWith(SCENE_PREFIX)) return;

    const anim = st.animation;
    let progress = 1;

    if (anim && anim.labels && typeof anim.labels.complete === 'number') {
      const total = anim.duration();
      if (total > 0) progress = Math.min(1, anim.labels.complete / total);
    }

    const start = Math.max(0, Math.min(max, Math.round(st.start)));
    const complete = Math.max(
      0,
      Math.min(max, Math.round(st.start + (st.end - st.start) * progress))
    );
    const end = Math.max(0, Math.min(max, Math.round(st.end)));

    scenes.push({ id, start, complete, end });
  });

  scenes.sort((a, b) => a.complete - b.complete);

  const filtered = [];
  for (let i = 0; i < scenes.length; i += 1) {
    if (
      filtered.length === 0 ||
      scenes[i].complete - filtered[filtered.length - 1].complete > 40
    ) {
      filtered.push(scenes[i]);
    }
  }

  return filtered;
}

function getSceneDuration(id) {
  if (id === 'scene:names') return 3.4;
  if (id === 'scene:ceremony') return 3.7;
  if (id === 'scene:reception') return 3.6;
  if (id === 'scene:date') return 3.9;
  if (id === 'scene:photo') return 3.35;
  if (id === 'scene:final') return 4.2;
  return SCENE_PLAY_DURATION;
}

function isEditableTarget(target) {
  if (!target || !target.closest) return false;
  return Boolean(
    target.closest('input, textarea, select, [contenteditable="true"]')
  );
}

export default function useSceneDirector(enabled) {
  useEffect(() => {
    if (!enabled) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const root = document.documentElement;
    root.classList.add('scene-director');

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const lenis = getLenis();
    // Lenis stays alive (ticker + ScrollTrigger sync) while Scene Director
    // controls scroll position directly at 60fps.
    if (lenis) lenis.stop();

    const proxy = { y: window.scrollY };

    let animating = false;
    let activeDirection = 0;
    let activeTargetY = null;
    let releaseTimer = null;
    let introTimer = null;
    let activeTween = null;

    // Wheel gesture bookkeeping (handles trackpad inertia).
    let wheelGestureConsumed = false;
    let lastWheelTime = 0;
    let lastWheelMagnitude = 0;

    // Touch bookkeeping.
    let touchStartY = null;
    let touchFired = false;
    let touchStartedWhileAnimatingForward = false;

    const setScroll = (y) => {
      if (lenis) {
        lenis.scrollTo(y, { immediate: true, force: true });
      } else {
        window.scrollTo(0, y);
      }
    };

    const finishAnimation = (finalY, settleSeconds) => {
      setScroll(finalY);
      ScrollTrigger.update();
      activeTween = null;
      if (releaseTimer) window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(() => {
        animating = false;
        activeDirection = 0;
        activeTargetY = null;
        wheelGestureConsumed = true;
        root.classList.remove('scene-director--playing');
      }, settleSeconds * 1000);
    };

    const killActive = () => {
      if (activeTween) {
        activeTween.kill();
        activeTween = null;
      }
      if (releaseTimer) {
        window.clearTimeout(releaseTimer);
        releaseTimer = null;
      }
    };

    const playForward = (scene, customDuration) => {
      const current = window.scrollY;
      const target = scene.complete;
      if (Math.abs(target - current) <= STOP_EPSILON) return;

      killActive();
      animating = true;
      activeDirection = 1;
      activeTargetY = target;
      root.classList.add('scene-director--playing');
      proxy.y = current;

      const entryY = Math.max(current, Math.min(target, scene.start));
      const handoffDist = entryY - current;
      const playDist = target - entryY;
      const playDuration = customDuration || getSceneDuration(scene.id);
      const handoffDuration =
        scene.id === 'scene:reception'
          ? OVERLAP_HANDOFF_DURATION
          : HANDOFF_DURATION;

      const tl = gsap.timeline({
        onComplete: () => finishAnimation(target, FORWARD_SETTLE),
      });

      if (handoffDist > 24 && playDist > 24) {
        // Phase 1: Controlled, cinematic transition out of current section
        // and smooth arrival into the next section's pinned stage.
        tl.to(proxy, {
          y: entryY,
          duration: handoffDuration,
          ease: 'sine.inOut',
          onUpdate: () => setScroll(proxy.y),
        });
        // Phase 2: Section establishes first, then internal elements reveal
        // progressively at a steady, unhurried pace before settling.
        tl.to(proxy, {
          y: target,
          duration: playDuration,
          ease: 'sine.inOut',
          onUpdate: () => setScroll(proxy.y),
        });
      } else {
        tl.to(proxy, {
          y: target,
          duration: playDuration,
          ease: 'sine.inOut',
          onUpdate: () => setScroll(proxy.y),
        });
      }

      activeTween = tl;
    };

    const playBackward = (scene, customDuration) => {
      const current = window.scrollY;
      const target = scene.complete;
      if (Math.abs(target - current) <= STOP_EPSILON) return;

      killActive();
      animating = true;
      activeDirection = -1;
      activeTargetY = target;
      root.classList.add('scene-director--playing');
      proxy.y = current;

      activeTween = gsap.to(proxy, {
        y: target,
        duration: customDuration || BACKWARD_DURATION,
        ease: 'power3.out',
        overwrite: true,
        onUpdate: () => setScroll(proxy.y),
        onComplete: () => finishAnimation(target, BACKWARD_SETTLE),
      });
    };

    const canInterrupt = (direction) => {
      if (!animating) return true;
      // Backward scrolling is always immediately interruptible / chainable.
      if (direction < 0) return true;
      // Forward scrolling NEVER interrupts or auto-chains while a scene is playing;
      // the current scene must finish and settle completely first.
      return false;
    };

    const go = (direction) => {
      if (!canInterrupt(direction)) return;

      const scenes = getScenes();
      if (scenes.length === 0) return;

      const referenceY =
        animating && activeTargetY != null && direction === activeDirection
          ? activeTargetY
          : window.scrollY;

      if (direction > 0) {
        const nextScene = scenes.find(
          (s) => s.complete > referenceY + STOP_EPSILON
        );
        if (nextScene) playForward(nextScene);
      } else {
        let prevScene = null;
        for (let i = scenes.length - 1; i >= 0; i -= 1) {
          if (scenes[i].complete < referenceY - STOP_EPSILON) {
            prevScene = scenes[i];
            break;
          }
        }
        if (prevScene) {
          playBackward(prevScene);
        } else if (window.scrollY > STOP_EPSILON) {
          playBackward({ id: 'scene:top', start: 0, complete: 0, end: 0 }, 0.55);
        }
      }
    };

    const goTo = (edge) => {
      const scenes = getScenes();
      if (scenes.length === 0) return;
      if (edge === 'start') {
        playBackward(scenes[0], 0.8);
      } else if (!animating) {
        playForward(scenes[scenes.length - 1], 2.2);
      }
    };

    /* ---------------- Wheel / trackpad ---------------- */
    const onWheel = (event) => {
      if (event.ctrlKey) return; // pinch-zoom on trackpads
      event.preventDefault();

      const now = performance.now();
      const magnitude = Math.abs(event.deltaY);
      const gap = now - lastWheelTime;
      lastWheelTime = now;

      const isNewGesture =
        gap > WHEEL_IDLE_GAP ||
        (magnitude > 20 && magnitude > lastWheelMagnitude * 1.6);
      lastWheelMagnitude = magnitude;

      if (isNewGesture) wheelGestureConsumed = false;
      if (wheelGestureConsumed) return;
      if (magnitude < WHEEL_THRESHOLD) return;

      // Consume this wheel gesture immediately so trackpad inertia cannot
      // linger and trigger the next section when the current animation ends.
      wheelGestureConsumed = true;

      const direction = event.deltaY > 0 ? 1 : -1;
      if (!canInterrupt(direction)) return;

      go(direction);
    };

    /* ---------------- Touch ---------------- */
    const onTouchStart = (event) => {
      if (event.touches.length !== 1) {
        touchStartY = null;
        return;
      }
      touchStartY = event.touches[0].clientY;
      touchFired = false;
      touchStartedWhileAnimatingForward = animating && activeDirection > 0;
    };

    const onTouchMove = (event) => {
      if (touchStartY == null) return;
      if (event.cancelable) event.preventDefault();
      if (touchFired) return;

      const dy = touchStartY - event.touches[0].clientY;
      if (Math.abs(dy) < SWIPE_THRESHOLD) return;

      // Mark touch as fired immediately so holding/dragging a finger while a
      // scene finishes can never auto-advance into the next scene.
      touchFired = true;

      const direction = dy > 0 ? 1 : -1;
      if (direction > 0 && touchStartedWhileAnimatingForward) return;
      if (!canInterrupt(direction)) return;

      go(direction);
    };

    const onTouchEnd = () => {
      touchStartY = null;
      touchStartedWhileAnimatingForward = false;
    };

    /* ---------------- Keyboard ---------------- */
    const onKeyDown = (event) => {
      if (isEditableTarget(event.target)) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      const interactive =
        event.target &&
        event.target.closest &&
        event.target.closest('button, a, [role="button"]');

      switch (event.key) {
        case 'ArrowDown':
        case 'PageDown':
          event.preventDefault();
          go(1);
          break;
        case 'ArrowUp':
        case 'PageUp':
          event.preventDefault();
          go(-1);
          break;
        case ' ':
        case 'Spacebar':
          if (interactive) return;
          event.preventDefault();
          go(event.shiftKey ? -1 : 1);
          break;
        case 'Home':
          event.preventDefault();
          goTo('start');
          break;
        case 'End':
          event.preventDefault();
          goTo('end');
          break;
        default:
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    // Refresh ScrollTrigger pins and immediately play Scene 01 (NamesScene)
    // so it composes gracefully right after the envelope opens, then STOPS
    // and waits on Scene 01 until the user scrolls.
    ScrollTrigger.refresh();
    introTimer = window.setTimeout(() => {
      const scenes = getScenes();
      if (scenes.length > 0 && window.scrollY < scenes[0].complete - STOP_EPSILON) {
        playForward(scenes[0], 3.4);
      }
    }, 60);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
      killActive();
      if (introTimer) window.clearTimeout(introTimer);
      root.classList.remove('scene-director', 'scene-director--playing');
      if (lenis) lenis.start();
    };
  }, [enabled]);
}
