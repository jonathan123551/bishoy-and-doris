import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const dateGlyphs = ['14', '11', '2026'];

export default function DateSequence() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          scrub: 0.8,
          pin: true,
        },
      });

      // 0.0: .ds-kicker fades in
      tl.fromTo(
        '.ds-kicker',
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.1, ease: 'none' },
        0.0
      );
      
      // 0.12: .ds-kicker fades out
      tl.to(
        '.ds-kicker',
        { autoAlpha: 0, scale: 0.96, duration: 0.08, ease: 'none' },
        0.12
      );

      // Glyph 0: '14'
      tl.fromTo(
        '.ds-glyph--0',
        { yPercent: 30, scale: 0.92, autoAlpha: 0 },
        { yPercent: 0, scale: 1, autoAlpha: 1, duration: 0.12, ease: 'none' },
        0.18
      );
      tl.to('.ds-glyph--0', { scale: 1.03, duration: 0.05, ease: 'none' }, 0.32);
      tl.to('.ds-glyph--0', { scale: 1, duration: 0.05, ease: 'none' }, 0.37); // Starts at 0.32 + 0.05

      // Glyph 1: '11'
      tl.fromTo(
        '.ds-glyph--1',
        { yPercent: 30, scale: 0.92, autoAlpha: 0 },
        { yPercent: 0, scale: 1, autoAlpha: 1, duration: 0.12, ease: 'none' },
        0.44
      );
      tl.to('.ds-glyph--1', { scale: 1.03, duration: 0.05, ease: 'none' }, 0.58);
      tl.to('.ds-glyph--1', { scale: 1, duration: 0.05, ease: 'none' }, 0.63);

      // Glyph 2: '2026'
      tl.fromTo(
        '.ds-glyph--2',
        { yPercent: 30, scale: 0.92, autoAlpha: 0 },
        { yPercent: 0, scale: 1, autoAlpha: 1, duration: 0.12, ease: 'none' },
        0.70
      );
      tl.to('.ds-glyph--2', { scale: 1.03, duration: 0.05, ease: 'none' }, 0.84);
      tl.to('.ds-glyph--2', { scale: 1, duration: 0.05, ease: 'none' }, 0.89);

      // 0.92: .ds-details slides up and fades in
      tl.fromTo(
        '.ds-details',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.1, ease: 'none' },
        0.92
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="ds-scene" 
      style={{ 
        position: 'relative', 
        height: '100svh',
        display: 'grid',
        placeItems: 'center',
        padding: 'max(1.4rem, env(safe-area-inset-top)) 1.2rem max(1.6rem, env(safe-area-inset-bottom))',
      }}
    >
      <div 
        className="ds-inner"
        style={{
          position: 'relative',
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <p 
          className="ds-kicker"
          style={{
            position: 'absolute',
            top: '-3rem',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.64rem',
            fontWeight: 500,
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            width: '100%',
          }}
        >
          Save the date
        </p>
        
        <div 
          className="ds-glyphs"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 12vw, 4.5rem)',
            fontWeight: 600,
            letterSpacing: '0.04em',
            color: 'var(--color-text-dark)',
          }}
        >
          {dateGlyphs.map((glyph, index) => (
            <span 
              key={glyph} 
              className={`ds-glyph ds-glyph--${index}`}
              style={{
                display: 'inline-block',
                opacity: 0, // initially hidden for fromTo
              }}
            >
              {glyph}
            </span>
          ))}
        </div>
        
        <div 
          className="ds-assembled"
          style={{
            display: 'none', // Removed from layout for now since it's just visually redundant, or kept for fallback.
          }}
        >
          <span>14</span><i>&middot;</i><span>11</span><i>&middot;</i><span>2026</span>
        </div>
        
        <div 
          className="ds-details"
          style={{
            marginTop: '1.5rem',
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
            Saturday
          </p>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.1rem, 4.5vw, 1.45rem)',
              color: 'var(--color-cocoa)',
            }}
          >
            5:00 PM
          </span>
        </div>
      </div>
    </section>
  );
}
