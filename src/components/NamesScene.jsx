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
      // Set initial states so they are hidden before scrub starts
      gsap.set('.ns-copy > *', { y: 14, autoAlpha: 0 });
      gsap.set('.ns-name-a', { xPercent: -15, autoAlpha: 0 });
      gsap.set('.ns-name-b', { xPercent: 15, autoAlpha: 0 });
      gsap.set('.ns-ribbon', { scaleX: 0.3, autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=100%',
          scrub: true,
          pin: true,
        },
      });

      // Animate contents as user scrubs
      tl.to('.ns-copy > p, .ns-copy > .lux-rule', { y: 0, autoAlpha: 1, stagger: 0.05, ease: 'none', duration: 0.2 }, 0.0)
        .to('.ns-name-a', { xPercent: 0, autoAlpha: 1, ease: 'none', duration: 0.2 }, 0.1)
        .to('.ns-name-b', { xPercent: 0, autoAlpha: 1, ease: 'none', duration: 0.2 }, 0.15)
        .to('.ns-amp', { y: 0, autoAlpha: 1, ease: 'none', duration: 0.15 }, 0.2)
        .to('.ns-ribbon', { scaleX: 1, autoAlpha: 0.9, ease: 'none', duration: 0.2 }, 0.2)
        // Read buffer
        .to({}, { duration: 0.5 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ns-scene scene-stage">
      <div className="ns-inner">
        <div className="ns-ribbon" />

        <div className="ns-card lux-paper">
          <div className="ns-card-rule ns-card-rule--top" />
          <div className="ns-card-rule ns-card-rule--bottom" />
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
      </div>
    </section>
  );
}
