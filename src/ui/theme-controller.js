export const UI_THEMES = Object.freeze({
  light: 'light',
  dark: 'dark',
});

const THEME_STORAGE_KEY = 'minimal-klotski-theme';

function isTheme(value) {
  return value === UI_THEMES.light || value === UI_THEMES.dark;
}

function readStoredTheme(storage) {
  try {
    const storedTheme = storage?.getItem(THEME_STORAGE_KEY);
    return isTheme(storedTheme) ? storedTheme : null;
  } catch {
    return null;
  }
}

function persistTheme(storage, theme) {
  try {
    storage?.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage failures to keep theme switching non-blocking.
  }
}

export function resolveInitialTheme(storage = globalThis.localStorage) {
  return readStoredTheme(storage) ?? UI_THEMES.light;
}

export function createThemeController({
  rootElement = document.documentElement,
  storage = globalThis.localStorage,
  themeButtons = [],
} = {}) {
  const buttons = Array.from(themeButtons);
  let currentTheme = resolveInitialTheme(storage);

  function applyTheme(theme) {
    if (!isTheme(theme)) {
      return;
    }

    currentTheme = theme;
    rootElement.dataset.theme = theme;
    rootElement.style.colorScheme = theme;
    persistTheme(storage, theme);

    for (const button of buttons) {
      const isActive = button.dataset.themeOption === theme;
      button.dataset.active = String(isActive);
      button.setAttribute('aria-pressed', String(isActive));
    }
  }

  for (const button of buttons) {
    button.addEventListener('click', () => {
      applyTheme(button.dataset.themeOption ?? UI_THEMES.light);
    });
  }

  applyTheme(currentTheme);

  return {
    getTheme() {
      return currentTheme;
    },
    setTheme(theme) {
      applyTheme(theme);
    },
  };
}
