import React from 'react';
import ThemeToggle from './ThemeToggle.jsx';
import { SUPPORTED_LANGUAGES, translations } from '../translations.js';

export default function Navbar({
  currentMode,
  currentLanguage = 'en',
  onOpenModeModal,
  onOpenLanguageModal,
  currentTheme,
  onToggleTheme
}) {
  const isElderly = currentMode === 'elderly';
  const t = translations[currentLanguage] || translations.en;
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.id === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="navbar-wrapper">
      <div className="container-wide">
        <nav className="navbar-content">
          <a
            href="#"
            className="brand-logo"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            PreConsult
          </a>

          {/* Actions in Navbar: Language Switcher, Mode Switcher Button & Animated Theme Toggle */}
          <div className="navbar-actions">
            {/* Language Selector Button */}
            <button
              type="button"
              className="navbar-lang-btn"
              onClick={onOpenLanguageModal}
              title="Click to change language / भाषा बदलने के लिए क्लिक करें"
              aria-label={`Current language: ${currentLangObj.nativeLabel} (${currentLangObj.label}). Click to change.`}
            >
              <span className="navbar-lang-icon" aria-hidden="true">🌐</span>
              <span className="navbar-lang-text">{currentLangObj.nativeLabel}</span>
            </button>

            {/* Mode Switcher Button */}
            <button
              type="button"
              className={`navbar-mode-btn ${isElderly ? 'is-elderly' : 'is-modern'}`}
              onClick={onOpenModeModal}
              title="Click to change viewing mode / मोड बदलने के लिए क्लिक करें"
              aria-label={`Current mode: ${isElderly ? t.elderlyLabel : t.modernLabel}. Click to switch.`}
            >
              <span className="navbar-mode-icon" aria-hidden="true">
                {isElderly ? '🧓' : '⚡'}
              </span>
              <span className="navbar-mode-text">
                <span className="navbar-mode-primary">
                  {isElderly ? t.elderlyLabel : t.modernLabel}
                </span>
              </span>
              <span className="navbar-mode-switch-tag">
                {t.switchMode}
              </span>
            </button>

            {/* Pure logo, animated theme switch */}
            <ThemeToggle
              theme={currentTheme}
              onToggle={onToggleTheme}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
