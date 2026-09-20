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
          end: '+=160%',
          scrub: 0.8,
          pin: true,
        },
      });

      tl.fromTo(
        '.cer-shell',
        { autoAlpha: 0.85, scale: 0.98, yPercent: 4 },
        { autoAlpha: 1, scale: 1, yPercent: 0, duration: 0.15, ease: 'none' },
        0.0
      );
      tl.fromTo(
        '.cer-copy > *',
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.04,
          duration: 0.3,
          ease: 'none',
        },
        0.10
      );
      
      // Reading buffer
      tl.to({}, { duration: 0.6 }, 0.6);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="scene-stage scene-stage--church"
      style={{
        position: 'relative',
        minHeight: '100svh',
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
