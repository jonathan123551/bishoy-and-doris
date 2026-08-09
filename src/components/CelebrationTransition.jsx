import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CelebrationTransition() {
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
          pin: '.ct-inner',
        },
      });

      tl.to('.ct-wash', { autoAlpha: 1, scale: 1, ease: 'none' }, 0);
      tl.to('.ct-bloom', { autoAlpha: 1, scale: 1, ease: 'none' }, 0.12);
      tl.to('.ct-ribbon', { autoAlpha: 1, yPercent: 0, ease: 'none' }, 0.18);
      tl.to(
        '.ct-copy',
        { autoAlpha: 0, yPercent: -18, ease: 'none' },
        0.5
      );
      tl.to(
        '.ct-bloom',
        { scale: 1.26, autoAlpha: 0.78, ease: 'none' },
        0.42
      );
      tl.to(
        '.ct-ribbon',
        { scaleX: 1.18, autoAlpha: 0.18, ease: 'none' },
        0.52
      );
      tl.to(
        '.ct-glow',
        { autoAlpha: 1, ease: 'none' },
        0.62
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="scene-stage scene-stage--transition"
      style={{
        position: 'relative',
        minHeight: '84svh',
        overflow: 'hidden',
      }}
    >
      <div
        className="ct-inner"
        style={{
          position: 'relative',
          minHeight: '84dvh',
          display: 'grid',
          placeItems: 'center',
          overflow: 'hidden',
          background: 'transparent',
        }}
      >
        <div
          className="ct-wash"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 50% 18%, rgba(255, 249, 239, 0.96) 0%, rgba(255, 241, 220, 0.42) 26%, transparent 56%), radial-gradient(circle at 50% 72%, rgba(214, 181, 122, 0.18) 0%, rgba(216, 183, 171, 0.14) 36%, transparent 72%)',
          }}
        />

        <div
            className="ct-bloom"
            style={{
              position: 'absolute',
              width: 'min(92vw, 520px)',
              aspectRatio: '1 / 1',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(255,255,255,0.88) 0%, rgba(255,245,230,0.46) 36%, rgba(219,186,149,0.18) 58%, transparent 76%)',
              opacity: 0.5,
              transform: 'scale(0.92)',
            }}
          />

        <div className="petal-field ct-petals">
          {[['8%','14%',-24], ['75%','8%',18], ['20%','62%',28], ['72%','70%',-18], ['44%','2%',36], ['-4%','42%',12], ['90%','48%',-36]].map(([left, top, rotation], index) => (
            <span key={index} style={{ left, top, transform: `rotate(${rotation}deg) scale(${index % 2 ? 0.72 : 1})` }} />
          ))}
        </div>

        <div
            className="ct-ribbon"
            style={{
              position: 'absolute',
              width: 'min(120vw, 700px)',
              height: 'min(32vw, 200px)',
            borderRadius: '50%',
            border: '1px solid rgba(183, 135, 114, 0.16)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)',
              transform: 'rotate(-8deg)',
              opacity: 0.52,
            }}
          />

        <div
          className="ct-copy"
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'grid',
            justifyItems: 'center',
            gap: '0.75rem',
            textAlign: 'center',
            width: 'min(82vw, 360px)',
            padding: '0 1rem',
            opacity: 0.96,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.62rem',
              fontWeight: 500,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
            }}
          >
            The day softens
          </p>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.2rem, 5vw, 1.7rem)',
              lineHeight: 1.34,
              color: 'var(--color-cocoa)',
            }}
          >
            Sacred stillness turns to golden warmth.
          </p>
        </div>

        <div
          className="ct-glow"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            background:
              'linear-gradient(180deg, rgba(248,229,205,0.12) 0%, rgba(242,210,171,0.24) 38%, rgba(230,187,140,0.34) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </section>
  );
}
