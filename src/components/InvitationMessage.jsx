import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lines = [
  'We would be honored to have you with us.',
  'To witness the promise,',
  'and celebrate the beginning.',
];

export default function InvitationMessage() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const els = sectionRef.current.querySelectorAll('.msg-line');
      const divider = sectionRef.current.querySelector('.msg-divider');

      gsap.fromTo(els,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'center 50%',
            scrub: true,
          },
        }
      );

      if (divider) {
        gsap.fromTo(divider,
          { scaleX: 0 },
          {
            scaleX: 1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'center 50%',
              scrub: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '54vh',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6vh 1.6rem',
        overflow: 'hidden',
      }}
    >
      {/* Soft Blush glow */}
      <div style={{
        position: 'absolute',
        width: '50vw',
        height: '50vw',
        maxWidth: '300px',
        maxHeight: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232, 200, 200, 0.3) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Decorative divider */}
      <div className="msg-divider" style={{
        width: '34px',
        height: '1px',
        background: 'rgba(214, 181, 122, 0.6)',
        marginBottom: '2rem',
        transformOrigin: 'center',
        transform: 'scaleX(0)',
      }} />

      {lines.map((line, i) => (
        <p
          key={i}
          className="msg-line"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(1.18rem, 4.2vw, 1.52rem)',
            color: '#4F3E39', // Dark luxury text
            textAlign: 'center',
            lineHeight: 1.5,
            letterSpacing: '0.02em',
            marginBottom: '0.72em',
            opacity: 0,
            maxWidth: '380px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {line}
        </p>
      ))}
    </section>
  );
}
