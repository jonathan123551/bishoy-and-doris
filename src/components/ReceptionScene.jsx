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
      const lights = sectionRef.current.querySelectorAll('.rec-light-strand');

      lights.forEach((light, index) => {
        gsap.to(light, {
          yPercent: index % 2 === 0 ? 2 : -2,
          duration: 7 + index,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });

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
        '.rec-venue',
        { autoAlpha: 0.85, scale: 0.98, yPercent: 4 },
        { autoAlpha: 1, scale: 1, yPercent: 0, duration: 0.35, ease: 'power2.out' },
        0
      );
      tl.fromTo(
        '.rec-lantern',
        { autoAlpha: 0.5, scale: 0.95 },
        { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power2.out' },
        0.05
      );
      tl.fromTo(
        '.rec-copy > *',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, stagger: 0.04, duration: 0.35, ease: 'power2.out' },
        0.1
      );
      // Give guests ample time to read the venue name, note, and view map link
      tl.to({}, { duration: 0.55 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="scene-stage scene-stage--reception"
      style={{
        position: 'relative',
        minHeight: '104svh',
        display: 'grid',
        placeItems: 'center',
        padding: 'max(1.6rem, env(safe-area-inset-top)) 1.2rem max(2rem, env(safe-area-inset-bottom))',
        overflow: 'hidden',
      }}
    >
      <div className="rec-string-lights" />
      <div className="rec-light-strands" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((index) => (
          <span className="rec-light-strand" key={index} />
        ))}
      </div>

      <div
        className="rec-venue"
        style={{
          position: 'relative',
          zIndex: 2,
          width: 'min(100%, 780px)',
          minHeight: '74vh',
          borderRadius: '40% 40% 26px 26px / 9% 9% 26px 26px',
          overflow: 'visible',
          background: 'transparent',
          boxShadow: 'none',
          display: 'grid',
          placeItems: 'center',
          padding: 'clamp(1.5rem, 6vw, 3rem)',
        }}
      >
        <div className="rec-venue-portal" aria-hidden="true" />
        <div
          className="rec-lantern"
          style={{
            position: 'absolute',
            top: '7%',
            left: '50%',
            width: 'min(56vw, 250px)',
            height: 'min(56vw, 250px)',
            transform: 'translateX(-50%)',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255, 252, 219, 0.96) 0 8%, rgba(255, 215, 145, 0.72) 24%, rgba(255, 191, 111, 0.18) 58%, transparent 59%)',
            opacity: 0.86,
          }}
        />

        <div className="rec-garden" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <div
          style={{
            position: 'absolute',
            inset: '10% 8% auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '6%',
            opacity: 0.64,
          }}
        >
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              style={{
                height: 1,
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(183, 135, 114, 0.24) 24%, rgba(255,255,255,0.7) 50%, rgba(183, 135, 114, 0.24) 76%, transparent 100%)',
              }}
            />
          ))}
        </div>

        <div
          className="rec-copy"
          style={{
            position: 'relative',
            zIndex: 1,
            width: 'min(100%, 460px)',
            display: 'grid',
            justifyItems: 'center',
            gap: '1rem',
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
              color: 'rgba(255, 235, 202, 0.76)',
            }}
          >
            Reception
          </p>

          <div className="lux-rule" style={{ width: 'min(24vw, 104px)' }} />

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 'clamp(2.6rem, 12vw, 5rem)',
              lineHeight: 0.9,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: '#fff0d7',
              textShadow: '0 4px 18px rgba(81,35,29,0.3)',
            }}
          >
            {eventConfig.reception.name}
          </h2>

          <div
            className="venue-destination venue-destination--reception"
            style={{
              display: 'grid',
              gap: '0.18rem',
              marginTop: '0.1rem',
            }}
          >
            <p
              className="venue-place"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.02rem, 4.2vw, 1.25rem)',
                lineHeight: 1.25,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(255, 232, 198, 0.9)',
              }}
            >
              {eventConfig.reception.area}
            </p>
            <p
              className="venue-location"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.64rem',
                fontWeight: 600,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'rgba(255, 247, 231, 0.9)',
              }}
            >
              Reception location
            </p>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(1.04rem, 4.3vw, 1.25rem)',
                lineHeight: 1.45,
                color: 'rgba(255, 239, 215, 0.88)',
              }}
            >
              {eventConfig.reception.note}
            </p>
          </div>

          <a
            href={eventConfig.reception.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-link venue-map venue-map--reception"
            style={{
              marginTop: '0.35rem',
              background: 'rgba(81, 35, 29, 0.18)',
              borderColor: 'rgba(255, 229, 185, 0.4)',
            }}
          >
            <span className="venue-map-mark" aria-hidden="true" />
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.62rem',
                fontWeight: 600,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#fff0d7',
              }}
            >
              {eventConfig.reception.mapLabel}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
