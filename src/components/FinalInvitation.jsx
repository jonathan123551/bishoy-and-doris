import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventConfig } from '../config/eventConfig';
import { generateICS } from '../utils/calendar';

gsap.registerPlugin(ScrollTrigger);

export default function FinalInvitation() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      const card = sectionRef.current.querySelector('.fi-card');
      const els = sectionRef.current.querySelectorAll('.fi-anim');

      gsap.fromTo(
        card,
        { autoAlpha: 0.78, y: 24, scale: 0.99, rotateX: 2 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 1.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        els,
        { autoAlpha: 0.58, y: 8 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.045,
          duration: 0.85,
          ease: 'power2.out',
          delay: 0.18,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const actionStyle = {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.62rem',
    fontWeight: 600,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: 'var(--color-brown-warm)',
    background: 'rgba(255,255,255,0.34)',
    border: '1px solid rgba(183, 135, 114, 0.18)',
    borderRadius: '999px',
    cursor: 'pointer',
    padding: '0.9rem 1.2rem',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '44px',
    transition: 'border-color 0.3s ease, background 0.3s ease, transform 0.3s ease',
  };

  const rule = (
    <div
      className="fi-anim"
      style={{
        width: '42px',
        height: '1px',
        margin: '0 auto',
        background: 'linear-gradient(90deg, transparent, rgba(204,176,138,0.82), transparent)',
      }}
    />
  );

  return (
    <section
      ref={sectionRef}
      className="scene-stage scene-stage--paper"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        display: 'grid',
        placeItems: 'center',
        padding: 'max(2rem, env(safe-area-inset-top)) 1.2rem max(2rem, env(safe-area-inset-bottom))',
        perspective: '1000px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '84vw',
          height: '84vw',
          maxWidth: '480px',
          maxHeight: '480px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255, 247, 232, 0.8) 0%, rgba(210,146,100,0.24) 34%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="fi-card lux-paper"
        style={{
          width: 'min(92vw, 440px)',
          padding: 'clamp(2rem, 6vw, 3rem) clamp(1.4rem, 5vw, 2.4rem)',
          borderRadius: '22px',
          textAlign: 'center',
          transformStyle: 'preserve-3d',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div className="fi-cast-shadow" />
        <div className="photo-frame-line" style={{ inset: '3.5%', borderColor: 'rgba(143, 88, 62, 0.34)' }} />
        <div className="fi-deckle fi-deckle--top" />
        <div className="fi-deckle fi-deckle--bottom" />
        <div
          style={{
            position: 'absolute',
            inset: '7% 9%',
            border: '1px solid rgba(204, 176, 138, 0.12)',
            borderRadius: '16px',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gap: '1rem',
          }}
        >
          <p
            className="fi-anim"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.62rem',
              fontWeight: 500,
              letterSpacing: '0.38em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
            }}
          >
            The invitation
          </p>

          {rule}

          <div className="fi-anim" style={{ display: 'grid', gap: '0.18rem' }}>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 'clamp(2.1rem, 8.6vw, 3rem)',
                lineHeight: 0.92,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-text-dark)',
              }}
            >
              {eventConfig.groomName}
            </h3>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '1.35rem',
                color: 'var(--color-rose-gold)',
              }}
            >
              &
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 'clamp(2.1rem, 8.6vw, 3rem)',
                lineHeight: 0.92,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-text-dark)',
              }}
            >
              {eventConfig.brideName}
            </h3>
          </div>

          <p
            className="fi-anim"
            style={{
              width: 'min(78vw, 290px)',
              margin: '0 auto',
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.04rem, 4.2vw, 1.25rem)',
              lineHeight: 1.5,
              color: 'var(--color-cocoa)',
            }}
          >
            Request the honor of your presence as vows, celebration, and memory become one day.
          </p>

          {rule}

          <div className="fi-anim" style={{ display: 'grid', gap: '0.28rem' }}>
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
              Date & time
            </p>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.08rem, 4.4vw, 1.35rem)',
                lineHeight: 1.3,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-text-dark)',
              }}
            >
              {eventConfig.displayDay}
              <br />
              {eventConfig.displayDate}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '1.08rem',
                color: 'var(--color-cocoa)',
              }}
            >
              {eventConfig.displayTime}
            </p>
          </div>

          <div
            className="fi-anim"
            style={{
              display: 'grid',
              gap: '1rem',
              marginTop: '0.1rem',
            }}
          >
            <div style={{ display: 'grid', gap: '0.22rem' }}>
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
                Ceremony
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '1.08rem',
                  color: 'var(--color-text-dark)',
                }}
              >
                {eventConfig.church.name}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--color-cocoa)',
                }}
              >
                {eventConfig.church.area} · {eventConfig.church.city}
              </p>
            </div>

            <div style={{ display: 'grid', gap: '0.22rem' }}>
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
                Reception
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '1.08rem',
                  color: 'var(--color-text-dark)',
                }}
              >
                {eventConfig.reception.name}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--color-cocoa)',
                }}
              >
                {eventConfig.reception.area}
              </p>
            </div>
          </div>

          {rule}

          <div
            className="fi-anim"
            style={{
              display: 'grid',
              gap: '0.7rem',
              marginTop: '0.1rem',
            }}
          >
            <a href={eventConfig.church.mapUrl} target="_blank" rel="noopener noreferrer" style={actionStyle}>
              Ceremony map
            </a>
            <a href={eventConfig.reception.mapUrl} target="_blank" rel="noopener noreferrer" style={actionStyle}>
              Reception map
            </a>
            <button onClick={() => generateICS(eventConfig)} style={actionStyle}>
              Add to calendar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
