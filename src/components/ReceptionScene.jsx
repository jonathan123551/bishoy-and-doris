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

      const isMobile = window.matchMedia(
        '(max-width: 600px)'
      ).matches;

      const CEREMONY_PIN = 1400;

      const RECEPTION_DURATION = isMobile
        ? 1000
        : 1100;

      /*
       * Ceremony is:
       *
       * height: 100svh
       * pin: true
       * pinSpacing: false
       * end: +=1400
       *
       * Because pinSpacing is false, Reception's natural
       * document position is only one viewport below the
       * previous content.
       *
       * At the exact moment Ceremony releases, Reception's
       * top may already be above the viewport.
       *
       * Therefore the Reception timeline must start at:
       *
       *     top - handoffOffset
       *
       * NOT:
       *
       *     top + handoffOffset
       *
       * The previous + value was the reason the Reception
       * animation was happening too early.
       */

      const ceremonySection = document.querySelector(
        '.ceremony-cinematic'
      );

      const ceremonyHeight =
        ceremonySection?.offsetHeight ||
        window.innerHeight;

      const handoffOffset = Math.max(
        0,
        CEREMONY_PIN - ceremonyHeight
      );

      /*
       * IMPORTANT:
       *
       * The image exists from the beginning.
       *
       * It is supposed to sit underneath Ceremony.
       * Ceremony must cover it until Ceremony disappears.
       *
       * DO NOT animate image opacity from 0 here.
       */
      gsap.set(image, {
        opacity: 1,
        scale: 1,
        xPercent: 0,
      });

      /*
       * Shade starts invisible.
       * It comes in only when Reception becomes active.
       */
      gsap.set(shade, {
        opacity: 0,
      });

      /*
       * Reception text starts hidden.
       */
      gsap.set(
        [
          label,
          rule,
          venue,
          area,
          note,
          maps,
        ],
        {
          autoAlpha: 0,
        }
      );

      /*
       * =====================================================
       * RECEPTION SCROLL TIMELINE
       * =====================================================
       *
       * The IMPORTANT correction is the minus sign:
       *
       *     top -= handoffOffset
       *
       * This means the timeline begins exactly when the
       * Ceremony pin reaches its release point.
       */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,

          start: () =>
            `top-=${handoffOffset}px top`,

          end: () =>
            `top-=${
              handoffOffset + RECEPTION_DURATION
            }px top`,

          scrub: 1,

          anticipatePin: 1,

          invalidateOnRefresh: true,

          refreshPriority: 0,
        },
      });

      /*
       * =====================================================
       * 1. RECEPTION IMAGE
       * =====================================================
       *
       * Already visible underneath Ceremony.
       *
       * No opacity animation here.
       */
      tl.set(
        image,
        {
          opacity: 1,
          scale: 1,
          xPercent: 0,
        },
        0
      );

      /*
       * =====================================================
       * 2. SHADE
       * =====================================================
       */
      tl.fromTo(
        shade,
        {
          opacity: 0,
        },
        {
          opacity: 0.50,
          ease: 'none',
          duration: 0.14,
        },
        0
      );

      /*
       * =====================================================
       * 3. RECEPTION
       * =====================================================
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
          duration: 0.12,
        },
        0.12
      );

      /*
       * =====================================================
       * 4. GOLD RULE
       * =====================================================
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
        0.20
      );

      /*
       * =====================================================
       * 5. LA PENSÉE
       * =====================================================
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
        0.28
      );

      /*
       * =====================================================
       * 6. GARDENIA
       * =====================================================
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
        0.38
      );

      /*
       * =====================================================
       * 7. AFTER THE CEREMONY
       * =====================================================
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
        0.48
      );

      /*
       * =====================================================
       * 8. MAPS — LAST
       * =====================================================
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
        0.58
      );

      /*
       * =====================================================
       * 9. SMALL CINEMATIC MOVEMENT
       * =====================================================
       */
      tl.to(
        copy,
        {
          yPercent: -2,
          ease: 'none',
          duration: 0.12,
        },
        0.70
      );

      /*
       * =====================================================
       * 10. HOLD
       * =====================================================
       *
       * Reception remains visible.
       * No fade-out.
       */
      tl.to(
        {},
        {
          duration: 0.22,
        },
        0.78
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