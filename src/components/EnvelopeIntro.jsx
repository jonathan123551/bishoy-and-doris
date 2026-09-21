import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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

// The envelope artwork is a square (1024x1024) photo. Verified by sampling
// every one of frame_05..frame_14 (the envelope BODY's own left/right pixel
// bounds, independent of the flap): the body is pixel-identical in position
// and size across all ten of those frames -- only the flap itself moves.
// The front pocket's top edge sits at a flat 38.5% of the image height.
const POCKET_LINE_FRACTION = 0.385;
const HERO_SCALE = 1.15;

// Exactly two visual layers exist in this component: the envelope <img>
// (the single physical envelope surface) and the letter <div>. The letter
// is clipped by ONE invisible overflow:hidden window sized to the pocket
// line measured off that one image -- the window itself paints nothing
// (no background, no border), so there is no second "pocket" or "envelope"
// shape anywhere in the DOM. Structure:
//   envelope <img>              (the physical envelope, z-index 1)
//   letter-window (invisible)   (z-index 2, overflow:hidden, height = pocket line)
//     letter <div>               (the paper, clipped by its parent as it rises)

const EnvDivider = () => (
  <div className="env-divider">
    <div className="env-div-line" />
    <div className="env-div-diamond" />
    <div className="env-div-line" />
  </div>
);

export default function EnvelopeIntro({ onReveal, onComplete }) {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const envImgRef = useRef(null);
  const windowRef = useRef(null);
  const letterRef = useRef(null);
  const openTimelineRef = useRef(null);
  const geometryRef = useRef({ pocketLineY: 0, hiddenY: 0, revealedY: 0, emergeScale: 0.35, wrapperHeight: 0, naturalHeight: 0 });
  const hasStartedRef = useRef(false);

  const [hasStarted, setHasStarted] = useState(false);
  const [framesDecoded, setFramesDecoded] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const isReady = framesDecoded && introDone;

  // Preload AND fully decode every frame up front, so the very last src swap
  // (frame_13 -> frame_14, right before the paper appears) never has to
  // decode on the fly -- avoids any chance of a stale/incoming frame both
  // being paintable at once during that swap.
  useEffect(() => {
    let cancelled = false;
    Promise.all(frames.map((src) => {
      const img = new Image();
      img.src = src;
      return img.decode ? img.decode().catch(() => {}) : Promise.resolve();
    })).then(() => {
      if (!cancelled) setFramesDecoded(true);
    });
    return () => { cancelled = true; };
  }, []);

  // Measure the (single) envelope image and derive the pocket line, plus the
  // letter's "hidden inside the envelope" / "just cleared the pocket" resting
  // spots. Runs before paint (useLayoutEffect) so the letter is positioned
  // correctly on the very first frame -- never relying on a GSAP tween's
  // fromTo() to establish the rest state.
  const measureGeometry = useCallback(() => {
    const wrapper = wrapperRef.current;
    const envImg = envImgRef.current;
    const win = windowRef.current;
    const letter = letterRef.current;
    if (!wrapper || !envImg || !win || !letter) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const envRect = envImg.getBoundingClientRect();
    const pocketLineY = (envRect.top - wrapperRect.top) + envRect.height * POCKET_LINE_FRACTION;

    // The window's own box IS the visible aperture: 0 -> pocketLineY, and
    // overflow:hidden clips the letter on both edges as it moves through
    // it, natively, every frame -- no per-frame JS math needed for the
    // clip itself, which is cheap for the browser to composite (it's a
    // plain transform animation underneath).
    win.style.height = `${pocketLineY}px`;

    const naturalHeight = letter.offsetHeight; // layout size, unaffected by transform
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
  }, []);

  useLayoutEffect(() => {
    measureGeometry();
    window.addEventListener('resize', measureGeometry);
    window.addEventListener('orientationchange', measureGeometry);
    return () => {
      window.removeEventListener('resize', measureGeometry);
      window.removeEventListener('orientationchange', measureGeometry);
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
      introTl.fromTo('.env-asset-wrapper', { autoAlpha: 0, scale: 0.95 }, { autoAlpha: 1, scale: 1, duration: 1.2 })
             .fromTo('.env-top-text, .env-bottom-text', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.8 }, 0.4)
             .call(() => setIntroDone(true), null, 1.5);
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleOpen = () => {
    if (hasStarted || !isReady) return;
    setHasStarted(true);
    hasStartedRef.current = true;

    // Re-measure right before we animate, in case of a resize/orientation
    // change while the envelope was sitting idle.
    measureGeometry();
    const geo = geometryRef.current;

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

      // 2. PHASE 2 -- the flap physically lifts open on the ONE envelope
      // image (a real stepped frame sequence, never a two-image crossfade).
      // The wax seal releases as part of this sequence. The letter stays
      // fully hidden behind the (zero-height) window for the whole phase.
      const frameObj = { frame: 0 };
      tl.to(frameObj, {
        frame: frames.length - 1,
        snap: 'frame',
        duration: 0.85,
        ease: 'power1.inOut',
        onUpdate: () => setCurrentFrame(frameObj.frame),
      }, 0.15);

      tl.call(() => playMusic(true), null, 0.4);

      // 3. PHASE 3 -- only once the flap sequence has FULLY finished (no
      // overlap with phase 2 -- this starts a beat after the frame tween's
      // own end at 1.0) does the paper rise out of the pocket, through the
      // fixed window.
      tl.to(letterRef.current, {
        y: () => geometryRef.current.revealedY,
        duration: 1.0,
        ease: 'power2.out',
      }, 1.05);

      // 4. PHASE 4 -- the paper has fully cleared the pocket. Release the
      // window (nothing left to occlude), let the hero shadow settle in,
      // and only now does the envelope fall away while the letter scales
      // and recenters into its final resting position.
      tl.set(windowRef.current, { overflow: 'visible' }, 2.05)
        .call(() => letterRef.current.classList.add('is-hero'), null, 2.05)
        .to('.env-envelope-seq', { y: 150, autoAlpha: 0, duration: 1.0, ease: 'power2.in' }, 2.05)
        .to(letterRef.current, {
          y: () => (geo.wrapperHeight - geo.naturalHeight * HERO_SCALE) / 2,
          scale: HERO_SCALE,
          duration: 1.2,
          ease: 'power2.inOut',
        }, 2.05);

      // 5. Short pause to read
      tl.to({}, { duration: 2.0 });

      // 6. Transition to the actual website
      tl.call(() => onReveal?.())
        .to(containerRef.current, { autoAlpha: 0, duration: 1.2, ease: 'power2.inOut' });

    }, containerRef);
  };

  return (
    <div ref={containerRef} className="env-overlay">

      <div className="env-stage">

        <div className="env-top-text">
          <p>A Special Invitation</p>
          <EnvDivider />
        </div>

        <div className="env-asset-wrapper" ref={wrapperRef} onClick={handleOpen}>

          {/* Layer 1 of 2, and the ONLY envelope surface: */}
          <img ref={envImgRef} src={frames[currentFrame]} className="env-envelope-seq" alt="Envelope Animation" />

          {/* An invisible clipping window (no fill, no border, no image) --
              purely an overflow:hidden aperture sized to the pocket line
              measured off the image above. Layer 2 of 2 is its child, the
              letter; nothing else renders here. */}
          <div className="env-letter-window" ref={windowRef}>
            <div className="env-asset-letter" ref={letterRef}>
              <div className="env-letter-copy">
                <p className="env-letter-title">BISHOY &amp; DORIS</p>
                <p className="env-letter-subtitle">INVITATION</p>
                <div className="lux-rule" style={{ margin: '1.2rem auto' }} />
                <p className="env-letter-text">Two stories, one vow, and a day we would be honored to share with you.</p>
              </div>
              {/* Static soft shadow at the card's own bottom edge -- reads as
                  the paper receding under the pocket fold, not pasted on top. */}
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
