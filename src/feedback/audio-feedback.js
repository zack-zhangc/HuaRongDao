export function createAudioFeedback({
  enabled = true,
  supported = typeof window !== 'undefined' && 'AudioContext' in window,
} = {}) {
  let audioContext = null;

  async function playMove() {
    if (!enabled || !supported) {
      return false;
    }

    if (!audioContext) {
      audioContext = new window.AudioContext();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(392, audioContext.currentTime);
    gain.gain.setValueAtTime(0.001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.18);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.18);
    return true;
  }

  return {
    isSupported() {
      return supported;
    },
    isEnabled() {
      return enabled;
    },
    setEnabled(nextValue) {
      enabled = Boolean(nextValue);
    },
    async playMove() {
      return playMove();
    },
  };
}
