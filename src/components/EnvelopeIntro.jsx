import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { eventConfig } from '../config/eventConfig';
import { playMusic } from '../utils/audioManager';
import { startIntroAmbient, stopIntroAmbient } from '../utils/introAmbient';

const paperNoise =
  'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 220 220\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.028\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.9\'/%3E%3C/svg%3E")';

export default function EnvelopeIntro({ onReveal, onComplete }) {
  const containerRef = useRef(null);
  const idleTweenRef = useRef([]);
  const openTimelineRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    document.body.classList.add('lock-scroll');

    return () => {
      document.body.classList.remove('lock-scroll');
      idleTweenRef.current.forEach((tween) => tween?.kill());
      openTimelineRef.current?.kill();
      stopIntroAmbient(0);
    };
  }, []);

  useEffect(() => {
    if (hasStarted) return undefined;

    const ctx = gsap.context(() => {
      const introTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      introTl.fromTo(
        '.env-night',
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.9 }
      );
      introTl.fromTo(
        '.env-stage',
        { autoAlpha: 0, y: 56, scale: 0.94 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.55 },
        0.18
      );
      introTl.fromTo(
        '.env-overline, .env-date, .env-cue > *',
        { autoAlpha: 0, y: 20, filter: 'blur(8px)' },
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          stagger: 0.08,
          duration: 1.05,
        },
        0.72
      );

      idleTweenRef.current = [
        gsap.to('.env-envelope', {
          yPercent: -2.4,
          rotateZ: -0.5,
          duration: 4.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        }),
        gsap.to('.env-glow', {
          scale: 1.12,
          opacity: 0.92,
          duration: 4.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        }),
        gsap.to('.env-haze', {
          xPercent: 3,
          yPercent: -5,
          duration: 7.6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        }),
        gsap.to('.env-shadow', {
          scaleX: 1.08,
          opacity: 0.34,
          duration: 4.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        }),
      ];
    }, containerRef);

    return () => {
      ctx.revert();
      idleTweenRef.current.forEach((tween) => tween?.kill());
      idleTweenRef.current = [];
    };
  }, [hasStarted]);

  const handleOpen = () => {
    if (hasStarted) return;

    setHasStarted(true);
    startIntroAmbient();
    idleTweenRef.current.forEach((tween) => tween?.kill());

    gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        onComplete: () => {
          stopIntroAmbient(0);
          document.body.classList.remove('lock-scroll');
          onComplete?.();
        },
      });

      openTimelineRef.current = tl;

      tl.to('.env-cue > *, .env-overline, .env-date', {
        autoAlpha: 0,
        y: 10,
        filter: 'blur(10px)',
        stagger: 0.04,
        duration: 0.35,
      });
      tl.to(
        '.env-night',
        {
          background:
            'radial-gradient(circle at 50% 44%, rgba(189, 150, 118, 0.16) 0%, rgba(16, 12, 11, 0.58) 22%, rgba(6, 5, 5, 0.96) 72%), linear-gradient(180deg, #050404 0%, #0b0908 48%, #15100f 100%)',
          duration: 1.1,
        },
        0
      );
      tl.to(
        '.env-seal',
        {
          scale: 0.84,
          duration: 0.22,
        },
        0
      );
      tl.to(
        '.env-seal',
        {
          scale: 0,
          rotate: 140,
          autoAlpha: 0,
          duration: 0.6,
          ease: 'back.in(2.8)',
        },
        0.18
      );
      tl.to(
        '.env-flap',
        {
          rotateX: -178,
          y: -8,
          duration: 1.28,
          ease: 'power3.inOut',
        },
        0.16
      );
      tl.to(
        '.env-letter',
        {
          yPercent: -36,
          duration: 1.18,
          ease: 'power3.out',
        },
        0.38
      );
      tl.call(() => {
        playMusic(true);
      }, null, 0.72);
      tl.call(() => {
        stopIntroAmbient(2400);
      }, null, 1.16);
      tl.to(
        '.env-envelope-shell',
        {
          y: 198,
          autoAlpha: 0,
          duration: 1.28,
          ease: 'power2.inOut',
        },
        0.58
      );
      tl.to(
        '.env-shadow',
        {
          autoAlpha: 0,
          duration: 0.7,
        },
        0.74
      );
      tl.to(
        '.env-letter',
        {
          width: '118vw',
          height: '118vh',
          borderRadius: '0px',
          bottom: '-14vh',
          yPercent: 0,
          scale: 1.05,
          duration: 1.65,
          ease: 'power3.inOut',
        },
        1.05
      );
      tl.to(
        '.env-letter-copy',
        {
          autoAlpha: 0,
          y: 28,
          duration: 0.55,
        },
        1.1
      );
      tl.to(
        '.env-film',
        {
          autoAlpha: 1,
          duration: 0.7,
          ease: 'power2.out',
        },
        1.82
      );
      tl.fromTo(
        '.env-film-portal, .env-film-sun, .env-film-beams',
        {
          autoAlpha: 0,
          scale: 0.82,
        },
        {
          autoAlpha: 1,
          scale: 1,
          stagger: 0.08,
          duration: 1.1,
          ease: 'power3.out',
        },
        1.96
      );
      tl.fromTo(
        '.env-film-kicker, .env-film-title > span, .env-film-date',
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.07,
          duration: 0.76,
          ease: 'power3.out',
        },
        2.34
      );
      tl.to(
        '.env-film-copy',
        {
          yPercent: -5,
          duration: 1.75,
          ease: 'sine.inOut',
        },
        2.7
      );
      tl.to(
        '.env-film-kicker, .env-film-title > span, .env-film-date',
        {
          autoAlpha: 0,
          y: -24,
          stagger: 0.06,
          duration: 0.55,
          ease: 'power2.in',
        },
        4.68
      );
      tl.to(
        '.env-film-portal',
        { scale: 1.38, autoAlpha: 0.12, duration: 1.12, ease: 'power2.in' },
        4.62
      );
      tl.to(
        '.env-film-sun',
        { scale: 2.45, autoAlpha: 0.2, duration: 1.08, ease: 'power2.in' },
        4.72
      );
      tl.to(
        '.env-film-beams',
        { scale: 1.42, autoAlpha: 0.18, duration: 0.98, ease: 'power2.in' },
        4.76
      );
      tl.to(
        '.env-film-veil',
        {
          autoAlpha: 1,
          duration: 1.05,
          ease: 'power2.inOut',
        },
        5.02
      );
      tl.call(() => {
        onReveal?.();
      }, null, 5.18);
      tl.to(
        '.env-letter',
        {
          scale: 1.18,
          autoAlpha: 0,
          duration: 1.05,
          ease: 'power2.in',
        },
        5.16
      );
      tl.to(
        containerRef.current,
        {
          autoAlpha: 0,
          duration: 0.7,
          ease: 'power2.out',
        },
        5.72
      );
      tl.set(containerRef.current, { display: 'none' });
    }, containerRef);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleOpen}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overflow: 'hidden',
        cursor: hasStarted ? 'default' : 'pointer',
        background: '#060505',
      }}
    >
      <div
        className="env-night"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0,
          background:
            'radial-gradient(circle at 50% 42%, rgba(214, 184, 153, 0.16) 0%, rgba(15, 12, 11, 0.42) 26%, rgba(6, 5, 5, 0.96) 74%), linear-gradient(180deg, #050404 0%, #0a0807 48%, #151211 100%)',
        }}
      />

      <div
        className="env-aura"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      >
        <div
          className="env-glow lux-glow"
          style={{
            width: '72vw',
            height: '72vw',
            maxWidth: 520,
            maxHeight: 520,
            left: '50%',
            top: '18%',
            transform: 'translateX(-50%)',
            background:
              'radial-gradient(circle, rgba(236, 212, 185, 0.24) 0%, rgba(180, 129, 102, 0.15) 33%, rgba(6, 5, 5, 0) 72%)',
          }}
        />
        <div
          className="env-haze"
          style={{
            position: 'absolute',
            inset: '-16%',
            opacity: 0.12,
            backgroundImage: paperNoise,
            mixBlendMode: 'soft-light',
          }}
        />
      </div>

      <div
        className="env-stage"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100%',
          display: 'grid',
          placeItems: 'center',
          padding: 'max(1.75rem, env(safe-area-inset-top)) 1.25rem max(1.9rem, env(safe-area-inset-bottom))',
        }}
      >
        <div
          style={{
            width: 'min(100%, 470px)',
            minHeight: '100%',
            display: 'grid',
            gridTemplateRows: '1fr auto 1fr',
            alignItems: 'center',
            justifyItems: 'center',
          }}
        >
          <div
            style={{
              alignSelf: 'start',
              paddingTop: '0.6rem',
              display: 'grid',
              gap: '0.72rem',
              justifyItems: 'center',
              textAlign: 'center',
            }}
          >
            <p
              className="env-overline"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.62rem',
                fontWeight: 500,
                letterSpacing: '0.44em',
                textTransform: 'uppercase',
                color: 'rgba(255, 244, 233, 0.7)',
              }}
            >
              Bishoy &amp; Doris
            </p>
            <p
              className="env-date"
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '1rem',
                letterSpacing: '0.04em',
                color: 'rgba(244, 231, 219, 0.68)',
              }}
            >
              {eventConfig.displayDate}
            </p>
          </div>

          <div
            className="env-envelope"
            style={{
              position: 'relative',
              width: 'min(88vw, 390px)',
              height: 'min(60vw, 268px)',
              perspective: '1600px',
              transformStyle: 'preserve-3d',
              filter: 'drop-shadow(0 36px 58px rgba(0, 0, 0, 0.46))',
            }}
          >
            <div
              className="env-shadow"
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '-16%',
                width: '70%',
                height: '16%',
                transform: 'translateX(-50%)',
                borderRadius: '999px',
                background: 'radial-gradient(circle, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0) 72%)',
                opacity: 0.28,
                filter: 'blur(16px)',
              }}
            />

            <div
              className="env-envelope-shell"
              style={{
                position: 'absolute',
                inset: 0,
              }}
            >
              <div
                className="env-envelope-body lux-paper"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '20px',
                  background:
                    'linear-gradient(145deg, rgba(255,255,255,0.88) 0%, rgba(241,228,213,0.97) 55%, rgba(219,191,168,0.96) 100%)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(31deg, transparent 47%, rgba(255,255,255,0.62) 49.6%, transparent 52%), linear-gradient(-31deg, transparent 47%, rgba(255,255,255,0.62) 49.6%, transparent 52%)',
                    opacity: 0.72,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 'auto 11% 14% 11%',
                    height: 1,
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(151, 123, 110, 0.26) 10%, rgba(151, 123, 110, 0.1) 90%, transparent 100%)',
                  }}
                />
              </div>

              <div
                className="env-letter lux-paper"
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: 18,
                  transform: 'translateX(-50%)',
                  width: '84%',
                  height: '88%',
                  borderRadius: '14px',
                  zIndex: 2,
                  display: 'grid',
                  placeItems: 'center',
                  padding: '1.6rem 1.3rem 1.4rem',
                  transformOrigin: 'bottom center',
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(246, 238, 229, 0.98)), var(--color-paper)',
                }}
              >
                <div
                  className="env-letter-copy"
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    height: '100%',
                    display: 'grid',
                    gridTemplateRows: 'auto 1fr auto',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gap: '0.55rem',
                      justifyItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.58rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.38em',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      You are invited
                    </span>
                    <div className="lux-rule" style={{ width: 'min(24vw, 92px)' }} />
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gap: '0.2rem',
                    }}
                  >
                    <h1
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2.1rem, 10vw, 3.4rem)',
                        fontWeight: 600,
                        lineHeight: 0.88,
                        letterSpacing: '0.06em',
                        color: 'var(--color-text-dark)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {eventConfig.groomName}
                    </h1>
                    <span
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.5rem',
                        fontStyle: 'italic',
                        color: 'var(--color-rose-gold)',
                      }}
                    >
                      &amp;
                    </span>
                    <h1
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2.1rem, 10vw, 3.4rem)',
                        fontWeight: 600,
                        lineHeight: 0.88,
                        letterSpacing: '0.06em',
                        color: 'var(--color-text-dark)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {eventConfig.brideName}
                    </h1>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'end',
                      gap: '1rem',
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      color: 'var(--color-text-muted)',
                      fontSize: '0.9rem',
                    }}
                  >
                    <span>{eventConfig.displayDay}</span>
                    <span>{eventConfig.displayDate}</span>
                  </div>
                </div>
              </div>

              <div
                className="env-flap lux-paper"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '59%',
                  borderRadius: '20px 20px 0 0',
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  transformOrigin: 'top center',
                  zIndex: 3,
                  background:
                    'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(243,229,216,0.98) 42%, rgba(214,187,164,0.98) 100%)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.42) 0%, transparent 64%), radial-gradient(circle at 50% 100%, rgba(183,135,114,0.16) 0%, transparent 62%)',
                  }}
                />
              </div>

              <div
                className="env-seal"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '52.5%',
                  transform: 'translate(-50%, -50%)',
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  zIndex: 4,
                  display: 'grid',
                  placeItems: 'center',
                  background:
                    'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.34), transparent 24%), linear-gradient(135deg, #cfa79c 0%, #b2806f 52%, #8f665b 100%)',
                  boxShadow:
                    '0 14px 24px rgba(96, 67, 57, 0.24), inset 0 2px 4px rgba(255,255,255,0.26), inset 0 -8px 16px rgba(114, 73, 58, 0.24)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    letterSpacing: '0.16em',
                    color: '#fff8f1',
                    textShadow: '0 1px 2px rgba(52, 31, 26, 0.26)',
                  }}
                >
                  B D
                </span>
              </div>
            </div>
          </div>

          <div
            className="env-cue"
            style={{
              alignSelf: 'end',
              display: 'grid',
              gap: '0.65rem',
              justifyItems: 'center',
              textAlign: 'center',
              paddingBottom: '0.4rem',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.64rem',
                fontWeight: 500,
                letterSpacing: '0.42em',
                textTransform: 'uppercase',
                color: 'rgba(255, 244, 233, 0.78)',
              }}
            >
              Tap to open
            </p>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '1rem',
                color: 'rgba(244, 231, 219, 0.7)',
              }}
            >
              Enter with sound
            </p>
          </div>
        </div>
      </div>

      <div
        className="env-film"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <div
          className="env-film-beams"
          style={{
            position: 'absolute',
            inset: '-10%',
            opacity: 0,
            background:
              'linear-gradient(116deg, transparent 0 36%, rgba(255,253,239,0.54) 37% 39%, transparent 40% 100%), linear-gradient(68deg, transparent 0 57%, rgba(255,249,230,0.42) 58% 60%, transparent 61% 100%), linear-gradient(180deg, rgba(49,31,25,0.62) 0%, rgba(119,74,55,0.38) 32%, rgba(246,227,202,0.22) 100%)',
          }}
        />
        <div
          className="env-film-portal"
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '-12%',
            width: 'min(110vw, 680px)',
            height: '102%',
            transform: 'translateX(-50%)',
            borderRadius: '50% 50% 0 0 / 22% 22% 0 0',
            border: '1px solid rgba(255,243,215,0.5)',
            boxShadow: 'inset 0 0 0 14px rgba(72,42,33,0.12), inset 0 0 0 15px rgba(255,236,202,0.18)',
            opacity: 0,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '8% 13% 0',
              borderRadius: '50% 50% 0 0 / 18% 18% 0 0',
              border: '1px solid rgba(255,245,219,0.35)',
            }}
          />
        </div>
        <div
          className="env-film-sun"
          style={{
            position: 'absolute',
            left: '50%',
            top: '24%',
            width: 'min(48vw, 230px)',
            aspectRatio: '1',
            transform: 'translateX(-50%)',
            borderRadius: '50%',
            opacity: 0,
            background: 'radial-gradient(circle at 40% 38%, #fffdf2 0 9%, #ffe3ad 36%, rgba(245,177,109,0.72) 64%, rgba(245,177,109,0) 65%)',
            boxShadow: '0 0 0 1px rgba(255,248,224,0.46), 0 0 34px rgba(250,193,121,0.26)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 50% 28%, rgba(255, 247, 224, 0.15) 0%, transparent 42%), linear-gradient(180deg, rgba(26,15,13,0.06) 0%, rgba(247,241,234,0.12) 38%, rgba(247,241,234,0.9) 100%)',
          }}
        />
        <div
          className="env-film-copy"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            alignContent: 'center',
            justifyItems: 'center',
            gap: '0.95rem',
            padding: 'max(2rem, env(safe-area-inset-top)) 1.4rem max(2rem, env(safe-area-inset-bottom))',
            textAlign: 'center',
          }}
        >
          <p
            className="env-film-kicker"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.62rem',
              fontWeight: 500,
              letterSpacing: '0.48em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
            }}
          >
            A promise in paper and light
          </p>

          <div
            className="env-film-title"
            style={{
              display: 'grid',
              gap: '0.1rem',
            }}
          >
            {['The day begins', 'in light.'].map((line) => (
              <span
                key={line}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 'clamp(2.9rem, 13vw, 6rem)',
                  lineHeight: 0.88,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-dark)',
                }}
              >
                {line}
              </span>
            ))}
          </div>

          <p
            className="env-film-date"
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 4.2vw, 1.34rem)',
              lineHeight: 1.42,
              color: 'var(--color-cocoa)',
              letterSpacing: '0.04em',
            }}
          >
            {eventConfig.displayDay} · {eventConfig.displayDate}
          </p>
        </div>

        <div
          className="env-film-veil"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            background:
              'radial-gradient(circle at 50% 34%, rgba(255,255,255,0.32) 0%, rgba(247,241,234,0) 34%), linear-gradient(180deg, rgba(247,241,234,0) 0%, rgba(247,241,234,0.46) 38%, rgba(247,241,234,1) 100%)',
          }}
        />
      </div>
    </div>
  );
}
