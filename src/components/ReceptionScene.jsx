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

      const image = section.querySelector('.rec-cinematic-image');
      const shade = section.querySelector('.rec-image-shade');
      const copy = section.querySelector('.rec-cinematic-copy');

      const label = section.querySelector('.rec-label');
      const rule = section.querySelector('.rec-rule-top');
      const venue = section.querySelector('.rec-venue-name');
      const area = section.querySelector('.rec-venue-sub');
      const note = section.querySelector('.rec-note');
      const maps = section.querySelector('.rec-map-link');

      /*
       * IMPORTANT:
       * The Reception image is visible from the beginning.
       *
       * This is what allows it to sit underneath Ceremony while
       * Ceremony is pinned/fading out.
       *
       * We do NOT fade the image out at the end.
       * It should remain visible until DateSequence naturally
       * takes over after this section.
       */
      gsap.set(image, {
        opacity: 1,
        scale: 1,
        xPercent: 0,
      });

      gsap.set(shade, {
        opacity: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: () => `top top-=${Math.max(0, 1400 - window.innerHeight)}px`,
          end: () => 'bottom bottom',
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 0,
        },
      });

      const isMobile = window.innerWidth <= 600;
      const startDelay = isMobile ? 0.04 : 0.06;

      /*
       * 1. Cinematic shade gently fades in to prepare contrast for text
       */
      tl.fromTo(
        shade,
        { opacity: 0 },
        {
          opacity: 0.52,
          ease: 'none',
          duration: 0.22,
        },
        startDelay * 0.5
      );

      /*
       * 2. "Reception" eyebrow appears after the breathing room
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
          ease: 'power2.out',
          duration: 0.15,
        },
        startDelay
      );

      /*
       * 3. Gold rule expands
       */
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
          duration: 0.13,
        },
        startDelay + 0.11
      );

      /*
       * 4. "LA PENSÉE" venue title
       */
      tl.fromTo(
        venue,
        {
          y: 36,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 0.17,
        },
        startDelay + 0.22
      );

      /*
       * 5. "Gardenia" area subtitle
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
          duration: 0.14,
        },
        startDelay + 0.34
      );

      /*
       * 6. "AFTER THE CEREMONY" note
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
          duration: 0.14,
        },
        startDelay + 0.45
      );

      /*
       * 7. "VIEW ON MAPS" link - last
       */
      tl.fromTo(
        maps,
        {
          y: 24,
          autoAlpha: 0,
          scale: 0.94,
        },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          ease: 'back.out(1.4)',
          duration: 0.15,
        },
        startDelay + 0.57
      );

      /*
       * 8. Hold the complete Reception scene briefly before releasing
       */
      tl.to(
        {},
        {
          duration: 0.06,
        },
        startDelay + 0.72
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="rec-scroll"
    >
      <div className="rec-cinematic">

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
      </div>
    </section>
  );
}