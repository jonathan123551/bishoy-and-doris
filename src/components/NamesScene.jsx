import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventConfig } from '../config/eventConfig';

import namesBg from '../assets/names-bg.png';

gsap.registerPlugin(ScrollTrigger);

export default function NamesScene() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      const section = sectionRef.current;

      const bg = section.querySelector('.ns-bg');
      const atmosphere = section.querySelector('.ns-atmosphere');

      const overline = section.querySelector('.ns-overline');
      const topRule = section.querySelector('.ns-rule-top');

      const groom = section.querySelector('.ns-name-a');
      const amp = section.querySelector('.ns-amp-wrapper');
      const bride = section.querySelector('.ns-name-b');

      const bottomRule = section.querySelector('.ns-rule-bottom');
      const subline = section.querySelector('.ns-subline');

      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'scene:names',
          trigger: section,
          start: 'top top',
          end: window.innerWidth <= 600 ? '+=920' : '+=1200',
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      /*
       * BACKGROUND & ATMOSPHERE
       * Establish the scene before typography enters.
       */
      tl.fromTo(
        bg,
        {
          scale: 1.08,
          yPercent: 3,
        },
        {
          scale: 1,
          yPercent: -1,
          ease: 'none',
          duration: 0.85,
        },
        0
      );

      tl.fromTo(
        atmosphere,
        {
          opacity: 0.15,
          scale: 0.9,
        },
        {
          opacity: 0.75,
          scale: 1.06,
          ease: 'none',
          duration: 0.85,
        },
        0
      );

      /*
       * 1. TOP LABEL (0.12 -> 0.28)
       */
      tl.fromTo(
        overline,
        {
          y: 26,
          autoAlpha: 0,
          letterSpacing: '0.56em',
        },
        {
          y: 0,
          autoAlpha: 1,
          letterSpacing: '0.36em',
          ease: 'power2.out',
          duration: 0.16,
        },
        0.12
      );

      /*
       * 2. GOLD LINE (0.23 -> 0.36)
       */
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
          ease: 'power1.inOut',
          duration: 0.13,
        },
        0.23
      );

      /*
       * 3. BISHOY (0.31 -> 0.48)
       */
      tl.fromTo(
        groom,
        {
          xPercent: -10,
          y: 22,
          autoAlpha: 0,
        },
        {
          xPercent: 0,
          y: 0,
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 0.17,
        },
        0.31
      );

      /*
       * 4. AMPERSAND (0.43 -> 0.58)
       */
      tl.fromTo(
        amp,
        {
          scale: 0.65,
          y: 16,
          autoAlpha: 0,
        },
        {
          scale: 1,
          y: 0,
          autoAlpha: 1,
          ease: 'back.out(1.4)',
          duration: 0.15,
        },
        0.43
      );

      /*
       * 5. DORIS (0.52 -> 0.69)
       */
      tl.fromTo(
        bride,
        {
          xPercent: 10,
          y: 22,
          autoAlpha: 0,
        },
        {
          xPercent: 0,
          y: 0,
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 0.17,
        },
        0.52
      );

      /*
       * 6. GOLD BOTTOM LINE (0.64 -> 0.76)
       */
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
          ease: 'power1.inOut',
          duration: 0.12,
        },
        0.64
      );

      /*
       * 7. POETIC SUBLINE (0.70 -> 0.85)
       */
      tl.fromTo(
        subline,
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
        0.70
      );

      /*
       * Scene Director stop: every name element is settled and complete.
       */
      tl.addLabel('complete', 0.86);

      /*
       * Gentle exit transition when advancing forward into Ceremony.
       */
      tl.to(
        '.ns-copy',
        {
          yPercent: -6,
          autoAlpha: 0.25,
          ease: 'power1.inOut',
          duration: 0.12,
        },
        0.88
      );
      tl.to(
        bg,
        {
          scale: 1.03,
          yPercent: -3,
          ease: 'power1.inOut',
          duration: 0.12,
        },
        0.88
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ns-cinematic">
      {/* Real visual background — no text inside */}
      <img
        className="ns-bg"
        src={namesBg}
        alt=""
        aria-hidden="true"
        draggable="false"
      />

      {/* Cinematic atmosphere */}
      <div className="ns-atmosphere" aria-hidden="true" />

      <div className="ns-copy">
        <p className="ns-overline">
          TOGETHER WITH THEIR FAMILIES
        </p>

        <div className="ns-rule ns-rule-top">
          <span />
        </div>

        <div className="ns-names">
          <h2 className="ns-name-a">
            {eventConfig.groomName}
          </h2>

          <div className="ns-amp-wrapper">
            <div className="ns-amp-line" />
            <span className="ns-amp">&amp;</span>
            <div className="ns-amp-line" />
          </div>

          <h2 className="ns-name-b">
            {eventConfig.brideName}
          </h2>
        </div>

        <div className="ns-rule ns-rule-bottom">
          <span />
        </div>

        <p className="ns-subline">
          A love story written in the stars, a day of unending joy.
          <br />
          Join us as we begin our forever.
        </p>
      </div>
    </section>
  );
}
