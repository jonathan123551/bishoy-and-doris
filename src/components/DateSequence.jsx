import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function DateSequence() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const num14 = sectionRef.current.querySelector('.ds-14');
      const num11 = sectionRef.current.querySelector('.ds-11');
      const num2026 = sectionRef.current.querySelector('.ds-2026');
      const assembled = sectionRef.current.querySelector('.ds-assembled');
      const details = sectionRef.current.querySelector('.ds-details');
      const inner = sectionRef.current.querySelector('.ds-inner');

      const mm = gsap.matchMedia();

      mm.add({
        isMobile: '(max-width: 768px)',
        isDesktop: '(min-width: 769px)',
      }, (context) => {
        const { isMobile } = context.conditions;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            pin: inner,
          },
        });

        // Tighter beats on mobile
        const b = isMobile
          ? [0, 0.15, 0.3, 0.45, 0.65]
          : [0, 0.18, 0.36, 0.54, 0.75];

        // 14 enters
        tl.fromTo(num14,
          { y: '60%', opacity: 0 },
          { y: '0%', opacity: 1, ease: 'power2.out' },
          b[0]
        );

        // 14 exits, 11 enters
        tl.to(num14, { y: '-30%', opacity: 0, scale: 0.9 }, b[1]);
        tl.fromTo(num11,
          { y: '60%', opacity: 0 },
          { y: '0%', opacity: 1, ease: 'power2.out' },
          b[1]
        );

        // 11 exits, 2026 enters
        tl.to(num11, { y: '-30%', opacity: 0, scale: 0.9 }, b[2]);
        tl.fromTo(num2026,
          { y: '60%', opacity: 0 },
          { y: '0%', opacity: 1, ease: 'power2.out' },
          b[2]
        );

        // 2026 exits, assembled date appears
        tl.to(num2026, { y: '-30%', opacity: 0, scale: 0.9 }, b[3]);
        tl.fromTo(assembled,
          { scale: 1.2, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'power2.out' },
          b[3]
        );

        // Details reveal
        tl.fromTo(details,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0 },
          b[4]
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const hugeStyle = {
    position: 'absolute',
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 300,
    fontSize: 'clamp(7rem, 28vw, 18rem)',
    color: '#E8C8C8', // Blush huge numbers
    lineHeight: 1,
    opacity: 0,
    pointerEvents: 'none',
  };

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '122svh',
        background: 'transparent',
      }}
    >
      <div
        className="ds-inner"
        style={{
          position: 'relative',
          width: '100%',
          height: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Soft glow */}
        <div style={{
          position: 'absolute',
          width: '70vw',
          height: '70vw',
          maxWidth: '400px',
          maxHeight: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232, 200, 200, 0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="ds-14" style={hugeStyle}>14</div>
        <div className="ds-11" style={hugeStyle}>11</div>
        <div className="ds-2026" style={{ ...hugeStyle, fontSize: 'clamp(5rem, 20vw, 14rem)' }}>2026</div>

        {/* Assembled */}
        <div className="ds-assembled" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.12em',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(2rem, 8.6vw, 4rem)',
          letterSpacing: '0.06em',
          color: '#4F3E39', // Dark luxury text
          fontWeight: 300,
          opacity: 0,
        }}>
          <span>14</span>
          <span style={{ color: '#D6B57A', fontSize: '0.7em' }}>.</span>
          <span>11</span>
          <span style={{ color: '#D6B57A', fontSize: '0.7em' }}>.</span>
          <span>2026</span>
        </div>

        {/* Details */}
        <div className="ds-details" style={{
          marginTop: '1.25rem',
          textAlign: 'center',
          opacity: 0,
        }}>
          <p style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.6rem',
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: '#8F7D78',
            marginBottom: '0.45em',
          }}>
            Saturday
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: '1.2rem',
            fontWeight: 500,
            color: '#6A5148',
          }}>
            5:00 PM
          </p>
        </div>
      </div>
    </section>
  );
}
