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
            background: 'linear-gradient(135deg, #f3ece3 0%, #e8c8c8 100%)',
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
      const inner = sectionRef.current.querySelector('.ps-inner');
      const photos = sectionRef.current.querySelectorAll('.ps-photo');
      const caption = sectionRef.current.querySelector('.ps-caption');
      const veil = sectionRef.current.querySelector('.ps-veil');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          pin: inner,
        },
      });

      if (photos[0]) {
        tl.fromTo(
          photos[0],
          { autoAlpha: 0.3, scale: 1.06, yPercent: 5 },
          { autoAlpha: 1, scale: 1, yPercent: 0, ease: 'none' },
          0
        );
        tl.to(
          photos[0],
          { yPercent: -3.5, ease: 'none' },
          0.34
        );
      }

      if (photos[1]) {
        tl.fromTo(
          photos[1],
          { autoAlpha: 0, xPercent: -8, yPercent: 8, rotate: -3 },
          { autoAlpha: 1, xPercent: 0, yPercent: 0, rotate: 0, ease: 'none' },
          0.12
        );
        tl.to(
          photos[1],
          { yPercent: 4, ease: 'none' },
          0.44
        );
      }

      if (caption) {
        tl.fromTo(
          caption.children,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, stagger: 0.06, ease: 'none' },
          0.16
        );
        tl.to(
          caption,
          { yPercent: -6, ease: 'none' },
          0.52
        );
      }

      if (veil) {
        tl.to(
          veil,
          { autoAlpha: 0.82, ease: 'none' },
          0.62
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [couplePhotos]);

  if (!couplePhotos || couplePhotos.length === 0) return null;

  const isDual = couplePhotos.length >= 2;

  return (
    <section
      ref={sectionRef}
      className="ps-scene scene-stage scene-stage--photo"
      style={{
        position: 'relative',
        minHeight: isDual ? '136svh' : '122svh',
      }}
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
        <div className="ps-side-type">A LOVE STORY<br />IN TWO FRAMES</div>
        <div className="ps-matte" />
        <div
          style={{
            position: 'absolute',
            inset: '6% auto auto 50%',
            width: '86vw',
            height: '86vw',
            maxWidth: 540,
            maxHeight: 540,
            transform: 'translateX(-50%)',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(248, 205, 154, 0.62) 0%, rgba(180, 93, 66, 0.2) 34%, transparent 74%)',
            pointerEvents: 'none',
          }}
        />

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
                width: 'min(90vw, 500px)',
                height: 'min(79vh, 700px)',
                right: 'max(-7%, 0rem)',
                top: '4%',
                zIndex: 2,
                borderRadius: '0',
                boxShadow: '0 32px 70px rgba(18, 8, 7, 0.34)',
              }}
            />

            <PhotoImage
              photo={couplePhotos[1]}
              className="ps-photo ps-photo--secondary"
              style={{
                position: 'absolute',
                width: 'min(39vw, 170px)',
                height: 'min(25vh, 220px)',
                left: 'max(1%, 0.2rem)',
                bottom: '12%',
                zIndex: 3,
                borderRadius: '0',
                border: '7px solid #f2dfcb',
                boxShadow: '0 22px 44px rgba(18, 8, 7, 0.4)',
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
            left: '1.25rem',
            right: '1.25rem',
            bottom: '5.5%',
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
            The heart of the day is simply the two of us, held in light.
          </p>
        </div>

        <div
          className="ps-veil"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            background:
              'linear-gradient(180deg, rgba(79,55,51,0) 0%, rgba(79,55,51,0.08) 52%, rgba(79,55,51,0.94) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </section>
  );
}
