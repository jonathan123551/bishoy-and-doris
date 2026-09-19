import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventConfig } from '../config/eventConfig';

gsap.registerPlugin(ScrollTrigger);

export default function CeremonyScene() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=150%',
          scrub: 0.8,
          pin: true,
        },
      });

      tl.fromTo(
        '.cer-shell',
        { autoAlpha: 0.85, scale: 0.98, yPercent: 4 },
        { autoAlpha: 1, scale: 1, yPercent: 0, duration: 0.4, ease: 'power2.out' },
        0
      );
      tl.fromTo(
        '.cer-arch',
        { scaleY: 0.94, autoAlpha: 0.3 },
        { scaleY: 1, autoAlpha: 0.85, duration: 0.45, ease: 'power2.out' },
        0.05
      );
      tl.fromTo(
        '.cer-light-top',
        { autoAlpha: 0, yPercent: -6 },
        { autoAlpha: 0.85, yPercent: 0, duration: 0.4, ease: 'power2.out' },
        0.1
      );
      tl.fromTo(
        '.cer-copy > *',
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.04,
          duration: 0.4,
          ease: 'power2.out',
        },
        0.15
      );
      // Generous reading buffer while pinned
      tl.to({}, { duration: 0.6 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="scene-stage scene-stage--church"
      style={{
        position: 'relative',
        minHeight: '118svh',
      }}
    >
      <div
        className="cer-inner"
        style={{
          position: 'relative',
          minHeight: '100dvh',
          overflow: 'hidden',
          display: 'grid',
          placeItems: 'center',
          padding: 'max(1.4rem, env(safe-area-inset-top)) 1.2rem max(1.6rem, env(safe-area-inset-bottom))',
        }}
      >
        <div className="scene-column scene-column--left" />
        <div className="scene-column scene-column--right" />
        <div
          className="cer-shell"
          style={{
            position: 'relative',
            width: 'min(100%, 820px)',
            minHeight: '76vh',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <div
            className="cer-architecture"
            style={{
              position: 'absolute',
              inset: 0,
            }}
          >
            <div
              className="cer-light-top"
              style={{
                position: 'absolute',
                inset: '2% 0 auto',
                height: '52%',
                background:
                  'linear-gradient(109deg, transparent 0 39%, rgba(255,252,239,0.46) 40% 42%, transparent 43% 100%), linear-gradient(71deg, transparent 0 54%, rgba(255,252,239,0.32) 55% 57%, transparent 58% 100%)',
                opacity: 0.18,
              }}
            />

            <div
              className="cer-light-floor"
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '-5%',
                width: '84%',
                height: '28%',
                transform: 'translateX(-50%)',
                background:
                  'radial-gradient(ellipse at center, rgba(210, 180, 138, 0.18) 0%, rgba(216, 183, 171, 0.1) 40%, transparent 74%)',
                opacity: 0.08,
              }}
            />

            <div
              className="cer-arch"
              style={{
                position: 'absolute',
                inset: '8% 9% 6%',
                borderRadius: '52% 52% 0 0 / 22% 22% 0 0',
                border: '1px solid rgba(137, 108, 95, 0.12)',
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(251,246,239,0.24) 28%, rgba(242,232,221,0.08) 100%)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -20px 40px rgba(173, 141, 124, 0.05)',
                opacity: 0.3,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: '6% 16% 0',
                  borderRadius: '48% 48% 0 0 / 18% 18% 0 0',
                  border: '1px solid rgba(137, 108, 95, 0.08)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '16%',
                  bottom: '0',
                  left: '50%',
                  width: 1,
                  transform: 'translateX(-50%)',
                  background:
                    'linear-gradient(180deg, rgba(137,108,95,0.04) 0%, rgba(137,108,95,0.14) 48%, rgba(137,108,95,0.02) 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '28%',
                  bottom: '0',
                  left: '22%',
                  width: 1,
                  background:
                    'linear-gradient(180deg, rgba(137,108,95,0.02) 0%, rgba(137,108,95,0.1) 52%, transparent 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '28%',
                  bottom: '0',
                  right: '22%',
                  width: 1,
                  background:
                    'linear-gradient(180deg, rgba(137,108,95,0.02) 0%, rgba(137,108,95,0.1) 52%, transparent 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '9%',
                  left: '50%',
                  width: 3,
                  height: '17%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(180deg, rgba(123,86,66,0.56), rgba(255,250,238,0.8))',
                  boxShadow: '0 0 12px rgba(255,238,202,0.5)',
                }}
              />
            </div>
          </div>

          <div
            className="cer-copy"
            style={{
              position: 'relative',
              zIndex: 3,
              width: 'min(100%, 430px)',
              display: 'grid',
              justifyItems: 'center',
              gap: '1.1rem',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.64rem',
                fontWeight: 500,
                letterSpacing: '0.42em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
              }}
            >
              Ceremony
            </p>

            <div className="lux-rule" style={{ width: 'min(24vw, 108px)' }} />

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 'clamp(2.2rem, 11vw, 4.3rem)',
                lineHeight: 0.92,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--color-text-dark)',
              }}
            >
              {eventConfig.church.name}
            </h2>

            <p
              dir="rtl"
              lang="ar"
              style={{
                fontFamily: 'var(--font-arabic)',
                fontSize: 'clamp(1.1rem, 4.8vw, 1.55rem)',
                lineHeight: 1.5,
                color: 'var(--color-cocoa)',
              }}
            >
              {eventConfig.church.arabicName}
            </p>

            <div
              style={{
                display: 'grid',
                gap: '0.2rem',
                marginTop: '0.15rem',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.58rem',
                  fontWeight: 500,
                  letterSpacing: '0.34em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                }}
              >
                Date
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.05rem, 4.3vw, 1.35rem)',
                  lineHeight: 1.25,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-dark)',
                }}
              >
                {eventConfig.displayDay}
                <br />
                {eventConfig.displayDate}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gap: '0.2rem',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.58rem',
                  fontWeight: 500,
                  letterSpacing: '0.34em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                }}
              >
                Time
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.1rem, 4.5vw, 1.45rem)',
                  color: 'var(--color-cocoa)',
                }}
              >
                {eventConfig.displayTime}
              </p>
            </div>

            <div
              className="venue-destination venue-destination--church"
              style={{
                display: 'grid',
                gap: '0.2rem',
              }}
            >
              <p
                className="venue-label"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.58rem',
                  fontWeight: 500,
                  letterSpacing: '0.34em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                }}
              >
                Location
              </p>
              <p
                className="venue-place"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1rem, 4.1vw, 1.28rem)',
                  lineHeight: 1.28,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-dark)',
                }}
              >
                {eventConfig.church.area}
                <br />
                {eventConfig.church.city}
              </p>
            </div>

            <a
              href={eventConfig.church.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-link venue-map venue-map--church"
              style={{ marginTop: '0.35rem' }}
            >
              <span className="venue-map-mark" aria-hidden="true" />
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.62rem',
                  fontWeight: 600,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: 'var(--color-rose-gold)',
                }}
              >
                {eventConfig.church.mapLabel}
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
