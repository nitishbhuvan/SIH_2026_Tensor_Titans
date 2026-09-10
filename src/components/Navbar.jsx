import React from 'react';
import { Globe, Accessibility, Zap, Stethoscope } from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';
import { SUPPORTED_LANGUAGES, translations } from '../translations.js';
import nidanLogo from '../assets/NIDAN_logo.png';
import './Navbar.css';

export default function Navbar({
  currentMode,
  currentLanguage = 'en',
  onOpenModeModal,
  onOpenLanguageModal,
  onSwitchRole,
  currentTheme,
  onToggleTheme
}) {
  const isElderly = currentMode === 'elderly';
  const t = translations[currentLanguage] || translations.en;
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.id === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="navbar-wrapper">
      <div className="container-wide">
        <nav className="navbar-content" aria-label="Main navigation">
          {/* Brand with NIDAN Logo */}
          <a
            href="#"
            className="navbar-brand"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="NIDAN PreConsult — Go to top"
          >
            <img src={nidanLogo} alt="NIDAN Logo" className="navbar-logo-img" />
            <div className="navbar-brand-text">
              <span className="brand-name">NIDAN</span>
              <span className="brand-sublabel" aria-hidden="true">PreConsult • Clinical Triage</span>
            </div>
          </a>

          {/* Actions */}
          <div className="navbar-actions">
            {/* Language */}
            <button
              type="button"
              className="navbar-btn"
              onClick={onOpenLanguageModal}
              title="Change language"
              aria-label={`Current language: ${currentLangObj.nativeLabel}. Click to change.`}
            >
              <Globe className="navbar-btn-icon" aria-hidden="true" />
              <span className="navbar-lang-text">{currentLangObj.nativeLabel}</span>
            </button>

            {/* Mode */}
            <button
              type="button"
              className={`navbar-btn ${isElderly ? 'mode-elderly-btn' : 'mode-modern-btn'}`}
              onClick={onOpenModeModal}
              title="Change viewing mode"
              aria-label={`Current mode: ${isElderly ? t.elderlyLabel : t.modernLabel}. Click to switch.`}
            >
              {isElderly
                ? <Accessibility className="navbar-btn-icon" aria-hidden="true" />
                : <Zap className="navbar-btn-icon" aria-hidden="true" />
              }
              <span className="navbar-mode-label">
                <span className="navbar-mode-primary">
                  {isElderly ? t.elderlyLabel : t.modernLabel}
                </span>
              </span>
            </button>

            {/* Doctor Portal Link */}
            {onSwitchRole && (
              <button
                type="button"
                className="navbar-btn navbar-switch-role-btn"
                onClick={() => onSwitchRole('role-select')}
                title="Switch role"
                aria-label="Switch role"
              >
                <Stethoscope className="navbar-btn-icon" aria-hidden="true" />
                <span className="navbar-lang-text">Switch Role</span>
              </button>
            )}

            {/* Theme Toggle */}
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
