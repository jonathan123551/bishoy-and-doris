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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const section = sectionRef.current;

      const image = section.querySelector('.rec-cinematic-image');
      const imageShade = section.querySelector('.rec-image-shade');
      const copy = section.querySelector('.rec-cinematic-copy');

      const label = section.querySelector('.rec-label');
      const topRule = section.querySelector('.rec-rule-top');
      const venue = section.querySelector('.rec-venue-name');
      const area = section.querySelector('.rec-venue-sub');
      const note = section.querySelector('.rec-note');
      const maps = section.querySelector('.rec-map-link');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=1250',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      /*
       * ------------------------------------------------------
       * 1. RECEPTION IMAGE ENTERS FROM THE RIGHT
       * ------------------------------------------------------
       */

      tl.fromTo(
        image,
        {
          xPercent: 100,
          scale: 1.08,
        },
        {
          xPercent: 0,
          scale: 1,
          ease: 'none',
          duration: 0.42,
        },
        0
      );

      /*
       * Image shade follows the entrance.
       */
      tl.fromTo(
        imageShade,
        {
          opacity: 0.1,
        },
        {
          opacity: 0.48,
          ease: 'none',
          duration: 0.35,
        },
        0.12
      );

      /*
       * ------------------------------------------------------
       * 2. VERY SMALL CINEMATIC PARALLAX
       * ------------------------------------------------------
       */

      tl.to(
        image,
        {
          scale: 1.035,
          yPercent: -1.5,
          ease: 'none',
          duration: 0.35,
        },
        0.42
      );

      /*
       * ------------------------------------------------------
       * 3. TEXT STARTS ONLY AFTER IMAGE HAS ARRIVED
       * ------------------------------------------------------
       */

      tl.fromTo(
        label,
        {
          y: 35,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 0.16,
        },
        0.47
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
          duration: 0.13,
        },
        0.54
      );

      /*
       * Venue name enters slightly from below.
       */
      tl.fromTo(
        venue,
        {
          y: 40,
          autoAlpha: 0,
          letterSpacing: '0.02em',
        },
        {
          y: 0,
          autoAlpha: 1,
          letterSpacing: '0.055em',
          ease: 'power3.out',
          duration: 0.20,
        },
        0.58
      );

      /*
       * Gardenia
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
          duration: 0.15,
        },
        0.68
      );

      /*
       * After the ceremony
       */
      tl.fromTo(
        note,
        {
          y: 20,
          autoAlpha: 0,
          filter: 'blur(4px)',
        },
        {
          y: 0,
          autoAlpha: 1,
          filter: 'blur(0px)',
          ease: 'power2.out',
          duration: 0.17,
        },
        0.75
      );

      /*
       * Maps appears LAST.
       */
      tl.fromTo(
        maps,
        {
          y: 30,
          autoAlpha: 0,
          scale: 0.9,
        },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          ease: 'back.out(1.5)',
          duration: 0.18,
        },
        0.84
      );

      /*
       * Final cinematic hold.
       */
      tl.to(
        copy,
        {
          yPercent: -2,
          ease: 'none',
          duration: 0.12,
        },
        0.93
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="rec-cinematic">
      {/* =================================================
          IMAGE ONLY
          No text baked into the artwork.
         ================================================= */}

      <img
        src={gardeniaImg}
        className="rec-cinematic-image"
        alt=""
        aria-hidden="true"
        draggable="false"
      />

      {/* Cinematic readability layer */}
      <div className="rec-image-shade" aria-hidden="true" />

      {/* =================================================
          ALL DATA IS HTML
         ================================================= */}

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

          <span>VIEW ON MAPS</span>
        </a>
      </div>
    </section>
  );
}
