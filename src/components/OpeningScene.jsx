import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventConfig } from '../config/eventConfig';

gsap.registerPlugin(ScrollTrigger);

export default function OpeningScene({ isActive }) {
  const sectionRef = useRef(null);
  const heroPhoto = eventConfig.couplePhotos[0];

  useLayoutEffect(() => {
    if (!isActive || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.os-intro-item',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.9, ease: 'power3.out', delay: 0.08 }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=100%',
          scrub: 0.8,
          pin: true,
        },
      });

      tl.to('.os-couple-photo', { scale: 1.05, ease: 'none' }, 0);
      tl.to('.os-photo-wash', { autoAlpha: 0.85, ease: 'none' }, 0.2);
      tl.to('.os-copy', { yPercent: -12, autoAlpha: 0, ease: 'power1.in' }, 0.45);
    }, sectionRef);

    return () => ctx.revert();
  }, [isActive]);

  return (
    <section ref={sectionRef} className="os-scene" style={{ position: 'relative', minHeight: '112svh' }}>
      <div className="os-panel">
        <img
          className="os-couple-photo"
          src={heroPhoto.src}
          alt="Bishoy and Doris together"
        />
        <div className="os-photo-wash" aria-hidden="true" />

        <div className="os-copy">
          <p className="os-intro-item os-kicker">A wedding invitation</p>
          <div className="os-title">
            <span className="os-intro-item">Bishoy &amp;</span>
            <span className="os-intro-item">Doris</span>
          </div>
          <p className="os-intro-item os-subcopy">
            Invite you to celebrate the beginning of their forever.
          </p>
        </div>
      </div>
    </section>
  );
}
