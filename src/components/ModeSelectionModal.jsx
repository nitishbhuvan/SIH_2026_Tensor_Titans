import React, { useEffect } from 'react';
import { SUPPORTED_LANGUAGES, translations } from '../translations.js';
import './ModeSelectionModal.css';

/**
 * Solid silhouette Elderly Person with Walker.
 * Matches the classic pictogram style (curved back, reaching arm, and 'A'-frame walker).
 */
function ElderlyWalkerIcon({ className = "" }) {
  return (
    <svg
      className={`mode-square-svg ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Head */}
      <circle cx="50" cy="18" r="8.5" fill="currentColor" />
      
      {/* Hunched Silhouette Body, Arms & Legs */}
      <path
        d="M 44 27 C 37 28 26.5 33.5 24 44 C 22 53 25 61 25.5 67 L 21.5 83.5 C 20.8 86 22.8 88 25.2 88 C 27.6 88 28.8 86.2 29.5 84 L 32.5 66.5 C 33.5 63 35.5 63 36.5 66.5 L 40.5 84 C 41 86.2 42.8 88 45.2 88 C 47.6 88 49 86 48.5 83.5 L 45 59 C 45.8 52 45 47 43 43 L 52 47 C 54.5 48.2 57.5 48.8 60.5 48.8 C 62 48.8 63 47.5 62 46 C 59.5 42 52.5 36.5 48.5 32.5 C 47.5 29.5 45.8 28 44 27 Z"
        fill="currentColor"
      />
      
      {/* Walker 'A' frame arch */}
      <path
        d="M 55.5 88 L 59.5 50.5 C 60 46.5 73.5 46.5 74 50.5 L 78 88"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      {/* Walker Horizontal Crossbar */}
      <path
        d="M 57.5 66 H 76"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Solid silhouette Male / Modern Person.
 * One unified continuous element where arms are fully connected to the body at the shoulders.
 */
function ModernPersonIcon({ className = "" }) {
  return (
    <svg
      className={`mode-square-svg ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Head */}
      <circle cx="50" cy="16.5" r="9" fill="currentColor" />
      
      {/* One continuous unified body element (connected shoulders, arms, torso, and legs) */}
      <path
        d="M 44 27.5 C 37 27.5 30 29.5 30 34 L 30 53 C 30 56.5 31.5 58 33 58 C 34.5 58 36 56.5 36 53 L 36 44 C 36 40 39.5 44 39.5 52 L 39.5 83.5 C 39.5 86.5 41 88 43.5 88 C 46 88 47.5 86.5 47.5 83.5 L 47.5 54 C 47.5 52.5 52.5 52.5 52.5 54 L 52.5 83.5 C 52.5 86.5 54 88 56.5 88 C 59 88 60.5 86.5 60.5 83.5 L 60.5 52 C 60.5 44 64 40 64 44 L 64 53 C 64 56.5 65.5 58 67 58 C 68.5 58 70 56.5 70 53 L 70 34 C 70 29.5 63 27.5 56 27.5 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function ModeSelectionModal({
  isOpen,
  step = 'language',
  onStepChange,
  currentLanguage = 'en',
  onSelectLanguage,
  currentMode,
  onSelectMode,
  onClose
}) {
  // Lock scroll & handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const t = translations[currentLanguage] || translations.en;

  const handleLanguageClick = (langId) => {
    if (onSelectLanguage) {
      onSelectLanguage(langId);
    }
    // Advance to mode selection step
    if (onStepChange) {
      onStepChange('mode');
    }
  };

  const handleModeClick = (mode) => {
    if (onSelectMode) {
      onSelectMode(mode);
    }
  };

  const handleGoToStep = (newStep) => {
    if (onStepChange) {
      onStepChange(newStep);
    }
  };

  return (
    <div className="simple-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="simple-modal-title">
      <div className="simple-modal-box">
        {/* Top-Right Close Button */}
        {onClose && (
          <button
            type="button"
            className="simple-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        )}

        {/* Step Progress Pills */}
        <div className="modal-step-indicator" role="tablist" aria-label="Setup steps">
          <button
            type="button"
            className={`step-pill ${step === 'language' ? 'is-active' : 'is-completed'}`}
            onClick={() => handleGoToStep('language')}
            aria-selected={step === 'language'}
          >
            {t.step1Pill || '1. Language'}
          </button>
          <span className="step-divider-arrow" aria-hidden="true">&rarr;</span>
          <button
            type="button"
            className={`step-pill ${step === 'mode' ? 'is-active' : ''}`}
            onClick={() => handleGoToStep('mode')}
            aria-selected={step === 'mode'}
          >
            {t.step2Pill || '2. Mode'}
          </button>
        </div>

        {/* ================================================================
            STEP 1: LANGUAGE SELECTION
            ================================================================ */}
        {step === 'language' && (
          <>
            <div className="simple-modal-header">
              <h2 id="simple-modal-title" className="simple-modal-title">
                {t.langModalTitle}
              </h2>
              <p className="simple-modal-subtitle">
                {t.langModalSubtitle}
              </p>
            </div>

            <div className="language-grid" role="group" aria-label="Select Language">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = currentLanguage === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    className={`language-card ${isSelected ? 'is-active' : ''}`}
                    onClick={() => handleLanguageClick(lang.id)}
                    aria-label={`${lang.nativeLabel} (${lang.label})`}
                  >
                    <span className="lang-glyph-badge" aria-hidden="true">
                      {lang.glyph}
                    </span>
                    <span className="lang-card-native">{lang.nativeLabel}</span>
                    <span className="lang-card-sub">{lang.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ================================================================
            STEP 2: MODE SELECTION (Elderly vs Modern)
            ================================================================ */}
        {step === 'mode' && (
          <>
            <div className="simple-modal-header">
              <div className="modal-header-top-row">
                <button
                  type="button"
                  className="modal-back-btn"
                  onClick={() => handleGoToStep('language')}
                  aria-label="Back to language selection"
                >
                  {t.backBtn}
                </button>
              </div>
              <h2 id="simple-modal-title" className="simple-modal-title">
                {t.modeModalTitle}
              </h2>
              <p className="simple-modal-subtitle">
                {t.modeModalSubtitle}
              </p>
            </div>

            <div className="simple-squares-container" role="group" aria-label="Select Mode">
              {/* Elderly Square */}
              <button
                type="button"
                className={`simple-choice-square ${currentMode === 'elderly' ? 'is-active' : ''}`}
                onClick={() => handleModeClick('elderly')}
                aria-label={`Elderly Mode: ${t.elderlyLabel}`}
              >
                <div className="square-icon-wrap">
                  <ElderlyWalkerIcon />
                </div>
                <span className="square-label">{t.elderlyLabel}</span>
                <span className="square-sublabel">{t.elderlyTagline}</span>
              </button>

              {/* Modern Square */}
              <button
                type="button"
                className={`simple-choice-square ${currentMode === 'modern' ? 'is-active' : ''}`}
                onClick={() => handleModeClick('modern')}
                aria-label={`Modern Mode: ${t.modernLabel}`}
              >
                <div className="square-icon-wrap">
                  <ModernPersonIcon />
                </div>
                <span className="square-label">{t.modernLabel}</span>
                <span className="square-sublabel">{t.modernTagline}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
