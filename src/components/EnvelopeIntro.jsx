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

// The envelope artwork is a square (1024x1024) photo. Measured directly on the
// source images: the front pocket's top edge -- the horizontal fold where the
// front panel meets the open flap -- sits at ~38.5% of the image height. Above
// that line is "open air" (the flap interior / background); below it the paper
// is physically behind the front panel and must never be visible.
const POCKET_LINE_FRACTION = 0.385;
const HERO_SCALE = 1.15;

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
  const maskRef = useRef(null);
  const letterRef = useRef(null);
  const openTimelineRef = useRef(null);
  const geometryRef = useRef({ pocketLineY: 0, hiddenY: 0, revealedY: 0, emergeScale: 0.35, wrapperHeight: 0, naturalHeight: 0 });
  const hasStartedRef = useRef(false);

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

  // Measure the envelope artwork and derive the pocket line + the letter's
  // "hidden inside the envelope" / "just cleared the pocket" resting spots.
  // This runs before paint (useLayoutEffect) so the letter is positioned
  // correctly on the very first frame -- never relying on a GSAP tween's
  // fromTo() to establish the rest state, which is what let the paper leak
  // into view before the first tap.
  const measureGeometry = useCallback(() => {
    const wrapper = wrapperRef.current;
    const envImg = envImgRef.current;
    const mask = maskRef.current;
    const letter = letterRef.current;
    if (!wrapper || !envImg || !mask || !letter) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const envRect = envImg.getBoundingClientRect();
    const pocketLineY = (envRect.top - wrapperRect.top) + envRect.height * POCKET_LINE_FRACTION;

    // The mask's own box IS the visible window: 0 -> pocketLineY. Sizing it
    // (rather than relying on a clip-path percentage) means "hidden" is the
    // CSS default (height defaults to 0 in the stylesheet) even before this
    // effect has run, and overflow:hidden clips both edges automatically as
    // the letter moves, with zero risk of a fixed clip-path percentage
    // drifting out of sync with the artwork.
    mask.style.height = `${pocketLineY}px`;

    const naturalHeight = letter.offsetHeight; // unaffected by transform, so safe to read regardless of current animation state
    // Scale the letter down while it's still inside the pocket window so the
    // whole visible sliver fits within that window with a little breathing
    // room -- otherwise a tall card would clip at the top the instant it
    // clears the bottom edge.
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
             .call(() => setIsReady(true), null, 1.5);
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

      // 2. PHASE 2 -- the flap physically lifts open (a real stepped frame
      // sequence, never a two-image crossfade). The wax seal releases as
      // part of this sequence.
      const frameObj = { frame: 0 };
      tl.to(frameObj, {
        frame: frames.length - 1,
        snap: 'frame',
        duration: 0.8,
        ease: 'power1.inOut',
        onUpdate: () => setCurrentFrame(frameObj.frame),
      }, 0.15);

      tl.call(() => playMusic(true), null, 0.4);

      // 3. PHASE 3 -- only once the flap has cleared does the paper rise
      // up out of the pocket. It starts pinned at the pocket line (zero
      // visible height) and travels to "revealedY", the spot where it is
      // fully clear of the pocket window -- the mask's overflow:hidden
      // does the actual occlusion every frame, so this is correct at any
      // scrub position, not just at the two ends.
      tl.to(letterRef.current, {
        y: () => geometryRef.current.revealedY,
        duration: 1.0,
        ease: 'power2.out',
      }, 0.85);

      // 4. PHASE 4 -- the envelope falls away and the paper becomes the
      // hero: the mask is released (it has already done its job) and the
      // letter scales/recenters into its final resting position.
      tl.to('.env-envelope-seq', { y: 150, autoAlpha: 0, duration: 1.0, ease: 'power2.in' }, 1.85)
        .set(maskRef.current, { overflow: 'visible' }, 1.85)
        .to(letterRef.current, {
          y: () => (geo.wrapperHeight - geo.naturalHeight * HERO_SCALE) / 2,
          scale: HERO_SCALE,
          duration: 1.2,
          ease: 'power2.inOut',
        }, 1.85);

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

          {/* Animated 3D Flap Sequence */}
          <img ref={envImgRef} src={frames[currentFrame]} className="env-envelope-seq" alt="Envelope Animation" />

          {/* Letter Extraction Window: the mask's own box height is set in JS
              to match the pocket line measured on the envelope artwork, and
              overflow:hidden does the clipping -- both edges, every frame --
              so the letter can never render below the fold (still "inside"
              the envelope) no matter where the timeline is scrubbed to. */}
          <div className="env-letter-mask" ref={maskRef}>
            <div className="env-asset-letter" ref={letterRef}>
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
