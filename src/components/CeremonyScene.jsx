import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventConfig } from '../config/eventConfig';
import churchImg from '../assets/decor/church.jpg';

gsap.registerPlugin(ScrollTrigger);

export default function CeremonyScene() {
  const sectionRef = useRef(null);
  const { church } = eventConfig;

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'center center',
          scrub: true,
        },
      });

      tl.fromTo('.cer-illustration', { y: 15, autoAlpha: 0 }, { y: 0, autoAlpha: 0.65, ease: 'none', duration: 0.2 }, 0.0)
        .fromTo('.cer-copy > *', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, ease: 'none', duration: 0.3 }, 0.05);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="cer-scene">
      <div className="cer-inner">
        <div className="cer-illustration">
          <img src={churchImg} alt="Church of Archangel Michael" />
        </div>

        <div className="cer-copy">
          <p className="cer-label">The Holy Matrimony</p>
          <div className="lux-rule" style={{ margin: '0 auto' }} />
          <h2 className="cer-venue-name">{church.name}</h2>
          <p className="cer-arabic" dir="rtl">{church.arabicName}</p>
          <p className="cer-date">{eventConfig.displayDate} &middot; {eventConfig.displayTime}</p>
          <p className="cer-location">{church.area}, {church.city}</p>
          <a
            className="cer-map-link"
            href={church.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="cer-map-icon">📖</span>
            <span>View on Maps</span>
          </a>
        </div>
      </div>
    </section>
  );
}
