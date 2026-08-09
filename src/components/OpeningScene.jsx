import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function OpeningScene({ isActive }) {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (!isActive) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      const introTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      introTl.fromTo(
        '.os-kicker, .os-title-line, .os-subcopy, .os-crest, .os-orbit',
        { autoAlpha: 0, y: 20, filter: 'blur(6px)' },
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.05,
          stagger: 0.1,
          delay: 0.16,
        }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      tl.to('.os-panel', {
        yPercent: -7,
        scale: 0.975,
        ease: 'none',
      });
      tl.to(
        '.os-title-line',
        {
          yPercent: -18,
          autoAlpha: 0,
          stagger: 0.03,
          ease: 'none',
        },
        0
      );
      tl.to(
        '.os-subcopy',
        {
          yPercent: -12,
          autoAlpha: 0,
          ease: 'none',
        },
        0.08
      );
      tl.to(
        '.os-veil',
        {
          autoAlpha: 0.75,
          ease: 'none',
        },
        0
      );
      tl.fromTo(
        '.os-line',
        { scaleY: 0.15, autoAlpha: 0.15 },
        { scaleY: 1, autoAlpha: 1, ease: 'none' },
        0.1
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isActive]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '120svh',
      }}
    >
      <div
        className="os-panel"
        style={{
          position: 'sticky',
          top: 0,
          minHeight: '100dvh',
          display: 'grid',
          placeItems: 'center',
          padding: 'max(2rem, env(safe-area-inset-top)) 1.5rem max(2rem, env(safe-area-inset-bottom))',
          overflow: 'hidden',
        }}
      >
        <div
          className="os-veil"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            background:
              'linear-gradient(180deg, rgba(247,241,234,0) 0%, rgba(242,232,221,0.58) 56%, rgba(239,225,210,0.9) 100%)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: '12% 12% auto',
            display: 'grid',
            justifyItems: 'center',
            gap: '0.9rem',
            pointerEvents: 'none',
          }}
        >
          <div
            className="os-orbit"
            style={{
              position: 'absolute',
              inset: '18% auto auto 50%',
              width: '76vw',
              height: '76vw',
              maxWidth: '520px',
              maxHeight: '520px',
              transform: 'translateX(-50%)',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(255,255,255,0.44) 0%, rgba(244,231,219,0.18) 32%, transparent 68%)',
              filter: 'blur(10px)',
            }}
          />

          <div
            className="os-crest"
            style={{
              width: 'min(30vw, 124px)',
              height: 'min(30vw, 124px)',
              borderRadius: '999px',
              border: '1px solid rgba(183, 135, 114, 0.18)',
              background:
                'radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.1) 40%, transparent 72%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
            }}
          />
          <div className="lux-rule" />
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: 'min(100%, 760px)',
            display: 'grid',
            justifyItems: 'center',
            gap: '1.1rem',
            textAlign: 'center',
          }}
        >
          <p
            className="os-kicker"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.66rem',
              fontWeight: 500,
              letterSpacing: '0.44em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
            }}
            >
            The day begins
          </p>

          <div
            style={{
              display: 'grid',
              gap: '0.15rem',
            }}
          >
            {['Some moments', 'arrive softly', 'and become a vow.'].map((line) => (
              <span
                key={line}
                className="os-title-line"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.7rem, 12vw, 6rem)',
                  lineHeight: 0.88,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-dark)',
                  textShadow: '0 10px 24px rgba(255, 255, 255, 0.18)',
                }}
              >
                {line}
              </span>
            ))}
          </div>

          <p
            className="os-subcopy"
            style={{
              width: 'min(80vw, 390px)',
              marginTop: '0.35rem',
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 3.8vw, 1.24rem)',
              lineHeight: 1.4,
              color: 'var(--color-cocoa)',
              letterSpacing: '0.03em',
            }}
          >
            Follow the light into a day of prayer, celebration, and memory.
          </p>
        </div>

        <div
          className="os-line"
          style={{
            position: 'absolute',
            bottom: '8%',
            left: '50%',
            width: 1,
            height: '22vh',
            transform: 'translateX(-50%) scaleY(0.15)',
            transformOrigin: 'top center',
            background:
              'linear-gradient(180deg, rgba(204, 176, 138, 0.85) 0%, rgba(183, 135, 114, 0.18) 58%, transparent 100%)',
            opacity: 0.15,
          }}
        />
      </div>
    </section>
  );
}
