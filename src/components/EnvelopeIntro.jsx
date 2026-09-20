import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { playMusic } from '../utils/audioManager';

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
             .fromTo('.env-envelope', { y: 20, scale: 0.98, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.6 }, 0.1)
             .fromTo('.env-cue > *', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.4 }, 0.3)
             .call(() => setIsReady(true), null, 1.0);
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

      tl.to('.env-cue > *', { autoAlpha: 0, duration: 0.2 }, 0)
        .to('.env-seal', { scale: 0.8, autoAlpha: 0, duration: 0.3 }, 0.1)
        .to('.env-flap', { rotateX: -175, duration: 0.6, ease: 'power2.inOut' }, 0.2)
        .call(() => playMusic(true), null, 0.4)
        .to('.env-letter', { yPercent: -55, duration: 0.8, ease: 'power2.out' }, 0.4)
        // Envelope falls away
        .to('.env-envelope-shell, .env-shadow', { y: 50, autoAlpha: 0, duration: 0.6, ease: 'power2.in' }, 0.8)
        // Letter scales and centers to be read
        .to('.env-letter', { yPercent: -10, scale: 1.15, duration: 0.8, ease: 'power2.inOut' }, 0.8)
        // Reading pause
        .to({}, { duration: 2.0 })
        // Fade the whole intro layer to reveal Opening Scene
        .call(() => onReveal?.(), null, 3.6)
        .to(containerRef.current, { autoAlpha: 0, duration: 1.0, ease: 'power2.inOut' }, 3.8);

    }, containerRef);
  };

  return (
    <div ref={containerRef} className="env-overlay" style={{ zIndex: 9999, position: 'fixed', inset: 0, overflow: 'hidden' }}>
      <div className="env-night">
        <div className="env-stage">
          <div className="env-envelope" onClick={handleOpen}>
            <div className="env-shadow" />
            <div className="env-envelope-shell">
              <div className="env-envelope-body lux-paper">
                <div className="env-letter lux-paper">
                  <div className="env-letter-copy">
                    <p className="env-letter-title">BISHOY &amp; DORIS</p>
                    <p className="env-letter-subtitle">INVITATION</p>
                    <div className="lux-rule" style={{ margin: '1.2rem auto' }} />
                    <p className="env-letter-text">Two stories, one vow, and a day we would be honored to share with you.</p>
                  </div>
                </div>
              </div>
              <div className="env-flap lux-paper" />
              <div className="env-seal">
                <span>B</span>
                <span className="env-seal-amp">&amp;</span>
                <span>D</span>
              </div>
            </div>
          </div>
          <div className="env-cue">
            <p>Tap to open</p>
            <p>Enter with sound</p>
          </div>
        </div>
      </div>
    </div>
  );
}
