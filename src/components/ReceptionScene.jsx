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

      const delayPixels = 1400 - window.innerHeight;
      const activePixels = 1000;
      const totalPixels = delayPixels > 0 ? delayPixels + activePixels : activePixels;
      const D = 1.07;
      const startT = delayPixels > 0 ? (delayPixels / activePixels) * D : 0;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${totalPixels}`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
        },
      });

      if (startT > 0) {
        tl.to({}, { duration: startT }, 0);
      }

      /*
       * ======================================================
       * 1. RECEPTION IMAGE ENTERS
       * ======================================================
       *
       * No clipPath.
       * The whole Reception scene is already there,
       * but starts just outside the right side.
       */

      tl.fromTo(
        section,
        {
          xPercent: 12,
        },
        {
          xPercent: 0,
          ease: 'power3.inOut',
          duration: 0.34,
        },
        startT + 0
      );

      /*
       * ======================================================
       * 2. CINEMATIC IMAGE SETTLES
       * ======================================================
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
          ease: 'power2.out',
          duration: 0.42,
        },
        startT + 0
      );

      /*
       * ======================================================
       * 3. DARK CINEMATIC WASH
       * ======================================================
       */

      tl.fromTo(
        shade,
        {
          opacity: 0,
        },
        {
          opacity: 0.46,
          ease: 'none',
          duration: 0.28,
        },
        startT + 0.12
      );

      /*
       * ======================================================
       * 4. HOLD IMAGE
       * ======================================================
       */

      tl.to(
        {},
        {
          duration: 0.10,
        },
        startT + 0.42
      );

      /*
       * ======================================================
       * 5. RECEPTION TEXT
       * ======================================================
       */

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
        startT + 0.48
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
        startT + 0.54
      );

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
        startT + 0.59
      );

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
        startT + 0.68
      );

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
        startT + 0.74
      );

      /*
       * ======================================================
       * 6. MAPS — LAST
       * ======================================================
       */

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
        startT + 0.81
      );

      /*
       * ======================================================
       * 7. FINAL HOLD
       * ======================================================
       */

      tl.to(
        {},
        {
          duration: 0.19,
        },
        startT + 0.88
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
