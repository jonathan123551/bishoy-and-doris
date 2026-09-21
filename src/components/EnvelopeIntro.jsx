import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { playMusic } from '../utils/audioManager';

import closedV2 from '../assets/envelope/closed-v2.png';

import f00 from '../assets/envelope/frames/frame_00.jpg';
import f01 from '../assets/envelope/frames/frame_01.jpg';
import f02 from '../assets/envelope/frames/frame_02.jpg';
import f03 from '../assets/envelope/frames/frame_03.jpg';
import f04 from '../assets/envelope/frames/frame_04.jpg';
import f05 from '../assets/envelope/frames/frame_05.jpg';
import f06 from '../assets/envelope/frames/frame_06.jpg';
import f07 from '../assets/envelope/frames/frame_07.jpg';
import f08 from '../assets/envelope/frames/frame_08.jpg';
import f09 from '../assets/envelope/frames/frame_09.jpg';
import f10 from '../assets/envelope/frames/frame_10.jpg';
import f11 from '../assets/envelope/frames/frame_11.jpg';
import f12 from '../assets/envelope/frames/frame_12.jpg';
import f13 from '../assets/envelope/frames/frame_13.jpg';
import f14 from '../assets/envelope/frames/frame_14.jpg';

const frames = [
  f00, f01, f02, f03, f04,
  f05, f06, f07, f08, f09,
  f10, f11, f12, f13, f14,
];

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
  const envImgRef = useRef(null);
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
  const frameIndexRef = useRef(0);

  const [hasStarted, setHasStarted] = useState(false);
  const [framesDecoded, setFramesDecoded] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  const isReady = framesDecoded && introDone;

  /*
   * Preload all animation frames before the envelope can be opened.
   * This keeps the existing animation smooth on desktop and avoids
   * decoding during the GSAP timeline.
   */
  useEffect(() => {
    let cancelled = false;

    Promise.all(
      frames.map((src) => {
        const img = new Image();
        img.src = src;

        if (img.decode) {
          return img.decode().catch(() => {});
        }

        return Promise.resolve();
      })
    ).then(() => {
      if (!cancelled) {
        setFramesDecoded(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Measure the paper/pocket geometry once.
   * Nothing expensive happens inside the animation loop.
   */
  const measureGeometry = useCallback(() => {
    const wrapper = wrapperRef.current;
    const envImg = envImgRef.current;
    const win = windowRef.current;
    const letter = letterRef.current;

    if (!wrapper || !envImg || !win || !letter) {
      return;
    }

    const wrapperRect = wrapper.getBoundingClientRect();
    const envRect = envImg.getBoundingClientRect();

    const pocketLineY =
      (envRect.top - wrapperRect.top) +
      envRect.height * POCKET_LINE_FRACTION;

    win.style.height = `${pocketLineY}px`;

    const naturalHeight = letter.offsetHeight;

    const emergeScale = Math.min(
      0.6,
      (pocketLineY * 0.92) /
        Math.max(naturalHeight, 1)
    );

    geometryRef.current = {
      pocketLineY,
      hiddenY: pocketLineY + 6,
      revealedY: Math.max(
        0,
        pocketLineY - naturalHeight * emergeScale
      ),
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

    window.addEventListener('resize', measureGeometry);
    window.addEventListener(
      'orientationchange',
      measureGeometry
    );

    return () => {
      window.removeEventListener(
        'resize',
        measureGeometry
      );

      window.removeEventListener(
        'orientationchange',
        measureGeometry
      );
    };
  }, [measureGeometry]);

  /*
   * Keep the existing tap-to-open architecture.
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
    if (hasStarted) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const introTl = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
      });

      introTl
        .fromTo(
          '.env-asset-wrapper',
          {
            autoAlpha: 0,
            scale: 0.97,
          },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 1.0,
          }
        )
        .fromTo(
          '.env-top-text, .env-bottom-text',
          {
            autoAlpha: 0,
            y: 10,
          },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.7,
          },
          0.35
        )
        .call(
          () => setIntroDone(true),
          null,
          1.35
        );
    }, containerRef);

    return () => ctx.revert();
  }, [hasStarted]);

  const handleOpen = () => {
    if (hasStarted || !isReady) {
      return;
    }

    setHasStarted(true);
    hasStartedRef.current = true;

    measureGeometry();

    const geo = geometryRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.classList.remove(
            'lock-scroll'
          );

          onComplete?.();
        },
      });

      openTimelineRef.current = tl;

      /*
       * PHASE 1
       *
       * Crossfade from the new clean closed artwork
       * into the existing animation sequence.
       *
       * IMPORTANT:
       * No env-bottom-patch.
       * No duplicate envelope.
       */
      tl.to(
        '.env-closed-v2',
        {
          autoAlpha: 0,
          duration: 0.18,
          ease: 'power2.inOut',
        },
        0.02
      );

      tl.to(
        '.env-envelope-seq',
        {
          autoAlpha: 1,
          duration: 0.18,
          ease: 'power2.inOut',
        },
        0.02
      );

      /*
       * PHASE 2
       *
       * Existing 15-frame envelope opening.
       * This is intentionally preserved.
       */
      const frameObj = {
        frame: 0,
      };

      tl.to(
        frameObj,
        {
          frame: frames.length - 1,
          snap: 'frame',
          duration: 0.85,
          ease: 'power1.inOut',

          onUpdate: () => {
            const next =
              frameObj.frame;

            if (
              next !==
              frameIndexRef.current
            ) {
              frameIndexRef.current =
                next;

              if (
                envImgRef.current
              ) {
                envImgRef.current.src =
                  frames[next];
              }
            }
          },
        },
        0.15
      );

      /*
       * Music starts from the user interaction.
       */
      tl.call(
        () => playMusic(true),
        null,
        0.4
      );

      /*
       * PHASE 3
       *
       * Paper emerges from the pocket only
       * after the flap sequence completes.
       */
      tl.to(
        letterRef.current,
        {
          y: () =>
            geometryRef.current
              .revealedY,
          duration: 1.0,
          ease: 'power2.out',
        },
        1.05
      );

      /*
       * PHASE 4
       *
       * Paper clears the pocket.
       * Envelope disappears.
       * Paper becomes the invitation hero.
       */
      tl.set(
        windowRef.current,
        {
          overflow: 'visible',
        },
        2.05
      );

      tl.call(
        () =>
          letterRef.current?.classList.add(
            'is-hero'
          ),
        null,
        2.05
      );

      tl.to(
        '.env-envelope-seq',
        {
          y: 150,
          autoAlpha: 0,
          duration: 1.0,
          ease: 'power2.in',
        },
        2.05
      );

      tl.to(
        letterRef.current,
        {
          y: () =>
            (
              geo.wrapperHeight -
              geo.naturalHeight *
                HERO_SCALE
            ) / 2,

          scale: HERO_SCALE,
          duration: 1.2,
          ease: 'power2.inOut',
        },
        2.05
      );

      /*
       * PHASE 5
       *
       * Give the invitation a moment to breathe.
       */
      tl.to(
        {},
        {
          duration: 2.0,
        }
      );

      /*
       * PHASE 6
       *
       * Reveal the real website.
       */
      tl.call(() => onReveal?.());

      tl.to(
        containerRef.current,
        {
          autoAlpha: 0,
          duration: 1.2,
          ease: 'power2.inOut',
        }
      );
    }, containerRef);

    openTimelineRef.current = ctx;
  };

  return (
    <div
      ref={containerRef}
      className="env-overlay"
    >
      <div className="env-stage">

        <div className="env-top-text">
          <p>
            A Special Invitation
          </p>

          <EnvDivider />
        </div>

        <div
          className="env-asset-wrapper"
          ref={wrapperRef}
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          aria-label="Open wedding invitation"
          onKeyDown={(event) => {
            if (
              event.key === 'Enter' ||
              event.key === ' '
            ) {
              event.preventDefault();
              handleOpen();
            }
          }}
        >

          {/* NEW CLEAN CLOSED STATE */}
          <img
            src={closedV2}
            className="env-closed-v2"
            alt="Bishoy and Doris wedding invitation"
            draggable="false"
          />

          {/* EXISTING APPROVED ANIMATION */}
          <img
            ref={envImgRef}
            src={frames[0]}
            className="env-envelope-seq"
            alt=""
            aria-hidden="true"
            draggable="false"
          />

          {/* INVITATION PAPER */}
          <div
            className="env-letter-window"
            ref={windowRef}
          >
            <div
              className="env-asset-letter"
              ref={letterRef}
            >
              <div className="env-letter-copy">

                <p className="env-letter-title">
                  BISHOY &amp; DORIS
                </p>

                <p className="env-letter-subtitle">
                  INVITATION
                </p>

                <div
                  className="lux-rule"
                  style={{
                    margin:
                      '1.2rem auto',
                  }}
                />

                <p className="env-letter-text">
                  Two stories, one vow,
                  and a day we would be
                  honored to share with you.
                </p>

              </div>

              <div
                className="env-letter-tuck-shadow"
                aria-hidden="true"
              />
            </div>
          </div>

        </div>

        <div className="env-bottom-text">
          <p>
            Tap to open
          </p>

          <EnvDivider />
        </div>

      </div>
    </div>
  );
}
