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
          start: 'top 80%',
          end: 'center center',
          scrub: true,
        },
      });

      // Animate contents as user naturally scrolls
      tl.fromTo('.ns-copy > p, .ns-copy > .lux-rule', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, ease: 'none', duration: 0.2 }, 0.0)
        .fromTo('.ns-name-a', { xPercent: -10, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, ease: 'none', duration: 0.2 }, 0.1)
        .fromTo('.ns-name-b', { xPercent: 10, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, ease: 'none', duration: 0.2 }, 0.15)
        .fromTo('.ns-amp', { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: 'none', duration: 0.15 }, 0.2);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ns-scene scene-stage">
      <div className="ns-inner">
        <div className="ns-copy">
          <p className="ns-overline">Together with their families</p>
          <div className="lux-rule" />
          <div className="ns-names">
            <h2 className="ns-name-a">{eventConfig.groomName}</h2>
            <span className="ns-amp" style={{ opacity: 0 }}>&amp;</span>
            <h2 className="ns-name-b">{eventConfig.brideName}</h2>
          </div>
          <p className="ns-subline">Two stories, one vow, and a day we would be honored to share with you.</p>
        </div>
      </div>
    </section>
  );
}
