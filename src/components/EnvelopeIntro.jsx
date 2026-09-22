import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { playMusic } from '../utils/audioManager';

import flapCutout from '../assets/envelope/flap_cutout.png';
import pocketClean from '../assets/envelope/pocket_clean.png';

const POCKET_LINE_FRACTION = 0.3853;

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
    heroY: 0,
    emergeScale: 1.0,
    heroScale: 1.8,
    wrapperHeight: 0,
    naturalHeight: 0,
  });

  const hasStartedRef = useRef(false);

  const [hasStarted, setHasStarted] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  const isReady = imagesLoaded && introDone;

  /*
   * Preload both envelope artwork assets before tap is enabled.
   */
  useEffect(() => {
    let cancelled = false;
    const p1 = new Image();
    p1.src = pocketClean;
    const p2 = new Image();
    p2.src = flapCutout;

    Promise.all([
      p1.decode ? p1.decode().catch(() => {}) : Promise.resolve(),
      p2.decode ? p2.decode().catch(() => {}) : Promise.resolve(),
    ]).then(() => {
      if (!cancelled) {
        setImagesLoaded(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Measure the physical paper/pocket geometry accurately.
   */
  const measureGeometry = useCallback(() => {
    const wrapper = wrapperRef.current;
    const win = windowRef.current;
    const letter = letterRef.current;
    const pocket = wrapper?.querySelector('.env-pocket');

    if (!wrapper || !win || !letter || !pocket) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const pocketRect = pocket.getBoundingClientRect();

    // The pocket mouth line where lower folds meet inside pocket_clean.png
    const pocketLineY = (pocketRect.top - wrapperRect.top) + pocketRect.height * POCKET_LINE_FRACTION;

    win.style.height = `${pocketLineY}px`;

    const naturalHeight = letter.offsetHeight || 220;

    // While tucked inside pocket
    const emergeScale = 1.0;

    // As paper rises out of pocket, top reaches ~10% of envelope box
    const revealedY = Math.max(12, (pocketRect.top - wrapperRect.top) + pocketRect.height * 0.10);

    // Hero invitation scale and centering
    const isMobile = window.innerWidth <= 600;
    const heroScale = isMobile ? 1.75 : 1.85;
    const heroY = (wrapperRect.height - naturalHeight * heroScale) / 2;

    geometryRef.current = {
      pocketLineY,
      hiddenY: pocketLineY + 4,
      revealedY,
      heroY,
      emergeScale,
      heroScale,
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

    window.addEventListener('resize', measureGeometry);
    window.addEventListener('orientationchange', measureGeometry);

    return () => {
      window.removeEventListener('resize', measureGeometry);
      window.removeEventListener('orientationchange', measureGeometry);
    };
  }, [measureGeometry, imagesLoaded]);

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
   * Initial entrance timeline.
   */
  useEffect(() => {
    if (hasStarted) return;

    const ctx = gsap.context(() => {
      const introTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      introTl
        .fromTo(
          '.env-asset-wrapper',
          { autoAlpha: 0, scale: 0.97 },
          { autoAlpha: 1, scale: 1, duration: 0.9 }
        )
        .fromTo(
          '.env-top-text, .env-bottom-text',
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.7 },
          0.25
        )
        .call(() => {
          setIntroDone(true);
          measureGeometry();
        }, null, 1.0);
    }, containerRef);

    return () => ctx.revert();
  }, [hasStarted, measureGeometry]);

  const handleOpen = () => {
    if (hasStarted || !isReady) return;

    setHasStarted(true);
    hasStartedRef.current = true;

    // Start music synchronously from the user tap interaction (required for iOS Safari)
    playMusic(true);

    measureGeometry();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.classList.remove('lock-scroll');
          onComplete?.();
        },
      });

      openTimelineRef.current = tl;

      // 1. Fade out tap prompt text immediately
      tl.to('.env-bottom-text, .env-top-text', { autoAlpha: 0, duration: 0.35, ease: 'power2.out' }, 0);

      // 2. Physical 3D Flap rotates open naturally along its real top hinge
      tl.to(
        '.env-flap',
        {
          rotateX: 175,
          duration: 0.95,
          ease: 'power2.inOut',
        },
        0.05
      );

      // As the flap flips past 90 degrees, place it behind the emerging paper
      tl.set('.env-flap-container', { zIndex: 1 }, 0.5);

      // 3. Paper emerges upward from inside the envelope pocket
      tl.to(
        letterRef.current,
        {
          y: () => geometryRef.current.revealedY,
          duration: 1.1,
          ease: 'power2.out',
        },
        0.85
      );

      // 4. Paper clears the pocket & expands to hero invitation
      tl.set(windowRef.current, { overflow: 'visible' }, 1.95);
      tl.call(() => letterRef.current?.classList.add('is-hero'), null, 1.95);

      // Envelope body fades and drops away gracefully
      tl.to(
        '.env-pocket, .env-flap-container',
        {
          y: 70,
          autoAlpha: 0,
          duration: 1.0,
          ease: 'power2.in',
        },
        1.95
      );

      // Paper moves to hero center and scales up
      tl.to(
        letterRef.current,
        {
          y: () => geometryRef.current.heroY,
          scale: () => geometryRef.current.heroScale,
          duration: 1.25,
          ease: 'power2.inOut',
        },
        1.95
      );

      // 5. Brief reading beat for the guest
      tl.to({}, { duration: 1.8 });

      // 6. Seamless transition into the main website
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
        >
          <div className="env-envelope-box">
            {/* Base Envelope (Pocket & Stage Artwork) */}
            <img
              src={pocketClean}
              className="env-pocket"
              alt="Bishoy and Doris wedding invitation"
              draggable="false"
            />

            {/* The Flap that rotates open in 3D */}
            <div className="env-flap-container">
              <img
                src={flapCutout}
                className="env-flap"
                alt=""
                aria-hidden="true"
                draggable="false"
              />
            </div>

            {/* The Invitation Paper Window (Clips lower part of paper while in pocket) */}
            <div className="env-letter-window" ref={windowRef}>
              <div className="env-asset-letter" ref={letterRef}>
                <div className="env-letter-copy">
                  <p className="env-letter-title">BISHOY &amp; DORIS</p>
                  <p className="env-letter-subtitle">INVITATION</p>
                  <div className="lux-rule" style={{ margin: '0.8rem auto' }} />
                  <p className="env-letter-text">
                    Two stories, one vow, and a day we would be honored to share with you.
                  </p>
                </div>
                <div className="env-letter-tuck-shadow" aria-hidden="true" />
              </div>
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
