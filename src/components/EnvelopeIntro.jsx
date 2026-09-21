import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { playMusic } from '../utils/audioManager';

import d00 from '../assets/envelope/frames/frame_00.jpg';
import d01 from '../assets/envelope/frames/frame_01.jpg';
import d02 from '../assets/envelope/frames/frame_02.jpg';
import d03 from '../assets/envelope/frames/frame_03.jpg';
import d04 from '../assets/envelope/frames/frame_04.jpg';
import d05 from '../assets/envelope/frames/frame_05.jpg';
import d06 from '../assets/envelope/frames/frame_06.jpg';
import d07 from '../assets/envelope/frames/frame_07.jpg';
import d08 from '../assets/envelope/frames/frame_08.jpg';
import d09 from '../assets/envelope/frames/frame_09.jpg';
import d10 from '../assets/envelope/frames/frame_10.jpg';
import d11 from '../assets/envelope/frames/frame_11.jpg';
import d12 from '../assets/envelope/frames/frame_12.jpg';
import d13 from '../assets/envelope/frames/frame_13.jpg';
import d14 from '../assets/envelope/frames/frame_14.jpg';

import m00 from '../assets/envelope/mobile/frame_00.jpg';
import m01 from '../assets/envelope/mobile/frame_01.jpg';
import m02 from '../assets/envelope/mobile/frame_02.jpg';
import m03 from '../assets/envelope/mobile/frame_03.jpg';
import m04 from '../assets/envelope/mobile/frame_04.jpg';
import m05 from '../assets/envelope/mobile/frame_05.jpg';
import m06 from '../assets/envelope/mobile/frame_06.jpg';
import m07 from '../assets/envelope/mobile/frame_07.jpg';
import m08 from '../assets/envelope/mobile/frame_08.jpg';
import m09 from '../assets/envelope/mobile/frame_09.jpg';
import m10 from '../assets/envelope/mobile/frame_10.jpg';
import m11 from '../assets/envelope/mobile/frame_11.jpg';
import m12 from '../assets/envelope/mobile/frame_12.jpg';
import m13 from '../assets/envelope/mobile/frame_13.jpg';
import m14 from '../assets/envelope/mobile/frame_14.jpg';

const desktopFrames = [d00, d01, d02, d03, d04, d05, d06, d07, d08, d09, d10, d11, d12, d13, d14];
const mobileFrames = [m00, m01, m02, m03, m04, m05, m06, m07, m08, m09, m10, m11, m12, m13, m14];

// The front pocket line is measured from the source artwork.
const POCKET_LINE_FRACTION = 0.385;
const HERO_SCALE = 1.15;

const EnvDivider = () => (
  <div className="env-divider" aria-hidden="true">
    <div className="env-div-line" />
    <div className="env-div-diamond" />
    <div className="env-div-line" />
  </div>
);

export default function EnvelopeIntro({ onReveal, onComplete }) {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const windowRef = useRef(null);
  const letterRef = useRef(null);
  const openTimelineRef = useRef(null);
  const frameImagesRef = useRef([]);
  const activeFramesRef = useRef(desktopFrames);
  const frameIndexRef = useRef(0);
  const canvasSizeRef = useRef({ width: 0, height: 0, dpr: 1 });
  const hasStartedRef = useRef(false);
  const isMobileRef = useRef(false);
  const geometryRef = useRef({
    pocketLineY: 0,
    hiddenY: 0,
    revealedY: 0,
    emergeScale: 0.35,
    wrapperHeight: 0,
    naturalHeight: 0,
  });

  const [hasStarted, setHasStarted] = useState(false);
  const [framesDecoded, setFramesDecoded] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const isReady = framesDecoded && introDone;

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, isMobileRef.current ? 2 : 2);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    canvasSizeRef.current = { width, height, dpr };

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = isMobileRef.current ? 'medium' : 'high';
  }, []);

  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    const images = frameImagesRef.current;
    const image = images[index];
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const { width, height } = canvasSizeRef.current;
    if (!width || !height) return;

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);
  }, []);

  const measureGeometry = useCallback(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const win = windowRef.current;
    const letter = letterRef.current;
    if (!wrapper || !canvas || !win || !letter) return;

    resizeCanvas();

    const wrapperRect = wrapper.getBoundingClientRect();
    const envRect = canvas.getBoundingClientRect();
    const pocketLineY = (envRect.top - wrapperRect.top) + envRect.height * POCKET_LINE_FRACTION;

    win.style.height = `${Math.max(0, pocketLineY)}px`;

    const naturalHeight = letter.offsetHeight;
    const emergeScale = Math.min(0.6, (pocketLineY * 0.92) / Math.max(naturalHeight, 1));

    geometryRef.current = {
      pocketLineY,
      hiddenY: pocketLineY + 6,
      revealedY: Math.max(0, pocketLineY - naturalHeight * emergeScale),
      emergeScale,
      wrapperHeight: wrapperRect.height,
      naturalHeight,
    };

    if (!hasStartedRef.current) {
      gsap.set(letter, {
        xPercent: -50,
        x: 0,
        y: geometryRef.current.hiddenY,
        scale: emergeScale,
        transformOrigin: 'top center',
      });
    }

    drawFrame(frameIndexRef.current);
  }, [drawFrame, resizeCanvas]);

  useEffect(() => {
    isMobileRef.current = window.matchMedia('(max-width: 520px)').matches;
    activeFramesRef.current = isMobileRef.current ? mobileFrames : desktopFrames;

    let cancelled = false;
    Promise.all(activeFramesRef.current.map((src) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      frameImagesRef.current.push(img);
      return img.decode ? img.decode().catch(() => {}) : new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    })).then(() => {
      if (!cancelled) {
        frameIndexRef.current = 0;
        requestAnimationFrame(() => {
          resizeCanvas();
          drawFrame(0);
        });
        setFramesDecoded(true);
      }
    });

    return () => {
      cancelled = true;
      frameImagesRef.current = [];
    };
  }, [drawFrame, resizeCanvas]);

  useLayoutEffect(() => {
    measureGeometry();
    const handleResize = () => measureGeometry();
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [measureGeometry]);

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
      introTl
        .fromTo('.env-asset-wrapper', { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.9 })
        .fromTo('.env-top-text, .env-bottom-text', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.7 }, 0.2)
        .call(() => setIntroDone(true), null, 1.0);
    }, containerRef);

    return () => ctx.revert();
  }, [hasStarted]);

  const handleOpen = () => {
    if (hasStarted || !isReady) return;

    setHasStarted(true);
    hasStartedRef.current = true;
    measureGeometry();

    const geo = geometryRef.current;
    const frames = activeFramesRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.classList.remove('lock-scroll');
          onComplete?.();
        },
      });

      openTimelineRef.current = tl;

      // 1. Labels leave before the physical opening starts.
      tl.to('.env-top-text, .env-bottom-text', { autoAlpha: 0, duration: 0.28 }, 0);

      // 2. The SINGLE envelope surface advances through the preloaded frame sequence.
      const frameObj = { frame: 0 };
      tl.to(frameObj, {
        frame: frames.length - 1,
        snap: 'frame',
        duration: isMobileRef.current ? 0.98 : 0.85,
        ease: 'power1.inOut',
        onUpdate: () => {
          const next = Math.round(frameObj.frame);
          if (next === frameIndexRef.current) return;
          frameIndexRef.current = next;
          drawFrame(next);
        },
      }, 0.14);

      // Start audio from the original user gesture while the opening is underway.
      tl.call(() => playMusic(true), null, 0.4);

      // 3. Only after the flap sequence is complete does the paper begin to emerge.
      tl.to(letterRef.current, {
        y: () => geometryRef.current.revealedY,
        duration: isMobileRef.current ? 1.05 : 1.0,
        ease: 'power2.out',
      }, 1.10);

      // 4. The paper becomes the hero only after it has cleared the pocket.
      tl.set(windowRef.current, { overflow: 'visible' }, 2.12)
        .call(() => letterRef.current?.classList.add('is-hero'), null, 2.12)
        .to(canvasRef.current, { y: 150, autoAlpha: 0, duration: 1.0, ease: 'power2.in' }, 2.12)
        .to(letterRef.current, {
          y: () => (geo.wrapperHeight - geo.naturalHeight * HERO_SCALE) / 2,
          scale: HERO_SCALE,
          duration: 1.2,
          ease: 'power2.inOut',
        }, 2.12);

      // 5. Brief reading beat.
      tl.to({}, { duration: 2.0 });

      // 6. Reveal the real website.
      tl.call(() => onReveal?.())
        .to(containerRef.current, { autoAlpha: 0, duration: 1.2, ease: 'power2.inOut' });
    }, containerRef);

    void ctx;
  };

  return (
    <div ref={containerRef} className="env-overlay" aria-label="Wedding invitation opening">
      <div className="env-stage">
        <div className="env-top-text">
          <p>A Special Invitation</p>
          <EnvDivider />
        </div>

        <div className="env-asset-wrapper" ref={wrapperRef} onClick={handleOpen} role="button" tabIndex={0} aria-disabled={!isReady}>
          <canvas ref={canvasRef} className="env-envelope-canvas" aria-label="Closed wedding envelope" />

          <div className="env-letter-window" ref={windowRef}>
            <div className="env-asset-letter" ref={letterRef}>
              <div className="env-letter-copy">
                <p className="env-letter-title">BISHOY &amp; DORIS</p>
                <p className="env-letter-subtitle">INVITATION</p>
                <div className="lux-rule" style={{ margin: '1.2rem auto' }} />
                <p className="env-letter-text">Two stories, one vow, and a day we would be honored to share with you.</p>
              </div>
              <div className="env-letter-tuck-shadow" aria-hidden="true" />
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
