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
      const orbs = sectionRef.current.querySelectorAll('.rec-orb');

      orbs.forEach((orb, index) => {
        gsap.to(orb, {
          xPercent: index % 2 === 0 ? 8 : -8,
          yPercent: index === 1 ? -10 : 8,
          duration: 10 + index * 1.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 94%',
          end: 'bottom top',
          scrub: true,
        },
      });

      tl.fromTo(
        '.rec-panel',
        { autoAlpha: 0.72, scale: 0.985, yPercent: 3 },
        { autoAlpha: 1, scale: 1, yPercent: 0, ease: 'none' },
        0
      );
      tl.fromTo(
        '.rec-copy > *',
        { autoAlpha: 0.45, y: 10 },
        { autoAlpha: 1, y: 0, stagger: 0.05, ease: 'none' },
        0.06
      );
      tl.fromTo(
        '.rec-lantern',
        { autoAlpha: 0.42, scale: 0.94 },
        { autoAlpha: 1, scale: 1, ease: 'none' },
        0.1
      );
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
      <div
        className="rec-orb"
        style={{
          position: 'absolute',
          inset: '8% auto auto -18%',
          width: '64vw',
          height: '64vw',
          maxWidth: 320,
          maxHeight: 320,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(244, 200, 141, 0.28) 0%, rgba(232, 183, 122, 0.12) 32%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="rec-orb"
        style={{
          position: 'absolute',
          inset: 'auto -10% 16% auto',
          width: '56vw',
          height: '56vw',
          maxWidth: 280,
          maxHeight: 280,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(234, 190, 146, 0.22) 0%, rgba(183, 135, 114, 0.12) 42%, transparent 76%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="rec-orb"
        style={{
          position: 'absolute',
          inset: '38% auto auto 24%',
          width: '32vw',
          height: '32vw',
          maxWidth: 160,
          maxHeight: 160,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255, 248, 233, 0.5) 0%, rgba(255, 241, 220, 0.14) 48%, transparent 72%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="rec-panel"
        style={{
          position: 'relative',
          zIndex: 2,
          width: 'min(100%, 780px)',
          minHeight: '74vh',
          borderRadius: '40% 40% 26px 26px / 9% 9% 26px 26px',
          overflow: 'hidden',
          background:
            'linear-gradient(180deg, rgba(118,60,44,0.9) 0%, rgba(169,91,59,0.94) 50%, rgba(236,170,104,0.95) 100%)',
          boxShadow: '0 28px 60px rgba(62, 29, 25, 0.34), inset 0 1px 0 rgba(255,235,201,0.42)',
          display: 'grid',
          placeItems: 'center',
          padding: 'clamp(1.5rem, 6vw, 3rem)',
        }}
      >
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
            style={{
              display: 'grid',
              gap: '0.18rem',
              marginTop: '0.1rem',
            }}
          >
            <p
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
            className="cta-link"
            style={{
              marginTop: '0.35rem',
              background: 'rgba(81, 35, 29, 0.18)',
              borderColor: 'rgba(255, 229, 185, 0.4)',
            }}
          >
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
