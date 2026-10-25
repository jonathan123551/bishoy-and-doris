import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventConfig } from '../config/eventConfig';

gsap.registerPlugin(ScrollTrigger);

function PhotoImage({ src, alt, className, objectPosition }) {
  return (
    <div className={`ps-photo ${className}`}>
      <img
        src={src}
        alt={alt}
        style={objectPosition ? { objectPosition } : undefined}
      />
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
          id: 'scene:photo',
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=110%',
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Primary full-bleed seaside portrait establishes and settles gracefully
      tl.fromTo(
        '.ps-photo--primary',
        { scale: 1.08 },
        { scale: 1, ease: 'none', duration: 0.85 },
        0.0
      );
      tl.fromTo(
        '.ps-side-type',
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.16 },
        0.10
      );

      // 2. Secondary framed portrait glides into place after primary settles (0.24 -> 0.54)
      tl.fromTo(
        '.ps-photo--secondary',
        { yPercent: 14, scale: 0.96, autoAlpha: 0 },
        { yPercent: 0, scale: 1, autoAlpha: 1, ease: 'power2.out', duration: 0.30 },
        0.24
      );

      // 3. Caption lines enter sequentially with breathing room (0.48 -> 0.84)
      tl.fromTo(
        '.ps-caption p:first-child',
        { y: 16, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.18 },
        0.48
      );
      tl.fromTo(
        '.ps-caption p:last-child',
        { y: 18, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.22 },
        0.62
      );

      // Scene Director stop: both portraits and caption fully composed.
      tl.addLabel('complete', 0.86);

      // 4. Gentle exit transition before FinalInvitation
      tl.to(
        '.ps-photo--secondary, .ps-caption',
        { y: -16, autoAlpha: 0.25, ease: 'power1.inOut', duration: 0.12 },
        0.88
      );
      tl.to(
        '.ps-photo--primary',
        { scale: 1.03, ease: 'power1.inOut', duration: 0.12 },
        0.88
      );
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
            objectPosition={primaryPhoto.objectPositionMobile || '66% 42%'}
          />
          <PhotoImage
            className="ps-photo--secondary"
            src={secondaryPhoto.src}
            alt="Bishoy and Doris candid"
            objectPosition={secondaryPhoto.objectPositionMobile || '50% 28%'}
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
