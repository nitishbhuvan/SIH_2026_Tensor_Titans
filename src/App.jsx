import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import Navbar from './components/Navbar.jsx';
import ModeSelectionModal from './components/ModeSelectionModal.jsx';
import { translations } from './translations.js';
import './App.css';

const LANGUAGE_STORAGE_KEY = 'preconsult_user_language';
const MODE_STORAGE_KEY = 'preconsult_user_mode';
const THEME_STORAGE_KEY = 'preconsult_color_theme';

export default function App() {
  // Language Preference
  const [userLanguage, setUserLanguage] = useState(() => {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en';
  });

  // Accessibility Mode: Elderly vs Modern
  const [userMode, setUserMode] = useState(() => {
    return localStorage.getItem(MODE_STORAGE_KEY) || 'modern';
  });

  // Onboarding / Preference Modal State
  const [showModeModal, setShowModeModal] = useState(() => {
    return !localStorage.getItem(LANGUAGE_STORAGE_KEY) || !localStorage.getItem(MODE_STORAGE_KEY);
  });

  // Modal Step ('language' | 'mode')
  const [modalStep, setModalStep] = useState(() => {
    return !localStorage.getItem(LANGUAGE_STORAGE_KEY) ? 'language' : 'mode';
  });

  // Dark vs Light Mode (Defaults to Light)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  // Top-to-bottom luminous sweep bar state
  const [sweepState, setSweepState] = useState({ active: false, targetTheme: 'light' });

  // Synchronize document.body with accessibility mode
  useEffect(() => {
    if (userMode === 'elderly') {
      document.body.classList.add('mode-elderly');
      document.body.classList.remove('mode-modern');
    } else {
      document.body.classList.add('mode-modern');
      document.body.classList.remove('mode-elderly');
    }
  }, [userMode]);

  // Synchronize html and body with theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Handle top-to-bottom animated theme toggle
  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    // Trigger glowing sweep wave bar that travels from top to bottom
    setSweepState({ active: true, targetTheme: nextTheme });

    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      const transition = document.startViewTransition(() => {
        flushSync(() => {
          setTheme(nextTheme);
        });
      });

      transition.finished.finally(() => {
        setSweepState((prev) => ({ ...prev, active: false }));
      });
    } else {
      document.documentElement.classList.add('theme-transitioning');
      setTheme(nextTheme);
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
        setSweepState((prev) => ({ ...prev, active: false }));
      }, 700);
    }
  };

  const handleSelectLanguage = (lang) => {
    setUserLanguage(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  const handleSelectMode = (mode) => {
    setUserMode(mode);
    localStorage.setItem(MODE_STORAGE_KEY, mode);
    setShowModeModal(false);
  };

  const handleOpenLanguageModal = () => {
    setModalStep('language');
    setShowModeModal(true);
  };

  const handleOpenModeModal = () => {
    setModalStep('mode');
    setShowModeModal(true);
  };

  const handleCloseModal = () => {
    setShowModeModal(false);
  };

  const isElderly = userMode === 'elderly';
  const t = translations[userLanguage] || translations.en;

  return (
    <div className={`app-wrapper ${isElderly ? 'is-elderly-theme' : 'is-modern-theme'} ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      {/* Top-to-bottom luminous laser sweep wave */}
      {sweepState.active && (
        <div
          className={`theme-sweep-bar to-${sweepState.targetTheme}`}
          aria-hidden="true"
        />
      )}

      <Navbar
        currentMode={userMode}
        currentLanguage={userLanguage}
        onOpenModeModal={handleOpenModeModal}
        onOpenLanguageModal={handleOpenLanguageModal}
        currentTheme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="main-content">
        <div className="container">
          {/* Active Mode Notice Banner */}
          <div className="mode-banner-alert">
            <div className="mode-banner-info">
              <span className="mode-banner-symbol" aria-hidden="true">
                {isElderly ? '🧓' : '⚡'}
              </span>
              <div>
                <h2 className="mode-banner-heading">
                  {isElderly ? t.bannerElderlyActive : t.bannerModernActive}
                </h2>
                <p className="mode-banner-sub">
                  {isElderly ? t.bannerElderlyDesc : t.bannerModernDesc}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="btn-banner-switch"
              onClick={handleOpenModeModal}
              aria-label={t.bannerChangeBtn}
            >
              {t.bannerChangeBtn}
            </button>
          </div>

          {/* Hero Presentation */}
          <section className="hero-box">
            <h1 className="hero-box-title">
              {isElderly ? t.heroTitleElderly : t.heroTitleModern}
              {userLanguage !== 'en' && isElderly && (
                <div style={{ fontSize: '0.7em', color: 'var(--accent-elderly)', marginTop: '0.35rem' }}>
                  {translations.en.heroTitleElderly}
                </div>
              )}
            </h1>
            <p className="hero-box-subtitle">
              {isElderly ? t.heroSubElderly : t.heroSubModern}
            </p>
          </section>

          {/* Quick Action Cards */}
          <div className="cards-grid">
            <div className="action-card">
              <span className="action-card-icon" aria-hidden="true">👨‍⚕️</span>
              <h3 className="action-card-title">
                {t.cardDoctorTitle}
              </h3>
              <p className="action-card-desc">
                {isElderly ? t.cardDoctorDescElderly : t.cardDoctorDescModern}
              </p>
              <button type="button" className="action-card-btn">
                {isElderly ? t.cardDoctorBtnElderly : t.cardDoctorBtnModern}
              </button>
            </div>

            <div className="action-card">
              <span className="action-card-icon" aria-hidden="true">📋</span>
              <h3 className="action-card-title">
                {t.cardRecordsTitle}
              </h3>
              <p className="action-card-desc">
                {isElderly ? t.cardRecordsDescElderly : t.cardRecordsDescModern}
              </p>
              <button type="button" className="action-card-btn">
                {isElderly ? t.cardRecordsBtnElderly : t.cardRecordsBtnModern}
              </button>
            </div>

            <div className="action-card">
              <span className="action-card-icon" aria-hidden="true">🚨</span>
              <h3 className="action-card-title">
                {t.cardEmergencyTitle}
              </h3>
              <p className="action-card-desc">
                {isElderly ? t.cardEmergencyDescElderly : t.cardEmergencyDescModern}
              </p>
              <button
                type="button"
                className="action-card-btn"
                style={isElderly ? { backgroundColor: '#DC2626', color: '#FFFFFF' } : {}}
              >
                {isElderly ? t.cardEmergencyBtnElderly : t.cardEmergencyBtnModern}
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="simple-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} {t.footerTagline}</p>
        </div>
      </footer>

      {/* Pop-up Preference Modal: Step 1 (Language) -> Step 2 (Elderly vs Modern Mode) */}
      <ModeSelectionModal
        isOpen={showModeModal}
        step={modalStep}
        onStepChange={setModalStep}
        currentLanguage={userLanguage}
        onSelectLanguage={handleSelectLanguage}
        currentMode={userMode}
        onSelectMode={handleSelectMode}
        onClose={handleCloseModal}
      />
    </div>
  );
}
