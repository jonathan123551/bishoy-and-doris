import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ChurchEntrance() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          pin: '.ent-inner',
        },
      });

      tl.to(
        '.ent-frame',
        { scale: 1.02, ease: 'none' },
        0.08
      );
      tl.to(
        '.ent-door',
        { scale: 1.15, autoAlpha: 1, ease: 'none' },
        0.08
      );
      tl.to(
        '.ent-aisle',
        { scaleY: 1, autoAlpha: 0.9, ease: 'none' },
        0.14
      );
      tl.to(
        '.ent-copy',
        { autoAlpha: 0, yPercent: -16, ease: 'none' },
        0.52
      );
      tl.to(
        '.ent-door',
        { scale: 7.4, autoAlpha: 0.28, ease: 'none' },
        0.52
      );
      tl.to(
        '.ent-rays',
        { autoAlpha: 1, scale: 1.18, ease: 'none' },
        0.55
      );
      tl.to(
        '.ent-overlay',
        { autoAlpha: 1, ease: 'none' },
        0.72
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="scene-stage scene-stage--church"
      style={{
        position: 'relative',
        minHeight: '120svh',
        overflow: 'hidden',
      }}
    >
      <div
        className="ent-inner"
        style={{
          position: 'relative',
          minHeight: '100dvh',
          display: 'grid',
          placeItems: 'center',
          overflow: 'hidden',
          padding: '1.4rem',
        }}
      >
        <div className="scene-column scene-column--left" />
        <div className="scene-column scene-column--right" />
        <div
          className="ent-frame"
          style={{
            position: 'relative',
            width: 'min(100%, 760px)',
            minHeight: '74vh',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <div
            className="ent-rays"
            style={{
              position: 'absolute',
              inset: '-8%',
              transform: 'scale(1)',
              background:
                'radial-gradient(circle at 50% 22%, rgba(255, 248, 235, 0.94) 0%, rgba(255, 241, 223, 0.38) 25%, transparent 62%), linear-gradient(180deg, rgba(255,248,235,0.28) 0%, rgba(255,248,235,0) 36%), linear-gradient(160deg, transparent 0%, rgba(255,255,255,0.44) 46%, transparent 54%), linear-gradient(20deg, transparent 0%, rgba(255,255,255,0.32) 46%, transparent 54%)',
              opacity: 0.46,
            }}
          />

          <div
            className="ent-door"
            style={{
              position: 'relative',
              width: 'min(34vw, 148px)',
              height: '48vh',
              minHeight: 290,
              maxHeight: 430,
              borderRadius: '50% 50% 0 0 / 18% 18% 0 0',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(250,238,224,0.28) 42%, rgba(232,214,190,0.14) 100%)',
              border: '1px solid rgba(167, 132, 115, 0.12)',
              boxShadow:
                'inset 0 0 42px rgba(255,248,235,0.46), 0 18px 38px rgba(96, 71, 58, 0.08)',
              overflow: 'hidden',
              opacity: 0.88,
            }}
            >
            <div
              className="sun-orb"
              style={{ width: '62%', aspectRatio: '1', top: '10%', left: '19%', opacity: 0.7 }}
            />
            <div
              className="ent-aisle"
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '-1px',
                width: '54%',
                height: '86%',
                transform: 'translateX(-50%) scaleY(0.58)',
                transformOrigin: 'bottom center',
                background:
                  'linear-gradient(180deg, rgba(255,251,244,0.95) 0%, rgba(255,241,220,0.58) 35%, rgba(233,209,183,0.18) 100%)',
                clipPath: 'polygon(46% 0, 54% 0, 100% 100%, 0 100%)',
              opacity: 0.68,
              }}
            />
          </div>

          <div
            className="ent-copy"
            style={{
              position: 'absolute',
              bottom: '12%',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'grid',
              gap: '0.55rem',
              justifyItems: 'center',
              width: 'min(72vw, 280px)',
              textAlign: 'center',
              opacity: 0.92,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.62rem',
                fontWeight: 500,
                letterSpacing: '0.36em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
              }}
            >
              The doors open
            </p>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '1rem',
                lineHeight: 1.45,
                color: 'var(--color-cocoa)',
              }}
            >
              Morning light gathers, then gently carries the day forward.
            </p>
          </div>

          <div
            className="ent-overlay"
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              background:
                'radial-gradient(circle at 50% 30%, rgba(255, 248, 235, 0.96) 0%, rgba(250, 236, 217, 0.92) 38%, rgba(245, 224, 199, 0.82) 62%, rgba(243, 220, 196, 0.46) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>
    </section>
  );
}
