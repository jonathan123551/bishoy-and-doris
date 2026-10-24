import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TARGET_DAY = 14;
const TARGET_MONTH = 11;
const START_YEAR = 2020;
const TARGET_YEAR = 2026;

export default function DateSequence() {
  const sectionRef = useRef(null);
  const dayRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (dayRef.current) dayRef.current.textContent = String(TARGET_DAY).padStart(2, '0');
      if (monthRef.current) monthRef.current.textContent = String(TARGET_MONTH).padStart(2, '0');
      if (yearRef.current) yearRef.current.textContent = String(TARGET_YEAR);
      return undefined;
    }

    const ctx = gsap.context(() => {
      const counter = {
        day: 1,
        month: 1,
        year: START_YEAR,
      };

      const renderDigits = () => {
        if (dayRef.current) {
          dayRef.current.textContent = String(Math.round(counter.day)).padStart(2, '0');
        }
        if (monthRef.current) {
          monthRef.current.textContent = String(Math.round(counter.month)).padStart(2, '0');
        }
        if (yearRef.current) {
          yearRef.current.textContent = String(Math.round(counter.year));
        }
      };

      renderDigits();

      gsap.set('.ds-clock', { autoAlpha: 0, scale: 0.92 });
      gsap.set('.ds-kicker', { autoAlpha: 0, y: 14 });
      gsap.set('.ds-unit', { autoAlpha: 0, y: 24, scale: 0.94 });
      gsap.set('.ds-dot', { autoAlpha: 0, scale: 0.5 });
      gsap.set('.ds-details', { autoAlpha: 0, y: 18 });
      gsap.set('.ds-clock-hands', { rotation: -210 });
      gsap.set('.ds-clock-hour', { rotation: -90 });

      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'scene:date',
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=110%',
          scrub: 0.25,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Clock dial & "Save the Date" header materialize (0.00 -> 0.16)
      tl.to(
        '.ds-clock',
        { autoAlpha: 1, scale: 1, duration: 0.14, ease: 'power2.out' },
        0.0
      );
      tl.to(
        '.ds-kicker',
        { autoAlpha: 1, y: 0, duration: 0.14, ease: 'power2.out' },
        0.05
      );

      // 2. Counter columns & gold separators enter sequentially (0.12 -> 0.28)
      tl.to(
        '.ds-unit',
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          stagger: 0.05,
          duration: 0.14,
          ease: 'power2.out',
        },
        0.12
      );
      tl.to(
        '.ds-dot',
        {
          autoAlpha: 1,
          scale: 1,
          stagger: 0.05,
          duration: 0.12,
          ease: 'back.out(1.6)',
        },
        0.16
      );

      // 3. Clock hands sweep while Day (01->14), Month (01->11), Year (2020->2026) roll
      tl.to(
        '.ds-clock-hands',
        { rotation: 0, duration: 0.58, ease: 'power2.inOut' },
        0.18
      );
      tl.to(
        '.ds-clock-hour',
        { rotation: 150, duration: 0.58, ease: 'power2.inOut' },
        0.18
      );

      tl.to(
        counter,
        {
          day: TARGET_DAY,
          duration: 0.44,
          ease: 'power1.inOut',
          onUpdate: renderDigits,
        },
        0.20
      );

      tl.to(
        counter,
        {
          month: TARGET_MONTH,
          duration: 0.46,
          ease: 'power1.inOut',
          onUpdate: renderDigits,
        },
        0.24
      );

      tl.to(
        counter,
        {
          year: TARGET_YEAR,
          duration: 0.48,
          ease: 'none',
          onUpdate: renderDigits,
        },
        0.26
      );

      // 4. Subtle lock-in pulse once 14 · 11 · 2026 settles (0.72 -> 0.80)
      tl.to(
        '.ds-glyphs',
        { scale: 1.045, duration: 0.05, ease: 'power2.out' },
        0.73
      ).to(
        '.ds-glyphs',
        { scale: 1, duration: 0.06, ease: 'power2.inOut' },
        0.78
      );

      // 5. "Saturday · 5:00 PM" rises in beneath the locked date (0.76 -> 0.88)
      tl.to(
        '.ds-details',
        { autoAlpha: 1, y: 0, duration: 0.12, ease: 'power2.out' },
        0.76
      );

      // Scene Director stop: date locked at 14 · 11 · 2026 and details visible.
      tl.addLabel('complete', 0.90);

      // Reading hold
      tl.to({}, { duration: 0.12 }, 0.88);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ds-scene scene-stage">
      <div className="ds-inner">
        <div className="ds-clock" aria-hidden="true">
          <div className="ds-clock-hour" />
          <div className="ds-clock-hands" />
          <div className="ds-clock-pivot" />
        </div>

        <p className="ds-kicker">Save the Date</p>

        <div className="ds-glyphs" aria-label="14 November 2026">
          <div className="ds-unit">
            <span ref={dayRef} className="ds-glyph ds-glyph--0">01</span>
          </div>

          <span className="ds-dot ds-dot--0" aria-hidden="true">&middot;</span>

          <div className="ds-unit">
            <span ref={monthRef} className="ds-glyph ds-glyph--1">01</span>
          </div>

          <span className="ds-dot ds-dot--1" aria-hidden="true">&middot;</span>

          <div className="ds-unit">
            <span ref={yearRef} className="ds-glyph ds-glyph--2">2020</span>
          </div>
        </div>

        <div className="ds-details">
          <p>Saturday</p>
          <span>5:00 PM</span>
        </div>
      </div>
    </section>
  );
}
