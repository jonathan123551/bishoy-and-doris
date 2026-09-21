import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import churchBg from '../assets/church-bg.png';

gsap.registerPlugin(ScrollTrigger);

const CHURCH_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Church+of+Archangel+Michael+Sheraton+Cairo';

export default function CeremonyScene() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      const section = sectionRef.current;

      const bg = section.querySelector('.ceremony-bg');
      const overlay = section.querySelector('.ceremony-overlay');
      const content = section.querySelector('.ceremony-content');

      const eyebrow = section.querySelector('.ceremony-eyebrow');
      const titleTop = section.querySelector('.ceremony-title-top');
      const titleBottom = section.querySelector('.ceremony-title-bottom');
      const arabic = section.querySelector('.ceremony-arabic');
      const date = section.querySelector('.ceremony-date');
      const location = section.querySelector('.ceremony-location');
      const maps = section.querySelector('.ceremony-maps');

      const topRule = section.querySelector('.ceremony-rule-top');
      const bottomRule = section.querySelector('.ceremony-rule-bottom');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=1400',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      /*
       * 0 → 20%
       * Cinematic image enters.
       */
      tl.fromTo(
        bg,
        {
          scale: 1.1,
          yPercent: 4,
        },
        {
          scale: 1,
          yPercent: 0,
          ease: 'none',
          duration: 0.28,
        },
        0
      );

      tl.fromTo(
        overlay,
        {
          opacity: 0.15,
        },
        {
          opacity: 0.72,
          ease: 'none',
          duration: 0.25,
        },
        0
      );

      /*
       * Content starts low and slightly invisible.
       */
      tl.fromTo(
        content,
        {
          yPercent: 8,
        },
        {
          yPercent: 0,
          ease: 'none',
          duration: 0.7,
        },
        0
      );

      /*
       * 20 → 35%
       * Eyebrow + top gold line.
       */
      tl.fromTo(
        eyebrow,
        {
          y: 28,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 0.18,
        },
        0.22
      );

      tl.fromTo(
        topRule,
        {
          scaleX: 0,
          autoAlpha: 0,
        },
        {
          scaleX: 1,
          autoAlpha: 1,
          transformOrigin: 'center',
          ease: 'none',
          duration: 0.18,
        },
        0.28
      );

      /*
       * 35 → 55%
       * Title enters from opposite directions.
       */
      tl.fromTo(
        titleTop,
        {
          x: 80,
          autoAlpha: 0,
        },
        {
          x: 0,
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 0.22,
        },
        0.34
      );

      tl.fromTo(
        titleBottom,
        {
          x: -80,
          autoAlpha: 0,
        },
        {
          x: 0,
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 0.22,
        },
        0.40
      );

      /*
       * Arabic reveal.
       */
      tl.fromTo(
        arabic,
        {
          y: 25,
          autoAlpha: 0,
          filter: 'blur(5px)',
        },
        {
          y: 0,
          autoAlpha: 1,
          filter: 'blur(0px)',
          ease: 'power2.out',
          duration: 0.2,
        },
        0.49
      );

      /*
       * Date.
       */
      tl.fromTo(
        date,
        {
          y: 22,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 0.18,
        },
        0.59
      );

      /*
       * Location.
       */
      tl.fromTo(
        location,
        {
          y: 20,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 0.17,
        },
        0.67
      );

      /*
       * Maps button draws itself.
       */
      tl.fromTo(
        maps,
        {
          y: 24,
          autoAlpha: 0,
          scale: 0.94,
          xPercent: -50,
        },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          xPercent: -50,
          ease: 'back.out(1.4)',
          duration: 0.2,
        },
        0.76
      );

      tl.fromTo(
        bottomRule,
        {
          scaleX: 0,
          autoAlpha: 0,
        },
        {
          scaleX: 1,
          autoAlpha: 1,
          transformOrigin: 'center',
          ease: 'none',
          duration: 0.16,
        },
        0.82
      );

      /*
       * Final cinematic hold.
       */
      tl.to(
        content,
        {
          yPercent: -1.5,
          ease: 'none',
          duration: 0.18,
        },
        0.86
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ceremony-cinematic">
      {/* Actual church artwork — NO TEXT INSIDE */}
      <img
        className="ceremony-bg"
        src={churchBg}
        alt=""
        aria-hidden="true"
        draggable="false"
      />

      {/* Cinematic darkness / readability layer */}
      <div className="ceremony-overlay" aria-hidden="true" />

      {/* Subtle blue glow */}
      <div className="ceremony-blue-glow" aria-hidden="true" />

      <div className="ceremony-content">
        <div className="ceremony-eyebrow">
          THE HOLY MATRIMONY
        </div>

        <div className="ceremony-rule ceremony-rule-top">
          <span />
        </div>

        <div className="ceremony-title">
          <div className="ceremony-title-top">
            CHURCH OF
          </div>

          <div className="ceremony-title-bottom">
            ARCHANGEL MICHAEL
          </div>
        </div>

        <div className="ceremony-arabic" dir="rtl">
          كنيسة رئيس الملائكة ميخائيل
        </div>

        <div className="ceremony-date">
          14 November 2026 · 5:00 PM
        </div>

        <div className="ceremony-location">
          SHERATON, CAIRO
        </div>

        <a
          className="ceremony-maps"
          href={CHURCH_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            className="ceremony-pin"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            />
            <circle
              cx="12"
              cy="9"
              r="2.3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            />
          </svg>

          <span>VIEW ON MAPS</span>
        </a>

        <div className="ceremony-rule ceremony-rule-bottom">
          <span />
        </div>
      </div>
    </section>
  );
}
