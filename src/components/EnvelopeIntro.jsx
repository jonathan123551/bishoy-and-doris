import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { playMusic } from '../utils/audioManager';

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
      introTl.fromTo('.env-night', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 })
             .fromTo('.env-envelope', { y: 30, scale: 0.95, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.8 }, 0.1)
             .fromTo('.env-top-text, .env-bottom-text', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.6 }, 0.4)
             .call(() => setIsReady(true), null, 1.2);
    }, containerRef);
    return () => ctx.revert();
  }, []); // Run only on mount

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

      // 1. Text and seal fade out
      tl.to('.env-top-text, .env-bottom-text', { autoAlpha: 0, duration: 0.3 }, 0)
        .to('.env-seal', { scale: 1.1, autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, 0.1);
      
      // 2. Flap opens and music triggers
      tl.to('.env-flap', { rotateX: -180, duration: 0.6, ease: 'power2.inOut' }, 0.2)
        .call(() => playMusic(true), null, 0.4);

      // 3. Letter slides up
      tl.to('.env-letter', { yPercent: -65, duration: 0.8, ease: 'power2.out' }, 0.5);

      // 4. Envelope falls away, leaving the physical invitation paper
      tl.to('.env-envelope-back, .env-envelope-front, .env-flap, .env-shadow', { y: 100, autoAlpha: 0, duration: 0.8, ease: 'power2.in' }, 1.0)
        .to('.env-letter', { yPercent: -15, scale: 1.12, duration: 0.8, ease: 'power2.inOut' }, 1.0);

      // 5. Short pause to read the invitation paper
      tl.to({}, { duration: 2.2 });

      // 6. Transition naturally to OpeningScene
      tl.call(() => onReveal?.(), null, 3.8)
        .to(containerRef.current, { autoAlpha: 0, duration: 1.2, ease: 'power2.inOut' }, 4.0);

    }, containerRef);
  };

  return (
    <div ref={containerRef} className="env-overlay">
      <div className="env-night">
        <div className="env-stage">
          
          <div className="env-top-text">
            <p>A Special Invitation</p>
            <EnvDivider />
          </div>

          <div className="env-envelope" onClick={handleOpen}>
            <div className="env-shadow" />
            
            {/* Back inner wall of the envelope */}
            <div className="env-envelope-back" />
            
            {/* The physical invitation paper */}
            <div className="env-letter lux-paper">
              <div className="env-letter-copy">
                <p className="env-letter-title">BISHOY &amp; DORIS</p>
                <p className="env-letter-subtitle">INVITATION</p>
                <div className="lux-rule" style={{ margin: '1.2rem auto' }} />
                <p className="env-letter-text">Two stories, one vow, and a day we would be honored to share with you.</p>
              </div>
            </div>

            {/* Front folded pockets of the envelope */}
            <div className="env-envelope-front">
              <svg viewBox="0 0 400 275" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
                <path d="M 0 0 L 200 160 L 400 0 L 400 275 L 0 275 Z" fill="#0a1733" stroke="rgba(197, 159, 81, 0.7)" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M 0 275 L 200 160 L 400 275" stroke="rgba(197, 159, 81, 0.4)" fill="none" strokeWidth="1" />
              </svg>
            </div>

            {/* Top flap with elegant gold botanical details */}
            <div className="env-flap">
              <svg viewBox="0 0 400 170" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
                <polygon points="0,0 400,0 200,170" fill="#0c1a3a" stroke="rgba(197, 159, 81, 0.7)" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M 180 145 Q 120 90 40 40" stroke="rgba(197, 159, 81, 0.5)" fill="none" strokeWidth="1" />
                <path d="M 220 145 Q 280 90 360 40" stroke="rgba(197, 159, 81, 0.5)" fill="none" strokeWidth="1" />
                <path d="M 135 105 Q 125 95 115 105 Q 125 115 135 105" fill="rgba(197, 159, 81, 0.4)" />
                <path d="M 95 70 Q 85 60 75 70 Q 85 80 95 70" fill="rgba(197, 159, 81, 0.4)" />
                <path d="M 265 105 Q 275 95 285 105 Q 275 115 265 105" fill="rgba(197, 159, 81, 0.4)" />
                <path d="M 305 70 Q 315 60 325 70 Q 315 80 305 70" fill="rgba(197, 159, 81, 0.4)" />
              </svg>
            </div>

            {/* Realistic wax seal */}
            <div className="env-seal">
              <div className="env-seal-inner">
                B<span className="env-seal-amp">&amp;</span>D
              </div>
            </div>

          </div>
          
          <div className="env-bottom-text">
            <p>Tap to open</p>
            <EnvDivider />
          </div>

        </div>
      </div>
    </div>
  );
}
