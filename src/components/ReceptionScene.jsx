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
      const childrenNote = section.querySelector('.rec-children-note');
      const maps = section.querySelector('.rec-map-link');

      /*
       * IMPORTANT:
       * The Reception image is visible from the beginning.
       * This allows the image to sit underneath Ceremony while
       * Ceremony is leaving the viewport.
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
          id: 'scene:reception',
          trigger: section,
          start: () => `top+=${Math.max(0, 1400 - window.innerHeight)} top`,
          end: () => 'bottom bottom',
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 0,
        },
      });

      /*
       * Image-only establishment period so the Reception venue settles
       * full-screen before typography begins.
       */
      const startDelay = 0.14;

      /*
       * 1. Cinematic shade gently fades in to prepare contrast for text.
       */
      tl.fromTo(
        shade,
        {
          opacity: 0,
        },
        {
          opacity: 0.52,
          ease: 'none',
          duration: 0.24,
        },
        0.04
      );

      /*
       * 2. "Reception" eyebrow appears after the establishment beat.
       */
      tl.fromTo(
        label,
        {
          y: 26,
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
       * 3. Gold rule expands.
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
          ease: 'power1.inOut',
          duration: 0.13,
        },
        startDelay + 0.10
      );

      /*
       * 4. "LA PENSÉE" venue title.
       */
      tl.fromTo(
        venue,
        {
          y: 30,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 0.17,
        },
        startDelay + 0.19
      );

      /*
       * 5. "Gardenia" area subtitle.
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
        startDelay + 0.30
      );

      /*
       * 6. "AFTER THE CEREMONY" note.
       */
      tl.fromTo(
        note,
        {
          y: 20,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 0.14,
        },
        startDelay + 0.40
      );

      /*
       * 6b. Children etiquette note.
       */
      if (childrenNote) {
        tl.fromTo(
          childrenNote,
          {
            y: 18,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            ease: 'power2.out',
            duration: 0.14,
          },
          startDelay + 0.49
        );
      }

      /*
       * 7. "VIEW ON MAPS" link - last.
       */
      tl.fromTo(
        maps,
        {
          y: 22,
          autoAlpha: 0,
          scale: 0.95,
        },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          ease: 'back.out(1.3)',
          duration: 0.15,
        },
        startDelay + 0.59
      );

      /*
       * Scene Director stop: all Reception copy + map button revealed.
       */
      tl.addLabel('complete', startDelay + 0.74);

      /*
       * Gentle exit transition when advancing forward into DateSequence.
       */
      tl.to(
        copy,
        {
          y: -18,
          autoAlpha: 0.22,
          ease: 'power1.inOut',
          duration: 0.10,
        },
        startDelay + 0.76
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

          {reception.childrenNote && (
            <p className="rec-children-note">
              {reception.childrenNote}
            </p>
          )}

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
