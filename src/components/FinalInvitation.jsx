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
        { autoAlpha: 0.72, y: 28, scale: 0.985, rotateX: 2 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.72,
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
        { autoAlpha: 0.72, y: 8 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.045,
          duration: 0.48,
          ease: 'power2.out',
          delay: 0.06,
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
    color: '#fff9ed',
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
        display: 'grid',
        placeItems: 'center',
        padding: 'max(2rem, env(safe-area-inset-top)) 1.2rem max(2rem, env(safe-area-inset-bottom))',
        perspective: '1000px',
        overflow: 'hidden',
      }}
    >
      <div
        className="fi-paper-glow"
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
        className="fi-card fi-card--hero lux-paper"
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
        <div className="fi-wax-seal" aria-hidden="true">B D</div>
        <div className="fi-emboss" aria-hidden="true">
          <span>B</span>
          <i>&amp;</i>
          <span>D</span>
        </div>
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
              color: 'rgba(239, 207, 124, 0.86)',
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
                color: '#f8fbff',
              }}
            >
              {eventConfig.groomName}
            </h3>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '1.35rem',
                color: '#edd17c',
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
                color: '#f8fbff',
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
              color: 'rgba(238, 244, 255, 0.86)',
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
                color: 'rgba(239, 207, 124, 0.82)',
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
                color: '#f8fbff',
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
                color: 'rgba(238, 244, 255, 0.86)',
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
                  color: 'rgba(239, 207, 124, 0.82)',
                }}
              >
                Ceremony
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '1.08rem',
                  color: '#f8fbff',
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
                  color: 'rgba(238, 244, 255, 0.78)',
                }}
              >
                {eventConfig.church.area} &middot; {eventConfig.church.city}
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
                  color: 'rgba(239, 207, 124, 0.82)',
                }}
              >
                Reception
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '1.08rem',
                  color: '#f8fbff',
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
                  color: 'rgba(238, 244, 255, 0.78)',
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
            <a className="fi-action" href={eventConfig.church.mapUrl} target="_blank" rel="noopener noreferrer" style={actionStyle}>
              Ceremony map
            </a>
            <a className="fi-action" href={eventConfig.reception.mapUrl} target="_blank" rel="noopener noreferrer" style={actionStyle}>
              Reception map
            </a>
            <button className="fi-action" onClick={() => generateICS(eventConfig)} style={actionStyle}>
              Add to calendar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
