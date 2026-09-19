import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const PARTICLE_COUNT = 10;

function createParticles() {
  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const type = Math.random();
    particles.push({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 14,
      duration: 16 + Math.random() * 20, // Slower, more organic
      isLeaf: type < 0.25,
      size: type < 0.25 ? (7 + Math.random() * 8) : (1 + Math.random() * 2),
      opacity: type < 0.25 ? (0.12 + Math.random() * 0.12) : (0.16 + Math.random() * 0.18),
      blur: type < 0.25 ? 0.3 + Math.random() * 0.7 : 0,
      rotation: Math.random() * 360,
    });
  }
  return particles;
}

const particleData = createParticles();

export default function AtmosphericParticles() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const els = containerRef.current.querySelectorAll('.ap');
      els.forEach((el, i) => {
        const p = particleData[i];
        gsap.set(el, { y: '110vh', opacity: 0, rotation: p.rotation });

        // Only a few leaves and dust motes keep the night setting tangible.
        gsap.to(el, {
          y: '-10vh',
          opacity: p.opacity,
          duration: p.duration,
          delay: p.delay,
          repeat: -1,
          ease: 'none',
          onRepeat: () => {
            gsap.set(el, { y: '110vh', x: (Math.random() - 0.5) * 40 });
          },
        });

        // Horizontal sway
        gsap.to(el, {
          x: `+=${(Math.random() - 0.5) * 120}`,
          duration: p.duration * 0.7,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: p.delay,
        });

        if (p.isLeaf) {
          gsap.to(el, {
            rotation: `+=${180 + Math.random() * 360}`,
            duration: p.duration * 1.2,
            repeat: -1,
            ease: 'none',
            delay: p.delay,
          });
        }

      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="night-atmosphere"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 50,
        overflow: 'hidden',
      }}
    >
      {particleData.map((p) => {
        if (p.isLeaf) {
          return (
            <span
              key={p.id}
              className="ap"
              style={{
                position: 'absolute',
                left: `${p.left}%`,
                bottom: '-20px',
                width: `${p.size}px`,
                height: `${p.size * 1.5}px`,
                borderRadius: '90% 10% 90% 10%',
                background: 'linear-gradient(135deg, rgba(123, 147, 192, 0.34), rgba(18, 36, 73, 0.12))',
                filter: `blur(${p.blur}px)`,
                opacity: 0,
                willChange: 'transform, opacity',
              }}
            />
          );
        }

        return (
          <span
            key={p.id}
            className="ap"
            style={{
              position: 'absolute',
              left: `${p.left}%`,
              bottom: '-10px',
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(226, 235, 255, 0.76) 0%, rgba(153, 181, 229, 0.22) 60%, transparent 100%)',
              opacity: 0,
              willChange: 'transform, opacity',
            }}
          />
        );
      })}
    </div>
  );
}
