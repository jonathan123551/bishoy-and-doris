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
      // Set initial states hidden before scrub
      gsap.set('.cer-copy > *', { y: 15, autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=100%',
          scrub: true,
          pin: true,
        },
      });

      // Animate inner content
      tl.to('.cer-copy > *', { y: 0, autoAlpha: 1, stagger: 0.05, ease: 'none', duration: 0.3 }, 0.0)
        // Read buffer
        .to({}, { duration: 0.6 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="scene-stage scene-stage--church">
      <div className="cer-inner">
        <div className="cer-shell lux-paper">
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
        </div>
      </div>
    </section>
  );
}
