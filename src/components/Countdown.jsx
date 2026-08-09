import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventConfig } from '../config/eventConfig';

gsap.registerPlugin(ScrollTrigger);

function getTimeRemaining() {
  const [year, month, day] = eventConfig.date.split('-').map(Number);
  const [hour, minute] = eventConfig.time.split(':').map(Number);
  const diff = new Date(year, month - 1, day, hour, minute, 0) - new Date();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo('.cd-copy, .cd-unit', { autoAlpha: 0, y: 24 }, {
        autoAlpha: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.82,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' },
      });
      gsap.fromTo('.cd-arc', { scale: 0.82, autoAlpha: 0.3 }, {
        scale: 1,
        autoAlpha: 1,
        duration: 1.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 84%', toggleActions: 'play none none none' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const units = remaining ? [
    { value: remaining.days, label: 'Days' },
    { value: remaining.hours, label: 'Hours' },
    { value: remaining.minutes, label: 'Min' },
    { value: remaining.seconds, label: 'Sec' },
  ] : [];

  return (
    <section ref={sectionRef} className="cd-scene">
      <div className="cd-arc cd-arc--outer" />
      <div className="cd-arc cd-arc--inner" />
      <div className="cd-lights">{Array.from({ length: 9 }, (_, index) => <span key={index} />)}</div>
      {remaining === null ? (
        <p className="cd-memory">Today became a memory.</p>
      ) : (
        <div className="cd-stage">
          <div className="cd-copy">
            <p>Until we celebrate</p>
            <span>The evening is waiting</span>
          </div>
          <div className="cd-units">
            {units.map((unit) => (
              <div key={unit.label} className="cd-unit">
                <strong>{String(unit.value).padStart(2, '0')}</strong>
                <span>{unit.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
