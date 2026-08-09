import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventConfig } from '../config/eventConfig';

gsap.registerPlugin(ScrollTrigger);

function getTimeRemaining() {
  const [year, month, day] = eventConfig.date.split('-').map(Number);
  const [hour, minute] = eventConfig.time.split(':').map(Number);
  const target = new Date(year, month - 1, day, hour, minute, 0);
  const diff = target - new Date();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown() {
  const sectionRef = useRef(null);
  const [remaining, setRemaining] = useState(getTimeRemaining);

  useEffect(() => {
    const interval = setInterval(() => setRemaining(getTimeRemaining()), 1000);
    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const items = sectionRef.current.querySelectorAll('.cd-item');
      gsap.fromTo(items,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const units = remaining
    ? [
        { value: remaining.days, label: 'Days' },
        { value: remaining.hours, label: 'Hours' },
        { value: remaining.minutes, label: 'Min' },
        { value: remaining.seconds, label: 'Sec' },
      ]
    : [];

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '36svh',
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5vh 1.2rem',
        overflow: 'hidden',
      }}
    >
      {/* Blush warm glow */}
      <div style={{
        position: 'absolute',
        width: '60vw',
        height: '60vw',
        maxWidth: '350px',
        maxHeight: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232, 200, 200, 0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {remaining === null ? (
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 'clamp(1rem, 3vw, 1.3rem)',
          color: '#8F7D78',
          textAlign: 'center',
        }}>
          Today became a memory.
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gap: '0.8rem',
          justifyItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.58rem',
            fontWeight: 500,
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: '#8F7D78',
          }}>
            Countdown
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
          }}>
          {units.map((unit, i) => (
            <div key={unit.label} style={{ display: 'flex', alignItems: 'center' }}>
              <div
                className="cd-item"
                style={{
                  textAlign: 'center',
                  padding: '0 clamp(0.6rem, 2.5vw, 1.8rem)',
                  opacity: 0,
                }}
              >
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: 'clamp(2.05rem, 7vw, 4rem)',
                  color: '#4F3E39', // Dark luxury text
                  lineHeight: 1,
                  display: 'block',
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '0.03em',
                }}>
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '0.5rem',
                  fontWeight: 500,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#8F7D78',
                  display: 'block',
                  marginTop: '0.55em',
                }}>
                  {unit.label}
                </span>
              </div>
              {i < units.length - 1 && (
                <div style={{
                  width: '1px',
                  height: '2.2rem',
                  background: 'rgba(106, 81, 72, 0.2)',
                  flexShrink: 0,
                }} />
              )}
            </div>
          ))}
          </div>
        </div>
      )}
    </section>
  );
}
