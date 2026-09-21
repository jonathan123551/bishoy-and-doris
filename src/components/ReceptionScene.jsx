import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventConfig } from '../config/eventConfig';
import gardeniaImg from '../assets/decor/gardenia.jpg';

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

      /*
       * ======================================================
       * RECEPTION ENTERS UNDER THE CEREMONY
       * ======================================================
       */

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,

          start: 'top top',

          end: '+=1250',

          scrub: 1,

          pin: true,

          /*
           * Important:
           * don't create another giant gap after Reception.
           */
          pinSpacing: true,

          anticipatePin: 1,

          invalidateOnRefresh: true,

          refreshPriority: -1,
        },
      });

      /*
       * ------------------------------------------------------
       * 1. REVEAL THE WHOLE PAGE FROM THE RIGHT
       * ------------------------------------------------------
       */

      tl.fromTo(
        section,
        {
          clipPath:
            'inset(0 0 0 100%)',
        },
        {
          clipPath:
            'inset(0 0 0 0%)',
          ease: 'power2.inOut',
          duration: 0.34,
        },
        0
      );

      /*
       * ------------------------------------------------------
       * 2. IMAGE HAS A SLIGHT CINEMATIC MOVEMENT
       * ------------------------------------------------------
       */

      tl.fromTo(
        image,
        {
          scale: 1.10,
          xPercent: 4,
        },
        {
          scale: 1,
          xPercent: 0,
          ease: 'none',
          duration: 0.42,
        },
        0
      );

      /*
       * ------------------------------------------------------
       * 3. DARKNESS SETTLES
       * ------------------------------------------------------
       */

      tl.fromTo(
        shade,
        {
          opacity: 0,
        },
        {
          opacity: 0.48,
          ease: 'none',
          duration: 0.30,
        },
        0.08
      );

      /*
       * ------------------------------------------------------
       * 4. TEXT — NOT IMMEDIATELY
       * ------------------------------------------------------
       */

      tl.fromTo(
        label,
        {
          y: 30,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          ease: 'power3.out',
          duration: 0.14,
        },
        0.43
      );

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
        0.49
      );

      /*
       * ------------------------------------------------------
       * 5. LA PENSÉE
       * ------------------------------------------------------
       */

      tl.fromTo(
        venue,
        {
          y: 45,
          autoAlpha: 0,
          scale: 0.97,
        },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          ease: 'power3.out',
          duration: 0.18,
        },
        0.54
      );

      /*
       * ------------------------------------------------------
       * 6. GARDENIA
       * ------------------------------------------------------
       */

      tl.fromTo(
        area,
        {
          y: 22,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 0.13,
        },
        0.64
      );

      /*
       * ------------------------------------------------------
       * 7. AFTER THE CEREMONY
       * ------------------------------------------------------
       */

      tl.fromTo(
        note,
        {
          y: 20,
          autoAlpha: 0,
          filter: 'blur(5px)',
        },
        {
          y: 0,
          autoAlpha: 1,
          filter: 'blur(0px)',
          ease: 'power2.out',
          duration: 0.14,
        },
        0.71
      );

      /*
       * ------------------------------------------------------
       * 8. MAPS — LAST
       * ------------------------------------------------------
       */

      tl.fromTo(
        maps,
        {
          y: 26,
          autoAlpha: 0,
          scale: 0.88,
        },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          ease: 'back.out(1.5)',
          duration: 0.17,
        },
        0.79
      );

      /*
       * ------------------------------------------------------
       * 9. FINAL HOLD
       * ------------------------------------------------------
       */

      tl.to(
        copy,
        {
          yPercent: -2,
          ease: 'none',
          duration: 0.18,
        },
        0.90
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
        src={gardeniaImg}
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
