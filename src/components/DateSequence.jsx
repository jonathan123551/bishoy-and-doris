import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function DateSequence() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      // Hide elements before scrub
      gsap.set('.ds-kicker', { autoAlpha: 0, y: 10 });
      gsap.set('.ds-glyph', { autoAlpha: 0, yPercent: 20, scale: 0.95 });
      gsap.set('.ds-dot', { autoAlpha: 0, scale: 0.5 });
      gsap.set('.ds-details', { autoAlpha: 0, y: 20 });
      gsap.set('.ds-clock-hands', { rotation: -60 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=120%',
          scrub: true,
          pin: true,
        },
      });

      // Clock hands slowly rotate throughout the scene
      tl.to('.ds-clock-hands', { rotation: 0, ease: 'none', duration: 1 }, 0.0);

      // 0.0 - 0.2: Kicker fades in, then fades out
      tl.to('.ds-kicker', { autoAlpha: 1, y: 0, duration: 0.08, ease: 'none' }, 0.0)
        .to('.ds-kicker', { autoAlpha: 0, duration: 0.08, ease: 'none' }, 0.12);

      // 0.20 - 0.35: First glyph "14"
      tl.to('.ds-glyph--0', { autoAlpha: 1, yPercent: 0, scale: 1.02, duration: 0.1, ease: 'none' }, 0.20)
        .to('.ds-glyph--0', { scale: 1, duration: 0.05, ease: 'none' }, 0.30);
      tl.to('.ds-dot--0', { autoAlpha: 1, scale: 1, duration: 0.05, ease: 'none' }, 0.30);

      // 0.35 - 0.50: Second glyph "11"
      tl.to('.ds-glyph--1', { autoAlpha: 1, yPercent: 0, scale: 1.02, duration: 0.1, ease: 'none' }, 0.35)
        .to('.ds-glyph--1', { scale: 1, duration: 0.05, ease: 'none' }, 0.45);
      tl.to('.ds-dot--1', { autoAlpha: 1, scale: 1, duration: 0.05, ease: 'none' }, 0.45);

      // 0.50 - 0.65: Third glyph "2026"
      tl.to('.ds-glyph--2', { autoAlpha: 1, yPercent: 0, scale: 1.02, duration: 0.1, ease: 'none' }, 0.50)
        .to('.ds-glyph--2', { scale: 1, duration: 0.05, ease: 'none' }, 0.60);

      // 0.65 - 0.75: Details fade in
      tl.to('.ds-details', { autoAlpha: 1, y: 0, duration: 0.1, ease: 'none' }, 0.65);

      // 0.75 - 1.0: Reading buffer
      tl.to({}, { duration: 0.25 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ds-scene scene-stage">
      <div className="ds-inner">
        <div className="ds-clock">
          <div className="ds-clock-hands" />
        </div>
        
        <p className="ds-kicker">Save the Date</p>
        
        <div className="ds-glyphs">
          <span className="ds-glyph ds-glyph--0">14</span>
          <span className="ds-dot ds-dot--0">/</span>
          <span className="ds-glyph ds-glyph--1">11</span>
          <span className="ds-dot ds-dot--1">/</span>
          <span className="ds-glyph ds-glyph--2">2026</span>
        </div>
        
        <div className="ds-details">
          <p>Saturday</p>
          <span>5:00 PM</span>
        </div>
      </div>
    </section>
  );
}
