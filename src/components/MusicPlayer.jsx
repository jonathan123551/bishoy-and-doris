import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  dismissRetry,
  initAudio,
  playMusic,
  subscribeToAudio,
  toggleMusic,
} from '../utils/audioManager';

export default function MusicPlayer() {
  const [state, setState] = useState({ isPlaying: false, playFailed: false });

  useEffect(() => {
    initAudio();
    return subscribeToAudio((nextState) => setState(nextState));
  }, []);

  const { isPlaying, playFailed } = state;

  return (
    <>
      <button
        className="music-control"
        onClick={toggleMusic}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        style={{
          position: 'fixed',
          right: '0.9rem',
          bottom: 'calc(0.9rem + env(safe-area-inset-bottom, 0px))',
          zIndex: 70,
          width: 48,
          height: 48,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(249,241,232,0.72) 100%)',
          border: '1px solid rgba(183, 135, 114, 0.24)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          boxShadow: '0 12px 28px rgba(78, 59, 52, 0.12)',
          transition: 'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
          transform: isPlaying ? 'scale(1)' : 'scale(0.96)',
        }}
      >
        <div style={{ display: 'flex', gap: 3, alignItems: 'end', height: 16 }}>
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              style={{
                width: 3,
                height: isPlaying ? `${10 + index * 2}px` : '4px',
                borderRadius: 999,
                background:
                  'linear-gradient(180deg, var(--color-brown-warm) 0%, var(--color-rose-gold) 100%)',
                animationName: isPlaying ? `musicBar${index + 1}` : 'none',
                animationDuration: '0.95s',
                animationIterationCount: 'infinite',
                animationDirection: 'alternate',
                animationTimingFunction: 'ease-in-out',
                animationDelay: `${index * 0.16}s`,
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes musicBar1 { from { height: 5px; } to { height: 15px; } }
          @keyframes musicBar2 { from { height: 8px; } to { height: 13px; } }
          @keyframes musicBar3 { from { height: 4px; } to { height: 12px; } }
          @keyframes musicRetryIn {
            from { opacity: 0; transform: translate(-50%, 18px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
        `}</style>
      </button>

      {playFailed &&
        createPortal(
          <div
            className="music-retry"
            style={{
              position: 'fixed',
              left: '50%',
              bottom: 'calc(5.3rem + env(safe-area-inset-bottom, 0px))',
              transform: 'translateX(-50%)',
              zIndex: 9999,
              width: 'min(calc(100vw - 2rem), 360px)',
              borderRadius: '24px',
              padding: '1rem 1rem 0.95rem',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(247,241,234,0.94) 100%)',
              border: '1px solid rgba(183, 135, 114, 0.22)',
              boxShadow: '0 18px 42px rgba(63, 48, 44, 0.14)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              animation: 'musicRetryIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.62rem',
                fontWeight: 500,
                letterSpacing: '0.34em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
              }}
            >
              Sound paused
            </p>
            <p
              style={{
                marginTop: '0.55rem',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '1.05rem',
                lineHeight: 1.45,
                color: 'var(--color-cocoa)',
              }}
            >
              The music needs one more tap on this device.
            </p>

            <div
              style={{
                marginTop: '0.95rem',
                display: 'flex',
                gap: '0.7rem',
                alignItems: 'center',
              }}
            >
              <button
                onClick={() => playMusic(false)}
                style={{
                  flex: 1,
                  minHeight: 42,
                  borderRadius: '999px',
                  background: 'var(--color-text-dark)',
                  color: 'var(--color-paper)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.64rem',
                  fontWeight: 600,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                }}
              >
                Retry sound
              </button>
              <button
                onClick={dismissRetry}
                aria-label="Dismiss audio retry"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  border: '1px solid rgba(183, 135, 114, 0.26)',
                  color: 'var(--color-text-muted)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
