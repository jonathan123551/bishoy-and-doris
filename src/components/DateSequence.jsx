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
          end: '+=120%',
          scrub: 0.8,
          pin: true,
        },
      });

      tl.to('.ds-time-ring', { rotate: 76, ease: 'none' }, 0);
      tl.to('.ds-needle', { rotate: 134, ease: 'none' }, 0);
      tl.to('.ds-kicker', { autoAlpha: 0, scale: 0.94, ease: 'none' }, 0.1);
      tl.fromTo('.ds-glyph--0', { autoAlpha: 0, yPercent: 36, scale: 0.9 }, { autoAlpha: 1, yPercent: 0, scale: 1, duration: 0.2, ease: 'none' }, 0.16);
      tl.to('.ds-glyph--0', { scale: 1.04, duration: 0.1, ease: 'none' }, 0.34);
      tl.to('.ds-glyph--0', { scale: 1, duration: 0.1, ease: 'none' }, 0.44);
      tl.fromTo('.ds-glyph--1', { autoAlpha: 0, yPercent: 36, scale: 0.9 }, { autoAlpha: 1, yPercent: 0, scale: 1, duration: 0.2, ease: 'none' }, 0.52);
      tl.to('.ds-glyph--1', { scale: 1.04, duration: 0.1, ease: 'none' }, 0.7);
      tl.to('.ds-glyph--1', { scale: 1, duration: 0.1, ease: 'none' }, 0.8);
      tl.fromTo('.ds-glyph--2', { autoAlpha: 0, yPercent: 36, scale: 0.9 }, { autoAlpha: 1, yPercent: 0, scale: 1, duration: 0.22, ease: 'none' }, 0.88);
      tl.to('.ds-disc', { scale: 1.1, autoAlpha: 0.54, ease: 'none' }, 0.88);
      tl.fromTo('.ds-details', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, ease: 'none' }, 1.1);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ds-scene" style={{ position: 'relative', height: '116svh' }}>
      <div className="ds-inner">
        <div className="ds-disc">
          <div className="ds-time-ring" />
          <div className="ds-needle" />
          <div className="ds-core" />
        </div>
        <p className="ds-kicker">Save the date</p>
        <div className="ds-glyphs">
          {dateGlyphs.map((glyph, index) => <span key={glyph} className={`ds-glyph ds-glyph--${index}`}>{glyph}</span>)}
        </div>
        <div className="ds-assembled">
          <span>14</span><i>&middot;</i><span>11</span><i>&middot;</i><span>2026</span>
        </div>
        <div className="ds-details">
          <p>Saturday</p>
          <span>5:00 PM</span>
        </div>
      </div>
    </section>
  );
}
