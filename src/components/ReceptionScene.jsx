import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventConfig } from '../config/eventConfig';

gsap.registerPlugin(ScrollTrigger);

export default function ReceptionScene() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=140%',
          scrub: 0.8,
          pin: true,
        },
      });

      tl.fromTo(
        '.rec-shell',
        { autoAlpha: 0.85, scale: 0.98, yPercent: 4 },
        { autoAlpha: 1, scale: 1, yPercent: 0, duration: 0.15, ease: 'none' },
        0.0
      );
      tl.fromTo(
        '.rec-copy > *',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, stagger: 0.04, duration: 0.3, ease: 'none' },
        0.10
      );
      
      // Reading buffer
      tl.to({}, { duration: 0.55 }, 0.55);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="scene-stage scene-stage--reception"
      style={{
        position: 'relative',
        minHeight: '100svh',
      }}
    >
      <div 
        className="rec-inner"
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
          className="rec-shell"
          style={{
            position: 'relative',
            width: 'min(100%, 820px)',
            minHeight: '76vh',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <div 
            className="rec-copy"
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
              className="rec-label"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.64rem',
                fontWeight: 500,
                letterSpacing: '0.42em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
              }}
            >
              Reception
            </p>
            <div className="lux-rule" style={{ width: 'min(24vw, 108px)' }} />
            <h2 
              className="rec-venue-name"
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
              La Pensée
            </h2>
            <p 
              className="rec-venue-sub"
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(1.1rem, 4.5vw, 1.45rem)',
                color: 'var(--color-cocoa)',
              }}
            >
              Gardenia
            </p>
            <div 
              className="venue-destination venue-destination--reception"
              style={{
                display: 'grid',
                gap: '0.2rem',
                marginTop: '0.5rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1rem, 4.1vw, 1.28rem)',
                  lineHeight: 1.28,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-dark)',
                }}
              >
                {eventConfig.reception.area}
              </span>
            </div>
            <a
              className="cta-link venue-map venue-map--reception"
              href={eventConfig.reception.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
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
                View on Maps
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
