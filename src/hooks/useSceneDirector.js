import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from './useLenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scene Director
 * ==============
 * Turns the long scroll-driven page into a sequence of cinematic scenes.
 *
 * Every major scene keeps its own pinned + scrubbed ScrollTrigger timeline
 * (so all existing animations, reverse scrolling and Lenis sync keep working).
 * The director only decides WHERE the scroll position should travel to:
 *
 *   one intentional gesture (wheel / trackpad / swipe / key)
 *     -> input is captured (locked)
 *     -> the real scroll position is tweened to the next scene's
 *        "complete" point, so the scene's scrubbed timeline plays like
 *        a short film
 *     -> scene reaches 100% -> input is released
 *     -> next gesture plays the next scene
 *
 * Scenes opt in by giving their ScrollTrigger an id starting with "scene:".
 * A scene may add a timeline label named "complete" to mark the exact moment
 * its content has finished revealing; otherwise the trigger end is used.
 *
 * Stops are computed lazily on every gesture from live ScrollTrigger data,
 * so resizes, refreshes and manual scrollbar drags are always respected.
 */

const SCENE_PREFIX = 'scene:';
const STOP_EPSILON = 4; // px tolerance when comparing scroll to a stop
const MIN_DURATION = 1.1; // seconds
const MAX_DURATION = 2.8; // seconds
const RELEASE_SETTLE = 0.28; // seconds to let scrubbed timelines settle
const SWIPE_THRESHOLD = 28; // px of finger travel that counts as intent
const WHEEL_THRESHOLD = 6; // ignore micro wheel noise
const WHEEL_IDLE_GAP = 180; // ms of wheel silence that ends a gesture

function getMaxScroll() {
  return Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
}

function getStops() {
  const stops = [0];

  ScrollTrigger.getAll().forEach((st) => {
    const id = st.vars && st.vars.id;
    if (typeof id !== 'string' || !id.startsWith(SCENE_PREFIX)) return;

    const anim = st.animation;
    let progress = 1;

    if (anim && anim.labels && typeof anim.labels.complete === 'number') {
      const total = anim.duration();
      if (total > 0) progress = Math.min(1, anim.labels.complete / total);
    }

    stops.push(Math.round(st.start + (st.end - st.start) * progress));
  });

  const max = getMaxScroll();
  stops.push(max);

  return stops
    .map((s) => Math.max(0, Math.min(max, s)))
    .sort((a, b) => a - b)
    .filter((s, i, arr) => i === 0 || s - arr[i - 1] > 40);
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
    // Lenis stays alive (ticker + ScrollTrigger sync) but no longer
    // interprets raw wheel input; the director owns navigation.
    if (lenis) lenis.stop();

    const ease = gsap.parseEase('power2.inOut');
    const proxy = { y: window.scrollY };

    let animating = false;
    let releaseTimer = null;
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

    const playTo = (target) => {
      const current = window.scrollY;
      if (Math.abs(target - current) <= STOP_EPSILON) return;

      const distance = Math.abs(target - current);
      const vh = Math.max(window.innerHeight, 1);
      const duration = gsap.utils.clamp(
        MIN_DURATION,
        MAX_DURATION,
        0.75 + 0.55 * (distance / vh)
      );

      animating = true;
      root.classList.add('scene-director--playing');
      proxy.y = current;

      activeTween = gsap.to(proxy, {
        y: target,
        duration,
        ease,
        overwrite: true,
        onUpdate: () => setScroll(proxy.y),
        onComplete: () => {
          setScroll(target);
          ScrollTrigger.update();
          activeTween = null;
          // Let scrubbed timelines finish catching up before releasing.
          releaseTimer = window.setTimeout(() => {
            animating = false;
            root.classList.remove('scene-director--playing');
            // A wheel stream still running from the last gesture must
            // not immediately trigger the following scene.
            wheelGestureConsumed = true;
          }, RELEASE_SETTLE * 1000);
        },
      });
    };

    const go = (direction) => {
      if (animating) return;

      const current = window.scrollY;
      const stops = getStops();

      let target = null;
      if (direction > 0) {
        target = stops.find((s) => s > current + STOP_EPSILON);
      } else {
        for (let i = stops.length - 1; i >= 0; i -= 1) {
          if (stops[i] < current - STOP_EPSILON) {
            target = stops[i];
            break;
          }
        }
      }

      if (target != null) playTo(target);
    };

    const goTo = (edge) => {
      if (animating) return;
      const stops = getStops();
      playTo(edge === 'start' ? stops[0] : stops[stops.length - 1]);
    };

    /* ---------------- Wheel / trackpad ---------------- */
    const onWheel = (event) => {
      if (event.ctrlKey) return; // pinch-zoom on trackpads
      event.preventDefault();

      const now = performance.now();
      const magnitude = Math.abs(event.deltaY);
      const gap = now - lastWheelTime;
      lastWheelTime = now;

      // A new gesture starts after a pause, or when the delta clearly
      // accelerates again (a fresh flick during decaying inertia).
      const isNewGesture =
        gap > WHEEL_IDLE_GAP ||
        (magnitude > 24 && magnitude > lastWheelMagnitude * 1.8);
      lastWheelMagnitude = magnitude;

      if (isNewGesture) wheelGestureConsumed = false;
      if (animating || wheelGestureConsumed) return;
      if (magnitude < WHEEL_THRESHOLD) return;

      wheelGestureConsumed = true;
      go(event.deltaY > 0 ? 1 : -1);
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
      // Native scrolling is replaced by scene navigation.
      if (event.cancelable) event.preventDefault();
      if (touchFired || animating) return;

      const dy = touchStartY - event.touches[0].clientY;
      if (Math.abs(dy) < SWIPE_THRESHOLD) return;

      touchFired = true;
      go(dy > 0 ? 1 : -1);
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

    // Pins / pin-spacers are final once the intro is gone.
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
      if (activeTween) activeTween.kill();
      if (releaseTimer) window.clearTimeout(releaseTimer);
      root.classList.remove('scene-director', 'scene-director--playing');
      if (lenis) lenis.start();
    };
  }, [enabled]);
}
