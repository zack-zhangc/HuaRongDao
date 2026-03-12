export function createHaptics({
  enabled = true,
  supported = typeof navigator !== 'undefined' &&
    typeof navigator.vibrate === 'function',
} = {}) {
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
    trigger(pattern = 18) {
      if (!enabled || !supported) {
        return false;
      }
      return navigator.vibrate(pattern);
    },
  };
}
