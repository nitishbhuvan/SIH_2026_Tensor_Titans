import React, { useState, useEffect } from 'react';
import {
  Accessibility,
  User,
  ShieldCheck,
  CreditCard,
  Phone,
  Calendar,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, translations } from '../translations.js';
import { formatAbhaId, DEMO_PATIENT_PROFILE } from '../services/patientProfileService.js';
import './ModeSelectionModal.css';

export default function ModeSelectionModal({
  isOpen,
  step = 'language',
  onStepChange,
  currentLanguage = 'en',
  onSelectLanguage,
  currentMode = 'modern',
  onSelectMode,
  patientProfile,
  onCompleteSetup,
  onClose
}) {
  const [patientData, setPatientData] = useState({
    name: '',
    abhaId: '',
    phone: '',
    age: '',
    gender: 'Male',
  });

  useEffect(() => {
    if (patientProfile) {
      setPatientData({
        name: patientProfile.name || '',
        abhaId: patientProfile.abhaId || '',
        phone: patientProfile.phone || '',
        age: patientProfile.age || '',
        gender: patientProfile.gender || 'Male',
      });
    }
  }, [patientProfile, isOpen]);

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
    if (onStepChange) onStepChange('abha');
  };

  const handleGoToStep = (newStep) => {
    if (onStepChange) onStepChange(newStep);
  };

  const handleAbhaChange = (e) => {
    const formatted = formatAbhaId(e.target.value);
    setPatientData((prev) => ({ ...prev, abhaId: formatted }));
  };

  const handleFillDemo = () => {
    setPatientData({
      name: DEMO_PATIENT_PROFILE.name,
      abhaId: DEMO_PATIENT_PROFILE.abhaId,
      phone: DEMO_PATIENT_PROFILE.phone,
      age: DEMO_PATIENT_PROFILE.age,
      gender: DEMO_PATIENT_PROFILE.gender,
    });
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    const finalProfile = {
      ...patientData,
      language: currentLanguage,
      mode: currentMode,
      abhaAddress: patientData.name
        ? `${patientData.name.toLowerCase().replace(/\s+/g, '.')}@abdm`
        : 'patient@abdm',
      isAbhaVerified: true,
    };
    if (onCompleteSetup) {
      onCompleteSetup(finalProfile);
    }
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
              01 LANGUAGE
            </button>
            <span className="step-divider" aria-hidden="true">→</span>
            <button
              type="button"
              className={`step-pill ${step === 'mode' ? 'is-active' : (step === 'abha' ? 'is-completed' : '')}`}
              onClick={() => handleGoToStep('mode')}
              aria-selected={step === 'mode'}
            >
              02 MODE
            </button>
            <span className="step-divider" aria-hidden="true">→</span>
            <button
              type="button"
              className={`step-pill ${step === 'abha' ? 'is-active' : ''}`}
              onClick={() => handleGoToStep('abha')}
              aria-selected={step === 'abha'}
            >
              03 ABHA ID
            </button>
          </div>

          {onClose && (
            <button
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* ── STEP 1: LANGUAGE SELECTION ── */}
        {step === 'language' && (
          <div className="modal-content">
            <h2 id="modal-title" className="modal-title">
              {t.langModalTitle || 'Select Your Language'}
            </h2>
            <p className="modal-subtitle">
              {t.langModalSubtitle || 'Choose your preferred language for symptom intake and clinical audio.'}
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
              ← Back to Language
            </button>

            <h2 id="modal-title" className="modal-title">
              {t.modeModalTitle || 'Select Interface Mode'}
            </h2>
            <p className="modal-subtitle">
              {t.modeModalSubtitle || 'Choose your accessibility preference. You can change this anytime in your profile.'}
            </p>

            <div className="mode-grid" role="group" aria-label="Select Mode">
              {/* Modern */}
              <button
                type="button"
                className={`mode-card ${currentMode === 'modern' ? 'is-active' : ''}`}
                onClick={() => handleModeClick('modern')}
                aria-label={`Modern Mode: ${t.modernLabel || 'Modern'}`}
              >
                <span className="mode-card__icon">
                  <User size={36} />
                </span>
                <span className="mode-card__label">{t.modernLabel || 'Modern Mode'}</span>
                <span className="mode-card__sublabel">{t.modernTagline || 'Standard high-density clinical layout'}</span>
              </button>

              {/* Elderly */}
              <button
                type="button"
                className={`mode-card ${currentMode === 'elderly' ? 'is-active' : ''}`}
                onClick={() => handleModeClick('elderly')}
                aria-label={`Elderly Mode: ${t.elderlyLabel || 'Elderly'}`}
              >
                <span className="mode-card__icon">
                  <Accessibility size={36} />
                </span>
                <span className="mode-card__label">{t.elderlyLabel || 'Elderly / Accessible'}</span>
                <span className="mode-card__sublabel">{t.elderlyTagline || 'Larger fonts, voice guidance & simplified buttons'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: ABHA ID & PATIENT REGISTRATION ── */}
        {step === 'abha' && (
          <div className="modal-content abha-step-content">
            <button
              type="button"
              className="modal-back-btn"
              onClick={() => handleGoToStep('mode')}
              aria-label="Back to mode selection"
            >
              ← Back to Mode
            </button>

            <div className="abha-step-badge">
              <ShieldCheck size={18} />
              <span>Ayushman Bharat Digital Health Account</span>
            </div>

            <h2 id="modal-title" className="modal-title">
              Enter Your ABHA Details
            </h2>
            <p className="modal-subtitle">
              Link your 14-digit ABHA ID to enable seamless medical record transfer with your doctor.
            </p>

            <form onSubmit={handleFinalSubmit} className="abha-onboarding-form">
              <div className="abha-onboarding-field">
                <label htmlFor="onboarding-name">Full Name / पूरा नाम</label>
                <div className="abha-input-box">
                  <User size={16} />
                  <input
                    id="onboarding-name"
                    type="text"
                    value={patientData.name}
                    onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    required
                  />
                </div>
              </div>

              <div className="abha-onboarding-field">
                <label htmlFor="onboarding-abha">ABHA ID / आभा संख्या (14 Digits)</label>
                <div className="abha-input-box">
                  <CreditCard size={16} />
                  <input
                    id="onboarding-abha"
                    type="text"
                    value={patientData.abhaId}
                    onChange={handleAbhaChange}
                    placeholder="91-XXXX-XXXX-XXXX"
                    maxLength={17}
                    required
                  />
                </div>
              </div>

              <div className="abha-onboarding-row">
                <div className="abha-onboarding-field">
                  <label htmlFor="onboarding-phone">Mobile / मोबाइल</label>
                  <div className="abha-input-box">
                    <Phone size={16} />
                    <input
                      id="onboarding-phone"
                      type="tel"
                      value={patientData.phone}
                      onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="abha-onboarding-field">
                  <label htmlFor="onboarding-age">Age / आयु</label>
                  <div className="abha-input-box">
                    <Calendar size={16} />
                    <input
                      id="onboarding-age"
                      type="number"
                      min="1"
                      max="120"
                      value={patientData.age}
                      onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                      placeholder="e.g. 58"
                    />
                  </div>
                </div>
              </div>

              <div className="abha-demo-action">
                <button type="button" className="abha-quick-demo-btn" onClick={handleFillDemo}>
                  <Sparkles size={14} /> Use Demo ABHA Account
                </button>
              </div>

              <button type="submit" className="abha-submit-btn">
                <span>Enter Patient Portal</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
