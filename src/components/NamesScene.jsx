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
          trigger: section,
          start: 'top top',
          end: '+=1100',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      /*
       * BACKGROUND
       * Slow cinematic movement while scrolling.
       */
      tl.fromTo(
        bg,
        {
          scale: 1.08,
          yPercent: 3,
        },
        {
          scale: 1,
          yPercent: -2,
          ease: 'none',
          duration: 1,
        },
        0
      );

      /*
       * Soft light movement.
       */
      tl.fromTo(
        atmosphere,
        {
          opacity: 0.15,
          scale: 0.9,
        },
        {
          opacity: 0.75,
          scale: 1.08,
          ease: 'none',
          duration: 0.9,
        },
        0
      );

      /*
       * TOP LABEL
       */
      tl.fromTo(
        overline,
        {
          y: 30,
          autoAlpha: 0,
          letterSpacing: '0.62em',
        },
        {
          y: 0,
          autoAlpha: 1,
          letterSpacing: '0.36em',
          ease: 'power2.out',
          duration: 0.18,
        },
        0.10
      );

      /*
       * GOLD LINE
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
          ease: 'none',
          duration: 0.12,
        },
        0.18
      );

      /*
       * BISHOY
       */
      tl.fromTo(
        groom,
        {
          xPercent: -12,
          y: 25,
          autoAlpha: 0,
        },
        {
          xPercent: 0,
          y: 0,
          autoAlpha: 1,
          ease: 'power3.out',
          duration: 0.20,
        },
        0.25
      );

      /*
       * AMPERSAND
       */
      tl.fromTo(
        amp,
        {
          scale: 0.55,
          y: 20,
          autoAlpha: 0,
        },
        {
          scale: 1,
          y: 0,
          autoAlpha: 1,
          ease: 'back.out(1.7)',
          duration: 0.18,
        },
        0.39
      );

      /*
       * DORIS
       */
      tl.fromTo(
        bride,
        {
          xPercent: 12,
          y: 25,
          autoAlpha: 0,
        },
        {
          xPercent: 0,
          y: 0,
          autoAlpha: 1,
          ease: 'power3.out',
          duration: 0.20,
        },
        0.45
      );

      /*
       * GOLD BOTTOM LINE
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
          ease: 'none',
          duration: 0.12,
        },
        0.58
      );

      /*
       * LOVE STORY
       */
      tl.fromTo(
        subline,
        {
          y: 25,
          autoAlpha: 0,
          filter: 'blur(4px)',
        },
        {
          y: 0,
          autoAlpha: 1,
          filter: 'blur(0px)',
          ease: 'power2.out',
          duration: 0.20,
        },
        0.64
      );

      /*
       * Tiny cinematic hold.
       */
      tl.to(
        '.ns-copy',
        {
          yPercent: -2,
          ease: 'none',
          duration: 0.12,
        },
        0.78
      );

      /*
       * Clean exit before Ceremony
       */
      tl.set(
        section,
        {
          autoAlpha: 0,
        },
        0.96
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
