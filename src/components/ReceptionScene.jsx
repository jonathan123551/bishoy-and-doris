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
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'center center',
          scrub: true,
        },
      });

      tl.fromTo('.rec-copy > *', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, ease: 'none', duration: 0.3 }, 0.0);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="rec-scene canvas-navy">
      <div className="rec-copy">
        <p className="rec-label">Reception</p>
        <div className="lux-rule" style={{ margin: '0.5rem auto' }} />
        <h2 className="rec-venue-name">{reception.name}</h2>
        <p className="rec-venue-sub" style={{ color: 'var(--color-champagne)' }}>{reception.area}</p>
        
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
