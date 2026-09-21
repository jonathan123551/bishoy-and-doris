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

    const isMobile = window.matchMedia(
      '(max-width: 600px)'
    ).matches;

    /*
     * Ceremony:
     * pinned for 1400px.
     *
     * Reception wrapper is intentionally 2500px:
     *
     * 1400px = Ceremony cinematic phase
     * 1100px = Reception cinematic phase
     *
     * Reception itself starts underneath Ceremony because
     * Ceremony uses pinSpacing:false.
     */
    const CEREMONY_PIN = 1400;
    const RECEPTION_PHASE = isMobile ? 1000 : 1100;
    const TOTAL_RECEPTION_WRAPPER =
      CEREMONY_PIN + RECEPTION_PHASE;

    /*
     * The actual Reception trigger starts after the normal
     * viewport-height portion of Ceremony.
     *
     * Therefore we calculate how much of the Reception phase
     * is still hidden underneath the pinned Ceremony.
     */
    const viewportHeight =
      window.visualViewport?.height ||
      window.innerHeight;

    const overlap =
      Math.max(0, CEREMONY_PIN - viewportHeight);

    const activeReceptionScroll =
      TOTAL_RECEPTION_WRAPPER - viewportHeight;

    const startProgress =
      activeReceptionScroll > 0
        ? overlap / activeReceptionScroll
        : 0;

    /*
     * Reception image is present immediately.
     * No image fade-in and no image fade-out.
     *
     * This is important for the cinematic handoff:
     *
     * Ceremony
     *    ↓
     * Reception image underneath
     *    ↓
     * Ceremony disappears
     *    ↓
     * Reception text begins
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

        /*
         * IMPORTANT:
         * Do NOT use +=2500 here.
         *
         * Reception trigger starts at the Reception wrapper's
         * top, so +=2500 would overshoot the wrapper.
         *
         * bottom top means:
         * "finish when the bottom of the wrapper reaches
         * the top of the viewport."
         */
        end: 'bottom top',

        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 0,
      },
    });

    /*
     * Dark cinematic shade.
     *
     * It begins immediately but remains subtle while the
     * Ceremony is still covering the Reception.
     */
    tl.fromTo(
      shade,
      { opacity: 0 },
      {
        opacity: 0.50,
        ease: 'none',
        duration: 0.20,
      },
      0
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
        duration: 0.14,
      },
      startProgress + 0.06
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
        duration: 0.10,
      },
      startProgress + 0.14
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
        duration: 0.16,
      },
      startProgress + 0.22
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
        duration: 0.12,
      },
      startProgress + 0.31
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
        duration: 0.12,
      },
      startProgress + 0.40
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
        duration: 0.14,
      },
      startProgress + 0.50
    );

    /*
     * Small cinematic movement after the content is complete.
     */
    tl.to(
      copy,
      {
        yPercent: -2,
        ease: 'none',
        duration: 0.12,
      },
      startProgress + 0.68
    );

    /*
     * Hold.
     *
     * No fade-out.
     */
    tl.to(
      {},
      {
        duration: 0.20,
      },
      startProgress + 0.80
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