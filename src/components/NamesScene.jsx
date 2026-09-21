import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventConfig } from '../config/eventConfig';

gsap.registerPlugin(ScrollTrigger);

export default function NamesScene() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          end: 'center center',
          scrub: true,
        },
      });

      tl.fromTo(
        '.ns-overline',
        { y: 18, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, ease: 'none', duration: 0.18 },
        0
      )
        .fromTo(
          '.ns-rule-top',
          { scaleX: 0, autoAlpha: 0 },
          { scaleX: 1, autoAlpha: 1, transformOrigin: 'center', ease: 'none', duration: 0.14 },
          0.05
        )
        .fromTo(
          '.ns-name-a',
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, ease: 'none', duration: 0.2 },
          0.08
        )
        .fromTo(
          '.ns-amp-wrapper',
          { y: 14, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, ease: 'none', duration: 0.16 },
          0.18
        )
        .fromTo(
          '.ns-name-b',
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, ease: 'none', duration: 0.2 },
          0.24
        )
        .fromTo(
          '.ns-rule-bottom',
          { scaleX: 0, autoAlpha: 0 },
          { scaleX: 1, autoAlpha: 1, transformOrigin: 'center', ease: 'none', duration: 0.14 },
          0.32
        )
        .fromTo(
          '.ns-subline',
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, ease: 'none', duration: 0.2 },
          0.38
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ns-scene">
      {/* Decorative floral corners */}
      <div className="ns-floral ns-floral-left" aria-hidden="true">
        <span className="ns-flower ns-flower-1" />
        <span className="ns-flower ns-flower-2" />
        <span className="ns-leaf ns-leaf-1" />
        <span className="ns-leaf ns-leaf-2" />
        <span className="ns-leaf ns-leaf-3" />
        <span className="ns-leaf ns-leaf-4" />
      </div>

      <div className="ns-floral ns-floral-right" aria-hidden="true">
        <span className="ns-flower ns-flower-1" />
        <span className="ns-flower ns-flower-2" />
        <span className="ns-leaf ns-leaf-1" />
        <span className="ns-leaf ns-leaf-2" />
        <span className="ns-leaf ns-leaf-3" />
        <span className="ns-leaf ns-leaf-4" />
      </div>

      <div className="ns-vignette" aria-hidden="true" />

      <div className="ns-inner">
        <div className="ns-copy">
          <p className="ns-overline">TOGETHER WITH THEIR FAMILIES</p>

          <div className="ns-rule-top">
            <span className="ns-diamond" />
          </div>

          <div className="ns-names">
            <h2 className="ns-name-a">{eventConfig.groomName}</h2>

            <div className="ns-amp-wrapper">
              <div className="ns-amp-line" />
              <span className="ns-amp">&amp;</span>
              <div className="ns-amp-line" />
            </div>

            <h2 className="ns-name-b">{eventConfig.brideName}</h2>
          </div>

          <div className="ns-rule-bottom">
            <span className="ns-diamond" />
          </div>

          <p className="ns-subline">
            A love story written in the stars, a day of unending joy.
            <br />
            Join us as we begin our forever.
          </p>
        </div>
      </div>
    </section>
  );
}
