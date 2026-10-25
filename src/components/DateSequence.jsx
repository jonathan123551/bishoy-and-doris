import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DAYS = Array.from({ length: 14 }, (_, i) => String(i + 1).padStart(2, '0'));
const MONTHS = Array.from({ length: 11 }, (_, i) => String(i + 1).padStart(2, '0'));
const YEARS = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];
const HOUR_TICKS = Array.from({ length: 12 }, (_, i) => i * 30);

export default function DateSequence() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const dayFinalY = -((DAYS.length - 1) * 100) / DAYS.length;
    const monthFinalY = -((MONTHS.length - 1) * 100) / MONTHS.length;
    const yearFinalY = -((YEARS.length - 1) * 100) / YEARS.length;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set('.ds-reel-track--day', { yPercent: dayFinalY });
      gsap.set('.ds-reel-track--month', { yPercent: monthFinalY });
      gsap.set('.ds-reel-track--year', { yPercent: yearFinalY });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.set('.ds-clock', { autoAlpha: 0, scale: 0.9 });
      gsap.set('.ds-clock-ticks', { rotation: -45, autoAlpha: 0 });
      gsap.set('.ds-clock-hands', { rotation: -360 });
      gsap.set('.ds-clock-hour', { rotation: -90 });
      gsap.set('.ds-kicker', { autoAlpha: 0, y: 12 });
      gsap.set('.ds-glyphs', { autoAlpha: 0, scale: 0.96 });
      gsap.set('.ds-unit--year', { autoAlpha: 0.45 });
      gsap.set('.ds-unit--month', { autoAlpha: 0.45 });
      gsap.set('.ds-unit--day', { autoAlpha: 0.45 });
      gsap.set('.ds-reel-track--year', { yPercent: 0 });
      gsap.set('.ds-reel-track--month', { yPercent: 0 });
      gsap.set('.ds-reel-track--day', { yPercent: 0 });
      gsap.set('.ds-details', { autoAlpha: 0, y: 14 });

      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'scene:date',
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=120%',
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Center Clock appears and spins first (0.00 -> 0.25)
      tl.to(
        '.ds-clock',
        { autoAlpha: 1, scale: 1, duration: 0.16, ease: 'power2.out' },
        0.02
      );
      tl.to(
        '.ds-clock-ticks',
        { rotation: 0, autoAlpha: 1, duration: 0.22, ease: 'power2.out' },
        0.03
      );
      tl.to(
        '.ds-clock-hands',
        { rotation: -30, duration: 0.24, ease: 'power2.inOut' },
        0.03
      );
      tl.to(
        '.ds-clock-hour',
        { rotation: 120, duration: 0.24, ease: 'power2.inOut' },
        0.03
      );
      tl.to(
        '.ds-kicker',
        { autoAlpha: 1, y: 0, duration: 0.13, ease: 'power2.out' },
        0.11
      );
      tl.to(
        '.ds-glyphs',
        { autoAlpha: 1, scale: 1, duration: 0.13, ease: 'power2.out' },
        0.15
      );

      // 2. YEAR scrolls on its own to 2026 (0.25 -> 0.45)
      tl.to(
        '.ds-unit--year',
        { autoAlpha: 1, duration: 0.05, ease: 'none' },
        0.25
      );
      tl.to(
        '.ds-reel-track--year',
        { yPercent: yearFinalY, duration: 0.20, ease: 'power2.inOut' },
        0.25
      );
      tl.to(
        '.ds-clock-hands',
        { rotation: -18, duration: 0.20, ease: 'none' },
        0.25
      );

      // 3. MONTH scrolls on its own to 11 (0.45 -> 0.65)
      tl.to(
        '.ds-unit--month',
        { autoAlpha: 1, duration: 0.05, ease: 'none' },
        0.45
      );
      tl.to(
        '.ds-reel-track--month',
        { yPercent: monthFinalY, duration: 0.20, ease: 'power2.inOut' },
        0.45
      );
      tl.to(
        '.ds-clock-hands',
        { rotation: -8, duration: 0.20, ease: 'none' },
        0.45
      );

      // 4. DAY scrolls on its own to 14 (0.65 -> 0.85)
      tl.to(
        '.ds-unit--day',
        { autoAlpha: 1, duration: 0.05, ease: 'none' },
        0.65
      );
      tl.to(
        '.ds-reel-track--day',
        { yPercent: dayFinalY, duration: 0.20, ease: 'power2.inOut' },
        0.65
      );
      tl.to(
        '.ds-clock-hands',
        { rotation: 0, duration: 0.20, ease: 'power2.out' },
        0.65
      );
      tl.to(
        '.ds-clock-hour',
        { rotation: 150, duration: 0.20, ease: 'power2.out' },
        0.65
      );

      // 5. Subtle lock-in settle & "Saturday · 5:00 PM" centered inside clock (0.83 -> 0.92)
      tl.to(
        '.ds-glyphs',
        { scale: 1.035, duration: 0.04, ease: 'power2.out' },
        0.84
      ).to(
        '.ds-glyphs',
        { scale: 1, duration: 0.05, ease: 'power2.inOut' },
        0.88
      );

      tl.to(
        '.ds-details',
        { autoAlpha: 1, y: 0, duration: 0.11, ease: 'power2.out' },
        0.81
      );

      // Scene Director stop: date locked at 14 · 11 · 2026 and details visible.
      tl.addLabel('complete', 0.92);

      // 6. Gentle exit transition before PhotoStory
      tl.to(
        '.ds-centerpiece',
        { y: -16, scale: 0.98, autoAlpha: 0.3, duration: 0.07, ease: 'power1.inOut' },
        0.93
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ds-scene scene-stage">
      <div className="ds-inner">
        <div className="ds-centerpiece">
          {/* Primary Centerpiece: Luxury Horological Clock Dial */}
          <div className="ds-clock" aria-hidden="true">
            <div className="ds-clock-glow" />
            <div className="ds-clock-ring-outer" />
            <div className="ds-clock-ring-inner" />

            <svg
              className="ds-clock-ticks"
              viewBox="0 0 200 200"
              fill="none"
            >
              {HOUR_TICKS.map((deg) => {
                const isCardinal = deg % 90 === 0;
                return (
                  <line
                    key={deg}
                    x1="100"
                    y1={isCardinal ? '8' : '11'}
                    x2="100"
                    y2={isCardinal ? '19' : '16'}
                    stroke="rgba(218, 181, 109, 0.72)"
                    strokeWidth={isCardinal ? '1.6' : '1'}
                    strokeLinecap="round"
                    transform={`rotate(${deg} 100 100)`}
                  />
                );
              })}
            </svg>

            <div className="ds-clock-hour" />
            <div className="ds-clock-hands" />
            <div className="ds-clock-pivot" />
          </div>

          {/* All text centered inside the middle of the clock */}
          <div className="ds-content">
            <p className="ds-kicker">Save the Date</p>

            <div className="ds-glyphs" aria-label="14 November 2026">
              {/* Day Reel (01 -> 14) */}
              <div className="ds-unit ds-unit--day">
                <div className="ds-reel-window ds-reel-window--2ch">
                  <div className="ds-reel-track ds-reel-track--day">
                    {DAYS.map((d) => (
                      <span key={d} className="ds-glyph">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <span className="ds-dot" aria-hidden="true">
                &middot;
              </span>

              {/* Month Reel (01 -> 11) */}
              <div className="ds-unit ds-unit--month">
                <div className="ds-reel-window ds-reel-window--2ch">
                  <div className="ds-reel-track ds-reel-track--month">
                    {MONTHS.map((m) => (
                      <span key={m} className="ds-glyph">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <span className="ds-dot" aria-hidden="true">
                &middot;
              </span>

              {/* Year Reel (2020 -> 2026) */}
              <div className="ds-unit ds-unit--year">
                <div className="ds-reel-window ds-reel-window--4ch">
                  <div className="ds-reel-track ds-reel-track--year">
                    {YEARS.map((y) => (
                      <span key={y} className="ds-glyph ds-glyph--year">
                        {y}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="ds-details">
              <p>Saturday</p>
              <span>5:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
