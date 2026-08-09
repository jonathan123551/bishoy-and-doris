let audioContext = null;
let masterGain = null;
let noiseNode = null;
let noiseFilter = null;
let padOscillator = null;
let padGain = null;
let lfo = null;
let lfoGain = null;
let active = false;

function getContext() {
  if (typeof window === 'undefined') return null;

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;

  if (!audioContext) {
    audioContext = new AudioCtx();
  }

  return audioContext;
}

function createNoiseBuffer(context) {
  const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
  const channel = buffer.getChannelData(0);

  let last = 0;
  for (let i = 0; i < channel.length; i += 1) {
    const white = Math.random() * 2 - 1;
    last = (last + (0.02 * white)) / 1.02;
    channel[i] = last * 2.6;
  }

  return buffer;
}

function ensureNodes(context) {
  if (masterGain) return;

  masterGain = context.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(context.destination);

  noiseNode = context.createBufferSource();
  noiseNode.buffer = createNoiseBuffer(context);
  noiseNode.loop = true;

  noiseFilter = context.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.value = 520;
  noiseFilter.Q.value = 0.4;

  padOscillator = context.createOscillator();
  padOscillator.type = 'triangle';
  padOscillator.frequency.value = 174;

  padGain = context.createGain();
  padGain.gain.value = 0.018;

  lfo = context.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.11;

  lfoGain = context.createGain();
  lfoGain.gain.value = 14;

  lfo.connect(lfoGain);
  lfoGain.connect(noiseFilter.frequency);

  noiseNode.connect(noiseFilter);
  noiseFilter.connect(masterGain);
  padOscillator.connect(padGain);
  padGain.connect(masterGain);

  noiseNode.start();
  padOscillator.start();
  lfo.start();
}

export async function startIntroAmbient() {
  const context = getContext();
  if (!context) return;

  if (context.state === 'suspended') {
    try {
      await context.resume();
    } catch {
      return;
    }
  }

  ensureNodes(context);

  const now = context.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(masterGain.gain.value, now);
  masterGain.gain.linearRampToValueAtTime(0.06, now + 1.1);
  active = true;
}

export function stopIntroAmbient(fadeMs = 1200) {
  if (!audioContext || !masterGain) return;

  const now = audioContext.currentTime;
  const fadeSeconds = Math.max(fadeMs, 0) / 1000;

  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(masterGain.gain.value, now);
  masterGain.gain.linearRampToValueAtTime(0, now + fadeSeconds);
  active = false;
}

export function isIntroAmbientActive() {
  return active;
}
