import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

const STORAGE_KEY = 'portfolio-theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [prevTheme, setPrevTheme] = useState<Theme>('dark');
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (saved === 'dark' || saved === 'light') {
        setTheme(saved);
        setPrevTheme(saved);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initial: Theme = prefersDark ? 'dark' : 'light';
        setTheme(initial);
        setPrevTheme(initial);
      }
    } catch (err) {
      console.warn('[ThemeToggle] Could not read preference:', err);
    }
    setMounted(true);
  }, []);

  const applyTheme = (t: Theme) => {
    try {
      const html = document.documentElement;
      if (t === 'dark') {
        html.classList.add('dark');
        html.classList.remove('light');
      } else {
        html.classList.remove('dark');
        html.classList.add('light');
      }
    } catch (err) {
      console.error('[ThemeToggle] Failed to apply theme to DOM:', err);
    }
  };

  const persistTheme = (t: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch (err) {
      console.warn('[ThemeToggle] Could not persist theme preference:', err);
    }
  };

  const toggle = () => {
    if (isAnimating) return;

    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    
    setPrevTheme(theme);
    setTheme(next);
    setIsAnimating(true);

    applyTheme(next);
    persistTheme(next);

    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  if (!mounted) {
    return (
      <button className="toggle-btn" aria-label="Toggle theme" disabled>
        <span className="toggle-icon-wrap">
          <span className="toggle-icon-inner">🌙</span>
        </span>
        <span style={{ fontSize: '0.78rem' }}>Dark</span>
      </button>
    );
  }

  const isDark = theme === 'dark';
  const goingToLight = theme === 'light';
  
  // Transition logic:
  // Going dark -> light: current 🌙 slides up out, new ☀️ slides up in from bottom
  // Going light -> dark: current ☀️ slides down out, new 🌙 slides down in from top
  const outgoingClass = goingToLight ? 'icon-slide-up-out' : 'icon-slide-down-out';
  const incomingClass = goingToLight ? 'icon-slide-up-in' : 'icon-slide-down-in';

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggle}
      className="toggle-btn"
      aria-label={isDark ? 'Switch to light mode / Cambiar a modo claro' : 'Switch to dark mode / Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      <span className="toggle-icon-wrap">
        {isAnimating ? (
          <>
            <span className={`toggle-icon-inner ${outgoingClass}`} key={`out-${prevTheme}`}>
              {prevTheme === 'dark' ? '🌙' : '☀️'}
            </span>
            <span className={`toggle-icon-inner ${incomingClass}`} key={`in-${theme}`}>
              {theme === 'dark' ? '🌙' : '☀️'}
            </span>
          </>
        ) : (
          <span className="toggle-icon-inner">
            {isDark ? '🌙' : '☀️'}
          </span>
        )}
      </span>
      <span style={{ fontSize: '0.78rem' }}>
        {isDark ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}
