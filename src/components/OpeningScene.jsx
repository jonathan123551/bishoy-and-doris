import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function OpeningScene({ isActive }) {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (!isActive || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.os-intro-item',
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, stagger: 0.1, duration: 1.1, ease: 'power3.out', delay: 0.12 }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      tl.to('.os-sun', { yPercent: -17, scale: 1.42, ease: 'none' }, 0);
      tl.to('.os-rings', { scale: 1.16, rotate: -6, ease: 'none' }, 0);
      tl.to('.os-rays', { scale: 1.2, autoAlpha: 0.38, ease: 'none' }, 0.04);
      tl.to('.os-copy', { yPercent: -21, autoAlpha: 0, ease: 'none' }, 0.3);
      tl.to('.os-floor', { yPercent: 18, scaleY: 1.3, autoAlpha: 1, ease: 'none' }, 0.28);
      tl.to('.os-portal', { yPercent: -8, scale: 1.08, ease: 'none' }, 0.42);
      tl.to('.os-shutter--left', { xPercent: -30, ease: 'none' }, 0.54);
      tl.to('.os-shutter--right', { xPercent: 30, ease: 'none' }, 0.54);
    }, sectionRef);

    return () => ctx.revert();
  }, [isActive]);

  return (
    <section ref={sectionRef} className="os-scene" style={{ position: 'relative', minHeight: '124svh' }}>
      <div className="os-panel">
        <div className="os-shutter os-shutter--left" />
        <div className="os-shutter os-shutter--right" />
        <div className="os-rays" />
        <div className="os-portal">
          <div className="os-rings">
            <div className="os-ring os-ring--outer" />
            <div className="os-ring os-ring--inner" />
          </div>
          <div className="os-sun" />
        </div>
        <div className="os-floor" />

        <div className="os-copy">
          <p className="os-intro-item os-kicker">The day begins</p>
          <div className="os-title">
            {['A promise', 'takes shape', 'in light.'].map((line) => (
              <span key={line} className="os-intro-item">{line}</span>
            ))}
          </div>
          <p className="os-intro-item os-subcopy">
            Follow the light into a day of prayer, celebration, and memory.
          </p>
        </div>
      </div>
    </section>
  );
}
