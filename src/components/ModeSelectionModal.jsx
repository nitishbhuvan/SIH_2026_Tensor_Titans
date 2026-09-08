import React, { useEffect } from 'react';
import { Accessibility, User } from 'lucide-react';
import { SUPPORTED_LANGUAGES, translations } from '../translations.js';
import './ModeSelectionModal.css';

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
    if (onSelectLanguage) onSelectLanguage(langId);
    if (onStepChange) onStepChange('mode');
  };

  const handleModeClick = (mode) => {
    if (onSelectMode) onSelectMode(mode);
  };

  const handleGoToStep = (newStep) => {
    if (onStepChange) onStepChange(newStep);
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-box">
        {/* Header Strip */}
        <div className="modal-header-strip">
          <div className="modal-step-indicator" role="tablist" aria-label="Setup steps">
            <button
              type="button"
              className={`step-pill ${step === 'language' ? 'is-active' : 'is-completed'}`}
              onClick={() => handleGoToStep('language')}
              aria-selected={step === 'language'}
            >
              {t.step1Pill || '01 LANGUAGE'}
            </button>
            <span className="step-divider" aria-hidden="true">→</span>
            <button
              type="button"
              className={`step-pill ${step === 'mode' ? 'is-active' : ''}`}
              onClick={() => handleGoToStep('mode')}
              aria-selected={step === 'mode'}
            >
              {t.step2Pill || '02 MODE'}
            </button>
          </div>

          {onClose && (
            <button
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
          )}
        </div>

        {/* ── STEP 1: LANGUAGE SELECTION ── */}
        {step === 'language' && (
          <div className="modal-content">
            <h2 id="modal-title" className="modal-title">
              {t.langModalTitle}
            </h2>
            <p className="modal-subtitle">
              {t.langModalSubtitle}
            </p>

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
          </div>
        )}

        {/* ── STEP 2: MODE SELECTION ── */}
        {step === 'mode' && (
          <div className="modal-content">
            <button
              type="button"
              className="modal-back-btn"
              onClick={() => handleGoToStep('language')}
              aria-label="Back to language selection"
            >
              {t.backBtn || '← Back'}
            </button>

            <h2 id="modal-title" className="modal-title">
              {t.modeModalTitle}
            </h2>
            <p className="modal-subtitle">
              {t.modeModalSubtitle}
            </p>

            <div className="mode-grid" role="group" aria-label="Select Mode">
              {/* Elderly */}
              <button
                type="button"
                className={`mode-card ${currentMode === 'elderly' ? 'is-active' : ''}`}
                onClick={() => handleModeClick('elderly')}
                aria-label={`Elderly Mode: ${t.elderlyLabel}`}
              >
                <span className="mode-card__icon">
                  <Accessibility size={36} />
                </span>
                <span className="mode-card__label">{t.elderlyLabel}</span>
                <span className="mode-card__sublabel">{t.elderlyTagline}</span>
              </button>

              {/* Modern */}
              <button
                type="button"
                className={`mode-card ${currentMode === 'modern' ? 'is-active' : ''}`}
                onClick={() => handleModeClick('modern')}
                aria-label={`Modern Mode: ${t.modernLabel}`}
              >
                <span className="mode-card__icon">
                  <User size={36} />
                </span>
                <span className="mode-card__label">{t.modernLabel}</span>
                <span className="mode-card__sublabel">{t.modernTagline}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
