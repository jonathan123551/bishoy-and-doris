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
          start: 'top top',
          end: '+=120%',
          scrub: 0.8,
          pin: true,
        },
      });

      tl.fromTo('.ns-card', { autoAlpha: 0.8, yPercent: 6, scale: 0.96 }, { autoAlpha: 1, yPercent: 0, scale: 1, ease: 'power2.out', duration: 0.3 }, 0);
      tl.fromTo('.ns-copy > *', { autoAlpha: 0.2, y: 14 }, { autoAlpha: 1, y: 0, stagger: 0.05, ease: 'power2.out', duration: 0.3 }, 0.05);
      tl.fromTo('.ns-name-a', { xPercent: -15, autoAlpha: 0.4 }, { xPercent: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.35 }, 0.1);
      tl.fromTo('.ns-name-b', { xPercent: 15, autoAlpha: 0.4 }, { xPercent: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.35 }, 0.15);
      tl.fromTo('.ns-ribbon', { scaleX: 0.3, autoAlpha: 0 }, { scaleX: 1, autoAlpha: 0.9, ease: 'power2.out', duration: 0.3 }, 0.2);
      // Let the content rest anchored and readable before releasing
      tl.to({}, { duration: 0.4 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ns-scene" style={{ position: 'relative', minHeight: '112svh' }}>
      <div className="ns-inner">
        <div className="ns-ink" />
        <div className="ns-grid" />
        <div className="ns-ribbon" />
        <div className="ns-stamp ns-stamp--left">B</div>
        <div className="ns-stamp ns-stamp--right">D</div>

        <div className="ns-card lux-paper">
          <div className="ns-card-rule ns-card-rule--top" />
          <div className="ns-card-rule ns-card-rule--bottom" />
          <div className="ns-copy">
            <p className="ns-overline">Together with their families</p>
            <div className="lux-rule" />
            <div className="ns-names">
              <h2 className="ns-name-a">{eventConfig.groomName}</h2>
              <span className="ns-amp">&amp;</span>
              <h2 className="ns-name-b">{eventConfig.brideName}</h2>
            </div>
            <p className="ns-subline">Two stories, one vow, and a day we would be honored to share with you.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
