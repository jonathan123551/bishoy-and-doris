import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventConfig } from '../config/eventConfig';

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

      // Animate inner content
      tl.fromTo('.cer-copy > *', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, ease: 'none', duration: 0.3 }, 0.0);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="cer-scene canvas-ivory">
      <div className="cer-copy">
        <p className="cer-label">Ceremony</p>
        <div className="lux-rule" />
        <h2 className="cer-venue-name">{church.name}</h2>
        <h2 className="cer-venue-name" dir="rtl">كنيسة رئيس الملائكة ميخائيل</h2>
        <p className="venue-date">{eventConfig.displayDate}</p>
        <p className="venue-time">{eventConfig.displayTime}</p>
        
        <div className="venue-destination venue-destination--church">
          <span>{church.area}, {church.city}</span>
        </div>
        
        <a
          className="cta-link venue-map venue-map--church"
          href={church.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="venue-map-mark" />
          <span>View on Maps</span>
        </a>
      </div>
    </section>
  );
}
