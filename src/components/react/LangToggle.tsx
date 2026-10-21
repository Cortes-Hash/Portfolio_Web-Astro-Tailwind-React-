import { useState, useEffect } from 'react';

type Lang = 'es' | 'en';

const STORAGE_KEY = 'portfolio-lang';
const VALID_LANGS: Lang[] = ['es', 'en'];

const FLAG: Record<Lang, string> = { es: '🇪🇸', en: '🇬🇧' };
const LABEL: Record<Lang, string> = { es: 'ES', en: 'EN' };
const ARIA: Record<Lang, string> = {
  es: 'Switch to English',
  en: 'Cambiar a Español',
};

export default function LangToggle() {
  const [lang, setLang] = useState<Lang>('es');
  const [prevLang, setPrevLang] = useState<Lang>('es');
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved && VALID_LANGS.includes(saved)) {
        setLang(saved);
        setPrevLang(saved);
        applyLang(saved);
      } else {
        const browserLang = navigator.language?.slice(0, 2).toLowerCase();
        const detected: Lang = browserLang === 'en' ? 'en' : 'es';
        setLang(detected);
        setPrevLang(detected);
        applyLang(detected);
      }
    } catch (err) {
      console.warn('[LangToggle] Could not read language preference:', err);
    }
    setMounted(true);
  }, []);

  const applyLang = (l: Lang) => {
    try {
      document.documentElement.setAttribute('data-lang', l);
      document.documentElement.setAttribute('lang', l);
    } catch (err) {
      console.error('[LangToggle] Failed to apply language to DOM:', err);
    }
  };

  const persistLang = (l: Lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch (err) {
      console.warn('[LangToggle] Could not persist language preference:', err);
    }
  };

  const toggle = () => {
    if (isAnimating) return;

    const next: Lang = lang === 'es' ? 'en' : 'es';
    setPrevLang(lang);
    setLang(next);
    setIsAnimating(true);

    applyLang(next);
    persistLang(next);

    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  if (!mounted) {
    return (
      <button className="toggle-btn" aria-label="Toggle language" disabled>
        <span className="toggle-icon-wrap">
          <span className="toggle-icon-inner">🇪🇸</span>
        </span>
        <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>ES</span>
      </button>
    );
  }

  // Transition logic (Horizontal slide):
  // ES -> EN: current (ES) slides out left, new (EN) slides in right
  // EN -> ES: current (EN) slides out right, new (ES) slides in left
  const goingToEn = lang === 'en';
  const outgoingClass = goingToEn ? 'flag-slide-out-left' : 'flag-slide-out-right';
  const incomingClass = goingToEn ? 'flag-slide-in-right' : 'flag-slide-in-left';

  return (
    <button
      id="lang-toggle-btn"
      onClick={toggle}
      className="toggle-btn"
      aria-label={ARIA[lang]}
      title={ARIA[lang]}
    >
      <span className="toggle-icon-wrap">
        {isAnimating ? (
          <>
            <span className={`toggle-icon-inner ${outgoingClass}`} key={`out-${prevLang}`}>
              {FLAG[prevLang]}
            </span>
            <span className={`toggle-icon-inner ${incomingClass}`} key={`in-${lang}`}>
              {FLAG[lang]}
            </span>
          </>
        ) : (
          <span className="toggle-icon-inner">
            {FLAG[lang]}
          </span>
        )}
      </span>
      <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>
        {LABEL[lang]}
      </span>
    </button>
  );
}
