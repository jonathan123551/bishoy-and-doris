import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { playMusic } from '../utils/audioManager';

import envelopeClosed from '../assets/envelope/closed.jpg';
import envelopeOpen from '../assets/envelope/open.jpg';

const EnvDivider = () => (
  <div className="env-divider">
    <div className="env-div-line" />
    <div className="env-div-diamond" />
    <div className="env-div-line" />
  </div>
);

export default function EnvelopeIntro({ onReveal, onComplete }) {
  const containerRef = useRef(null);
  const openTimelineRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    document.body.classList.add('lock-scroll');
    return () => {
      document.body.classList.remove('lock-scroll');
      openTimelineRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (hasStarted) return undefined;
    const ctx = gsap.context(() => {
      const introTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      introTl.fromTo('.env-asset-closed', { autoAlpha: 0, scale: 0.95 }, { autoAlpha: 1, scale: 1, duration: 1.2 })
             .fromTo('.env-top-text, .env-bottom-text', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.8 }, 0.4)
             .call(() => setIsReady(true), null, 1.5);
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleOpen = () => {
    if (hasStarted || !isReady) return;
    setHasStarted(true);

    gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.classList.remove('lock-scroll');
          onComplete?.();
        },
      });

      openTimelineRef.current = tl;

      // 1. Text fades out
      tl.to('.env-top-text, .env-bottom-text', { autoAlpha: 0, duration: 0.4 }, 0);
      
      // 2. Crossfade closed -> open envelope
      tl.to('.env-asset-closed', { autoAlpha: 0, duration: 0.8, ease: 'power2.inOut' }, 0.3)
        .to('.env-asset-open-base, .env-asset-open-front', { autoAlpha: 1, duration: 0.8, ease: 'power2.inOut' }, 0.3)
        .call(() => playMusic(true), null, 0.4);

      // 3. Invitation paper slides up from inside the pocket
      tl.fromTo('.env-asset-letter', 
        { yPercent: 20, autoAlpha: 0 }, 
        { yPercent: -45, autoAlpha: 1, duration: 1.2, ease: 'power3.out' }, 
        1.0
      );

      // 4. Envelope falls away, letter scales up
      tl.to('.env-asset-open-base, .env-asset-open-front', { y: 150, autoAlpha: 0, duration: 1.0, ease: 'power2.in' }, 2.5)
        .to('.env-asset-letter', { yPercent: -15, scale: 1.15, duration: 1.2, ease: 'power2.inOut' }, 2.5);

      // 5. Short pause to read
      tl.to({}, { duration: 2.2 });

      // 6. Transition to actual website
      tl.call(() => onReveal?.(), null, 5.5)
        .to(containerRef.current, { autoAlpha: 0, duration: 1.2, ease: 'power2.inOut' }, 5.5);

    }, containerRef);
  };

  return (
    <div ref={containerRef} className="env-overlay">
      
      <div className="env-stage">
        
        <div className="env-top-text">
          <p>A Special Invitation</p>
          <EnvDivider />
        </div>

        <div className="env-asset-wrapper" onClick={handleOpen}>
          
          {/* Base Open Envelope (Back layer) */}
          <img src={envelopeOpen} className="env-asset-img env-asset-open-base" alt="Open Envelope Background" />

          {/* The Physical Letter (Middle layer) */}
          <div className="env-asset-letter">
            <div className="env-letter-copy">
              <p className="env-letter-title">BISHOY &amp; DORIS</p>
              <p className="env-letter-subtitle">INVITATION</p>
              <div className="lux-rule" style={{ margin: '1.2rem auto' }} />
              <p className="env-letter-text">Two stories, one vow, and a day we would be honored to share with you.</p>
            </div>
          </div>

          {/* Front Open Envelope (Top layer, clipped to bottom half) */}
          <img src={envelopeOpen} className="env-asset-img env-asset-open-front" alt="Open Envelope Front Pocket" />

          {/* Closed Envelope (Topmost layer initially) */}
          <img src={envelopeClosed} className="env-asset-img env-asset-closed" alt="Closed Envelope" />

        </div>
        
        <div className="env-bottom-text">
          <p>Tap to open</p>
          <EnvDivider />
        </div>

      </div>
    </div>
  );
}
