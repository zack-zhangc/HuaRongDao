export const UI_THEMES = Object.freeze({
  light: 'light',
  dark: 'dark',
});

export const THEME_METADATA = Object.freeze({
  [UI_THEMES.light]: Object.freeze({
    title: '极简华容道 - 原木版 | Minimal Klotski Wood Edition',
    editionLabel: '原木版',
  }),
  [UI_THEMES.dark]: Object.freeze({
    title: '极简华容道 - 尊享暗木版 | Minimal Klotski Dark Edition',
    editionLabel: '尊享暗木版',
  }),
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

function resolveThemeMetadata(themeMetadata, theme) {
  return themeMetadata[theme] ?? themeMetadata[UI_THEMES.light];
}

export function resolveInitialTheme(storage = globalThis.localStorage) {
  return readStoredTheme(storage) ?? UI_THEMES.light;
}

export function createThemeController({
  rootElement = document.documentElement,
  storage = globalThis.localStorage,
  themeButtons = [],
  themeMetadata = THEME_METADATA,
} = {}) {
  const buttons = Array.from(themeButtons);
  let currentTheme = resolveInitialTheme(storage);

  function applyTheme(theme) {
    if (!isTheme(theme)) {
      return;
    }

    const metadata = resolveThemeMetadata(themeMetadata, theme);
    currentTheme = theme;
    rootElement.dataset.theme = theme;
    rootElement.style.colorScheme = theme;
    document.title = metadata.title;
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
