import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventConfig } from '../config/eventConfig';

gsap.registerPlugin(ScrollTrigger);

function PhotoImage({ src, alt, className }) {
  return (
    <div className={`ps-photo ${className}`}>
      <img src={src} alt={alt} />
    </div>
  );
}

export default function PhotoStory() {
  const sectionRef = useRef(null);
  const primaryPhoto = eventConfig.couplePhotos[0];
  const secondaryPhoto = eventConfig.couplePhotos[1];

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

      // Animate contents
      tl.fromTo('.ps-photo--primary', { scale: 1.05 }, { scale: 1, ease: 'none', duration: 0.1 }, 0.0)
        .fromTo('.ps-photo--secondary', { yPercent: 10, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, ease: 'none', duration: 0.15 }, 0.05)
        .fromTo('.ps-caption > *', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, ease: 'none', duration: 0.15 }, 0.1);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ps-scene scene-stage scene-stage--photo">
      <div className="ps-inner">
        <div className="ps-matte" />
        <span className="ps-side-type">B &amp; D</span>

        <div className="ps-composition">
          <PhotoImage
            className="ps-photo--primary"
            src={primaryPhoto.src}
            alt="Bishoy and Doris portrait"
          />
          <PhotoImage
            className="ps-photo--secondary"
            src={secondaryPhoto.src}
            alt="Bishoy and Doris candid"
          />
        </div>

        <div className="ps-caption">
          <p>Two stories</p>
          <p>Written in the stars, grounded in faith.</p>
        </div>

        <div className="ps-veil" />
      </div>
    </section>
  );
}
