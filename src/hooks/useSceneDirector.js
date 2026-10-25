import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from './useLenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scene Director
 * ==============
 * Drives the scroll-based wedding film as smooth, responsive cinematic scenes:
 *
 * - Forward gesture:
 *   1. Brisk, silky handoff (`~0.48s`, `power2.inOut`) across the inter-section
 *      scroll gap until the next section is pinned full-screen (`scene.start`).
 *   2. Graceful in-scene timeline playback (`~2.35s - 2.75s`, `power1.out`)
 *      from `scene.start` to `scene.complete` so every element inside the
 *      section composes smoothly and sequentially.
 *
 * - Backward gesture:
 *   Fast, feather-light glide (`~0.68s`, `power3.out`) directly back to the
 *   previous section's completed state, with instant swipe-chaining if the
 *   user swipes backward multiple times in a row on mobile.
 */

const SCENE_PREFIX = 'scene:';
const STOP_EPSILON = 4; // px tolerance when comparing scroll to a stop
const HANDOFF_DURATION = 0.48; // seconds to cross inter-section gap into next pin
const SCENE_PLAY_DURATION = 2.35; // seconds to play a pinned scene's internal timeline
const BACKWARD_DURATION = 0.68; // seconds for fast, silky reverse navigation
const RELEASE_SETTLE = 0.04; // seconds settle buffer after tween completes
const SWIPE_THRESHOLD = 16; // px of finger travel that triggers a mobile swipe
const WHEEL_THRESHOLD = 5; // ignore micro wheel noise
const WHEEL_IDLE_GAP = 140; // ms of wheel silence that starts a fresh gesture

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
  if (id === 'scene:date') return 2.8;
  if (id === 'scene:final') return 2.75;
  if (id === 'scene:photo') return 2.15;
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

    const setScroll = (y) => {
      if (lenis) {
        lenis.scrollTo(y, { immediate: true, force: true });
      } else {
        window.scrollTo(0, y);
      }
    };

    const finishAnimation = (finalY) => {
      setScroll(finalY);
      ScrollTrigger.update();
      activeTween = null;
      if (releaseTimer) window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(() => {
        animating = false;
        activeDirection = 0;
        activeTargetY = null;
        root.classList.remove('scene-director--playing');
      }, RELEASE_SETTLE * 1000);
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

      const tl = gsap.timeline({
        onComplete: () => finishAnimation(target),
      });

      if (handoffDist > 24 && playDist > 24) {
        // Phase 1: Brisk, smooth section-to-section handoff into the new pin
        tl.to(proxy, {
          y: entryY,
          duration: HANDOFF_DURATION,
          ease: 'power2.inOut',
          onUpdate: () => setScroll(proxy.y),
        });
        // Phase 2: Unhurried in-section animation while pinned
        tl.to(proxy, {
          y: target,
          duration: playDuration,
          ease: 'power1.out',
          onUpdate: () => setScroll(proxy.y),
        });
      } else {
        tl.to(proxy, {
          y: target,
          duration: playDuration,
          ease: 'power1.out',
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
        onComplete: () => finishAnimation(target),
      });
    };

    const canInterrupt = (direction) => {
      if (!animating) return true;
      // Always allow interrupting or chaining when scrolling backward, or
      // when reversing direction mid-flight.
      if (direction < 0 || direction !== activeDirection) return true;
      // Allow chaining forward swipes when current scene is nearly complete (>80%).
      if (activeTween && typeof activeTween.progress === 'function') {
        return activeTween.progress() > 0.8;
      }
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
      } else {
        playForward(scenes[scenes.length - 1], 1.6);
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

      const direction = event.deltaY > 0 ? 1 : -1;
      if (!canInterrupt(direction)) return;

      wheelGestureConsumed = true;
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
    };

    const onTouchMove = (event) => {
      if (touchStartY == null) return;
      if (event.cancelable) event.preventDefault();
      if (touchFired) return;

      const dy = touchStartY - event.touches[0].clientY;
      if (Math.abs(dy) < SWIPE_THRESHOLD) return;

      const direction = dy > 0 ? 1 : -1;
      if (!canInterrupt(direction)) return;

      touchFired = true;
      go(direction);
    };

    const onTouchEnd = () => {
      touchStartY = null;
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
    // so it composes gracefully right after the envelope opens.
    ScrollTrigger.refresh();
    introTimer = window.setTimeout(() => {
      const scenes = getScenes();
      if (scenes.length > 0 && window.scrollY < scenes[0].complete - STOP_EPSILON) {
        playForward(scenes[0], 2.5);
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
