import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventConfig } from '../config/eventConfig';
import receptionImg from '../assets/decor/reception-twilight.jpg';

gsap.registerPlugin(ScrollTrigger);

export default function ReceptionScene() {
  const sectionRef = useRef(null);
  const { reception } = eventConfig;

  useLayoutEffect(() => {
    if (
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
    ) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const section = sectionRef.current;

      const image = section.querySelector(
        '.rec-cinematic-image'
      );

      const shade = section.querySelector(
        '.rec-image-shade'
      );

      const copy = section.querySelector(
        '.rec-cinematic-copy'
      );

      const label = section.querySelector(
        '.rec-label'
      );

      const rule = section.querySelector(
        '.rec-rule-top'
      );

      const venue = section.querySelector(
        '.rec-venue-name'
      );

      const area = section.querySelector(
        '.rec-venue-sub'
      );

      const note = section.querySelector(
        '.rec-note'
      );

      const maps = section.querySelector(
        '.rec-map-link'
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,

          start: 'top top',
          end: '+=1100',

          scrub: 1,

          /*
           * Reception gets its own clean scroll space.
           * It does NOT overlap Ceremony.
           */
          pin: true,
          pinSpacing: true,

          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 0,
        },
      });

      /* ======================================================
         1. IMAGE ENTERS
         ====================================================== */

      tl.fromTo(
        image,
        {
          opacity: 0.15,
          scale: 1.06,
          xPercent: 3,
        },
        {
          opacity: 1,
          scale: 1,
          xPercent: 0,
          ease: 'power2.out',
          duration: 0.24,
        },
        0
      );

      /* ======================================================
         2. CINEMATIC WASH
         ====================================================== */

      tl.fromTo(
        shade,
        {
          opacity: 0,
        },
        {
          opacity: 0.50,
          ease: 'none',
          duration: 0.20,
        },
        0.04
      );

      /* ======================================================
         3. IMAGE HOLD
         ====================================================== */

      tl.to(
        {},
        {
          duration: 0.12,
        },
        0.28
      );

      /* ======================================================
         4. RECEPTION LABEL
         ====================================================== */

      tl.fromTo(
        label,
        {
          y: 28,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          ease: 'power3.out',
          duration: 0.14,
        },
        0.34
      );

      /* ======================================================
         5. RULE
         ====================================================== */

      tl.fromTo(
        rule,
        {
          scaleX: 0,
          autoAlpha: 0,
        },
        {
          scaleX: 1,
          autoAlpha: 1,
          transformOrigin: 'center',
          ease: 'none',
          duration: 0.12,
        },
        0.40
      );

      /* ======================================================
         6. VENUE
         ====================================================== */

      tl.fromTo(
        venue,
        {
          y: 38,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          ease: 'power3.out',
          duration: 0.18,
        },
        0.45
      );

      /* ======================================================
         7. AREA
         ====================================================== */

      tl.fromTo(
        area,
        {
          y: 20,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 0.13,
        },
        0.56
      );

      /* ======================================================
         8. NOTE
         ====================================================== */

      tl.fromTo(
        note,
        {
          y: 18,
          autoAlpha: 0,
          filter: 'blur(4px)',
        },
        {
          y: 0,
          autoAlpha: 1,
          filter: 'blur(0px)',
          ease: 'power2.out',
          duration: 0.14,
        },
        0.63
      );

      /* ======================================================
         9. MAPS — LAST
         ====================================================== */

      tl.fromTo(
        maps,
        {
          y: 24,
          autoAlpha: 0,
          scale: 0.92,
        },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          ease: 'back.out(1.4)',
          duration: 0.16,
        },
        0.71
      );

      /* ======================================================
         10. FINAL HOLD
         ====================================================== */

      tl.to(
        copy,
        {
          yPercent: -2,
          ease: 'none',
          duration: 0.12,
        },
        0.86
      );

      tl.to(
        {},
        {
          duration: 0.12,
        },
        0.92
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="rec-cinematic"
    >
      <img
        src={receptionImg}
        className="rec-cinematic-image"
        alt=""
        aria-hidden="true"
        draggable="false"
      />

      <div
        className="rec-image-shade"
        aria-hidden="true"
      />

      <div className="rec-cinematic-copy">

        <p className="rec-label">
          Reception
        </p>

        <div className="rec-rule rec-rule-top">
          <span />
        </div>

        <h2 className="rec-venue-name">
          {reception.name}
        </h2>

        <p className="rec-venue-sub">
          {reception.area}
        </p>

        <p className="rec-note">
          {reception.note}
        </p>

        <a
          className="rec-map-link"
          href={reception.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            className="rec-map-icon"
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

          <span>
            VIEW ON MAPS
          </span>
        </a>

      </div>
    </section>
  );
}
