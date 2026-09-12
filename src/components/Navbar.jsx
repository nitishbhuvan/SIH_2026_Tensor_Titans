import React from 'react';
import { Globe, ShieldCheck } from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';
import { SUPPORTED_LANGUAGES, translations } from '../translations.js';
import './Navbar.css';

export default function Navbar({
  currentLanguage = 'en',
  onOpenLanguageModal,
  currentTheme,
  onToggleTheme,
  patientProfile,
  onOpenProfile,
}) {
  const t = translations[currentLanguage] || translations.en;
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.id === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const initials = patientProfile?.name
    ? patientProfile.name
        .split(' ')
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AB';

  return (
    <header className="navbar-wrapper">
      <div className="container-wide">
        <nav className="navbar-content" aria-label="Main navigation">
          {/* Brand */}
          <a
            href="#"
            className="navbar-brand"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="PreConsult — Go to top"
          >
            <span className="brand-name">PreConsult</span>
            <span className="brand-sublabel" aria-hidden="true">Digital Health Services</span>
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


            {/* Theme Toggle */}
            <ThemeToggle
              theme={currentTheme}
              onToggle={onToggleTheme}
            />

            {/* Circular Profile Avatar (PFP) Button */}
            {onOpenProfile && (
              <button
                type="button"
                className="navbar-pfp-btn"
                onClick={onOpenProfile}
                title="Open Profile & ABHA Card"
                aria-label={`Open profile for ${patientProfile?.name || 'Patient'}`}
              >
                <span className="navbar-pfp-initials">{initials}</span>
                <span className="navbar-pfp-badge" title="ABHA Verified">
                  <ShieldCheck size={10} />
                </span>
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
