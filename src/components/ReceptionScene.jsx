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

      const ceremonyPinDuration = 1400;
      const totalSticky = Math.max(1, section.offsetHeight - window.innerHeight);
      const overlapPixels = Math.max(0, ceremonyPinDuration - window.innerHeight);
      const startT = Math.min(0.85, overlapPixels / totalSticky);
      const activeSpan = 1 - startT;

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

      gsap.set(
        [label, rule, venue, area, note, maps],
        {
          autoAlpha: 0,
        }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${section.offsetHeight - window.innerHeight}`,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 0,
        },
      });

      /*
       * Once Reception becomes the active scene,
       * bring in the cinematic shade.
       */
      tl.fromTo(
        shade,
        { opacity: 0 },
        {
          opacity: 0.50,
          ease: 'none',
          duration: activeSpan * 0.20,
        },
        startT
      );

      /*
       * Reception
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
          duration: activeSpan * 0.14,
        },
        startT
      );

      /*
       * Gold rule
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
          duration: activeSpan * 0.12,
        },
        startT + activeSpan * 0.07
      );

      /*
       * LA PENSÉE
       */
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
          duration: activeSpan * 0.18,
        },
        startT + activeSpan * 0.14
      );

      /*
       * Gardenia
       */
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
          duration: activeSpan * 0.13,
        },
        startT + activeSpan * 0.28
      );

      /*
       * AFTER THE CEREMONY
       */
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
          duration: activeSpan * 0.14,
        },
        startT + activeSpan * 0.38
      );

      /*
       * Maps — last
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
          duration: activeSpan * 0.16,
        },
        startT + activeSpan * 0.50
      );

      /*
       * Small cinematic movement after the content is complete.
       */
      tl.to(
        copy,
        {
          yPercent: -2,
          ease: 'none',
          duration: activeSpan * 0.12,
        },
        startT + activeSpan * 0.70
      );

      /*
       * Hold the finished Reception scene.
       *
       * DO NOT fade the image out here.
       * The next section should naturally take over.
       */
      tl.to(
        {},
        {
          duration: activeSpan * 0.18,
        },
        startT + activeSpan * 0.82
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