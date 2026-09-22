import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { playMusic } from '../utils/audioManager';

import flapCutout from '../assets/envelope/flap_cutout.png';
import pocketClean from '../assets/envelope/pocket_clean.png';

const POCKET_LINE_FRACTION = 0.385;
const HERO_SCALE = 1.15;

const EnvDivider = () => (
  <div className="env-divider">
    <div className="env-div-line" />
    <div className="env-div-diamond" />
    <div className="env-div-line" />
  </div>
);

export default function EnvelopeIntro({ onReveal, onComplete }) {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const windowRef = useRef(null);
  const letterRef = useRef(null);
  const openTimelineRef = useRef(null);

  const geometryRef = useRef({
    pocketLineY: 0,
    hiddenY: 0,
    revealedY: 0,
    emergeScale: 0.35,
    wrapperHeight: 0,
    naturalHeight: 0,
  });

  const hasStartedRef = useRef(false);

  const [hasStarted, setHasStarted] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  // We no longer need to preload 15 frames, so it's ready immediately after intro
  const isReady = introDone;

  /*
   * Measure the paper/pocket geometry once.
   */
  const measureGeometry = useCallback(() => {
    const wrapper = wrapperRef.current;
    const win = windowRef.current;
    const letter = letterRef.current;

    if (!wrapper || !win || !letter) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    // In the old code, envRect was used. Since pocketClean fills the wrapper width:
    const envRect = wrapper.querySelector('.env-pocket').getBoundingClientRect();

    const pocketLineY = (envRect.top - wrapperRect.top) + envRect.height * POCKET_LINE_FRACTION;

    win.style.height = `${pocketLineY}px`;

    const naturalHeight = letter.offsetHeight;
    const emergeScale = Math.min(
      0.6,
      (pocketLineY * 0.92) / Math.max(naturalHeight, 1)
    );

    geometryRef.current = {
      pocketLineY,
      hiddenY: pocketLineY + 6,
      revealedY: Math.max(0, pocketLineY - naturalHeight * emergeScale),
      emergeScale,
      wrapperHeight: wrapperRect.height,
      naturalHeight,
    };

    if (!hasStartedRef.current) {
      gsap.set(letter, {
        xPercent: -50,
        x: 0,
        y: geometryRef.current.hiddenY,
        scale: emergeScale,
        transformOrigin: 'top center',
      });
    }
  }, []);

  useLayoutEffect(() => {
    measureGeometry();

    // Re-measure after images load to ensure correct geometry
    const img = new Image();
    img.src = pocketClean;
    img.onload = measureGeometry;

    window.addEventListener('resize', measureGeometry);
    window.addEventListener('orientationchange', measureGeometry);

    return () => {
      window.removeEventListener('resize', measureGeometry);
      window.removeEventListener('orientationchange', measureGeometry);
    };
  }, [measureGeometry]);

  /*
   * Lock scroll and clean up.
   */
  useEffect(() => {
    document.body.classList.add('lock-scroll');
    return () => {
      document.body.classList.remove('lock-scroll');
      openTimelineRef.current?.kill();
    };
  }, []);

  /*
   * Initial entrance.
   */
  useEffect(() => {
    if (hasStarted) return;

    const ctx = gsap.context(() => {
      const introTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      introTl
        .fromTo(
          '.env-asset-wrapper',
          { autoAlpha: 0, scale: 0.97 },
          { autoAlpha: 1, scale: 1, duration: 1.0 }
        )
        .fromTo(
          '.env-top-text, .env-bottom-text',
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.7 },
          0.35
        )
        .call(() => setIntroDone(true), null, 1.35);
    }, containerRef);

    return () => ctx.revert();
  }, [hasStarted]);

  const handleOpen = () => {
    if (hasStarted || !isReady) return;

    setHasStarted(true);
    hasStartedRef.current = true;

    measureGeometry();
    const geo = geometryRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.classList.remove('lock-scroll');
          onComplete?.();
        },
      });

      openTimelineRef.current = tl;

      // 1. Fade out tap text
      tl.to('.env-bottom-text, .env-top-text', { autoAlpha: 0, duration: 0.3 }, 0);

      // Music starts from the user interaction.
      tl.call(() => playMusic(true), null, 0.1);

      // 2. 3D Flap opens natively
      tl.to(
        '.env-flap',
        {
          rotateX: 180,
          duration: 0.85,
          ease: 'power2.inOut',
        },
        0.1
      );

      // 3. Paper emerges from the pocket
      tl.to(
        letterRef.current,
        {
          y: () => geometryRef.current.revealedY,
          duration: 1.0,
          ease: 'power2.out',
        },
        0.9 // Start just before flap finishes opening
      );

      // 4. Paper clears the pocket & envelope disappears
      tl.set(windowRef.current, { overflow: 'visible' }, 2.0);
      tl.call(() => letterRef.current?.classList.add('is-hero'), null, 2.0);

      tl.to(
        '.env-pocket-wrapper',
        {
          y: 150,
          autoAlpha: 0,
          duration: 1.0,
          ease: 'power2.in',
        },
        2.0
      );

      tl.to(
        letterRef.current,
        {
          y: () => (geo.wrapperHeight - geo.naturalHeight * HERO_SCALE) / 2,
          scale: HERO_SCALE,
          duration: 1.2,
          ease: 'power2.inOut',
        },
        2.0
      );

      // 5. Give the invitation a moment to breathe.
      tl.to({}, { duration: 2.0 });

      // 6. Reveal the real website.
      tl.call(() => onReveal?.());
      tl.to(containerRef.current, {
        autoAlpha: 0,
        duration: 1.2,
        ease: 'power2.inOut',
      });
    }, containerRef);

    openTimelineRef.current = ctx;
  };

  return (
    <div ref={containerRef} className="env-overlay">
      <div className="env-stage">
        <div className="env-top-text">
          <p>A Special Invitation</p>
          <EnvDivider />
        </div>

        <div
          className="env-asset-wrapper"
          ref={wrapperRef}
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          aria-label="Open wedding invitation"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOpen();
            }
          }}
          style={{ position: 'relative' }}
        >
          {/* Base Envelope (Pocket & Inner Back) */}
          <div className="env-pocket-wrapper" style={{ position: 'relative', width: '100%', height: 'auto' }}>
            <img
              src={pocketClean}
              className="env-pocket"
              alt="Bishoy and Doris wedding invitation"
              draggable="false"
              style={{ display: 'block', width: '100%', height: 'auto' }}
            />
            
            {/* The Flap that rotates */}
            <div
              className="env-flap-container"
              style={{
                position: 'absolute',
                inset: 0,
                perspective: '1500px',
                pointerEvents: 'none',
              }}
            >
              <img
                src={flapCutout}
                className="env-flap"
                alt=""
                aria-hidden="true"
                draggable="false"
                style={{
                  width: '100%',
                  height: '100%',
                  transformOrigin: '50% 14.89%',
                  transformStyle: 'preserve-3d',
                  // Ensure it doesn't flicker when rotated
                  backfaceVisibility: 'visible',
                }}
              />
            </div>
          </div>

          {/* INVITATION PAPER */}
          <div className="env-letter-window" ref={windowRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', overflow: 'hidden' }}>
            <div className="env-asset-letter" ref={letterRef}>
              <div className="env-letter-copy">
                <p className="env-letter-title">BISHOY &amp; DORIS</p>
                <p className="env-letter-subtitle">INVITATION</p>
                <div className="lux-rule" style={{ margin: '1.2rem auto' }} />
                <p className="env-letter-text">
                  Two stories, one vow, and a day we would be honored to share with you.
                </p>
              </div>
              <div className="env-letter-tuck-shadow" aria-hidden="true" />
            </div>
          </div>

        </div>

        <div className="env-bottom-text">
          <p>Tap to open</p>
          <EnvDivider />
        </div>
      </div>
    </div>
  );
}
