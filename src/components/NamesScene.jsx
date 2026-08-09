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
          end: 'bottom top',
          scrub: true,
          pin: '.ns-inner',
        },
      });

      tl.fromTo('.ns-card', { autoAlpha: 0.72, yPercent: 7, rotate: 1.2, scale: 0.96 }, { autoAlpha: 1, yPercent: 0, rotate: -1.2, scale: 1, ease: 'none' }, 0);
      tl.fromTo('.ns-copy > *', { autoAlpha: 0.56, y: 10 }, { autoAlpha: 1, y: 0, stagger: 0.04, ease: 'none' }, 0.06);
      tl.fromTo('.ns-name-a', { scale: 0.96 }, { scale: 1, ease: 'none' }, 0.12);
      tl.fromTo('.ns-name-b', { scale: 0.96 }, { scale: 1, ease: 'none' }, 0.16);
      tl.fromTo('.ns-ribbon', { scaleX: 0.18, autoAlpha: 0 }, { scaleX: 1, autoAlpha: 1, ease: 'none' }, 0.25);
      tl.to('.ns-card', { yPercent: -7, rotate: 1.5, scale: 0.98, ease: 'none' }, 0.58);
      tl.to('.ns-copy', { yPercent: -13, autoAlpha: 0, ease: 'none' }, 0.68);
      tl.to('.ns-ink', { scale: 1.2, autoAlpha: 0.88, ease: 'none' }, 0.6);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ns-scene" style={{ position: 'relative', minHeight: '138svh' }}>
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
