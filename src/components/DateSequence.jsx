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
          end: 'bottom top',
          scrub: true,
          pin: '.ds-inner',
        },
      });

      tl.to('.ds-orbit', { rotate: 76, ease: 'none' }, 0);
      tl.to('.ds-needle', { rotate: 134, ease: 'none' }, 0);
      dateGlyphs.forEach((_, index) => {
        const start = index * 0.18;
        tl.fromTo(`.ds-glyph--${index}`, { autoAlpha: 0, yPercent: 62, scale: 0.86 }, { autoAlpha: 1, yPercent: 0, scale: 1, ease: 'none' }, start);
        tl.to(`.ds-glyph--${index}`, { autoAlpha: 0, yPercent: -38, scale: 1.08, ease: 'none' }, start + 0.2);
      });
      tl.fromTo('.ds-assembled', { autoAlpha: 0, scale: 0.7, y: 18 }, { autoAlpha: 1, scale: 1, y: 0, ease: 'none' }, 0.56);
      tl.fromTo('.ds-details', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, ease: 'none' }, 0.68);
      tl.to('.ds-disc', { scale: 1.13, autoAlpha: 0.5, ease: 'none' }, 0.72);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ds-scene" style={{ position: 'relative', height: '116svh' }}>
      <div className="ds-inner">
        <div className="ds-star ds-star--one" />
        <div className="ds-star ds-star--two" />
        <div className="ds-star ds-star--three" />
        <div className="ds-disc">
          <div className="ds-orbit" />
          <div className="ds-needle" />
          <div className="ds-core" />
        </div>
        <p className="ds-kicker">Save the date</p>
        <div className="ds-glyphs">
          {dateGlyphs.map((glyph, index) => <span key={glyph} className={`ds-glyph ds-glyph--${index}`}>{glyph}</span>)}
        </div>
        <div className="ds-assembled">
          <span>14</span><i>·</i><span>11</span><i>·</i><span>2026</span>
        </div>
        <div className="ds-details">
          <p>Saturday</p>
          <span>5:00 PM</span>
        </div>
      </div>
    </section>
  );
}
