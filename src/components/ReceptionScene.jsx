import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventConfig } from '../config/eventConfig';
import gardeniaImg from '../assets/decor/gardenia.jpg';

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
    <section ref={sectionRef} className="rec-scene">
      <img src={gardeniaImg} className="rec-botanical" alt="" aria-hidden="true" />
      <div className="rec-inner">
        <div className="rec-copy">
          <p className="rec-label">Reception</p>
          <div className="lux-rule" style={{ margin: '0 auto' }} />
          <h2 className="rec-venue-name">{reception.name}</h2>
          <p className="rec-venue-sub">{reception.area}</p>
          <p className="rec-note">{reception.note}</p>
          <a
            className="rec-map-link"
            href={reception.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="rec-map-icon">📖</span>
            <span>View on Maps</span>
          </a>
        </div>
      </div>
    </section>
  );
}
