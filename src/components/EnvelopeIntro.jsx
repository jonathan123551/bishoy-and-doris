import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { eventConfig } from '../config/eventConfig';
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

      introTl.fromTo(
        '.env-night',
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.3 }
      );
      
      introTl.fromTo(
        '.env-envelope',
        { y: 20, scale: 0.98, autoAlpha: 0 },
        { y: 0, scale: 1, autoAlpha: 1, duration: 0.6 },
        0.1
      );
      
      introTl.fromTo(
        '.env-overline, .env-date, .env-cue > *',
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.4 },
        0.3
      );
      
      introTl.call(() => setIsReady(true), null, 1.0);
    }, containerRef);

    return () => ctx.revert();
  }, [hasStarted]);

  const handleOpen = () => {
    if (hasStarted || !isReady) return;

    setHasStarted(true);

    gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        onComplete: () => {
          document.body.classList.remove('lock-scroll');
          onComplete?.();
        },
      });

      openTimelineRef.current = tl;

      // Cue text fades out
      tl.to('.env-cue > *, .env-overline, .env-date', {
        autoAlpha: 0,
        duration: 0.2,
      }, 0);

      // Seal scales down and dissolves
      tl.to('.env-seal', {
        scale: 0.8,
        autoAlpha: 0,
        duration: 0.3,
      }, 0.1);

      // Flap unrolls in 3D
      tl.to('.env-flap', {
        rotateX: -175,
        duration: 0.5,
        ease: 'power3.inOut'
      }, 0.2);

      // Trigger music
      tl.call(() => {
        playMusic(true);
      }, null, 0.4);

      // Letter slides up from envelope
      tl.to('.env-letter', {
        yPercent: -45,
        duration: 0.5,
        ease: 'power3.out'
      }, 0.45);

      // Reveal callback fires before container completely fades out
      tl.call(() => {
        onReveal?.();
      }, null, 0.85);

      // Entire container fades out
      tl.to(containerRef.current, {
        autoAlpha: 0,
        duration: 0.4,
      }, 0.95);

    }, containerRef);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleOpen}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overflow: 'hidden',
        cursor: hasStarted || !isReady ? 'default' : 'pointer',
      }}
    >
      <div 
        className="env-night"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          backgroundColor: 'var(--color-bg, #060505)',
        }}
      >
        <div 
          className="env-stage"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            width: '100%',
            height: '100%'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <p className="env-overline">A wedding invitation</p>
            <p className="env-date">14 &middot; 11 &middot; 2026</p>
          </div>

          <div 
            className="env-envelope" 
            style={{ 
              position: 'relative',
              width: 'min(88vw, 390px)',
              height: 'min(60vw, 268px)',
              perspective: '1600px',
              transformStyle: 'preserve-3d',
            }}
          >
            <div 
              className="env-shadow" 
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '-16%',
                width: '70%',
                height: '16%',
                transform: 'translateX(-50%)',
                borderRadius: '999px',
                background: 'rgba(0,0,0,0.15)',
                filter: 'blur(16px)',
              }}
            />
            
            <div 
              className="env-envelope-shell"
              style={{ position: 'absolute', inset: 0 }}
            >
              <div 
                className="env-envelope-body lux-paper" 
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '20px',
                  zIndex: 1
                }}
              />
              
              <div 
                className="env-letter lux-paper"
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: 18,
                  transform: 'translateX(-50%)',
                  width: '84%',
                  height: '88%',
                  borderRadius: '14px',
                  zIndex: 2,
                  display: 'grid',
                  placeItems: 'center',
                  padding: '1.6rem 1.3rem 1.4rem',
                }}
              >
                <div 
                  className="env-letter-copy"
                  style={{ textAlign: 'center', width: '100%' }}
                >
                  <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                    You are invited
                  </p>
                  <div className="lux-rule" style={{ margin: '1rem auto' }} />
                  <h2>{eventConfig.groomName}</h2>
                  <span style={{ fontStyle: 'italic', margin: '0.5rem 0', display: 'block' }}>&amp;</span>
                  <h2>{eventConfig.brideName}</h2>
                </div>
              </div>
              
              <div 
                className="env-flap lux-paper"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '59%',
                  borderRadius: '20px 20px 0 0',
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  transformOrigin: 'top center',
                  zIndex: 3
                }}
              />
              
              <div 
                className="env-seal"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '52.5%',
                  transform: 'translate(-50%, -50%)',
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  zIndex: 4,
                  display: 'grid',
                  placeItems: 'center',
                  background: 'linear-gradient(135deg, #cfa79c 0%, #b2806f 52%, #8f665b 100%)',
                  color: '#fff8f1',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              >
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <span>B</span>
                  <span className="env-seal-amp">&amp;</span>
                  <span>D</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="env-cue" style={{ textAlign: 'center' }}>
            <p>Tap to open</p>
            <p style={{ fontStyle: 'italic', marginTop: '0.5rem' }}>Enter with sound</p>
          </div>
        </div>
      </div>
    </div>
  );
}
