import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { playMusic } from '../utils/audioManager';

import f00 from '../assets/envelope/frames/frame_00.jpg';
import f01 from '../assets/envelope/frames/frame_01.jpg';
import f02 from '../assets/envelope/frames/frame_02.jpg';
import f03 from '../assets/envelope/frames/frame_03.jpg';
import f04 from '../assets/envelope/frames/frame_04.jpg';
import f05 from '../assets/envelope/frames/frame_05.jpg';
import f06 from '../assets/envelope/frames/frame_06.jpg';
import f07 from '../assets/envelope/frames/frame_07.jpg';
import f08 from '../assets/envelope/frames/frame_08.jpg';
import f09 from '../assets/envelope/frames/frame_09.jpg';
import f10 from '../assets/envelope/frames/frame_10.jpg';
import f11 from '../assets/envelope/frames/frame_11.jpg';
import f12 from '../assets/envelope/frames/frame_12.jpg';
import f13 from '../assets/envelope/frames/frame_13.jpg';
import f14 from '../assets/envelope/frames/frame_14.jpg';

const frames = [f00, f01, f02, f03, f04, f05, f06, f07, f08, f09, f10, f11, f12, f13, f14];

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
  const [currentFrame, setCurrentFrame] = useState(0);

  // Preload frames
  useEffect(() => {
    frames.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

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
      introTl.fromTo('.env-asset-wrapper', { autoAlpha: 0, scale: 0.95 }, { autoAlpha: 1, scale: 1, duration: 1.2 })
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
      tl.to('.env-top-text, .env-bottom-text', { autoAlpha: 0, duration: 0.3 }, 0);
      
      // 2. Play frames (15 frames over ~0.65 seconds)
      const obj = { frame: 0 };
      tl.to(obj, {
          frame: 14,
          snap: "frame",
          duration: 0.65,
          ease: 'power1.inOut',
          onUpdate: () => setCurrentFrame(obj.frame)
      }, 0.2);
      
      // Trigger sound midway through opening
      tl.call(() => playMusic(true), null, 0.4);

      // 3. Invitation paper slides up from inside the pocket
      // The mask reveals it exactly at the pocket line (y = 48%)
      tl.fromTo('.env-asset-letter', 
        { yPercent: 50 }, 
        { yPercent: -50, duration: 1.3, ease: 'power2.out' }, 
        0.5
      );

      // 4. Envelope sequence falls away, letter scales up
      tl.to('.env-envelope-seq', { y: 150, autoAlpha: 0, duration: 1.0, ease: 'power2.in' }, 2.5)
        .to('.env-asset-letter', { yPercent: -15, scale: 1.15, duration: 1.2, ease: 'power2.inOut' }, 2.5)
        .to('.env-letter-mask', { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 0.5 }, 2.5);

      // 5. Short pause to read
      tl.to({}, { duration: 2.5 });

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
          
          {/* Animated 3D Flap Sequence */}
          <img src={frames[currentFrame]} className="env-envelope-seq" alt="Envelope Animation" />

          {/* Letter Extraction Mask */}
          {/* The clip-path ensures the letter is physically hidden until it clears the envelope pocket (roughly 48% down the image) */}
          <div className="env-letter-mask">
            <div className="env-asset-letter">
              <div className="env-letter-copy">
                <p className="env-letter-title">BISHOY &amp; DORIS</p>
                <p className="env-letter-subtitle">INVITATION</p>
                <div className="lux-rule" style={{ margin: '1.2rem auto' }} />
                <p className="env-letter-text">Two stories, one vow, and a day we would be honored to share with you.</p>
              </div>
            </div>
          </div>

        </div>
        
        <div className="env-bottom-text">
          <p>Tap to open</p>
          <EnvDivider />
        </div>

      </div>
    </div>
  );
}
