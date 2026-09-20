import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventConfig } from '../config/eventConfig';

gsap.registerPlugin(ScrollTrigger);

export default function ReceptionScene() {
  const sectionRef = useRef(null);
  const { reception } = eventConfig;

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      gsap.set('.rec-copy > *', { y: 15, autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'center center',
          end: '+=80%',
          scrub: true,
          pin: true,
        },
      });

      tl.to('.rec-copy > *', { y: 0, autoAlpha: 1, stagger: 0.05, ease: 'none', duration: 0.3 }, 0.0)
        .to({}, { duration: 0.6 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="rec-scene canvas-ivory">
      <div className="rec-copy">
        <p className="rec-label">Reception</p>
        <div className="lux-rule" />
        <h2 className="rec-venue-name">{reception.name}</h2>
        <p className="rec-venue-sub">{reception.area}</p>
        
        <div className="venue-destination venue-destination--reception">
          <span>{reception.note}</span>
        </div>
        
        <a
          className="cta-link venue-map venue-map--reception"
          href={reception.mapUrl}
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
