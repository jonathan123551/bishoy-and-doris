import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventConfig } from '../config/eventConfig';

gsap.registerPlugin(ScrollTrigger);

function PhotoImage({ photo, className, style }) {
  const [error, setError] = useState(false);

  return (
    <div className={className} style={{ overflow: 'hidden', ...style }}>
      {error ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #091a3a 0%, #183766 100%)',
          }}
        />
      ) : (
        <img
          src={photo.src}
          alt={photo.alt}
          onError={() => setError(true)}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: photo.objectPositionMobile || '50% 35%',
            display: 'block',
          }}
        />
      )}
    </div>
  );
}

export default function PhotoStory() {
  const { couplePhotos } = eventConfig;
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (!couplePhotos || couplePhotos.length === 0) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=80%',
          scrub: 0.6,
          pin: true,
        },
      });

      tl.fromTo(
        '.ps-photo--primary',
        { scale: 1.02, autoAlpha: 0.9 },
        { scale: 1, autoAlpha: 1, ease: 'none' },
        0.0
      );

      tl.fromTo(
        '.ps-photo--secondary',
        { yPercent: 4, autoAlpha: 0.7 },
        { yPercent: 0, autoAlpha: 1, ease: 'none' },
        0.10
      );

      tl.fromTo(
        '.ps-caption > *',
        { y: 10, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.05, ease: 'none' },
        0.15
      );

      tl.to({}, { duration: 0.45 }, 0.45);
    }, sectionRef);

    return () => ctx.revert();
  }, [couplePhotos]);

  if (!couplePhotos || couplePhotos.length === 0) return null;

  const isDual = couplePhotos.length >= 2;

  return (
    <section
      ref={sectionRef}
      className="ps-scene scene-stage scene-stage--photo"
    >
      <div
        className="ps-inner"
        style={{
          position: 'relative',
          width: '100%',
          height: '100dvh',
          display: 'grid',
          placeItems: 'center',
          overflow: 'hidden',
          padding: 'max(1.5rem, env(safe-area-inset-top)) 1.2rem max(1.8rem, env(safe-area-inset-bottom))',
        }}
      >
        <div className="ps-side-type">BISHOY<br />&amp;<br />DORIS</div>
        <div className="ps-matte" />

        {isDual ? (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <PhotoImage
              photo={couplePhotos[0]}
              className="ps-photo ps-photo--primary"
              style={{
                position: 'absolute',
                inset: '0',
                width: '100%',
                height: '100%',
                zIndex: 2,
                borderRadius: '0',
                boxShadow: 'none',
              }}
            />

            <PhotoImage
              photo={couplePhotos[1]}
              className="ps-photo ps-photo--secondary"
              style={{
                position: 'absolute',
                width: 'min(48vw, 210px)',
                height: 'min(33vh, 280px)',
                left: 'max(4%, 0.9rem)',
                bottom: '10%',
                zIndex: 3,
                borderRadius: '0',
                border: '1px solid rgba(239, 209, 121, 0.72)',
                boxShadow: '0 24px 50px rgba(0, 4, 18, 0.5)',
              }}
            />
          </div>
        ) : (
          <PhotoImage
            photo={couplePhotos[0]}
            className="ps-photo ps-photo--primary"
            style={{
              width: 'min(86vw, 460px)',
              height: 'min(74vh, 640px)',
              zIndex: 2,
              borderRadius: '18px',
              boxShadow: '0 34px 72px rgba(79, 62, 57, 0.18)',
            }}
          />
        )}

        <div
          className="ps-caption"
          style={{
            position: 'absolute',
            left: '42%',
            right: '1.05rem',
            bottom: '8.5%',
            zIndex: 4,
            display: 'grid',
            gap: '0.45rem',
            justifyItems: 'start',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.6rem',
              fontWeight: 500,
              letterSpacing: '0.34em',
              textTransform: 'uppercase',
              color: 'rgba(255, 228, 195, 0.82)',
              opacity: 0,
            }}
          >
            Portraits
          </p>
          <p
            style={{
              maxWidth: 'min(72vw, 320px)',
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.25rem, 5vw, 1.65rem)',
              lineHeight: 1.28,
              color: '#fff3df',
              opacity: 0,
            }}
          >
            The invitation belongs first to the two people inside it.
          </p>
        </div>

        <div
          className="ps-veil"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(79,55,51,0) 0%, rgba(79,55,51,0.08) 52%, rgba(79,55,51,0.6) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </section>
  );
}
