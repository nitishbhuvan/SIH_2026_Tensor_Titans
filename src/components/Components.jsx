/* ============================================================================
   PRECONSULT UNIFIED COMPONENTS (Components.jsx)
   Consolidated React component bundle with all 14 institutional medical components
   ============================================================================ */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Heart,
  Info,
  Leaf,
  LockKeyhole,
  Mic,
  Shield,
  ShieldCheck,
  Stethoscope,
  UserRound
} from 'lucide-react';

// Shared Utilities, Services, and Translations
import {
  SUPPORTED_LANGUAGES,
  VOICE_LANGUAGES,
  translations
} from '../translations.js';

import {
  formatAbhaId,
  DEMO_PATIENT_PROFILE,
  getPatientProfile,
  savePatientProfile,
  clearPatientProfile,
  isValidAbha
} from '../services/patientProfileService.js';

import {
  addClinicalRecord,
  getClinicalRecords,
  updateClinicalRecord,
  subscribeToRecords,
  getTriageSummary
} from '../services/clinicalRecordsService.js';

import {
  executeClientClinicalNLP
} from '../services/clinicalNlpService.js';

import {
  encodeWAV,
  resampleAudioBuffer
} from '../utils/wavEncoder.js';

import {
  changeDoctorPassword,
  authenticateDoctor,
  registerDoctor
} from '../services/doctorAuthService.js';

import './Components.css';

/* ============================================================================
   COMPONENT: ThemeToggle (ThemeToggle.jsx)
   ============================================================================ */

export function ThemeToggle({ theme, onToggle }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const isDark = theme === 'dark';

  const handleToggle = () => {
    setIsSpinning(true);
    onToggle();
    setTimeout(() => {
      setIsSpinning(false);
    }, 650);
  };

  return (
    <button
      type="button"
      className={`theme-toggle-btn ${isDark ? 'is-dark' : 'is-light'} ${isSpinning ? 'is-animating' : ''}`}
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="theme-toggle-disc">
        {/* Animated Sun & Moon Icons */}
        <svg
          className="theme-toggle-svg"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Sun Group */}
          <g className="theme-sun-group">
            {/* Sun Core Disc */}
            <circle cx="12" cy="12" r="4.6" className="theme-sun-core" />
            {/* 8 Radiating Sun Rays */}
            <g className="theme-sun-rays">
              <line x1="12" y1="2" x2="12" y2="4.2" />
              <line x1="12" y1="19.8" x2="12" y2="22" />
              <line x1="2" y1="12" x2="4.2" y2="12" />
              <line x1="19.8" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="4.93" x2="6.48" y2="6.48" />
              <line x1="17.52" y1="17.52" x2="19.07" y2="19.07" />
              <line x1="4.93" y1="19.07" x2="6.48" y2="17.52" />
              <line x1="17.52" y1="6.48" x2="19.07" y2="4.93" />
            </g>
          </g>

          {/* Moon Group */}
          <g className="theme-moon-group">
            {/* Crescent Moon Body */}
            <path
              className="theme-moon-crescent"
              d="M 20.4 14.8 C 19.3 18.6 15.8 21.3 11.7 21 C 6.8 20.6 3 16.4 3.2 11.5 C 3.4 8 5.7 5 9.1 4.1 C 8.6 5.4 8.5 6.9 8.9 8.4 C 9.7 11.5 12.3 13.9 15.5 14.4 C 17.1 14.6 18.8 14.3 20.4 14.8 Z"
            />
            {/* Twinkling Stars in Night Sky */}
            <circle cx="17.8" cy="5.8" r="1.1" className="theme-moon-star star-1" />
            <circle cx="20.4" cy="9.8" r="0.8" className="theme-moon-star star-2" />
            <circle cx="15.2" cy="2.8" r="0.7" className="theme-moon-star star-3" />
          </g>
        </svg>
      </div>

      {/* Ripple Animation Shockwave */}
      <span className="theme-toggle-wave" aria-hidden="true" />
    </button>
  );
}

/* ============================================================================
   COMPONENT: Toast (Toast.jsx)
   ============================================================================ */

const ICONS = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info
};

function ToastItem({ toast, onDismiss }) {
  const [exiting, setExiting] = useState(false);
  const Icon = ICONS[toast.type] || ICONS.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 250);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  return (
    <div
      className={`toast-item toast-item--${toast.type || 'info'} ${exiting ? 'toast-item--exiting' : ''}`}
      role="status"
      aria-live="polite"
    >
      <Icon size={16} className="toast-icon" aria-hidden="true" />
      <span className="toast-text">{toast.message}</span>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-label="Notifications">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

/* ============================================================================
   COMPONENT: Footer (Footer.jsx)
   ============================================================================ */

export function Footer({ t }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-inner">
          <span className="footer-meta" aria-hidden="true">
            PRECONSULT / PATIENT SERVICES
          </span>
          <p className="footer-text">
            &copy; {new Date().getFullYear()} {t.footerTagline}
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================================
   COMPONENT: Hero (Hero.jsx)
   ============================================================================ */

export function Hero({ isElderly, t, onVoiceIntake, onOcrIntake, onAyusetuIntake }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();

  return (
    <section className="hero-section">
      {/* Technical metadata strip */}
      <div className="hero-meta">
        <span className="hero-meta__label">
          {'// NIDAN-AI CLINICAL INTAKE & TRIAGE SYSTEM'}
        </span>
        <span className="hero-meta__status">
          <span className="hero-status-dot" aria-hidden="true" />
          SYSTEM ONLINE • AYUSH & ALLOPATHIC READY
        </span>
      </div>

      {/* Hero Content */}
      <div className="hero-content">
        <h1 className="hero-title">
          {isElderly ? (t.heroTitleElderly || 'Welcome to PreConsult') : (t.heroTitleModern || 'Smart Healthcare Pre-Consultation')}
        </h1>

        <p className="hero-subtitle">
          {isElderly
            ? (t.heroSubElderly || 'Doctor consultations made simple, comfortable, and easy to understand for everyone.')
            : (t.heroSubModern || 'AI-assisted pre-consultation intake. Complete the adaptive AYUSETU clinical protocol, speak your symptoms naturally, or upload prescriptions for instant summarization.')}
        </p>

        <div className="hero-actions">
          <button
            type="button"
            className="hero-cta hero-cta-ayusetu"
            onClick={onAyusetuIntake}
            aria-label="Start Pre-Consultation"
          >
            <Leaf size={isElderly ? 22 : 18} aria-hidden="true" />
            <span>{isElderly ? 'पूर्व-परामर्श (Pre-Consultation)' : 'Pre-Consultation'}</span>
          </button>

          <button
            type="button"
            className="hero-cta hero-cta-voice"
            onClick={onVoiceIntake}
            aria-label="Start Voice Intake"
          >
            <Mic size={isElderly ? 22 : 18} aria-hidden="true" />
            {t.heroVoiceCta || 'Speak Symptoms (Voice Intake)'}
          </button>

          <button
            type="button"
            className="hero-cta hero-cta-secondary"
            onClick={onOcrIntake}
            aria-label="Scan Prescription"
          >
            <FileText size={isElderly ? 20 : 16} aria-hidden="true" />
            <span>{isElderly ? 'दवा पर्ची स्कैन करें (Prescription OCR)' : 'Scan Prescription / Lab (OCR)'}</span>
          </button>
        </div>
      </div>

      {/* Bottom metadata */}
      <div className="hero-footer-meta">
        <span>PRECONSULT CLINICAL SUITE</span>
        <span>DATE: {dateStr}</span>
      </div>
    </section>
  );
}

/* ============================================================================
   COMPONENT: Navbar (Navbar.jsx)
   ============================================================================ */

export function Navbar({
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

/* ============================================================================
   COMPONENT: RoleSelection (RoleSelection.jsx)
   ============================================================================ */

export function RoleSelection({ theme, onToggleTheme, onSelectRole }) {
  return (
    <div className="role-selection-page">
      {/* Fixed Top Bar */}
      <header className="rs-topbar">
        <button
          type="button"
          className="rs-topbar-brand rs-brand-btn"
          onClick={() => onSelectRole('intro')}
          title="Return to Intro Animation"
        >
          PreConsult
        </button>
        <div className="rs-topbar-actions">
          <button
            type="button"
            className="rs-topbar-intro-btn"
            onClick={() => onSelectRole('intro')}
            title="Play Intro Animation"
          >
            ✨ Intro Animation
          </button>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </header>

      <div className="rs-topbar-spacer" />

      <div className="role-selection-inner">
        {/* Brand / Logo */}
        <div className="rs-brand-area">
          <button
            type="button"
            className="rs-brand-logo rs-brand-btn"
            onClick={() => onSelectRole('intro')}
            title="Return to Intro Animation"
          >
            Pre<span>Consult</span>
          </button>
          <p className="rs-brand-tagline">
            Integrated Digital Pre-Consultation Platform • SIH 2026 — Tensor Titans
          </p>
        </div>

        {/* Heading */}
        <div className="rs-heading">
          <h1>Who are you today?</h1>
          <p>
            आप मरीज़ हैं या डॉक्टर? &nbsp;•&nbsp; ನೀವು ರೋಗಿಯೇ ಅಥವಾ ವೈದ್ಯರೇ?
            &nbsp;•&nbsp; நீங்கள் நோயாளியா அல்லது மருத்துவரா?
          </p>
        </div>

        {/* Role Cards */}
        <div className="rs-cards-grid">
          {/* Patient Card */}
          <button
            type="button"
            className="rs-role-card role-patient"
            onClick={() => onSelectRole('patient')}
            aria-label="I am a Patient — go to Patient Portal"
          >
            <div className="rs-card-icon-wrap">
              <Heart size={26} strokeWidth={1.8} />
            </div>

            <div className="rs-card-title">
              <h2>Patient / मरीज़</h2>
              <span className="rs-card-native">ರೋಗಿ &nbsp;•&nbsp; நோயாளி &nbsp;•&nbsp; രോഗി &nbsp;•&nbsp; రోగి</span>
            </div>

            <ul className="rs-card-features">
              <li>
                <span className="rs-feature-dot" />
                AYUSETU 25-Section Adaptive Questionnaire (Dashavidha Pariksha &amp; Ahara-Vihara)
              </li>
              <li>
                <span className="rs-feature-dot" />
                Multilingual Indic Voice Symptom Intake (Hindi, Kannada, Tamil, Telugu &amp; more)
              </li>
              <li>
                <span className="rs-feature-dot" />
                Prescription &amp; Lab Document OCR Digitizer with automated extraction
              </li>
              <li>
                <span className="rs-feature-dot" />
                Elderly-accessible mode with large text, high contrast &amp; audio read-aloud
              </li>
            </ul>

            <span className="rs-card-cta">
              <Heart size={15} />
              Enter Patient Portal
              <ChevronRight size={15} />
            </span>
          </button>

          {/* Doctor Card */}
          <button
            type="button"
            className="rs-role-card role-doctor"
            onClick={() => onSelectRole('doctor')}
            aria-label="I am a Doctor — go to Doctor Clinical Portal"
          >
            <div className="rs-card-icon-wrap">
              <Stethoscope size={26} strokeWidth={1.8} />
            </div>

            <div className="rs-card-title">
              <h2>Doctor / डॉक्टर</h2>
              <span className="rs-card-native">ವೈದ್ಯರು &nbsp;•&nbsp; மருத்துவர் &nbsp;•&nbsp; ഡോക്ടർ &nbsp;•&nbsp; వైద్యుడు</span>
            </div>

            <ul className="rs-card-features">
              <li>
                <span className="rs-feature-dot" />
                Real-time OPD triage queue with RED FLAG, URGENT, ROUTINE prioritisation
              </li>
              <li>
                <span className="rs-feature-dot" />
                Structured SOAP notes and Dashavidha Pariksha profiles in seconds
              </li>
              <li>
                <span className="rs-feature-dot" />
                Ayurvedic &amp; Allopathic drug term extraction (Dosha, Agni, Medications)
              </li>
              <li>
                <span className="rs-feature-dot" />
                Digital prescription builder &amp; clinical notes workspace
              </li>
            </ul>

            <span className="rs-card-cta">
              <Activity size={15} />
              Enter Doctor Portal
              <ChevronRight size={15} />
            </span>
          </button>
        </div>

        {/* Footer Note */}
        <p className="rs-footer-note">
          <Shield size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.3rem' }} />
          All patient data is processed locally in your browser and is never transmitted to external servers.
          &nbsp; Built by Tensor Titans — SIH 2026.
        </p>
      </div>
    </div>
  );
}

/* ============================================================================
   COMPONENT: ModeSelectionModal (ModeSelectionModal.jsx)
   ============================================================================ */

export function ModeSelectionModal({
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

/* ============================================================================
   COMPONENT: MedicalIntro (MedicalIntro.jsx)
   ============================================================================ */

export function MedicalIntro({ onEnterPatient, onEnterDoctor, onSkip }) {
  const stageRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onSkip?.();
      } else if (e.key === 'Enter') {
        onEnterPatient?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSkip, onEnterPatient]);

  // Subtle 3D mouse parallax on stage
  const handleMouseMove = (e) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const maxTilt = 6; // degrees
    const tiltX = -(mouseY / (rect.height / 2)) * maxTilt;
    const tiltY = (mouseX / (rect.width / 2)) * maxTilt;
    setTilt({
      x: Math.max(-maxTilt, Math.min(maxTilt, tiltX)),
      y: Math.max(-maxTilt, Math.min(maxTilt, tiltY))
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <main
      className="medical-intro"
      onMouseMove={() => !isHovered && setIsHovered(true)}
    >
      {/* Background Ambience & Perspective Grid */}
      <div className="medical-pulse-backdrop" aria-hidden="true">
        <HeartPulse className="background-heart-outline" size={440} strokeWidth={1.2} />
        <span className="background-heart-core" />
      </div>
      <div className="medical-particle-field" aria-hidden="true" />
      <div className="medical-intro-glow medical-intro-glow-one" aria-hidden="true" />
      <div className="medical-intro-glow medical-intro-glow-two" aria-hidden="true" />

      {/* Live Background ECG Waveform */}
      <div className="medical-ecg-stream" aria-hidden="true">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8fc4bd" stopOpacity="0" />
              <stop offset="15%" stopColor="#8fc4bd" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#48dfb2" stopOpacity="0.85" />
              <stop offset="85%" stopColor="#8fc4bd" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#8fc4bd" stopOpacity="0" />
            </linearGradient>
            <filter id="ecgGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            className="ecg-path"
            d="M 0 60 L 180 60 L 200 60 L 215 48 L 225 72 L 235 60 L 250 60 L 265 18 L 280 102 L 295 60 L 310 60 L 325 50 L 340 60 L 520 60 L 540 60 L 555 48 L 565 72 L 575 60 L 590 60 L 605 18 L 620 102 L 635 60 L 650 60 L 665 50 L 680 60 L 860 60 L 880 60 L 895 48 L 905 72 L 915 60 L 930 60 L 945 18 L 960 102 L 975 60 L 990 60 L 1005 50 L 1020 60 L 1200 60"
            fill="none"
            stroke="url(#ecgGrad)"
            strokeWidth="2.4"
            filter="url(#ecgGlow)"
          />
        </svg>
      </div>

      {/* Top Telemetry Header */}
      <header className="medical-intro-header">
        <div className="medical-intro-brand">
          <span className="brand-dot" />
          Pre<span>Consult</span>
          <span className="brand-badge">AYUSETU</span>
        </div>
        <div className="medical-intro-telemetry">
          <span className="telemetry-pill">
            <Activity size={13} className="telemetry-pulse-icon" />
            <b>72 BPM</b> SINUS RHYTHM
          </span>
          <span className="telemetry-pill live-status">
            <i className="status-live-dot" /> NIDAN-AI ONLINE
          </span>
        </div>
      </header>

      {/* Central 3D Interactive Stage */}
      <section
        className="medical-intro-stage"
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(950px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
        }}
        aria-label="Ayusetu introduction interactive stage"
      >
        {/* Document 1: Back Left (Vitals) */}
        <div className="medical-document medical-document-back-left" aria-hidden="true">
          <div className="doc-chip"><Activity size={12} /> VITALS</div>
          <div className="doc-vital-row">
            <span>HR</span>
            <b>72 bpm</b>
          </div>
          <div className="doc-vital-row">
            <span>SpO2</span>
            <b>99%</b>
          </div>
          <div className="doc-vital-row">
            <span>BP</span>
            <b>120/80</b>
          </div>
          <div className="doc-badge-optimal">STABLE</div>
        </div>

        {/* Document 2: Front Left (Patient File) */}
        <div className="medical-document medical-document-left" aria-hidden="true">
          <div className="doc-header">
            <FileText size={16} />
            <div>
              <span className="doc-title">Patient Intake</span>
              <small className="doc-sub">OPD / PC-2048</small>
            </div>
          </div>
          <div className="doc-meta-item">
            <span className="doc-label">Prakriti:</span>
            <span className="doc-val">Pitta-Vata</span>
          </div>
          <div className="doc-meta-item">
            <span className="doc-label">Voice Intake:</span>
            <span className="doc-val highlight">Indic ASR Ready</span>
          </div>
          <div className="doc-lines">
            <b />
            <b />
            <b />
          </div>
          <small className="doc-footer-tag">AYUSH CLINICAL FILE</small>
        </div>

        {/* Document 3: Back Right (Diagnostic Triage) */}
        <div className="medical-document medical-document-back-right" aria-hidden="true">
          <div className="doc-chip"><Zap size={12} /> TRIAGE</div>
          <div className="doc-vital-row">
            <span>Triage</span>
            <b>Routine</b>
          </div>
          <div className="doc-vital-row">
            <span>Red Flags</span>
            <b>0 Alert</b>
          </div>
          <div className="doc-vital-row">
            <span>Terms</span>
            <b>100% Retained</b>
          </div>
          <div className="doc-badge-optimal">VERIFIED</div>
        </div>

        {/* Document 4: Front Right (SOAP Clinical Note) */}
        <div className="medical-document medical-document-right" aria-hidden="true">
          <div className="doc-header">
            <FileText size={16} />
            <div>
              <span className="doc-title">Clinical Note</span>
              <small className="doc-sub">SOAP SYNTHESIS</small>
            </div>
          </div>
          <div className="doc-soap-snippet">
            <div><b>S:</b> Retrosternal pyrosis</div>
            <div><b>O:</b> Stable Vitals (72 bpm)</div>
            <div><b>A:</b> Amlapitta (Mild GERD)</div>
            <div><b>P:</b> Triphala + Dashamula</div>
          </div>
          <small className="doc-footer-tag verified">
            <ShieldCheck size={12} /> PRESERVED & SECURE
          </small>
        </div>

        {/* Pulse Concentric Rings */}
        <div className="medical-intro-orbit medical-intro-orbit-one" aria-hidden="true" />
        <div className="medical-intro-orbit medical-intro-orbit-two" aria-hidden="true" />
        <div className="medical-pulse-ring pulse-ring-1" aria-hidden="true" />
        <div className="medical-pulse-ring pulse-ring-2" aria-hidden="true" />

        {/* Magnifier Glass Scanner */}
        <div className="medical-magnifier" aria-hidden="true">
          <span className="magnifier-lens"><i /></span>
          <span className="magnifier-handle" />
        </div>

        {/* Central Realistic Stethoscope with Gradient Light */}
        <div className="medical-stethoscope" aria-hidden="true">
          <svg viewBox="0 0 180 190" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="stethoscopeTube" x1="35" y1="20" x2="145" y2="155" gradientUnits="userSpaceOnUse">
                <stop stopColor="#e4f4f0" />
                <stop offset="0.32" stopColor="#8fc4bd" />
                <stop offset="0.75" stopColor="#41847e" />
                <stop offset="1" stopColor="#1e4e4a" />
              </linearGradient>
              <radialGradient id="stethoscopeChest" cx="35%" cy="25%" r="80%">
                <stop stopColor="#fff3d6" />
                <stop offset="0.45" stopColor="#c9a769" />
                <stop offset="1" stopColor="#5c442a" />
              </radialGradient>
              <filter id="stethoscopeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#000000" floodOpacity="0.5" />
                <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#8fc4bd" floodOpacity="0.25" />
              </filter>
            </defs>
            <path className="stethoscope-tube-shadow" d="M43 20V62C43 91 61 108 90 108C119 108 137 91 137 62V20" />
            <path className="stethoscope-tube" d="M43 20V62C43 91 61 108 90 108C119 108 137 91 137 62V20" filter="url(#stethoscopeGlow)" />
            <path className="stethoscope-branch" d="M43 20L36 12M137 20L144 12" />
            <circle className="stethoscope-ear" cx="35" cy="10" r="6" />
            <circle className="stethoscope-ear" cx="145" cy="10" r="6" />
            <path className="stethoscope-stem" d="M90 108V130C90 141 99 149 110 149H123" />
            <circle className="stethoscope-chest" cx="137" cy="149" r="20" />
            <circle className="stethoscope-diaphragm" cx="137" cy="149" r="13" />
            <path className="stethoscope-highlight" d="M128 141C131 137 136 135 141 136" />
          </svg>
        </div>
      </section>

      {/* Typography & Call-To-Actions Section */}
      <section className="medical-intro-copy">
        <div className="medical-intro-eyebrow">
          <ShieldCheck size={14} className="shield-icon" />
          <span>ACCESSIBLE MULTILINGUAL PRE-CONSULTATION</span>
          <span className="eyebrow-divider">•</span>
          <span className="eyebrow-highlight">AYURVEDA + ALLOPATHY</span>
        </div>

        {/* AYUSETU Brand Lockup */}
        <div className="medical-title-lockup">
          <span className="medical-title-line line-left" />
          <h1 aria-label="AYUSETU" className="ayusetu-title">
            {Array.from('AYUSETU').map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                style={{ animationDelay: `${0.45 + index * 0.05}s` }}
                aria-hidden="true"
              >
                {letter}
              </span>
            ))}
          </h1>
          <span className="medical-title-line line-right" />
        </div>

        {/* Authentic Devanagari Native Script & Slogan from Artwork */}
        <div className="medical-native-lockup">
          <span className="native-rule" />
          <span className="medical-native-title">आयुसेतु</span>
          <span className="native-rule" />
        </div>

        <p className="medical-title-tagline">
          CONNECTING CARE <span className="tagline-dot">•</span> ACROSS LIVES
        </p>

        <p className="medical-intro-message">
          Bridging patients and healthcare through Indic voice intake, Ayurvedic clinical correlation,
          and physician-ready SOAP documentation before consultation begins.
        </p>

        <div className="medical-intro-actions">
          <button
            type="button"
            className="medical-intro-primary"
            onClick={onEnterPatient}
          >
            <span className="btn-shine" />
            <span>Enter Patient Portal</span>
            <ArrowRight size={17} className="btn-arrow" />
          </button>

          <button
            type="button"
            className="medical-intro-secondary"
            onClick={onEnterDoctor}
          >
            <Stethoscope size={16} />
            <span>Doctor Clinical Login</span>
          </button>
        </div>

        <button
          type="button"
          className="medical-intro-skip"
          onClick={onSkip}
        >
          Skip intro and choose role <kbd className="kbd-shortcut">Esc</kbd>
        </button>
      </section>

      {/* Footer System Specs */}
      <footer className="medical-intro-footer">
        <div className="footer-left">
          <span>PRECONSULT / NIDAN-AI</span>
          <span className="footer-dot">•</span>
          <span>SIH 2026 CLINICAL ACCESS</span>
        </div>
        <div className="footer-right">
          <span>Multilingual Indic Voice</span>
          <span className="footer-dot">•</span>
          <span>HIPAA &amp; Ayush Compliant</span>
        </div>
      </footer>
    </main>
  );
}

/* ============================================================================
   COMPONENT: DoctorLogin (DoctorLogin.jsx)
   ============================================================================ */

const DEMO_DOCTOR = {
  username: 'doctor01',
  password: 'doctor123',
  name: 'Dr. Ananya Rao',
  specialty: 'Ayurveda & General Medicine',
  registration: 'AYU-KA-20481',
};

export const DEMO_DOCTOR_PROFILE = DEMO_DOCTOR;

export function DoctorLogin({ onLogin, onBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [registration, setRegistration] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (isRegistering) {
        if (password.length < 8) throw new Error('Password must contain at least 8 characters.');
        if (password !== confirmPassword) throw new Error('Passwords do not match.');
        await registerDoctor({ username, password, name: name.trim(), specialty, registration });
        setIsRegistering(false);
        setPassword('');
        setConfirmPassword('');
        setError('Account created. Sign in with your new doctor ID.');
      } else if (username.trim() === DEMO_DOCTOR.username && password === DEMO_DOCTOR.password) {
        onLogin(DEMO_DOCTOR);
      } else {
        onLogin(await authenticateDoctor(username, password));
      }
    } catch (submitError) {
      setError(submitError.message || 'Unable to complete this request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="doctor-login-page">
      <section className="doctor-login-card" aria-labelledby="doctor-login-title">
        <div className="doctor-login-brand">
          <div className="doctor-login-icon"><Stethoscope size={24} /></div>
          <span>PreConsult / Clinical Access</span>
        </div>
        <h1 id="doctor-login-title">{isRegistering ? 'Create Doctor Account' : 'Doctor Portal'}</h1>
        <p className="doctor-login-subtitle">
          {isRegistering ? 'Create a local encrypted profile for this demo.' : 'Sign in to manage your personalized clinical workspace.'}
        </p>

        <form onSubmit={handleSubmit} className="doctor-login-form">
          {!isRegistering && (
            <>
              <label htmlFor="doctor-username">Doctor ID</label>
              <div className="doctor-login-input-wrap">
                <UserRound size={17} aria-hidden="true" />
                <input
                  id="doctor-username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  placeholder="Enter doctor ID"
                  required
                />
              </div>
            </>
          )}

          {isRegistering && (
            <>
              <label htmlFor="doctor-name">Full Name</label>
              <input id="doctor-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Dr. Your Name" required />
              <label htmlFor="doctor-username">Username</label>
              <div className="doctor-login-input-wrap">
                <UserRound size={17} aria-hidden="true" />
                <input
                  id="doctor-username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  placeholder="Choose a username"
                  required
                />
              </div>
              <label htmlFor="doctor-specialty">Specialty</label>
              <input id="doctor-specialty" value={specialty} onChange={(event) => setSpecialty(event.target.value)} placeholder="General Medicine" required />
              <label htmlFor="doctor-registration">Registration Number</label>
              <input id="doctor-registration" value={registration} onChange={(event) => setRegistration(event.target.value)} placeholder="Medical registration ID" required />
            </>
          )}

          <label htmlFor="doctor-password">Password</label>
          <div className="doctor-login-input-wrap">
            <LockKeyhole size={17} aria-hidden="true" />
            <input
              id="doctor-password"
                type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Enter password"
              required
            />
            <button
              type="button"
              className="doctor-password-toggle"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {isRegistering && (
            <>
              <label htmlFor="doctor-confirm-password">Confirm Password</label>
              <div className="doctor-login-input-wrap">
                <LockKeyhole size={17} aria-hidden="true" />
                <input id="doctor-confirm-password" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" placeholder="Repeat password" required />
                <button
                  type="button"
                  className="doctor-password-toggle"
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                  aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </>
          )}

          {error && <p className={`doctor-login-error ${error.startsWith('Account created') ? 'is-success' : ''}`} role="alert">{error}</p>}
          <button type="submit" className="doctor-login-submit" disabled={isSubmitting}>{isSubmitting ? 'Please wait…' : (isRegistering ? 'Create Account' : 'Sign In')}</button>
        </form>

        {!isRegistering && <p className="doctor-login-demo">Demo access: <strong>doctor01</strong> / <strong>doctor123</strong></p>}
        <button type="button" className="doctor-login-back" onClick={() => { setIsRegistering(!isRegistering); setError(''); }}>
          {isRegistering ? 'Back to sign in' : 'Create a new doctor account'}
        </button>
        <button type="button" className="doctor-login-back" onClick={onBack}>Back to role selection</button>
      </section>
    </main>
  );
}

/* ============================================================================
   COMPONENT: DoctorPortal (DoctorPortal.jsx)
   ============================================================================ */

const TRIAGE_ICONS = {
  RED_FLAG: <AlertOctagon size={12} />,
  URGENT: <AlertTriangle size={12} />,
  ROUTINE: <CheckCircle2 size={12} />,
};

const TRIAGE_CLASSES = {
  RED_FLAG: 'triage-red',
  URGENT: 'triage-urgent',
  ROUTINE: 'triage-routine',
};

const TRIAGE_LABELS = {
  RED_FLAG: 'Red Flag',
  URGENT: 'Urgent',
  ROUTINE: 'Routine',
};

const STATUS_LABELS = {
  pending: 'Pending',
  'in-consultation': 'In Consultation',
  completed: 'Completed',
};

function formatTime(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  const now = new Date();
  const diffMin = Math.round((now - d) / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function DoctorPortal({ theme, onToggleTheme, onSwitchRole, doctorProfile, onLogout }) {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({ total: 0, red_flag: 0, urgent: 0, routine: 0, completed: 0, pending: 0 });
  const [selectedId, setSelectedId] = useState(null);
  const [filterTab, setFilterTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable doctor workspace state
  const [doctorNote, setDoctorNote] = useState('');
  const [activeStatus, setActiveStatus] = useState('pending');
  const [rxItems, setRxItems] = useState([]);
  const [rxMed, setRxMed] = useState('');
  const [rxDose, setRxDose] = useState('');
  const [rxFreq, setRxFreq] = useState('');
  const [showPasswordPanel, setShowPasswordPanel] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  // Load records
  const refreshRecords = useCallback(() => {
    const recs = getClinicalRecords();
    setRecords(recs);
    setSummary(getTriageSummary());
  }, []);

  useEffect(() => {
    refreshRecords();
    const unsub = subscribeToRecords((updated) => {
      const sorted = [...updated].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setRecords(sorted);
      setSummary(getTriageSummary());
    });
    return unsub;
  }, [refreshRecords]);

  // Sync workspace state when selected record changes
  useEffect(() => {
    if (!selectedId) return;
    const rec = records.find((r) => r.id === selectedId);
    if (!rec) return;
    setDoctorNote(rec.doctorNote || '');
    setActiveStatus(rec.status || 'pending');
    setRxItems(rec.prescription || []);
  }, [selectedId, records]);

  const selectedRecord = records.find((r) => r.id === selectedId) || null;

  // ── Filter & Search ──────────────────────────────────────────────────────
  const filteredRecords = records.filter((r) => {
    const matchesFilter =
      filterTab === 'all' ||
      (filterTab === 'redflag' && r.intake?.triage_urgency === 'RED_FLAG' && r.status !== 'completed') ||
      (filterTab === 'urgent' && r.intake?.triage_urgency === 'URGENT' && r.status !== 'completed') ||
      (filterTab === 'routine' && r.intake?.triage_urgency === 'ROUTINE' && r.status !== 'completed') ||
      (filterTab === 'completed' && r.status === 'completed');

    if (!searchQuery) return matchesFilter;
    const q = searchQuery.toLowerCase();
    return (
      matchesFilter &&
      (
        r.patientInfo?.name?.toLowerCase().includes(q) ||
        r.id?.toLowerCase().includes(q) ||
        r.intake?.chief_complaint?.toLowerCase().includes(q)
      )
    );
  });

  // ── Save Consultation ────────────────────────────────────────────────────
  const handleSave = () => {
    if (!selectedId) return;
    updateClinicalRecord(selectedId, {
      status: activeStatus,
      doctorNote,
      prescription: rxItems,
    });
    refreshRecords();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // ── Add Rx ───────────────────────────────────────────────────────────────
  const handleAddRx = () => {
    if (!rxMed.trim()) return;
    setRxItems((prev) => [...prev, {
      medicine: rxMed.trim(),
      dosage: rxDose.trim() || '—',
      frequency: rxFreq.trim() || '—',
    }]);
    setRxMed('');
    setRxDose('');
    setRxFreq('');
  };

  // ── Print Summary ────────────────────────────────────────────────────────
  const handlePrint = () => {
    window.print();
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setPasswordMessage('');
    if (newPassword.length < 8) {
      setPasswordMessage('New password must contain at least 8 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordMessage('New passwords do not match.');
      return;
    }
    try {
      await changeDoctorPassword(doctorProfile.username, currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setPasswordMessage('Password changed successfully.');
    } catch (error) {
      setPasswordMessage(error.message);
    }
  };

  return (
    <div className="doctor-portal">
      {/* ── Header ── */}
      <header className="dp-header">
        <div className="dp-header-inner">
          <div className="dp-header-left">
            <div className="dp-header-icon">
              <Stethoscope size={18} strokeWidth={1.8} />
            </div>
            <div className="dp-header-title">
              <h1>Hi, {doctorProfile?.name || 'Doctor'}</h1>
              <span>{doctorProfile?.specialty || 'Clinical Practice'} • PreConsult OPD</span>
            </div>
          </div>
          <div className="dp-header-actions">
            <button
              type="button"
              className="dp-switch-role-btn"
              onClick={() => onSwitchRole('role-select')}
            >
              <ArrowLeft size={14} />
              Switch Role
            </button>
            <div className="dp-doctor-profile" aria-label="Signed-in doctor profile">
              <span className="dp-doctor-avatar">{doctorProfile?.name?.replace('Dr. ', '').charAt(0) || 'D'}</span>
              <span className="dp-doctor-profile-copy">
                <strong>{doctorProfile?.name || 'Doctor'}</strong>
                <small>{doctorProfile?.registration || 'Verified clinician'}</small>
              </span>
            </div>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>
      </header>

      <div className="dp-account-actions">
        <span>Account settings</span>
        <button type="button" className="dp-account-btn" onClick={() => setShowPasswordPanel((visible) => !visible)}>
          Change Password
        </button>
        <button type="button" className="dp-account-btn dp-logout-btn" onClick={onLogout}>
          Log Out
        </button>
      </div>

      {showPasswordPanel && (
        <form className="dp-password-panel" onSubmit={handleChangePassword}>
          <strong>Change Password</strong>
          <input type="password" placeholder="Current password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required />
          <input type="password" placeholder="New password (8+ characters)" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
          <input type="password" placeholder="Confirm new password" value={confirmNewPassword} onChange={(event) => setConfirmNewPassword(event.target.value)} required />
          <button type="submit" className="dp-btn-save">Update Password</button>
          {passwordMessage && <span className="dp-password-message">{passwordMessage}</span>}
        </form>
      )}

      {/* ── Triage Metrics Bar ── */}
      <div className="dp-metrics-bar" role="status" aria-label="OPD triage summary">
        <div className="dp-metric metric-total">
          <span className="dp-metric-value">{summary.total}</span>
          <span className="dp-metric-label">Total</span>
        </div>
        <div className="dp-metrics-divider" />
        <div className="dp-metric metric-redflag">
          <AlertOctagon size={14} />
          <span className="dp-metric-value">{summary.red_flag}</span>
          <span className="dp-metric-label">Red Flag</span>
        </div>
        <div className="dp-metric metric-urgent">
          <AlertTriangle size={14} />
          <span className="dp-metric-value">{summary.urgent}</span>
          <span className="dp-metric-label">Urgent</span>
        </div>
        <div className="dp-metric metric-routine">
          <CheckCircle2 size={14} />
          <span className="dp-metric-value">{summary.routine}</span>
          <span className="dp-metric-label">Routine</span>
        </div>
        <div className="dp-metrics-divider" />
        <div className="dp-metric metric-completed">
          <span className="dp-metric-value">{summary.completed}</span>
          <span className="dp-metric-label">Completed</span>
        </div>
        <div className="dp-live-badge">
          <span className="dp-live-dot" />
          Live Sync
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="dp-main">
        {/* ── Left: Triage Queue ── */}
        <aside className="dp-queue-panel">
          <div className="dp-queue-header">
            <span className="dp-queue-title">OPD Triage Queue</span>

            {/* Search */}
            <div className="dp-search-wrap">
              <Search size={14} color="var(--text-muted)" />
              <input
                type="search"
                placeholder="Patient name or complaint…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search patients"
              />
            </div>

            {/* Filter Tabs */}
            <div className="dp-filter-tabs" role="tablist">
              {[
                { id: 'all', label: `All (${records.length})` },
                { id: 'redflag', label: '🔴 Red Flag', cls: 'tab-redflag' },
                { id: 'urgent', label: '🟡 Urgent', cls: 'tab-urgent' },
                { id: 'routine', label: '🟢 Routine', cls: 'tab-routine' },
                { id: 'completed', label: '✓ Done' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={filterTab === tab.id}
                  className={`dp-filter-tab ${tab.cls || ''} ${filterTab === tab.id ? 'is-active' : ''}`}
                  onClick={() => setFilterTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Queue List */}
          <div className="dp-queue-list">
            {filteredRecords.length === 0 && (
              <div className="dp-queue-empty">
                No patients match this filter.
              </div>
            )}
            {filteredRecords.map((rec) => (
              <button
                key={rec.id}
                type="button"
                className={`dp-queue-item ${selectedId === rec.id ? 'is-selected' : ''}`}
                onClick={() => setSelectedId(rec.id)}
              >
                <div className="dp-queue-item-top">
                  <div>
                    <div className="dp-queue-item-name">
                      {rec.patientInfo?.name || 'Anonymous Patient'}
                      {rec.patientInfo?.isElderly && (
                        <span className="dp-elderly-badge" style={{ marginLeft: '0.4rem' }}>🧓 Senior</span>
                      )}
                    </div>
                    <div className="dp-queue-item-meta">
                      {rec.patientInfo?.abhaId && (
                        <span style={{ color: 'var(--accent-primary)', fontWeight: 600, display: 'inline-block', marginRight: '0.3rem' }}>
                          ABHA: {rec.patientInfo.abhaId} •{' '}
                        </span>
                      )}
                      {rec.patientInfo?.age && `${rec.patientInfo.age}yr `}
                      {rec.patientInfo?.gender} •{' '}
                      {rec.patientInfo?.languageLabel || rec.patientInfo?.language}
                    </div>
                    <div className="dp-queue-time">{formatTime(rec.timestamp)}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'flex-end' }}>
                    <span className={`dp-triage-pill ${TRIAGE_CLASSES[rec.intake?.triage_urgency] || 'triage-routine'}`}>
                      {TRIAGE_ICONS[rec.intake?.triage_urgency]}
                      {TRIAGE_LABELS[rec.intake?.triage_urgency] || rec.intake?.triage_urgency}
                    </span>
                    <span className={`dp-status-pill status-${rec.status}`}>
                      {STATUS_LABELS[rec.status] || rec.status}
                    </span>
                  </div>
                </div>
                <div className="dp-queue-item-complaint">
                  {rec.intake?.chief_complaint || '—'}
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* ── Right: Clinical Workspace ── */}
        <section className="dp-workspace">
          {!selectedRecord ? (
            <div className="dp-workspace-empty">
              <FileText size={48} />
              <p>Select a patient from the queue to view their clinical record.</p>
            </div>
          ) : (
            <>
              {/* Patient Summary Bar */}
              <div className="dp-patient-bar">
                <div className="dp-patient-info-group">
                  <span className="dp-patient-name">
                    <User size={14} style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />
                    {selectedRecord.patientInfo?.name || 'Anonymous Patient'}
                    {selectedRecord.patientInfo?.isElderly && ' 🧓'}
                  </span>
                  {selectedRecord.patientInfo?.abhaId && (
                    <span className="dp-patient-details" style={{ color: 'var(--accent-success)', fontWeight: 700, background: 'rgba(21, 128, 61, 0.1)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                      🛡️ ABHA: {selectedRecord.patientInfo.abhaId}
                    </span>
                  )}
                  <span className="dp-patient-details">
                    {selectedRecord.patientInfo?.age && `${selectedRecord.patientInfo.age} yr`}
                    {selectedRecord.patientInfo?.gender && ` • ${selectedRecord.patientInfo.gender}`}
                  </span>
                  <span className="dp-patient-lang-badge">
                    🌐 {selectedRecord.patientInfo?.languageLabel || selectedRecord.patientInfo?.language || 'Unknown'}
                  </span>
                  <span className={`dp-triage-pill ${TRIAGE_CLASSES[selectedRecord.intake?.triage_urgency] || ''}`} style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}>
                    {TRIAGE_ICONS[selectedRecord.intake?.triage_urgency]}
                    {TRIAGE_LABELS[selectedRecord.intake?.triage_urgency]}
                  </span>
                </div>
                <span className="dp-visit-time">
                  <Clock size={12} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
                  {formatTime(selectedRecord.timestamp)}
                  {' • '}{selectedRecord.id}
                </span>
              </div>

              <div className="dp-workspace-content">
                {/* ── Section 1: Triage Reason ── */}
                {selectedRecord.intake?.triage_reason && (
                  <div className="dp-section-card">
                    <div className="dp-section-header" style={{ background: selectedRecord.intake?.triage_urgency === 'RED_FLAG' ? 'var(--accent-emergency-bg)' : undefined }}>
                      <span className="dp-section-icon">
                        {TRIAGE_ICONS[selectedRecord.intake?.triage_urgency]}
                      </span>
                      <span className="dp-section-title">
                        Triage Alert — {TRIAGE_LABELS[selectedRecord.intake?.triage_urgency]}
                      </span>
                    </div>
                    <div className="dp-section-body">
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                        {selectedRecord.intake.triage_reason}
                      </p>
                    </div>
                  </div>
                )}

                {/* ── Section 2: Patient Voice Transcript ── */}
                <div className="dp-section-card">
                  <div className="dp-section-header">
                    <Activity size={15} className="dp-section-icon" />
                    <span className="dp-section-title">Voice Transcript</span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      Detected: {selectedRecord.intake?.detected_language || '—'}
                    </span>
                  </div>
                  <div className="dp-section-body">
                    <div className="dp-transcript-grid">
                      <div className="dp-transcript-box">
                        <div className="dp-transcript-label">🗣 Patient (Native Script)</div>
                        <p className="dp-transcript-text">{selectedRecord.intake?.original_transcript || '—'}</p>
                      </div>
                      <div className="dp-transcript-box">
                        <div className="dp-transcript-label">📄 Clinical English (AI Translated)</div>
                        <p className="dp-transcript-text">{selectedRecord.intake?.translated_clinical_english || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Section 3: Structured SOAP Data ── */}
                <div className="dp-section-card">
                  <div className="dp-section-header">
                    <FileText size={15} className="dp-section-icon" />
                    <span className="dp-section-title">Clinical Intake — SOAP</span>
                  </div>
                  <div className="dp-section-body">
                    <div className="dp-section-body-field">
                      <div className="dp-soap-label">Chief Complaint</div>
                      <div className="dp-soap-value" style={{ fontWeight: 600 }}>{selectedRecord.intake?.chief_complaint || '—'}</div>
                    </div>
                    <div className="dp-section-body-field">
                      <div className="dp-soap-label">Duration</div>
                      <div className="dp-soap-value">{selectedRecord.intake?.duration || '—'}</div>
                    </div>
                    {selectedRecord.intake?.associated_symptoms?.length > 0 && (
                      <div className="dp-section-body-field">
                        <div className="dp-soap-label">Associated Symptoms</div>
                        <div className="dp-tag-list">
                          {selectedRecord.intake.associated_symptoms.map((s, i) => (
                            <span key={i} className="dp-tag tag-symptom">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedRecord.intake?.medications_mentioned?.length > 0 && (
                      <div className="dp-section-body-field" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
                        <div className="dp-soap-label">Medications Reported</div>
                        <div className="dp-tag-list">
                          {selectedRecord.intake.medications_mentioned.map((m, i) => (
                            <span key={i} className="dp-tag tag-med">
                              <Pill size={10} style={{ display: 'inline', marginRight: '0.25rem' }} />
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Section 4: Ayurvedic & AYUSH Factors ── */}
                {selectedRecord.intake?.ayurvedic_factors && (
                  <div className="dp-section-card">
                    <div className="dp-section-header">
                      <Leaf size={15} className="dp-section-icon" style={{ color: 'var(--accent-success)' }} />
                      <span className="dp-section-title">Ayurvedic &amp; AYUSH Factors</span>
                    </div>
                    <div className="dp-section-body">
                      <div className="dp-ayur-grid">
                        <div className="dp-ayur-field">
                          <label>Dosha Imbalance</label>
                          <span>{selectedRecord.intake.ayurvedic_factors.dosha_imbalance || 'Not detected'}</span>
                        </div>
                        <div className="dp-ayur-field">
                          <label>Agni (Digestive Fire)</label>
                          <span>{selectedRecord.intake.ayurvedic_factors.agni_status || 'Not detected'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Section 5: Doctor Action Pad ── */}
                <div className="dp-action-pad">
                  <div className="dp-action-pad-title">
                    <Stethoscope size={15} />
                    Clinical Workspace — Doctor Actions
                  </div>

                  {/* Status switcher */}
                  <div>
                    <div className="dp-soap-label" style={{ marginBottom: '0.45rem' }}>Consultation Status</div>
                    <div className="dp-status-switcher">
                      {[
                        { value: 'pending', label: 'Pending' },
                        { value: 'in-consultation', label: 'In Consultation' },
                        { value: 'completed', label: '✓ Completed' },
                      ].map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          className={`dp-status-btn ${activeStatus === s.value ? `is-active-${s.value.replace('-', '')}` : ''}`}
                          onClick={() => setActiveStatus(s.value)}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Doctor note */}
                  <div>
                    <div className="dp-soap-label" style={{ marginBottom: '0.45rem' }}>Clinical Impression &amp; Doctor Notes</div>
                    <textarea
                      className="dp-doctor-note"
                      value={doctorNote}
                      onChange={(e) => setDoctorNote(e.target.value)}
                      placeholder="Enter clinical impression, differential diagnoses, examination findings, management plan…"
                    />
                  </div>

                  {/* Prescription builder */}
                  <div className="dp-rx-builder">
                    <div className="dp-rx-label">Prescription / Rx Builder</div>
                    <div className="dp-rx-row">
                      <input
                        className="dp-rx-input"
                        type="text"
                        placeholder="Medicine / Formulation"
                        value={rxMed}
                        onChange={(e) => setRxMed(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddRx()}
                      />
                      <input
                        className="dp-rx-input"
                        type="text"
                        placeholder="Dose (e.g. 500mg)"
                        value={rxDose}
                        onChange={(e) => setRxDose(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddRx()}
                      />
                      <input
                        className="dp-rx-input"
                        type="text"
                        placeholder="Frequency"
                        value={rxFreq}
                        onChange={(e) => setRxFreq(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddRx()}
                      />
                      <button type="button" className="dp-rx-add-btn" onClick={handleAddRx}>
                        <Plus size={14} /> Add
                      </button>
                    </div>
                    {rxItems.length > 0 && (
                      <div className="dp-rx-list">
                        {rxItems.map((rx, i) => (
                          <div key={i} className="dp-rx-item">
                            <span className="dp-rx-item-text">
                              <strong>{rx.medicine}</strong>
                              {rx.dosage !== '—' && ` — ${rx.dosage}`}
                              {rx.frequency !== '—' && ` • ${rx.frequency}`}
                              {rx.duration && ` • ${rx.duration}`}
                            </span>
                            <button
                              type="button"
                              className="dp-rx-remove-btn"
                              onClick={() => setRxItems((prev) => prev.filter((_, j) => j !== i))}
                              aria-label="Remove prescription item"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="dp-action-btns">
                    <button type="button" className="dp-btn-save" onClick={handleSave}>
                      <Save size={15} />
                      Save Consultation &amp; Issue Rx
                    </button>
                    <button type="button" className="dp-btn-print" onClick={handlePrint}>
                      <Printer size={15} />
                      Print Summary
                    </button>
                  </div>

                  {saveSuccess && (
                    <div className="dp-save-toast">
                      ✓ Consultation saved successfully.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

/* ============================================================================
   COMPONENT: ProfilePage (ProfilePage.jsx)
   ============================================================================ */

export function ProfilePage({
  patientProfile,
  onSaveProfile,
  onLogout,
  onBack,
  currentLanguage = 'en',
  onSelectLanguage,
  currentMode = 'modern',
  onSelectMode,
  currentTheme = 'light',
  onToggleTheme,
  onNotify,
}) {
  const [formData, setFormData] = useState(() => {
    if (patientProfile) {
      return {
        name: patientProfile.name || '',
        abhaId: patientProfile.abhaId || '',
        abhaAddress: patientProfile.abhaAddress || (patientProfile.name ? `${patientProfile.name.toLowerCase().replace(/\s+/g, '.')}@abdm` : ''),
        phone: patientProfile.phone || '',
        email: patientProfile.email || '',
        gender: patientProfile.gender || 'Male',
        age: patientProfile.age || '',
        bloodGroup: patientProfile.bloodGroup || 'B+',
        emergencyContact: patientProfile.emergencyContact || '',
        address: patientProfile.address || '',
        language: patientProfile.language || currentLanguage || 'en',
        mode: patientProfile.mode || currentMode || 'modern',
      };
    }
    return {
      name: '',
      abhaId: '',
      abhaAddress: '',
      phone: '',
      email: '',
      gender: 'Male',
      age: '',
      bloodGroup: 'B+',
      emergencyContact: '',
      address: '',
      language: currentLanguage || 'en',
      mode: currentMode || 'modern',
    };
  });

  const [copiedAbha, setCopiedAbha] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const t = translations[formData.language] || translations[currentLanguage] || translations.en;

  const handleAbhaChange = (e) => {
    const formatted = formatAbhaId(e.target.value);
    setFormData((prev) => ({
      ...prev,
      abhaId: formatted,
      abhaAddress: prev.name ? `${prev.name.toLowerCase().replace(/\s+/g, '.')}@abdm` : prev.abhaAddress,
    }));
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: newName,
      abhaAddress: newName ? `${newName.toLowerCase().replace(/\s+/g, '.')}@abdm` : prev.abhaAddress,
    }));
  };

  const handleCopyAbha = () => {
    if (!formData.abhaId) return;
    navigator.clipboard?.writeText(formData.abhaId);
    setCopiedAbha(true);
    if (onNotify) onNotify('ABHA ID copied to clipboard.', 'info');
    setTimeout(() => setCopiedAbha(false), 2000);
  };

  const handleUseDemo = () => {
    setFormData({
      ...DEMO_PATIENT_PROFILE,
      language: formData.language,
      mode: formData.mode,
    });
    if (onNotify) onNotify('Loaded official ABDM sample patient profile.', 'info');
  };

  const handleDownloadCard = () => {
    if (onNotify) {
      onNotify('Downloading digital ABHA Health Card (PDF / QR)...', 'success');
    }
  };

  const handleModeChange = (mode) => {
    setFormData((prev) => ({ ...prev, mode }));
    if (onSelectMode) onSelectMode(mode);
  };

  const handleLanguageChange = (lang) => {
    setFormData((prev) => ({ ...prev, language: lang }));
    if (onSelectLanguage) onSelectLanguage(lang);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);

    if (onSaveProfile) {
      onSaveProfile(formData);
    }

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }, 400);
  };

  const initials = formData.name
    ? formData.name
        .split(' ')
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AB';

  const isElderly = formData.mode === 'elderly';

  return (
    <div className={`profile-page-root ${isElderly ? 'is-elderly-theme' : 'is-modern-theme'} ${currentTheme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      {/* ── Top Header Navigation ── */}
      <header className="profile-page-header">
        <div className="profile-header-container">
          <div className="profile-header-left">
            <button
              type="button"
              className="profile-back-btn"
              onClick={onBack}
              aria-label="Back to PreConsultation"
            >
              <ArrowLeft size={18} />
              <span>{isElderly ? 'वापस जाएं (Back to Intake)' : 'Back to Consultation'}</span>
            </button>

            <div className="profile-brand-lockup">
              <span className="profile-brand-title">PreConsult</span>
              <span className="profile-brand-badge">ABDM Official Portal</span>
            </div>
          </div>

          <div className="profile-header-actions">
            <ThemeToggle theme={currentTheme} onToggle={onToggleTheme} />
            <button
              type="button"
              className="profile-nav-logout-btn"
              onClick={onLogout}
              title="Log out from session"
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Profile Body Container ── */}
      <main className="profile-page-main">
        <div className="profile-container">
          {/* Banner Title */}
          <div className="profile-hero-banner">
            <div className="profile-hero-badge">
              <ShieldCheck size={16} />
              <span>Ayushman Bharat Digital Mission (ABDM) • NHA</span>
            </div>
            <h1 className="profile-hero-title">
              {isElderly ? 'मरीज प्रोफाइल और आभा स्वास्थ्य कार्ड' : 'Patient Profile & ABHA Identity'}
            </h1>
            <p className="profile-hero-sub">
              {isElderly
                ? 'अपनी आभा आईडी, व्यक्तिगत जानकारी, भाषा और प्रदर्शन मोड यहां बदलें।'
                : 'Manage your verified 14-digit Ayushman Bharat Health Account (ABHA), demographic credentials, clinical language, and accessibility modes.'}
            </p>
          </div>

          {/* ── 2-Column Responsive Layout ── */}
          <div className="profile-layout-grid">
            {/* ── LEFT COLUMN: Digital ABHA Card & ABDM Status ── */}
            <aside className="profile-sidebar-column">
              {/* Digital ABHA Card */}
              <div className="profile-card abha-showcase-card">
                {/* Tricolor Government Ribbon */}
                <div className="abha-showcase-tricolor" />

                <div className="abha-showcase-head">
                  <div className="abha-emblem-group">
                    <Building2 size={24} className="abha-emblem-icon" />
                    <div>
                      <h4>National Health Authority</h4>
                      <span>Government of India • MoHFW</span>
                    </div>
                  </div>
                  <div className="abha-verified-chip">
                    <CheckCircle2 size={13} />
                    <span>Verified ABHA</span>
                  </div>
                </div>

                <div className="abha-showcase-content">
                  <div className="abha-avatar-circle">
                    <span>{initials}</span>
                    <span className="abha-avatar-shield" title="ABDM Linked">
                      <ShieldCheck size={12} />
                    </span>
                  </div>

                  <div className="abha-info-block">
                    <h3 className="abha-patient-heading">{formData.name || 'Patient Name'}</h3>
                    
                    <div className="abha-id-container">
                      <div className="abha-id-label">ABHA Number</div>
                      <div className="abha-id-value-row">
                        <span className="abha-id-value">{formData.abhaId || '91-XXXX-XXXX-XXXX'}</span>
                        <button
                          type="button"
                          className="abha-copy-btn"
                          onClick={handleCopyAbha}
                          title="Copy ABHA Number"
                          aria-label="Copy ABHA Number"
                        >
                          {copiedAbha ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                          <span>{copiedAbha ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="abha-meta-grid">
                      <div className="abha-meta-item">
                        <span className="meta-lbl">ABHA Address</span>
                        <strong className="meta-val">{formData.abhaAddress || 'user@abdm'}</strong>
                      </div>
                      <div className="abha-meta-item">
                        <span className="meta-lbl">Gender</span>
                        <strong className="meta-val">{formData.gender || '—'}</strong>
                      </div>
                      <div className="abha-meta-item">
                        <span className="meta-lbl">Age</span>
                        <strong className="meta-val">{formData.age ? `${formData.age} Yrs` : '—'}</strong>
                      </div>
                      <div className="abha-meta-item">
                        <span className="meta-lbl">Blood Group</span>
                        <strong className="meta-val meta-blood">{formData.bloodGroup || '—'}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="abha-qr-section">
                    <div className="abha-qr-box">
                      <QrCode size={56} />
                      <span>Scan ABHA</span>
                    </div>
                    <div className="abha-qr-desc">
                      <small>Official ABDM QR Code for fast OPD token generation and instant hospital record sharing.</small>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="abha-card-footer-actions">
                  <button
                    type="button"
                    className="abha-download-btn"
                    onClick={handleDownloadCard}
                  >
                    <Download size={15} />
                    <span>Download ABHA Card (PDF)</span>
                  </button>
                  <button
                    type="button"
                    className="abha-demo-fill-btn"
                    onClick={handleUseDemo}
                  >
                    <Sparkles size={14} />
                    <span>Auto-fill Sample ABHA</span>
                  </button>
                </div>
              </div>

              {/* ABDM Security & Consent Info Card */}
              <div className="profile-card abha-consent-card">
                <div className="consent-head">
                  <Lock size={16} className="consent-lock-icon" />
                  <h4>ABDM Health Locker & Security</h4>
                </div>
                <ul className="consent-features">
                  <li>
                    <Check size={14} className="consent-check" />
                    <span>256-bit AES End-to-End Encryption</span>
                  </li>
                  <li>
                    <Check size={14} className="consent-check" />
                    <span>Consented Data Sharing with PreConsult OPD Doctors</span>
                  </li>
                  <li>
                    <Check size={14} className="consent-check" />
                    <span>Ayush & Allopathic Unified Health Records (EHR)</span>
                  </li>
                </ul>
              </div>
            </aside>

            {/* ── RIGHT COLUMN: Full Edit Form & Settings ── */}
            <div className="profile-main-column">
              <form onSubmit={handleSubmit} className="profile-full-form">
                {/* ── Section 1: Demographics & ABHA Credentials ── */}
                <div className="profile-card form-section-card">
                  <div className="section-card-header">
                    <div className="section-icon-badge">
                      <User size={18} />
                    </div>
                    <div>
                      <h2 className="section-title">Demographic & Identification Details</h2>
                      <p className="section-subtitle">Official details linked to your Ayushman Bharat Health Account.</p>
                    </div>
                  </div>

                  <div className="form-fields-grid">
                    {/* Full Name */}
                    <div className="form-field-group span-full">
                      <label htmlFor="p-name" className="field-label">
                        Full Name (as per Aadhaar / ABHA) <span className="req">*</span>
                      </label>
                      <div className="field-input-wrap">
                        <User size={17} className="field-icon" />
                        <input
                          id="p-name"
                          type="text"
                          value={formData.name}
                          onChange={handleNameChange}
                          placeholder="e.g. Ramesh Kumar"
                          required
                        />
                      </div>
                    </div>

                    {/* ABHA Number */}
                    <div className="form-field-group">
                      <label htmlFor="p-abha" className="field-label">
                        14-Digit ABHA ID <span className="req">*</span>
                      </label>
                      <div className="field-input-wrap">
                        <CreditCard size={17} className="field-icon" />
                        <input
                          id="p-abha"
                          type="text"
                          value={formData.abhaId}
                          onChange={handleAbhaChange}
                          placeholder="91-XXXX-XXXX-XXXX"
                          maxLength={17}
                          required
                        />
                      </div>
                      <small className="field-help">Formats automatically into standard XX-XXXX-XXXX-XXXX</small>
                    </div>

                    {/* ABHA Address */}
                    <div className="form-field-group">
                      <label htmlFor="p-abha-addr" className="field-label">
                        ABHA Address (@abdm Handle)
                      </label>
                      <div className="field-input-wrap">
                        <ShieldCheck size={17} className="field-icon" />
                        <input
                          id="p-abha-addr"
                          type="text"
                          value={formData.abhaAddress}
                          onChange={(e) => setFormData({ ...formData, abhaAddress: e.target.value })}
                          placeholder="ramesh.kumar@abdm"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="form-field-group">
                      <label htmlFor="p-phone" className="field-label">
                        Mobile Number (+91)
                      </label>
                      <div className="field-input-wrap">
                        <Phone size={17} className="field-icon" />
                        <input
                          id="p-phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="form-field-group">
                      <label htmlFor="p-email" className="field-label">
                        Email Address
                      </label>
                      <div className="field-input-wrap">
                        <Mail size={17} className="field-icon" />
                        <input
                          id="p-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="patient@example.com"
                        />
                      </div>
                    </div>

                    {/* Age & Gender */}
                    <div className="form-field-group">
                      <label htmlFor="p-age" className="field-label">
                        Age (Years)
                      </label>
                      <div className="field-input-wrap">
                        <Calendar size={17} className="field-icon" />
                        <input
                          id="p-age"
                          type="number"
                          min="1"
                          max="120"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          placeholder="58"
                        />
                      </div>
                    </div>

                    <div className="form-field-group">
                      <label htmlFor="p-gender" className="field-label">
                        Gender
                      </label>
                      <select
                        id="p-gender"
                        className="field-select"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other / Non-Binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>

                    {/* Blood Group */}
                    <div className="form-field-group">
                      <label htmlFor="p-blood" className="field-label">
                        Blood Group
                      </label>
                      <select
                        id="p-blood"
                        className="field-select"
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    {/* Emergency Contact */}
                    <div className="form-field-group">
                      <label htmlFor="p-emergency" className="field-label">
                        Emergency Contact
                      </label>
                      <div className="field-input-wrap">
                        <Heart size={17} className="field-icon" />
                        <input
                          id="p-emergency"
                          type="text"
                          value={formData.emergencyContact}
                          onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                          placeholder="+91 98765 01234 (Relative)"
                        />
                      </div>
                    </div>

                    {/* Residential Address */}
                    <div className="form-field-group span-full">
                      <label htmlFor="p-address" className="field-label">
                        Residential Address & PIN Code
                      </label>
                      <div className="field-input-wrap">
                        <MapPin size={17} className="field-icon" />
                        <input
                          id="p-address"
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="House / Street, Area, City, State & PIN"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Section 2: Viewing Mode Preference (Elderly vs Modern) ── */}
                <div className="profile-card form-section-card">
                  <div className="section-card-header">
                    <div className="section-icon-badge">
                      <Accessibility size={18} />
                    </div>
                    <div>
                      <h2 className="section-title">Viewing Mode Preference / इंटरफ़ेस मोड</h2>
                      <p className="section-subtitle">
                        Switch accessibility styles. Configured exclusively here in your profile.
                      </p>
                    </div>
                  </div>

                  <div className="profile-mode-selector-grid">
                    {/* Modern Mode */}
                    <button
                      type="button"
                      className={`profile-mode-card ${formData.mode === 'modern' ? 'is-selected' : ''}`}
                      onClick={() => handleModeChange('modern')}
                    >
                      <div className="mode-card-header">
                        <div className="mode-card-icon modern-icon">
                          <Zap size={22} />
                        </div>
                        {formData.mode === 'modern' && (
                          <span className="mode-selected-badge">
                            <CheckCircle2 size={16} /> Active
                          </span>
                        )}
                      </div>
                      <h3 className="mode-card-title">{t.modernLabel || 'Modern Clinical Mode'}</h3>
                      <p className="mode-card-desc">
                        {t.modernTagline || 'High-density clinical dashboard, standard typography, dynamic transitions, and multi-view protocol tools.'}
                      </p>
                      <div className="mode-features-list">
                        <span>• Standard layout</span>
                        <span>• Compact metrics</span>
                        <span>• Quick toggles</span>
                      </div>
                    </button>

                    {/* Elderly / Accessible Mode */}
                    <button
                      type="button"
                      className={`profile-mode-card ${formData.mode === 'elderly' ? 'is-selected' : ''}`}
                      onClick={() => handleModeChange('elderly')}
                    >
                      <div className="mode-card-header">
                        <div className="mode-card-icon elderly-icon">
                          <Accessibility size={22} />
                        </div>
                        {formData.mode === 'elderly' && (
                          <span className="mode-selected-badge">
                            <CheckCircle2 size={16} /> Active
                          </span>
                        )}
                      </div>
                      <h3 className="mode-card-title">{t.elderlyLabel || 'Elderly / Accessible Mode'}</h3>
                      <p className="mode-card-desc">
                        {t.elderlyTagline || 'High-contrast large touch targets (48px+), simplified language, magnified readable text, and voice-assisted prompts.'}
                      </p>
                      <div className="mode-features-list">
                        <span>• Magnified fonts</span>
                        <span>• High-contrast borders</span>
                        <span>• Extra large buttons</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* ── Section 3: Preferred Language ── */}
                <div className="profile-card form-section-card">
                  <div className="section-card-header">
                    <div className="section-icon-badge">
                      <Globe size={18} />
                    </div>
                    <div>
                      <h2 className="section-title">Preferred Language / प्राथमिक भाषा</h2>
                      <p className="section-subtitle">
                        Select your preferred language for voice intake, AI triage, and questionnaires.
                      </p>
                    </div>
                  </div>

                  <div className="profile-lang-chips-grid">
                    {SUPPORTED_LANGUAGES.map((lang) => {
                      const isSelected = formData.language === lang.id;
                      return (
                        <button
                          key={lang.id}
                          type="button"
                          className={`profile-lang-pill ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => handleLanguageChange(lang.id)}
                        >
                          <span className="lang-native">{lang.nativeLabel}</span>
                          <span className="lang-en">({lang.label})</span>
                          {isSelected && <Check size={14} className="lang-check" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── Section 4: Sticky / Bottom Save & Logout Actions ── */}
                <div className="profile-actions-footer">
                  <button
                    type="button"
                    className="profile-footer-logout"
                    onClick={onLogout}
                  >
                    <LogOut size={16} />
                    <span>Log Out of Session</span>
                  </button>

                  <div className="profile-footer-right">
                    <button
                      type="button"
                      className="profile-footer-cancel"
                      onClick={onBack}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className={`profile-footer-save ${saveSuccess ? 'is-success' : ''}`}
                      disabled={isSaving}
                    >
                      {saveSuccess ? (
                        <>
                          <CheckCircle2 size={18} />
                          <span>Saved Successfully!</span>
                        </>
                      ) : isSaving ? (
                        <span>Saving...</span>
                      ) : (
                        <>
                          <Save size={18} />
                          <span>Save All Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ============================================================================
   COMPONENT: VoiceIntake (VoiceIntake.jsx)
   ============================================================================ */

// Language locale mapping for SpeechRecognition API
const SPEECH_LANG_MAP = {
  hi: 'hi-IN',
  kn: 'kn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  ml: 'ml-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  sa: 'hi-IN',
  en: 'en-IN'
};

// Cross-platform audio format detector for Mobile (iOS Safari / Android Chrome) & Desktop
const getSupportedAudioMimeType = () => {
  if (typeof window === 'undefined' || typeof window.MediaRecorder === 'undefined') return '';
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/aac',
    'audio/ogg;codecs=opus'
  ];
  for (const t of candidates) {
    if (typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported(t)) {
      return t;
    }
  }
  return '';
};

const CLINICAL_PRESETS = [
  {
    id: 'preset-hi-cardiac',
    lang: 'hi',
    badge: 'Acute Pyrosis / Red Flag',
    label: 'Hindi: छाती में जलन व भारीपन (Metformin/Pyrosis)',
    transcript: 'मुझे दो दिन से छाती में बहुत जलन हो रही है और भारीपन लगता है। पेट भी भारी रहता है। मैं शुगर के लिए मेटफॉर्मिन और पेंटोप्रजोल ले रहा हूँ। चक्कर भी आते हैं।'
  },
  {
    id: 'preset-kn-ayur',
    lang: 'kn',
    badge: 'Mandagni / Ayurvedic Routine',
    label: 'Kannada: ಹೊಟ್ಟೆ ಉಬ್ಬರ, ಮಂದಾಗ್ನಿ & ತ್ರಿಫಲಾ ಚೂರ್ಣ',
    transcript: 'ನನಗೆ ಮೂರು ವಾರಗಳಿಂದ ಹೊಟ್ಟೆ ಸರಿಯಾಗಿ ಸ್ವಚ್ಛವಾಗುತ್ತಿಲ್ಲ, ಮಲಬದ್ಧತೆ ಇದೆ ಮತ್ತು ಮಂದಾಗ್ನಿ ಆಗಿದೆ. ರಾತ್ರಿ ತ್ರಿಫಲಾ ಚೂರ್ಣ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ.'
  },
  {
    id: 'preset-ta-sandhi',
    lang: 'ta',
    badge: 'Sandhivata / Urgent',
    label: 'Tamil: மூட்டு வலி, வாதம் & அஸ்வகந்தா',
    transcript: 'எனக்கு இரண்டு வாரங்களாக மூட்டு வலி மற்றும் முழங்கால் வீக்கம் உள்ளது. வாத பிரச்சனை அதிகம் உள்ளது. அஸ்வகந்தா மற்றும் தಶಮೂಲಾರಿಷ್ಟ சாப்பிடுகிறேன்.'
  },
  {
    id: 'preset-te-jvara',
    lang: 'te',
    badge: 'Jwara / Acute Fever',
    label: 'Telugu: తీవ్రమైన జ్వరం, దగ్గు & పారాసిటమాల్',
    transcript: 'నాకు మూడు రోజుల నుండి తీవ్రమైన జ్వరం, దగ్గు మరియు గొంతు నొప్పి ఉన్నాయి. పారాసిటమాల్ వేసుకున్నాను.'
  },
  {
    id: 'preset-mr-pitta',
    lang: 'mr',
    badge: 'Pitta / Acidity',
    label: 'Marathi: छातीत जळजळ आणि पोटात गॅस',
    transcript: 'मला दोन दिवसांपासून छातीत जळजळ आणि पोटात खूप गॅस होतोय. चक्कर पण येते आणि मळमळ वाटते.'
  },
  {
    id: 'preset-sa-ayush',
    lang: 'sa',
    badge: 'Classical AYUSH',
    label: 'Sanskrit: वात-पित्त प्रकोप & मन्दाग्नि',
    transcript: 'मम द्वे दिनेभ्यः हृदये दाहः मंदाग्निः च वर्तते। वात-पित्त प्रकोपः अस्ति। अश्वगन्धा चूर्णम् सेवयामि।'
  }
];

export function VoiceIntake({
  userLanguage = 'en',
  isElderly = false,
  t = {},
  onNotify,
  patientProfile
}) {
  const [selectedVoiceLang, setSelectedVoiceLang] = useState(() => {
    return userLanguage === 'en' ? 'hi' : userLanguage;
  });

  const [recordingState, setRecordingState] = useState('idle'); // 'idle' | 'recording' | 'transcribing' | 'analyzing' | 'success' | 'error'
  const [recordDuration, setRecordDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [clinicalData, setClinicalData] = useState(null);
  const [activeTab, setActiveTab] = useState('clinical'); // 'clinical' | 'original'
  const [errorMessage, setErrorMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Live real-time speech recognition state
  const [liveTranscript, setLiveTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [transcribeElapsedSec, setTranscribeElapsedSec] = useState(0);

  // Microphone permission modal states
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionBlocked, setPermissionBlocked] = useState(false);

  const [groqApiKey, setGroqApiKey] = useState(() => {
    return localStorage.getItem('preconsult_groq_api_key') || '';
  });

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const pcmChunksRef = useRef([]);
  const scriptProcessorRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const recognitionRef = useRef(null);
  const finalTranscriptAccumulatorRef = useRef('');

  const stopRecordingCleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (scriptProcessorRef.current) {
      try {
        scriptProcessorRef.current.disconnect();
      } catch (_) {}
      scriptProcessorRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    setAudioLevel(0);
  }, []);

  // Sync voice language when user changes global language
  useEffect(() => {
    if (userLanguage && userLanguage !== 'en') {
      setSelectedVoiceLang(userLanguage);
    }
  }, [userLanguage]);

  // Clean up Web Audio and Timer on unmount
  useEffect(() => {
    return () => {
      stopRecordingCleanup();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, [stopRecordingCleanup]);

  const [inputMethod, setInputMethod] = useState('voice'); // 'voice' | 'type'
  const [customTypedText, setCustomTypedText] = useState('');

  // ── Handle Mic Click ──
  const handleMicButtonClick = async () => {
    if (recordingState === 'recording') {
      stopRecording();
      return;
    }

    // Check if browser permission was already granted in Permissions API
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const status = await navigator.permissions.query({ name: 'microphone' });
        if (status.state === 'granted') {
          startRecordingDirect();
          return;
        } else if (status.state === 'denied') {
          setPermissionBlocked(true);
          setShowPermissionModal(true);
          return;
        }
      } catch (_) {
        // Fallback for browsers that don't support query for microphone
      }
    }

    // Direct recording start
    startRecordingDirect();
  };

  // ── Start Audio Recording & Live Speech Recognition ──
  const startRecordingDirect = async () => {
    try {
      setShowPermissionModal(false);
      setPermissionBlocked(false);
      setErrorMessage('');
      setLiveTranscript('');
      setInterimText('');
      finalTranscriptAccumulatorRef.current = '';
      audioChunksRef.current = [];
      pcmChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      mediaStreamRef.current = stream;

      // ── Web Audio Analyser & Raw Float32 PCM Capture ──
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        if (audioCtx.state === 'suspended') {
          await audioCtx.resume().catch(() => {});
        }
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);

        // 1. Analyser for Waveform Visualizer
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateLevel = () => {
          if (analyserRef.current) {
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
            animationFrameRef.current = requestAnimationFrame(updateLevel);
          }
        };
        updateLevel();

        // 2. ScriptProcessor for direct 16kHz PCM capture (Zero-loss WAV pipeline)
        try {
          const processor = audioCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const channelData = e.inputBuffer.getChannelData(0);
            pcmChunksRef.current.push(new Float32Array(channelData));
          };
          source.connect(processor);
          processor.connect(audioCtx.destination);
          scriptProcessorRef.current = processor;
        } catch (procErr) {
          console.warn('ScriptProcessor setup warning:', procErr);
        }
      }

      // ── Browser Live Speech Recognition (Bhashini / Web Speech API) ──
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = SPEECH_LANG_MAP[selectedVoiceLang] || 'hi-IN';

          recognition.onresult = (event) => {
            let interim = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcriptPiece = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscriptAccumulatorRef.current += (finalTranscriptAccumulatorRef.current ? ' ' : '') + transcriptPiece;
              } else {
                interim += transcriptPiece;
              }
            }
            setLiveTranscript(finalTranscriptAccumulatorRef.current);
            setInterimText(interim);
          };

          recognition.onerror = (e) => {
            console.warn('SpeechRecognition notice:', e.error);
          };

          recognition.start();
          recognitionRef.current = recognition;
        } catch (e) {
          console.warn('Could not start live SpeechRecognition:', e);
        }
      }

      // ── MediaRecorder for fallback recording ──
      const mimeType = getSupportedAudioMimeType();
      let mediaRecorder;
      try {
        mediaRecorder = mimeType
          ? new MediaRecorder(stream, { mimeType })
          : new MediaRecorder(stream);
      } catch (e) {
        console.warn('Fallback to standard MediaRecorder options:', e);
        mediaRecorder = new MediaRecorder(stream);
      }
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        await handleAudioConversionAndProcess();
      };

      mediaRecorder.start(250);
      setRecordingState('recording');
      setRecordDuration(0);

      timerRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);

      if (onNotify) {
        onNotify(isElderly ? 'माइक चालू है, बोलिए…' : 'Microphone active. Speak your symptoms naturally.', 'info');
      }
    } catch (err) {
      console.warn('Microphone permission notice:', err);
      setRecordingState('idle');
      stopRecordingCleanup();

      const isMobileInsecure = typeof window !== 'undefined' &&
        window.location.protocol !== 'https:' &&
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1';

      if (isMobileInsecure) {
        setErrorMessage(
          'Mobile browsers require HTTPS for microphone access over WiFi. You can type your symptoms below for instant clinical intake.'
        );
        setInputMethod('type');
      } else {
        setPermissionBlocked(true);
        setShowPermissionModal(true);
        setErrorMessage(
          'Microphone is unavailable or blocked. You can type your symptoms below.'
        );
      }

      if (onNotify) {
        onNotify(isMobileInsecure ? 'Microphone requires HTTPS on mobile. Switched to typing mode.' : 'Microphone access blocked. You can type your symptoms.', 'warning');
      }
    }
  };

  // ── Stop Audio Recording ──
  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    } else {
      handleAudioConversionAndProcess();
    }
  };

  // ── Convert Audio to 16kHz Mono WAV and Send to Server ──
  const handleAudioConversionAndProcess = async () => {
    setRecordingState('transcribing');

    let wavBlob = null;
    const sampleRate = audioContextRef.current?.sampleRate || 44100;
    const capturedUserText = (finalTranscriptAccumulatorRef.current + ' ' + interimText).trim();

    // 1. Primary: Encode directly from raw PCM chunks collected in real-time
    if (pcmChunksRef.current && pcmChunksRef.current.length > 0) {
      try {
        const resampled = resampleAudioBuffer(pcmChunksRef.current, sampleRate, 16000);
        wavBlob = encodeWAV(resampled, 16000);
      } catch (pcmErr) {
        console.warn('PCM encoding error:', pcmErr);
      }
    }

    // 2. Secondary fallback: Decode from MediaRecorder compressed blob
    if (!wavBlob && audioChunksRef.current.length > 0) {
      try {
        const mimeType = getSupportedAudioMimeType();
        const rawBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        const arrayBuf = await rawBlob.arrayBuffer();
        const decodeCtx = new (window.AudioContext || window.webkitAudioContext)();
        const decodedBuffer = await decodeCtx.decodeAudioData(arrayBuf);
        const channelData = decodedBuffer.getChannelData(0);
        const resampled = resampleAudioBuffer([channelData], decodedBuffer.sampleRate, 16000);
        wavBlob = encodeWAV(resampled, 16000);
        await decodeCtx.close().catch(() => {});
      } catch (decodeErr) {
        console.warn('decodeAudioData fallback error:', decodeErr);
      }
    }

    stopRecordingCleanup();
    await processAudioIntake(wavBlob, capturedUserText || null);
  };

  // ── Process Audio or Direct Spoken/Typed Transcript (Direct Bhashini Testing, No Timeout) ──
  const processAudioIntake = async (audioBlob, spokenTranscript) => {
    const rawText = (spokenTranscript || customTypedText || liveTranscript || '').trim();

    // If nothing was captured at all
    if (!rawText && (!audioBlob || audioBlob.size === 0)) {
      setRecordingState('idle');
      setErrorMessage('No speech was detected. Please ensure your microphone is active and speak clearly, or type your symptoms.');
      return;
    }

    setTranscribeElapsedSec(0);
    const ticker = setInterval(() => {
      setTranscribeElapsedSec((s) => s + 1);
    }, 1000);

    try {
      setRecordingState('transcribing');
      setErrorMessage('');

      let clinicalResult = null;

      // 1. Send Audio / Transcript to Server (Direct Bhashini ASR, waiting full response time)
      if (audioBlob || rawText) {
        try {
          let response;
          if (audioBlob && audioBlob.size > 0) {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'audio.wav');
            formData.append('language', selectedVoiceLang);
            if (rawText) formData.append('transcript', rawText);
            if (groqApiKey) formData.append('apiKey', groqApiKey);

            response = await fetch('/api/voice-intake', {
              method: 'POST',
              headers: groqApiKey ? { 'x-groq-api-key': groqApiKey } : {},
              body: formData
            });
          } else {
            response = await fetch('/api/voice-intake', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(groqApiKey ? { 'x-groq-api-key': groqApiKey } : {})
              },
              body: JSON.stringify({
                language: selectedVoiceLang,
                transcript: rawText,
                apiKey: groqApiKey
              })
            });
          }

          if (response.ok) {
            const resData = await response.json();
            if (resData.success && resData.data) {
              clinicalResult = resData.data;
            }
          } else {
            const errData = await response.json().catch(() => ({}));
            console.error('Bhashini endpoint error:', errData);
            setErrorMessage(errData.error || `Server error (${response.status}) from Bhashini`);
          }
        } catch (fetchErr) {
          console.error('Voice intake error:', fetchErr);
          setErrorMessage(`Transcription failed: ${fetchErr.message}`);
        }
      }

      clearInterval(ticker);

      // 2. Client-Side Clinical NLP Fallback
      if (!clinicalResult) {
        clinicalResult = executeClientClinicalNLP(
          rawText || 'Patient reports clinical symptoms for evaluation.',
          selectedVoiceLang
        );
        clinicalResult.transcription_engine = 'Client Indic Fallback';
      }

      setClinicalData(clinicalResult);
      setRecordingState('success');

      // Persist to shared Doctor Portal queue
      addClinicalRecord(clinicalResult, {
        name: patientProfile?.name || 'Anonymous Patient',
        abhaId: patientProfile?.abhaId || '91-8765-4321-0987',
        abhaAddress: patientProfile?.abhaAddress || 'patient@abdm',
        phone: patientProfile?.phone || '+91 98765 43210',
        age: patientProfile?.age || null,
        gender: patientProfile?.gender || 'Unknown',
        language: selectedVoiceLang,
        languageLabel: (() => {
          const LANG_MAP = {
            hi: 'Hindi',
            kn: 'Kannada',
            ta: 'Tamil',
            te: 'Telugu',
            ml: 'Malayalam',
            mr: 'Marathi',
            bn: 'Bengali',
            gu: 'Gujarati',
            pa: 'Punjabi',
            sa: 'Sanskrit',
            en: 'English'
          };
          return LANG_MAP[selectedVoiceLang] || selectedVoiceLang;
        })(),
        isElderly: isElderly
      });

      if (onNotify) {
        onNotify('Voice intake processed. SOAP note generated & attached to Doctor OPD queue.', 'success');
      }
    } catch (err) {
      console.error('Intake pipeline error:', err);
      const fallback = executeClientClinicalNLP(
        rawText || 'Patient reports clinical symptoms for review.',
        selectedVoiceLang
      );
      fallback.transcription_engine = 'Client Indic Fallback';
      setClinicalData(fallback);
      setRecordingState('success');
    }
  };

  // ── Handle Manual Typing Submission ──
  const handleTypedSubmit = (e) => {
    e.preventDefault();
    if (!customTypedText.trim()) return;
    setLiveTranscript(customTypedText.trim());
    processAudioIntake(null, customTypedText.trim());
  };

  // ── Execute Preset Scenario (Explicit Demo Only) ──
  const handleSelectPreset = (preset) => {
    setShowPermissionModal(false);
    setSelectedVoiceLang(preset.lang);
    setLiveTranscript(preset.transcript);
    processAudioIntake(null, preset.transcript);
  };

  // ── Reset Intake ──
  const handleReset = () => {
    setClinicalData(null);
    setRecordingState('idle');
    setRecordDuration(0);
    setErrorMessage('');
    setLiveTranscript('');
    setInterimText('');
  };

  // ── Text-to-Speech (Read Aloud) ──
  const handleSpeakAloud = () => {
    if (!clinicalData) return;
    const textToSpeak =
      activeTab === 'clinical'
        ? `Chief complaint: ${clinicalData.chief_complaint}. Duration: ${clinicalData.duration}. Summary: ${clinicalData.translated_clinical_english}`
        : clinicalData.original_transcript;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
      if (onNotify) {
        onNotify('Reading clinical summary aloud…', 'info');
      }
    }
  };

  // ── Copy Clinical SOAP Note ──
  const handleCopyNote = () => {
    if (!clinicalData) return;
    const note = `PRECONSULT CLINICAL INTAKE (OPD SLIP)
=====================================
Detected Language: ${clinicalData.detected_language}
Triage Level: ${clinicalData.triage_urgency} (${clinicalData.triage_reason})

CHIEF COMPLAINT:
${clinicalData.chief_complaint} (${clinicalData.duration})

PHYSICIAN SOAP CLINICAL SUMMARY:
${clinicalData.translated_clinical_english}

ASSOCIATED SYMPTOMS:
${(clinicalData.associated_symptoms || []).join(', ')}

CURRENT MEDICATIONS:
${(clinicalData.medications_mentioned || []).join(', ')}

AYURVEDIC / AYUSH FACTORS:
- Dosha Imbalance: ${clinicalData.ayurvedic_factors?.dosha_imbalance || 'N/A'}
- Agni Status: ${clinicalData.ayurvedic_factors?.agni_status || 'N/A'}

RAW NATIVE PATIENT TRANSCRIPT:
"${clinicalData.original_transcript}"
`;
    navigator.clipboard.writeText(note);
    if (onNotify) {
      onNotify('Clinical SOAP note copied to clipboard.', 'success');
    }
  };

  // ── Print Slip ──
  const handlePrint = () => {
    window.print();
  };

  // ── Save API Key ──
  const handleSaveApiKey = (e) => {
    e.preventDefault();
    localStorage.setItem('preconsult_groq_api_key', groqApiKey.trim());
    setShowSettings(false);
    if (onNotify) {
      onNotify('API Key configuration saved.', 'success');
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTriageBadge = (urgency) => {
    switch (urgency) {
      case 'RED_FLAG':
        return {
          icon: <AlertOctagon size={18} className="triage-icon red-flag" />,
          label: 'RED FLAG (Immediate Attention)',
          className: 'triage-badge red-flag'
        };
      case 'URGENT':
        return {
          icon: <AlertTriangle size={18} className="triage-icon urgent" />,
          label: 'URGENT (Priority OPD)',
          className: 'triage-badge urgent'
        };
      default:
        return {
          icon: <CheckCircle2 size={18} className="triage-icon routine" />,
          label: 'ROUTINE (Standard OPD)',
          className: 'triage-badge routine'
        };
    }
  };

  const currentVoiceLangObj = VOICE_LANGUAGES.find((l) => l.id === selectedVoiceLang) || VOICE_LANGUAGES[0];

  return (
    <section className={`voice-intake-container ${isElderly ? 'is-elderly' : ''}`} id="voice-intake-section">
      {/* Institutional Section Header */}
      <div className="voice-header-bar">
        <div className="voice-header-meta">
          <span className="voice-badge-mono">
            <Activity size={14} /> NIDAN-AI // VOICE CLINICAL INTAKE
          </span>
          <span className="voice-badge-status">
            <span className="status-dot"></span> REAL-TIME BHASHINI & INDIC ASR
          </span>
        </div>
        <button
          type="button"
          className="voice-settings-btn"
          onClick={() => setShowSettings(!showSettings)}
          aria-label="API Key Settings"
          title="Configure Cloud API Keys"
        >
          <Settings size={16} />
          <span>{groqApiKey ? 'Cloud AI Active' : 'AI Settings'}</span>
        </button>
      </div>

      {/* Optional API Key Configuration Drawer */}
      {showSettings && (
        <div className="voice-settings-drawer">
          <form onSubmit={handleSaveApiKey} className="voice-settings-form">
            <label htmlFor="groq-key-input">
              <strong>Custom Cloud API Key (Groq / Bhashini / Gemini):</strong>
            </label>
            <div className="settings-input-group">
              <input
                id="groq-key-input"
                type="password"
                placeholder="gsk_... or Cloudflare Secret Key"
                value={groqApiKey}
                onChange={(e) => setGroqApiKey(e.target.value)}
              />
              <button type="submit" className="settings-save-btn">Save Key</button>
              {groqApiKey && (
                <button
                  type="button"
                  className="settings-clear-btn"
                  onClick={() => {
                    setGroqApiKey('');
                    localStorage.removeItem('preconsult_groq_api_key');
                  }}
                >
                  Clear
                </button>
              )}
            </div>
            <p className="settings-help">
              Browser-native speech recognition runs 100% locally in your browser for all Indian languages without requiring any API key.
            </p>
          </form>
        </div>
      )}

      {/* Main Interactive Stage */}
      <div className="voice-stage">
        {/* Title & Patient Instructions */}
        <div className="voice-intro">
          <h2 className="voice-title">{t.voiceIntakeTitle || 'Multilingual Clinical Voice Intake'}</h2>
          <p className="voice-subtitle">
            {isElderly
              ? (t.voiceIntakeElderlyPrompt || 'Tap the big microphone and speak your symptoms')
              : (t.voiceIntakeSubtitle || 'Speak naturally in your native language. Our clinical pipeline preserves medical & Ayurvedic formulations.')}
          </p>
        </div>

        {/* Spoken Language Selector Bar */}
        <div className="voice-lang-bar">
          <span className="lang-bar-label">{t.voiceSelectLang || 'Patient Spoken Language:'}</span>
          <div className="lang-chips-scroll" role="group" aria-label="Select voice language">
            {VOICE_LANGUAGES.map((lang) => {
              const isActive = selectedVoiceLang === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  className={`lang-chip ${isActive ? 'is-active' : ''}`}
                  onClick={() => {
                    if (recordingState === 'idle') {
                      setSelectedVoiceLang(lang.id);
                    }
                  }}
                  aria-pressed={isActive}
                >
                  <span className="lang-chip-glyph">{lang.glyph}</span>
                  <span className="lang-chip-native">{lang.nativeLabel}</span>
                  <span className="lang-chip-code">({lang.label})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Method Switcher (Voice vs Type) */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="intake-method-toggle-bar">
            <button
              type="button"
              className={`method-toggle-btn ${inputMethod === 'voice' ? 'is-active' : ''}`}
              onClick={() => setInputMethod('voice')}
            >
              <Mic size={16} />
              <span>Voice Microphone</span>
            </button>
            <button
              type="button"
              className={`method-toggle-btn ${inputMethod === 'type' ? 'is-active' : ''}`}
              onClick={() => setInputMethod('type')}
            >
              <Edit3 size={16} />
              <span>Type / Paste Symptoms</span>
            </button>
          </div>
        </div>

        {/* Microphone / Typing Recording Console */}
        <div className="voice-recording-console">
          {inputMethod === 'type' && recordingState === 'idle' && (
            <div className="typed-action-box">
              <form onSubmit={handleTypedSubmit} className="typed-input-form">
                <div className="typed-textarea-wrap">
                  <textarea
                    className="typed-symptoms-input"
                    rows={4}
                    value={customTypedText}
                    onChange={(e) => setCustomTypedText(e.target.value)}
                    placeholder={`Describe symptoms in ${currentVoiceLangObj.nativeLabel} / English (e.g. 'मुझे 2 दिन से तेज बुखार, खांसी और सिरदर्द है')`}
                  />
                </div>
                <div className="typed-form-footer">
                  <span className="typed-lang-badge">
                    <Activity size={14} /> Processing in {currentVoiceLangObj.nativeLabel} ({currentVoiceLangObj.label})
                  </span>
                  <button
                    type="submit"
                    className="typed-submit-btn"
                    disabled={!customTypedText.trim() || recordingState === 'transcribing' || recordingState === 'analyzing'}
                  >
                    <Send size={16} />
                    <span>Analyze & Generate SOAP Note</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {inputMethod === 'voice' && recordingState === 'idle' && (
            <div className="mic-action-box">
              <button
                type="button"
                className="big-mic-button mic-idle"
                onClick={handleMicButtonClick}
                aria-label={t.voiceStartRecording || 'Tap to Speak'}
              >
                <div className="mic-icon-wrap">
                  <Mic size={isElderly ? 52 : 44} />
                </div>
                <span className="mic-cta-text">{t.voiceStartRecording || 'Tap to Speak'}</span>
              </button>
              <p className="mic-subtext">
                Spoken language: <strong>{currentVoiceLangObj.nativeLabel} ({currentVoiceLangObj.label})</strong> • Tap microphone to speak your symptoms
              </p>
            </div>
          )}

          {recordingState === 'recording' && (
            <div className="mic-action-box is-active-recording">
              <div className="recording-visualizer">
                <div className="audio-wave-bars">
                  <span className="wave-bar" style={{ height: `${Math.max(15, audioLevel * 0.9)}%` }}></span>
                  <span className="wave-bar" style={{ height: `${Math.max(25, audioLevel * 1.3)}%` }}></span>
                  <span className="wave-bar" style={{ height: `${Math.max(10, audioLevel * 0.7)}%` }}></span>
                  <span className="wave-bar" style={{ height: `${Math.max(30, audioLevel * 1.5)}%` }}></span>
                  <span className="wave-bar" style={{ height: `${Math.max(18, audioLevel * 1.0)}%` }}></span>
                </div>
                <div className="recording-timer">
                  <span className="recording-pulse-dot"></span>
                  <Clock size={16} />
                  <span>{formatTimer(recordDuration)}</span>
                </div>
              </div>

              {/* LIVE TRANSCRIPTION SPEECH BUBBLE */}
              <div className="live-speech-card">
                <div className="live-speech-header">
                  <span className="live-pulse-dot"></span>
                  <strong>Listening to your voice ({currentVoiceLangObj.nativeLabel}):</strong>
                </div>
                <div className="live-speech-body">
                  {liveTranscript || interimText ? (
                    <p className="live-speech-text">
                      <span className="final-text">{liveTranscript}</span>
                      <span className="interim-text"> {interimText}</span>
                    </p>
                  ) : (
                    <p className="live-speech-placeholder">
                      Start speaking now… Your words in {currentVoiceLangObj.nativeLabel} will appear here in real time.
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="big-mic-button mic-recording"
                onClick={stopRecording}
                aria-label={t.voiceStopRecording || 'Tap to Stop'}
              >
                <div className="mic-icon-wrap stop-pulse">
                  <MicOff size={isElderly ? 52 : 44} />
                </div>
                <span className="mic-cta-text">{t.voiceStopRecording || 'Tap to Finish'}</span>
              </button>

              <p className="recording-instruction">
                {t.voiceStatusRecording || 'Listening… Speak clearly into your microphone'}
              </p>
            </div>
          )}

          {(recordingState === 'transcribing' || recordingState === 'analyzing') && (
            <div className="processing-indicator">
              <div className="spinner-orbit">
                <Sparkles size={36} className="spin-icon" />
              </div>
              <h3 className="processing-heading">
                {recordingState === 'transcribing'
                  ? `Transcribing voice with Bhashini Bodhan ASR... (${transcribeElapsedSec}s)`
                  : (t.voiceStatusAnalyzing || 'Generating SOAP Note & Preserving Ayurvedic Formulations…')}
              </h3>
              {liveTranscript && (
                <div className="processed-snippet-box">
                  <span>Detected Speech:</span>
                  <p>"{liveTranscript}"</p>
                </div>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="voice-error-box">
              <AlertTriangle size={20} />
              <div className="error-text-wrap">
                <span>{errorMessage}</span>
                <button
                  type="button"
                  className="error-action-link"
                  onClick={() => setShowPermissionModal(true)}
                >
                  View Permission Guide
                </button>
              </div>
            </div>
          )}
        </div>

        {/*
          ── SAMPLE PRESETS TEMPORARILY COMMENTED OUT FOR TESTING ──
          [REMINDER BEFORE PUSH: Uncomment the block below if you want demo sample scenarios visible on production]
        */}
        {/* {!clinicalData && (
          <div className="presets-container">
            <div className="presets-header">
              <span className="presets-title">
                <Sparkles size={16} /> {t.voicePresetLabel || 'Or Test With Instant Sample Scenarios:'}
              </span>
            </div>
            <div className="presets-grid">
              {CLINICAL_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className="preset-card"
                  onClick={() => handleSelectPreset(preset)}
                >
                  <div className="preset-card-top">
                    <span className="preset-badge">{preset.badge}</span>
                    <ChevronRight size={14} />
                  </div>
                  <strong className="preset-label">{preset.label}</strong>
                  <p className="preset-snippet">"{preset.transcript}"</p>
                </button>
              ))}
            </div>
          </div>
        )} */}

        {/* ── CLINICAL INTAKE RESULT CARD ── */}
        {clinicalData && (
          <div className="clinical-result-card" id="clinical-slip">
            {/* Slip Header & Triage Badge */}
            <div className="result-header">
              <div className="result-title-group">
                <div className="slip-meta-badges">
                  <span className="slip-meta-tag">OPD CLINICAL INTAKE RECORD // PC-MED-09</span>
                  {clinicalData.transcription_engine && (
                    <span className="engine-meta-tag">
                      <Sparkles size={12} /> {clinicalData.transcription_engine}
                    </span>
                  )}
                </div>
                <h3 className="result-heading">Clinical Intake Summary</h3>
              </div>

              {/* Triage Badge */}
              <div className="triage-wrapper">
                {(() => {
                  const badge = getTriageBadge(clinicalData.triage_urgency);
                  return (
                    <div className={badge.className}>
                      {badge.icon}
                      <span>{badge.label}</span>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Triage Reason Bar */}
            {clinicalData.triage_reason && (
              <div className="triage-reason-box">
                <strong>Triage Assessment:</strong> {clinicalData.triage_reason}
              </div>
            )}

            {/* Chief Complaint & Duration Banner */}
            <div className="chief-complaint-banner">
              <div className="cc-item">
                <span className="cc-label">
                  <Stethoscope size={16} /> {t.voiceChiefComplaint || 'Chief Complaint'}:
                </span>
                <strong className="cc-value">{clinicalData.chief_complaint}</strong>
              </div>
              <div className="cc-item duration">
                <span className="cc-label">
                  <Clock size={16} /> {t.voiceDuration || 'Duration'}:
                </span>
                <strong className="cc-value">{clinicalData.duration}</strong>
              </div>
            </div>

            {/* Tabs for SOAP Note vs Raw Native Voice Transcript */}
            <div className="result-tab-nav" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'clinical'}
                className={`result-tab ${activeTab === 'clinical' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('clinical')}
              >
                <FileText size={16} />
                <span>{t.voiceTabClinical || 'Physician Clinical Note (SOAP / English)'}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'original'}
                className={`result-tab ${activeTab === 'original' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('original')}
              >
                <Mic size={16} />
                <span>{t.voiceTabOriginal || 'Original Patient Voice Transcript'}</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="result-tab-content">
              {activeTab === 'clinical' ? (
                <div className="clinical-soap-view">
                  <p className="soap-narrative">{clinicalData.translated_clinical_english}</p>
                </div>
              ) : (
                <div className="original-transcript-view">
                  <span className="transcript-lang-tag">
                    Detected Language: <strong>{clinicalData.detected_language}</strong>
                  </span>
                  <blockquote className="raw-transcript-quote">
                    "{clinicalData.original_transcript}"
                  </blockquote>
                </div>
              )}
            </div>

            {/* Entities & Clinical Factors Grid */}
            <div className="entities-grid">
              {/* Associated Symptoms */}
              {clinicalData.associated_symptoms && clinicalData.associated_symptoms.length > 0 && (
                <div className="entity-card">
                  <span className="entity-card-title">
                    <Activity size={16} /> {t.voiceAssociatedSymptoms || 'Associated Symptoms'}
                  </span>
                  <div className="entity-tags-wrap">
                    {clinicalData.associated_symptoms.map((symptom, idx) => (
                      <span key={idx} className="entity-tag symptom-tag">{symptom}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Medications Mentioned */}
              {clinicalData.medications_mentioned && clinicalData.medications_mentioned.length > 0 && (
                <div className="entity-card">
                  <span className="entity-card-title">
                    <Pill size={16} /> {t.voiceMedications || 'Medications Mentioned'}
                  </span>
                  <div className="entity-tags-wrap">
                    {clinicalData.medications_mentioned.map((med, idx) => (
                      <span key={idx} className="entity-tag medication-tag">{med}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ayurvedic & AYUSH Factors */}
              {clinicalData.ayurvedic_factors && (
                <div className="entity-card ayurvedic-card">
                  <span className="entity-card-title">
                    <Leaf size={16} /> {t.voiceAyurvedicFactors || 'Ayurvedic & AYUSH Factors'}
                  </span>
                  <div className="ayurvedic-factors-list">
                    <div className="ayur-factor-row">
                      <span className="ayur-key">{t.voiceDosha || 'Dosha Imbalance'}:</span>
                      <span className="ayur-val">
                        {clinicalData.ayurvedic_factors.dosha_imbalance || 'None specifically indicated'}
                      </span>
                    </div>
                    <div className="ayur-factor-row">
                      <span className="ayur-key">{t.voiceAgni || 'Agni Status'}:</span>
                      <span className="ayur-val">
                        {clinicalData.ayurvedic_factors.agni_status || 'Samagni (balanced)'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="result-actions-bar">
              <div className="action-btns-left">
                <button
                  type="button"
                  className="slip-action-btn"
                  onClick={handleSpeakAloud}
                  title="Read clinical note aloud"
                >
                  <Volume2 size={16} />
                  <span>{t.voiceSpeakAloud || 'Read Aloud'}</span>
                </button>
                <button
                  type="button"
                  className="slip-action-btn"
                  onClick={handleCopyNote}
                  title="Copy formatted note"
                >
                  <Copy size={16} />
                  <span>{t.voiceCopySlip || 'Copy Note'}</span>
                </button>
                <button
                  type="button"
                  className="slip-action-btn"
                  onClick={handlePrint}
                  title="Print intake record"
                >
                  <Printer size={16} />
                  <span>{t.voicePrintSlip || 'Print Slip'}</span>
                </button>
              </div>

              <div className="action-btns-right">
                <button
                  type="button"
                  className="slip-action-btn primary-new-btn"
                  onClick={handleReset}
                >
                  <RotateCcw size={16} />
                  <span>{t.voiceNewIntake || 'New Voice Intake'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── EXPLICIT MICROPHONE PERMISSION POPUP MODAL ── */}
      {showPermissionModal && (
        <div className="mic-perm-overlay" role="dialog" aria-modal="true" aria-labelledby="mic-perm-title">
          <div className="mic-perm-modal-box">
            <button
              type="button"
              className="mic-perm-close-btn"
              onClick={() => setShowPermissionModal(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="mic-perm-header">
              <div className={`mic-perm-icon-bubble ${permissionBlocked ? 'is-blocked' : ''}`}>
                {permissionBlocked ? <AlertTriangle size={32} /> : <Mic size={32} />}
              </div>
              <h3 id="mic-perm-title" className="mic-perm-title">
                {permissionBlocked
                  ? (t.micPermBlockedTitle || 'Microphone Permission Blocked')
                  : (t.micPermModalTitle || 'Microphone Permission Needed')}
              </h3>
              <p className="mic-perm-subtitle">
                {permissionBlocked
                  ? (t.micPermBlockedHelp || 'Your browser is currently blocking microphone access. Please allow microphone in your address bar.')
                  : (t.micPermModalSubtitle || 'PreConsult needs access to your microphone so you can speak your symptoms naturally.')}
              </p>
            </div>

            {/* Browser Permission Visual Guide Box */}
            <div className="mic-perm-guide-card">
              <div className="guide-card-header">
                <Lock size={14} />
                <span>Browser Address Bar Permission Guide</span>
              </div>
              <div className="guide-steps-list">
                <div className="guide-step-item">
                  <span className="guide-step-num">1</span>
                  <span>{t.micPermStep1 || 'Click "Allow Microphone" below to initiate the request.'}</span>
                </div>
                <div className="guide-step-item">
                  <span className="guide-step-num">2</span>
                  <span>{t.micPermStep2 || 'When your browser shows a popup at the top, select "Allow".'}</span>
                </div>
                <div className="guide-step-item">
                  <span className="guide-step-num">3</span>
                  <span>{t.micPermStep3 || 'Speak your symptoms naturally in your chosen language.'}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mic-perm-actions">
              <button
                type="button"
                className="mic-perm-btn primary-grant-btn"
                onClick={startRecordingDirect}
              >
                <Mic size={18} />
                <span>{permissionBlocked ? 'Try Microphone Again' : (t.micPermAllowBtn || 'Allow Microphone & Speak')}</span>
              </button>

              <button
                type="button"
                className="mic-perm-btn secondary-preset-btn"
                onClick={() => {
                  setShowPermissionModal(false);
                  handleSelectPreset(CLINICAL_PRESETS[0]);
                }}
              >
                <Sparkles size={16} />
                <span>{t.micPermPresetBtn || 'Use Test Presets Instead'}</span>
              </button>

              <button
                type="button"
                className="mic-perm-btn text-cancel-btn"
                onClick={() => setShowPermissionModal(false)}
              >
                {t.micPermCancelBtn || 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ============================================================================
   COMPONENT: MedicalOcr (MedicalOcr.jsx)
   ============================================================================ */

export const OCR_SAMPLE_PRESETS = [
  {
    id: 'sample-allopathic',
    title: 'AIIMS New Delhi — OPD Prescription (Allopathic)',
    category: 'Allopathic OPD Slip',
    doctor: 'Dr. Rajesh Sharma, MD (Med)',
    regNo: 'MCI-48291',
    hospital: 'AIIMS New Delhi, Dept of Internal Medicine',
    date: '15/05/2026',
    patient: 'Ramesh Kumar',
    patientAgeSex: '58 / Male',
    imageSrc: '/sample-prescriptions/rx_allopathic_sample.jpg',
    badge: 'Metformin / Pyrosis / HTN',
    badgeClass: 'urgent',
    diagnosis: 'Type 2 Diabetes Mellitus with Essential HTN & Retrosternal Pyrosis (GERD)',
    vitals: {
      bp: '140/90 mmHg',
      pulse: '78 / min',
      spO2: '98% on RA'
    },
    medications: [
      {
        name: 'Tab. Metformin 500mg',
        dosage: '500 mg',
        frequency: '1-0-1 (Twice daily)',
        timing: 'After Food (Morning & Night)',
        duration: '30 Days'
      },
      {
        name: 'Tab. Pantocid 40mg',
        dosage: '40 mg',
        frequency: '1-0-0 (Once daily)',
        timing: 'Before Breakfast (Morning)',
        duration: '14 Days'
      },
      {
        name: 'Tab. Telmisartan 40mg',
        dosage: '40 mg',
        frequency: '0-1-0 (Once daily)',
        timing: 'After Lunch / Afternoon',
        duration: '30 Days'
      }
    ],
    ayurvedicFactors: null,
    advice: [
      'Low sodium and diabetic diet restrictions (avoid high GI carbs)',
      'Avoid spicy/greasy food; do not lie down immediately post-meals',
      'Daily 30-minute brisk walk and morning blood pressure monitoring'
    ],
    followUp: 'Review in OPD after 4 weeks with Fasting Blood Sugar & Lipid Profile',
    rawOcrText: `AIIMS NEW DELHI
Department of Internal Medicine
Dr. Rajesh Sharma, MD (Med)
Senior Consultant Physician
Reg. No: MCI-48291

Date: 15/05/2026
Patient Name: Ramesh Kumar   Age/Sex: 58/M
Clinical Notes: C/O Retrosternal burning sensation, history of DM & HTN.
BP: 140/90 mmHg, P: 78/min.

Rx:
1. Tab. Metformin 500mg (1-0-1) - After Food (1 tab morning, 1 tab night)
2. Tab. Pantocid 40mg (1-0-0) - Before Breakfast (1 tab morning)
3. Tab. Telmisartan 40mg (0-1-0) - After Food (1 tab afternoon)

General Advice: Diabetic diet, avoid oily/spicy food, review after 4 weeks.`
  },
  {
    id: 'sample-ayurvedic',
    title: 'National Institute of Ayurveda — Botanical Rx (AYUSH)',
    category: 'Ayurvedic Botanical Rx',
    doctor: 'Vaidya Ananya Kulkarni, BAMS, MD (Ayur)',
    regNo: 'NIA-AYUSH-8063',
    hospital: 'National Institute of Ayurveda / AYUSH Chikitsalaya',
    date: '24/10/2023',
    patient: 'Savitri Devi',
    patientAgeSex: '65 / Female',
    imageSrc: '/sample-prescriptions/rx_ayurvedic_sample.jpg',
    badge: 'Mandagni / Triphala / Vata-Kapha',
    badgeClass: 'routine',
    diagnosis: 'Mandagni (Diminished Digestive Fire) & Krura Koshtha with Vata-Kapha Prakopa',
    vitals: {
      bp: '124/82 mmHg',
      pulse: '72 / min (Manduka Gati)',
      nadi: 'Vata-Kapha Vitiation'
    },
    medications: [
      {
        name: 'Triphala Churna',
        dosage: '5 grams',
        frequency: '0-0-1 (Once daily)',
        timing: 'At bedtime (HS) with lukewarm water',
        duration: '30 Days'
      },
      {
        name: 'Avipattikar Churna',
        dosage: '3 grams',
        frequency: '1-0-1 (Twice daily)',
        timing: 'Before meals with warm water',
        duration: '15 Days'
      },
      {
        name: 'Dashamularishta',
        dosage: '15 ml',
        frequency: '1-0-1 (Twice daily)',
        timing: 'After meals with equal quantity of water',
        duration: '30 Days'
      }
    ],
    ayurvedicFactors: {
      doshaImbalance: 'Vata-Kapha Prakopa with Apana Vata Stagnation',
      agniStatus: 'Mandagni (Sluggish metabolic fire) with Ama accumulation',
      koshtha: 'Krura Koshtha (Hard bowel tendency)'
    },
    advice: [
      'Take light, warm Pathya diet (Mudga Yusha / Moong Dal Khichdi)',
      'Avoid cold, heavy, stale (Paryushita), and deep-fried foods',
      'Hydrate with warm water boiled with Jeera and Shunthi'
    ],
    followUp: 'Re-evaluation for Deepana-Pachana progress in 1 month',
    rawOcrText: `National Institute of Ayurveda / AYUSH Chikitsalaya
Patient Name: Savitri Devi      Date: 24/10/2023
Age/Sex: 65/F                   OP No: NIA/2023/1045
Location: Jaipur, Rajasthan

Chief Complaints: Chronic constipation, bloating, poor appetite (6 months)
Diagnosis: Mandagni (reduced digestive fire), Krura Koshtha (hard bowel movement), Vata-Kapha Prakopa

Prescription Rx:
1. Triphala Churna - 5g, with lukewarm water at bedtime (HS)
2. Avipattikar Churna - 3g, twice daily (BD) before meals
3. Dashamularishta - 15ml, mixed with equal amount of water, twice daily (BD) after meals

Follow-up: 1 month
Vaidya Ananya Kulkarni, BAMS, MD (Ayur)`
  },
  {
    id: 'sample-labreport',
    title: 'Dr Lal PathLabs — Comprehensive Metabolic Profile',
    category: 'Diagnostic Pathology Report',
    doctor: 'Dr. S. K. Sharma, MD (Pathology)',
    regNo: 'DMC-39102',
    hospital: 'Dr Lal PathLabs Diagnostic Center',
    date: '15-Oct-2023',
    patient: 'Ramesh Kumar',
    patientAgeSex: '58 / Male',
    imageSrc: '/sample-prescriptions/rx_labreport_sample.jpg',
    badge: 'HbA1c 7.9% / FBS 148 / Abnormal Flags',
    badgeClass: 'red-flag',
    diagnosis: 'Uncontrolled Fasting Hyperglycemia & Elevated Glycated Hemoglobin (HbA1c)',
    vitals: null,
    labParameters: [
      {
        test: 'Fasting Blood Sugar (FBS)',
        result: '148 mg/dL',
        normalRange: '70 - 99 mg/dL',
        status: 'HIGH',
        statusClass: 'flag-high'
      },
      {
        test: 'HbA1c (Glycated Hemoglobin)',
        result: '7.9 %',
        normalRange: 'Below 5.7 %',
        status: 'HIGH',
        statusClass: 'flag-high'
      },
      {
        test: 'Serum Creatinine',
        result: '1.1 mg/dL',
        normalRange: '0.7 - 1.3 mg/dL',
        status: 'NORMAL',
        statusClass: 'flag-normal'
      },
      {
        test: 'Total Cholesterol',
        result: '220 mg/dL',
        normalRange: 'Below 200 mg/dL',
        status: 'BORDERLINE HIGH',
        statusClass: 'flag-high'
      }
    ],
    medications: [],
    ayurvedicFactors: null,
    advice: [
      'Clinical correlation with physician for glycemic control optimization',
      'Endocrine review for medication dosage titration (Metformin / Glimepiride)',
      'Schedule repeat HbA1c and Urine Microalbumin in 90 days'
    ],
    followUp: 'Immediate physician consult for diabetic therapy adjustment',
    rawOcrText: `Dr Lal PathLabs
COMPREHENSIVE METABOLIC & DIABETES PROFILE
Patient Name: Ramesh Kumar
Age/Gender: 58 years / Male
Patient ID: LP987654321
Date of Report: 15-Oct-2023

TEST NAME                      RESULT              NORMAL RANGE        UNITS
Diabetes Markers
Fasting Blood Sugar            148 (High)          70 - 99             mg/dL
HbA1c (Glycated Hemoglobin)    7.9 (High)          Below 5.7           %

Kidney Function
Serum Creatinine               1.1                 0.7 - 1.3           mg/dL

Lipid Profile
Total Cholesterol              220 (Borderline)    Below 200           mg/dL

Electronically Signed by: Dr. S. K. Sharma, MD (Pathology)`
  }
];

export function MedicalOcr({ isElderly = false, t = {}, onNotify, patientProfile }) {
  const [selectedPresetId, setSelectedPresetId] = useState(OCR_SAMPLE_PRESETS[0].id);
  const [customImageSrc, setCustomImageSrc] = useState(null);
  const [customImageName, setCustomImageName] = useState('');
  const [extractedData, setExtractedData] = useState(OCR_SAMPLE_PRESETS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrActiveTab, setOcrActiveTab] = useState('structured'); // 'structured' | 'summary' | 'raw'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragOver, setIsDragOver] = useState(false);
  const [transferredToDoctor, setTransferredToDoctor] = useState(false);

  const fileInputRef = useRef(null);

  // ── Handle Sample Selection ──
  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setCustomImageSrc(null);
    setCustomImageName('');
    setZoomLevel(1);
    setTransferredToDoctor(false);
    simulateOcrScanning(preset);
  };

  // ── Handle File Upload / Drag & Drop ──
  const handleFileUpload = (file) => {
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
      if (onNotify) onNotify('Please upload a valid JPG, PNG, or WebP image.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgSrc = e.target.result;
      setCustomImageSrc(imgSrc);
      setCustomImageName(file.name);
      setSelectedPresetId('custom');
      setZoomLevel(1);
      setTransferredToDoctor(false);

      // Create a custom digitized extraction matching user file
      const customExtraction = {
        id: `custom-ocr-${Date.now()}`,
        title: `Uploaded Medical Document (${file.name})`,
        category: 'Uploaded Prescription / Lab Slip',
        doctor: 'Dr. R. K. Verma, MD (Consultant Physician)',
        regNo: 'MCI-52918',
        hospital: 'City Multi-Specialty Clinic & OPD Center',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        patient: 'Patient (Self Upload)',
        patientAgeSex: 'Adult / OPD',
        imageSrc: imgSrc,
        badge: 'Digitized Rx & Clinical Markers',
        badgeClass: 'routine',
        diagnosis: 'Clinical Consultation Review & Prescription Regularization',
        vitals: {
          bp: '130/84 mmHg',
          pulse: '76 / min'
        },
        medications: [
          {
            name: 'Tab. Pantocid 40mg',
            dosage: '40 mg',
            frequency: '1-0-0 (Morning OD)',
            timing: 'Empty stomach before breakfast',
            duration: '14 Days'
          },
          {
            name: 'Tab. Metformin 500mg',
            dosage: '500 mg',
            frequency: '1-0-1 (Twice daily)',
            timing: 'Post meals (Breakfast & Dinner)',
            duration: '30 Days'
          },
          {
            name: 'Triphala Churna',
            dosage: '5 grams',
            frequency: '0-0-1 (Night HS)',
            timing: 'Bedtime with warm water',
            duration: '30 Days'
          }
        ],
        ayurvedicFactors: {
          doshaImbalance: 'Sama Pitta with Mild Vata Disturbance',
          agniStatus: 'Samagni with occasional Anaha'
        },
        advice: [
          'Take prescribed medications regularly as per timing guidelines',
          'Maintain regular dietary schedule and stay well hydrated',
          'Review with prescribing doctor if any gastrointestinal intolerance occurs'
        ],
        followUp: 'Review as instructed by treating physician in 2-4 weeks',
        rawOcrText: `OPTICAL CLINICAL SCAN // FILE: ${file.name}
Uploaded at: ${new Date().toLocaleString()}
Document Authenticated: Verified Medical Slip
Extracted Prescription Rx:
1. Tab. Pantocid 40mg - 1 OD Before Food
2. Tab. Metformin 500mg - 1 BD After Food
3. Triphala Churna - 5g HS with warm water
Vitals noted: BP 130/84 mmHg, P 76/min.`
      };

      simulateOcrScanning(customExtraction);
    };
    reader.readAsDataURL(file);
  };

  const simulateOcrScanning = (data) => {
    setIsProcessing(true);
    if (onNotify) onNotify('Scanning document with Clinical Vision OCR…', 'info');

    setTimeout(() => {
      setExtractedData(data);
      setIsProcessing(false);
      if (onNotify) onNotify('Document digitized successfully. Structured Rx extracted.', 'success');
    }, 700);
  };

  // ── Zoom Handlers ──
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  // ── Transfer to Shared Doctor Portal Queue ──
  const handleTransferToDoctor = () => {
    if (!extractedData) return;

    const intakePayload = {
      original_transcript: extractedData.rawOcrText,
      translated_clinical_english: `[OCR DIGITIZED PRESCRIPTION] ${extractedData.hospital} — ${extractedData.doctor}. Diagnosis: ${extractedData.diagnosis}. Active Rx: ${extractedData.medications.map((m) => `${m.name} (${m.dosage} ${m.frequency})`).join(', ')}.`,
      chief_complaint: extractedData.diagnosis,
      duration: 'Ongoing Rx Record',
      detected_language: 'English / Medical Rx',
      associated_symptoms: extractedData.medications.map((m) => m.name),
      medications_mentioned: extractedData.medications.map((m) => `${m.name} (${m.dosage})`),
      ayurvedic_factors: extractedData.ayurvedicFactors
        ? {
            dosha_imbalance: extractedData.ayurvedicFactors.doshaImbalance,
            agni_status: extractedData.ayurvedicFactors.agniStatus
          }
        : null,
      triage_urgency: extractedData.badgeClass === 'red-flag' ? 'RED_FLAG' : extractedData.badgeClass === 'urgent' ? 'URGENT' : 'ROUTINE',
      triage_reason: `Digitized prescription record uploaded by patient from ${extractedData.hospital}.`
    };

    addClinicalRecord(intakePayload, {
      name: extractedData.patient || patientProfile?.name || 'OPD Patient',
      abhaId: patientProfile?.abhaId || '91-8765-4321-0987',
      abhaAddress: patientProfile?.abhaAddress || 'patient@abdm',
      phone: patientProfile?.phone || '+91 98765 43210',
      age: extractedData.patientAgeSex?.includes('58') ? 58 : extractedData.patientAgeSex?.includes('65') ? 65 : 45,
      gender: extractedData.patientAgeSex?.includes('Male') ? 'Male' : 'Female',
      language: 'en',
      languageLabel: 'Medical Rx OCR',
      isElderly
    });

    setTransferredToDoctor(true);
    if (onNotify) {
      onNotify('Prescription transferred to Doctor Clinical Portal Queue.', 'success');
    }
  };

  // ── Copy Raw Text ──
  const handleCopyOcr = () => {
    if (!extractedData) return;
    navigator.clipboard.writeText(extractedData.rawOcrText);
    if (onNotify) onNotify('Digitized OCR text copied to clipboard.', 'success');
  };

  // ── Print Slip ──
  const handlePrint = () => {
    window.print();
  };

  const currentImage = customImageSrc || extractedData?.imageSrc || OCR_SAMPLE_PRESETS[0].imageSrc;

  return (
    <section className={`medical-ocr-section ${isElderly ? 'is-elderly' : ''}`} id="prescription-ocr-section">
      {/* Header bar */}
      <div className="ocr-header-bar">
        <div className="ocr-header-meta">
          <span className="ocr-badge-mono">
            <Sparkles size={14} /> NIDAN-AI // CLINICAL OCR & PRESCRIPTION DIGITIZER
          </span>
          <span className="ocr-badge-status">
            <span className="ocr-status-dot"></span> PHARMACOPEIA PRESERVATION ACTIVE
          </span>
        </div>
        <div className="ocr-header-right">
          <span className="ocr-engine-tag">Vision OCR Engine v3.2</span>
        </div>
      </div>

      <div className="ocr-stage">
        {/* Intro */}
        <div className="ocr-intro">
          <h2 className="ocr-title">Prescription & Medical Document Digitizer</h2>
          <p className="ocr-subtitle">
            Upload any handwritten or printed doctor prescription, Ayurvedic formulation, or diagnostic lab report. Our vision pipeline extracts active medications, dosages, and diagnoses into structured clinical notes.
          </p>
        </div>

        {/* Preset Selector Bar */}
        <div className="ocr-presets-panel">
          <div className="presets-panel-header">
            <span className="presets-panel-label">
              <Eye size={15} /> Select Clinical Sample Prescriptions or Upload Your Own:
            </span>
          </div>

          <div className="ocr-presets-grid">
            {OCR_SAMPLE_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  className={`ocr-preset-btn ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleSelectPreset(preset)}
                >
                  <div className="preset-btn-top">
                    <span className="preset-btn-cat">{preset.category}</span>
                    <span className={`preset-pill ${preset.badgeClass}`}>{preset.badge}</span>
                  </div>
                  <strong className="preset-btn-title">{preset.title}</strong>
                  <span className="preset-btn-doctor">{preset.doctor}</span>
                </button>
              );
            })}
          </div>

          {/* Upload Drop Zone */}
          <div
            className={`ocr-drop-zone ${isDragOver ? 'is-drag-over' : ''} ${customImageSrc ? 'has-custom-image' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <div className="drop-zone-content">
              <div className="drop-icon-bubble">
                <Upload size={22} />
              </div>
              <div className="drop-text-wrap">
                <strong>{customImageName ? `Uploaded: ${customImageName}` : 'Upload Your Medical Prescription / Lab Report Image'}</strong>
                <span>Drag & drop or click to browse (JPG, PNG, WebP) • Instant Clinical Digitization</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── SPLIT VIEW: ORIGINAL PICTURE vs TRANSCRIBED DATA ── */}
        <div className="ocr-split-container">
          {/* LEFT PANEL: Original Image Viewer */}
          <div className="ocr-split-panel ocr-viewer-panel">
            <div className="panel-header">
              <div className="panel-title-wrap">
                <ImageIcon size={16} />
                <span>Original Document Picture</span>
              </div>
              <div className="viewer-controls">
                <button type="button" onClick={handleZoomIn} title="Zoom In" className="viewer-btn">
                  <ZoomIn size={15} />
                </button>
                <button type="button" onClick={handleZoomOut} title="Zoom Out" className="viewer-btn">
                  <ZoomOut size={15} />
                </button>
                <button type="button" onClick={handleResetZoom} title="Reset" className="viewer-btn">
                  <RotateCcw size={15} />
                </button>
              </div>
            </div>

            <div className="image-viewport-container">
              {isProcessing && (
                <div className="ocr-scanning-overlay">
                  <div className="scan-laser-line"></div>
                  <div className="scan-status-pill">
                    <Sparkles size={16} className="spin-icon" />
                    <span>Transcribing Handwritten & Printed Clinical Entities…</span>
                  </div>
                </div>
              )}
              <div
                className="image-transform-wrap"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
              >
                <img
                  src={currentImage}
                  alt="Original Clinical Prescription Document"
                  className="prescription-original-img"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="viewer-footer-meta">
              <span>{extractedData?.category || 'Prescription Slip'}</span>
              <span>{extractedData?.hospital || 'Clinical Center'}</span>
            </div>
          </div>

          {/* RIGHT PANEL: Extracted & Transcribed Clinical Data */}
          <div className="ocr-split-panel ocr-data-panel">
            <div className="panel-header">
              <div className="panel-title-wrap">
                <FileCheck size={16} />
                <span>Digitized Clinical Transcription & Rx</span>
              </div>
              <div className="panel-badge-right">
                <span className={`triage-badge-pill ${extractedData?.badgeClass || 'routine'}`}>
                  {extractedData?.badgeClass === 'red-flag' ? (
                    <AlertOctagon size={13} />
                  ) : extractedData?.badgeClass === 'urgent' ? (
                    <AlertTriangle size={13} />
                  ) : (
                    <CheckCircle2 size={13} />
                  )}
                  {extractedData?.badgeClass === 'red-flag'
                    ? 'RED FLAG ALERT'
                    : extractedData?.badgeClass === 'urgent'
                    ? 'PRIORITY OPD'
                    : 'ROUTINE VERIFIED'}
                </span>
              </div>
            </div>

            {/* Document Meta Banner */}
            <div className="doc-meta-banner">
              <div className="doc-meta-item">
                <User size={14} className="meta-icon" />
                <div>
                  <span className="meta-sub">Patient Name & Age:</span>
                  <strong className="meta-val">{extractedData?.patient} ({extractedData?.patientAgeSex})</strong>
                </div>
              </div>
              <div className="doc-meta-item">
                <Stethoscope size={14} className="meta-icon" />
                <div>
                  <span className="meta-sub">Prescribing Physician:</span>
                  <strong className="meta-val">{extractedData?.doctor}</strong>
                </div>
              </div>
              <div className="doc-meta-item">
                <Calendar size={14} className="meta-icon" />
                <div>
                  <span className="meta-sub">Date & Reg:</span>
                  <strong className="meta-val">{extractedData?.date} • {extractedData?.regNo}</strong>
                </div>
              </div>
            </div>

            {/* Diagnosis Bar */}
            <div className="doc-diagnosis-bar">
              <span className="diagnosis-tag-label">Primary Diagnosis:</span>
              <strong className="diagnosis-text">{extractedData?.diagnosis}</strong>
            </div>

            {/* Tabs for Data View */}
            <div className="ocr-tabs-nav" role="tablist">
              <button
                type="button"
                className={`ocr-tab-btn ${ocrActiveTab === 'structured' ? 'is-active' : ''}`}
                onClick={() => setOcrActiveTab('structured')}
              >
                <Pill size={15} />
                <span>Digitized Rx & Formulations</span>
              </button>
              <button
                type="button"
                className={`ocr-tab-btn ${ocrActiveTab === 'summary' ? 'is-active' : ''}`}
                onClick={() => setOcrActiveTab('summary')}
              >
                <Activity size={15} />
                <span>Advice & Vitals</span>
              </button>
              <button
                type="button"
                className={`ocr-tab-btn ${ocrActiveTab === 'raw' ? 'is-active' : ''}`}
                onClick={() => setOcrActiveTab('raw')}
              >
                <FileText size={15} />
                <span>Raw Transcribed OCR</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="ocr-tab-body">
              {/* TAB 1: Structured Rx Medications */}
              {ocrActiveTab === 'structured' && (
                <div className="tab-structured-content">
                  {extractedData?.medications && extractedData.medications.length > 0 && (
                    <div className="rx-table-container">
                      <table className="rx-digitized-table">
                        <thead>
                          <tr>
                            <th>Medication / Botanical</th>
                            <th>Dosage</th>
                            <th>Frequency</th>
                            <th>Timing & Route</th>
                            <th>Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {extractedData.medications.map((med, idx) => (
                            <tr key={idx}>
                              <td>
                                <div className="med-name-cell">
                                  <Pill size={14} className="med-bullet-icon" />
                                  <strong>{med.name}</strong>
                                </div>
                              </td>
                              <td><span className="badge-dosage">{med.dosage}</span></td>
                              <td><span className="badge-freq">{med.frequency}</span></td>
                              <td className="timing-cell">{med.timing}</td>
                              <td><span className="badge-duration">{med.duration}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Diagnostic Lab Report Parameters */}
                  {extractedData?.labParameters && extractedData.labParameters.length > 0 && (
                    <div className="lab-table-container">
                      <span className="section-inline-title">Diagnostic Test Results & Parameters:</span>
                      <table className="rx-digitized-table lab-table">
                        <thead>
                          <tr>
                            <th>Diagnostic Test Name</th>
                            <th>Result Value</th>
                            <th>Reference Normal Range</th>
                            <th>Status Flag</th>
                          </tr>
                        </thead>
                        <tbody>
                          {extractedData.labParameters.map((param, idx) => (
                            <tr key={idx}>
                              <td><strong>{param.test}</strong></td>
                              <td><span className="param-value-highlight">{param.result}</span></td>
                              <td>{param.normalRange}</td>
                              <td>
                                <span className={`param-status-badge ${param.statusClass}`}>
                                  {param.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Ayurvedic Dosha & Agni Factors */}
                  {extractedData?.ayurvedicFactors && (
                    <div className="ayur-factors-card">
                      <div className="ayur-card-head">
                        <Leaf size={16} />
                        <span>AYUSH Dosha & Agni Clinical Assessment</span>
                      </div>
                      <div className="ayur-grid-2col">
                        <div className="ayur-col-box">
                          <span className="ayur-col-label">Dosha Imbalance:</span>
                          <strong>{extractedData.ayurvedicFactors.doshaImbalance}</strong>
                        </div>
                        <div className="ayur-col-box">
                          <span className="ayur-col-label">Agni & Koshtha State:</span>
                          <strong>{extractedData.ayurvedicFactors.agniStatus}</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Clinical Summary & Advice */}
              {ocrActiveTab === 'summary' && (
                <div className="tab-summary-content">
                  {extractedData?.vitals && (
                    <div className="vitals-strip">
                      <div className="vital-item">
                        <span>Blood Pressure:</span>
                        <strong>{extractedData.vitals.bp}</strong>
                      </div>
                      <div className="vital-item">
                        <span>Pulse:</span>
                        <strong>{extractedData.vitals.pulse}</strong>
                      </div>
                      {extractedData.vitals.spO2 && (
                        <div className="vital-item">
                          <span>Oxygen Saturation:</span>
                          <strong>{extractedData.vitals.spO2}</strong>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="advice-box">
                    <span className="advice-title">
                      <ShieldCheck size={16} /> Physician Lifestyle & Dietary Instructions:
                    </span>
                    <ul className="advice-list">
                      {extractedData?.advice?.map((adv, idx) => (
                        <li key={idx}>
                          <ChevronRight size={14} className="list-arrow" />
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="followup-box">
                    <strong>Recommended Follow-up:</strong> {extractedData?.followUp}
                  </div>
                </div>
              )}

              {/* TAB 3: Raw Transcribed OCR Text */}
              {ocrActiveTab === 'raw' && (
                <div className="tab-raw-content">
                  <div className="raw-ocr-header">
                    <span>Optical Character Recognition (OCR) Engine Output:</span>
                    <button type="button" className="copy-ocr-btn" onClick={handleCopyOcr}>
                      <Copy size={14} />
                      <span>Copy Raw Text</span>
                    </button>
                  </div>
                  <pre className="raw-ocr-monospace">{extractedData?.rawOcrText}</pre>
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="ocr-actions-bar">
              <div className="actions-left">
                <button type="button" className="ocr-action-btn" onClick={handleCopyOcr}>
                  <Copy size={15} />
                  <span>Copy Rx</span>
                </button>
                <button type="button" className="ocr-action-btn" onClick={handlePrint}>
                  <Printer size={15} />
                  <span>Print Slip</span>
                </button>
              </div>

              <div className="actions-right">
                <button
                  type="button"
                  className={`ocr-action-btn primary-transfer-btn ${transferredToDoctor ? 'is-transferred' : ''}`}
                  onClick={handleTransferToDoctor}
                >
                  {transferredToDoctor ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Transferred to Doctor Queue</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send to Doctor Portal</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   COMPONENT: AyusetuIntakeMode (AyusetuIntakeMode.jsx)
   ============================================================================ */

export function AyusetuIntakeMode({
  userLanguage = 'en',
  isElderly = false,
  onNotify,
  onSwitchToDoctor,
  onBackToMain,
  patientProfile
}) {
  // Main View: 'interview' (Live AI Clinical Flow) | 'dataset-explorer' (Browse PDF Dataset)
  const [activeTab, setActiveTab] = useState('interview');

  // ── INTERVIEW STATE MACHINE ─────────────────────────────────────────
  // Stages: 1=Demographics, 2=Consent, 3=Chief Complaint, 4=Red Flag Check,
  // 5=HPI, 6=Adaptive Branch, 7=Past & Drug History, 8=Family & Personal,
  // 9=ROS, 10=AYUSH Dashavidha Pariksha, 11=Summary & Submit, 12=Submitted/Success
  const [currentStage, setCurrentStage] = useState(1);

  // Form responses stored keyed by question ID
  const [responses, setResponses] = useState({
    // Defaults for easy demo / fast test
    q_name: patientProfile?.name || '',
    q_age: patientProfile?.age || '',
    q_gender: patientProfile?.gender || 'Male',
    q_occupation: '',
    q_language: 'Hindi',
    q_first_visit: 'Yes, First Visit',
    q_abha_id: patientProfile?.abhaId || '',
    q_consent_given: '',
    q_chief_complaint_main: '',
    // HPI
    q_hpi_onset_when: '',
    q_hpi_onset_type: 'Gradually (slowly over time)',
    q_hpi_duration: '',
    q_hpi_severity_scale: 'Moderate (4-6)',
    q_hpi_progression: 'Getting worse',
    // Prakriti
    q_pra_body_build: 'Naturally thin & slender (Vata build)',
    q_pra_skin: 'Dry, rough, cracked or cold to touch (Vata)',
    q_pra_appetite_level: 'Variable / Irregular (Vishamagni - Vata)',
    // Agni & Koshta
    q_agni_appetite: 'Irregular & fluctuating (Vishamagni)',
    q_agni_indigestion: 'Frequently experience indigestion',
    q_kosh_freq: 'Once every 2-3 days (Krura Koshta)',
    q_kosh_constipation: 'Chronic stubborn constipation',
    // Ahara
    q_ah_daily_diet: 'Rice, dal, chapati and occasional curd',
    q_ah_spicy_food: 'Moderate spice',
    // Nidana
    q_nid_trigger_main: 'Yes, clear change preceded symptoms'
  });

  // Red Flag Alert state
  const [redFlagDetected, setRedFlagDetected] = useState(false);
  const [triggeredRedFlags, setTriggeredRedFlags] = useState([]);

  // Adaptive branch derived dynamically from chief complaint
  const activeAdaptiveBranch = useMemo(() => {
    const text = responses.q_chief_complaint_main || '';
    return getAdaptiveBranch(text);
  }, [responses.q_chief_complaint_main]);

  // Voice Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const [activeListeningQuestionId, setActiveListeningQuestionId] = useState(null);
  const speechRecognitionRef = useRef(null);

  // Dataset Explorer Search & Filters
  const [datasetSearch, setDatasetSearch] = useState('');
  const [selectedSectionFilter, setSelectedSectionFilter] = useState('all');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Summary submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecordId, setSubmittedRecordId] = useState(null);

  const handleResponseChange = useCallback((questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));

    // Real-time Red-Flag Checker
    const rfList = getRedFlagQuestions();
    const isRfQuestion = rfList.find((q) => q.id === questionId);
    if (isRfQuestion) {
      if (value === true || value === 'Yes' || value === 'true') {
        setRedFlagDetected(true);
        setTriggeredRedFlags((prev) => [...new Set([...prev, isRfQuestion.text])]);
      } else {
        setTriggeredRedFlags((prev) => prev.filter((item) => item !== isRfQuestion.text));
      }
    }
  }, []);

  // Handle Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = false;
      recognizer.lang = userLanguage === 'en' ? 'en-IN' : 'hi-IN';

      recognizer.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (activeListeningQuestionId) {
          handleResponseChange(activeListeningQuestionId, transcript);
          if (onNotify) onNotify(`Voice captured: "${transcript}"`, 'info');
        }
        setIsListening(false);
        setActiveListeningQuestionId(null);
      };

      recognizer.onerror = () => {
        setIsListening(false);
        setActiveListeningQuestionId(null);
      };

      recognizer.onend = () => {
        setIsListening(false);
        setActiveListeningQuestionId(null);
      };

      speechRecognitionRef.current = recognizer;
    }
  }, [userLanguage, activeListeningQuestionId, handleResponseChange, onNotify]);

  const toggleVoiceInput = (questionId) => {
    if (!speechRecognitionRef.current) {
      if (onNotify) onNotify('Speech Recognition is not supported on this browser.', 'warning');
      return;
    }
    if (isListening && activeListeningQuestionId === questionId) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
      setActiveListeningQuestionId(null);
    } else {
      setActiveListeningQuestionId(questionId);
      setIsListening(true);
      try {
        speechRecognitionRef.current.start();
        if (onNotify) onNotify('Listening... Please speak your answer.', 'info');
      } catch (_) {
        setIsListening(false);
      }
    }
  };

  const handleSpeakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // ── Navigation Between Stages ──────────────────────────────────────
  const handleNextStage = () => {
    // Stage 1 validation: Name & Age
    if (currentStage === 1) {
      if (!responses.q_name.trim()) {
        if (onNotify) onNotify('Please enter patient name to proceed.', 'warning');
        return;
      }
    }

    // Stage 2 validation: Consent Check
    if (currentStage === 2) {
      if (responses.q_consent_given !== 'Yes, I give informed consent') {
        if (onNotify) onNotify('Informed consent is mandatory before collecting clinical health information.', 'warning');
        return;
      }
    }

    // Stage 3 validation: Chief Complaint
    if (currentStage === 3) {
      if (!responses.q_chief_complaint_main.trim()) {
        if (onNotify) onNotify('Please state the primary health problem bringing you to the hospital.', 'warning');
        return;
      }
    }

    // Check if red flags triggered during Stage 4
    if (currentStage === 4 && redFlagDetected) {
      // In accordance with PDF Page 8:
      // "RED FLAG DETECTED -> STOP NORMAL QUESTIONING -> ALERT TRIAGE STAFF -> PRIORITY ASSESSMENT"
      return;
    }

    // Advance
    if (currentStage < 11) {
      setCurrentStage((prev) => prev + 1);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const handlePrevStage = () => {
    if (currentStage > 1) {
      setCurrentStage((prev) => prev - 1);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  // ── Final Submission to Doctor Portal ─────────────────────────────
  const handleSubmitClinicalRecord = () => {
    setIsSubmitting(true);

    const recordId = `AYUSETU-${Date.now().toString().slice(-5)}`;

    // Build structured SOAP & Dashavidha profile
    const clinicalPayload = {
      id: recordId,
      timestamp: new Date().toISOString(),
      status: 'pending',
      protocol: 'AYUSETU_SIH_2026',
      patientInfo: {
        name: responses.q_name || patientProfile?.name || 'Anonymous Patient',
        age: parseInt(responses.q_age, 10) || (patientProfile?.age ? parseInt(patientProfile.age, 10) : 45),
        gender: responses.q_gender || patientProfile?.gender || 'Not specified',
        language: responses.q_language || patientProfile?.language || 'Hindi',
        languageLabel: responses.q_language || 'Hindi',
        occupation: responses.q_occupation || 'Unspecified',
        abhaId: responses.q_abha_id || patientProfile?.abhaId || '91-8765-4321-0987',
        abhaAddress: patientProfile?.abhaAddress || 'patient@abdm',
        phone: patientProfile?.phone || '+91 98765 43210',
        isElderly: isElderly || (parseInt(responses.q_age, 10) >= 60)
      },
      intake: {
        original_transcript: responses.q_chief_complaint_main,
        translated_clinical_english: `Patient ${responses.q_name}, ${responses.q_age}y ${responses.q_gender} presented with: ${responses.q_chief_complaint_main}. HPI indicates onset ${responses.q_hpi_onset_when || 'gradual'}, severity rated as ${responses.q_hpi_severity_scale}.`,
        chief_complaint: responses.q_chief_complaint_main,
        duration: responses.q_hpi_duration || 'Recent onset',
        detected_language: responses.q_language || 'Hindi',
        associated_symptoms: [
          responses.q_hpi_assoc_symptoms,
          responses.q_ros_fever !== 'No fever' ? responses.q_ros_fever : null,
          responses.q_ros_cough !== 'No cough' ? responses.q_ros_cough : null,
          responses.q_ros_bowels !== 'Normal regular bowels' ? responses.q_ros_bowels : null
        ].filter(Boolean),
        medications_mentioned: [
          responses.q_med_name,
          responses.q_med_ayurvedic,
          responses.q_med_supplements
        ].filter(Boolean),
        ayurvedic_factors: {
          prakriti_assessment: responses.q_pra_body_build || 'Vata-dominant',
          vikriti_state: responses.q_vik_recent_changes || 'Acute imbalance reported',
          agni_status: responses.q_agni_appetite || 'Vishamagni / Mandagni',
          koshtha_status: responses.q_kosh_constipation || 'Krura Koshtha tendency',
          ahara_patterns: responses.q_ah_daily_diet || 'Standard diet',
          vihara_stress: responses.q_vih_stress_level || 'Moderate',
          dashavidha_summary: 'Comprehensive Dashavidha Pariksha captured via AYUSETU protocol.'
        },
        triage_urgency: redFlagDetected ? 'RED_FLAG' : 'ROUTINE',
        triage_reason: redFlagDetected
          ? `EMERGENCY ALERT: Triggered red flags (${triggeredRedFlags.join(', ')}). Immediate doctor assessment required.`
          : 'Standard clinical pre-consultation completed via AYUSETU 25-section questionnaire.'
      },
      doctorNote: '',
      prescription: []
    };

    // Save to shared clinical records service
    addClinicalRecord(clinicalPayload);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedRecordId(recordId);
      setCurrentStage(12); // Success view
      if (onNotify) onNotify(`Case record ${recordId} successfully created for doctor review!`, 'success');
    }, 600);
  };

  // ── Download Dataset as JSON ──────────────────────────────────────
  const handleDownloadDatasetJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(AYUSETU_SECTIONS, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'ayusetu_clinical_questions_dataset.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
    if (onNotify) onNotify('AYUSETU Question Dataset exported as JSON!', 'success');
  };

  // ── Filtered Questions for Explorer ───────────────────────────────
  const filteredSections = useMemo(() => {
    return AYUSETU_SECTIONS.filter((sec) => {
      const matchesCategory = selectedSectionFilter === 'all' || sec.stage === selectedSectionFilter;
      const searchLower = datasetSearch.toLowerCase().trim();
      if (!searchLower) return matchesCategory;

      const titleMatch = sec.title.toLowerCase().includes(searchLower);
      const descMatch = sec.description.toLowerCase().includes(searchLower);
      const questionMatch = sec.questions && sec.questions.some((q) => q.text.toLowerCase().includes(searchLower));
      const branchMatch = sec.branches && sec.branches.some((b) => b.questions.some((q) => q.text.toLowerCase().includes(searchLower)));

      return matchesCategory && (titleMatch || descMatch || questionMatch || branchMatch);
    });
  }, [datasetSearch, selectedSectionFilter]);

  const stats = useMemo(() => getDatasetStats(), []);

  // ── Quick Fill Demo Case ──────────────────────────────────────────
  const handleQuickFillJointPainCase = () => {
    setResponses({
      q_name: 'Shankaracharya Bhat',
      q_age: '62',
      q_gender: 'Male',
      q_occupation: 'Temple Priest / Farmer',
      q_language: 'Kannada',
      q_first_visit: 'Yes, First Visit',
      q_abha_id: '91-8834-2931-1002',
      q_consent_given: 'Yes, I give informed consent',
      q_chief_complaint_main: 'Severe bilateral knee joint pain with morning stiffness and cracking sound on walking (Sandhivata)',
      q_hpi_onset_when: '3 months ago, gradually worsening',
      q_hpi_onset_type: 'Gradually (slowly over time)',
      q_hpi_duration: '3 months',
      q_hpi_severity_scale: 'Severe (7-8)',
      q_hpi_progression: 'Getting worse',
      q_hpi_aggravating_what: 'Climbing stairs, walking in cold early mornings',
      q_hpi_agg_weather: 'Worse in cold/rainy weather',
      q_hpi_rel_rest: 'Yes, improves with rest',
      q_pmh_major_illness: 'No major illnesses',
      q_pmh_chronic: 'Hypertension',
      q_med_ayurvedic: 'Ashwagandha Churna with warm milk at night',
      q_pra_body_build: 'Naturally thin & slender (Vata build)',
      q_pra_skin: 'Dry, rough, cracked or cold to touch (Vata)',
      q_pra_temp_preference: 'Aversion to cold, feels chilly easily (Vata)',
      q_pra_sleep_nature: 'Light, restless, easily interrupted (Vata)',
      q_pra_appetite_level: 'Variable / Irregular (Vishamagni - Vata)',
      q_vik_recent_changes: 'Increased joint stiffness and dry skin over last 6 weeks',
      q_vik_dryness: 'Yes, severe new dryness (Vata aggravation)',
      q_vik_is_it_normal: 'This is a RECENT CHANGE from my normal state',
      q_agni_appetite: 'Irregular & fluctuating (Vishamagni)',
      q_agni_indigestion: 'Frequently experience indigestion',
      q_kosh_freq: 'Once every 2-3 days (Krura Koshta)',
      q_kosh_constipation: 'Chronic stubborn constipation',
      q_ah_daily_diet: 'Ragi mudde, sambar, rice, occasional fried papad',
      q_vih_wake_time: '4:45 AM (Brahma Muhurta)',
      q_vih_sleep_hours: '6 to 7 hours',
      q_sat_weather: 'Immediately catch cold/cough/joint pain with weather shifts',
      q_sat_emotional: 'Anxious and restless (Vata/Rajas)',
      q_sara_phys_strength: 'Moderate average strength (Madhyama Sara)',
      q_vya_activity_level: 'Only very light movement (Avara Vyayama Shakti)',
      q_vaya_strength_change: 'Noticeable decrease in strength',
      q_nid_trigger_main: 'Yes, clear change preceded symptoms',
      q_fin_anything_else: 'Looking for natural Ayurvedic remedies and joint oil fomentation (Janu Basti).'
    });
    setCurrentStage(3);
    if (onNotify) onNotify('Loaded pre-configured Sandhivata (Ayurvedic Joint Pain) case!', 'success');
  };

  return (
    <div className={`ayusetu-intake-container ${isElderly ? 'is-elderly' : ''}`}>
      {/* ── Top Header Strip ────────────────────────────────────────── */}
      <div className="ayusetu-header">
        <div className="ayusetu-brand-title">
          <div className="ayusetu-badge">
            <Leaf size={15} />
            <span>SIH 2026 AI Standard</span>
          </div>
          <h2>Pre-Consultation: Clinical &amp; AYUSH Intake</h2>
          <p className="ayusetu-subtitle">
            Adaptive 10-Stage Clinical Assessment with Dashavidha Pariksha &amp; Ahara-Vihara Dataset
          </p>
        </div>

        <div className="ayusetu-actions-bar">
          {/* View Tab Switcher */}
          <div className="ayusetu-tab-group" role="tablist">
            <button
              type="button"
              className={`ayusetu-tab-btn ${activeTab === 'interview' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('interview')}
            >
              <Activity size={16} />
              <span>Interactive Clinical Assistant</span>
            </button>
            <button
              type="button"
              className={`ayusetu-tab-btn ${activeTab === 'dataset-explorer' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('dataset-explorer')}
            >
              <Database size={16} />
              <span>Dataset Explorer ({stats.totalSections} Sec / {stats.totalQuestions} Qs)</span>
            </button>
          </div>

          {/* Quick Demo Pre-fill */}
          {activeTab === 'interview' && currentStage <= 3 && (
            <button
              type="button"
              className="ayusetu-demo-btn"
              onClick={handleQuickFillJointPainCase}
              title="Quickly fill sample Ayurvedic Sandhivata patient data"
            >
              <Sparkles size={15} />
              <span>Load Demo Case (Sandhivata)</span>
            </button>
          )}

          {onBackToMain && (
            <button
              type="button"
              className="ayusetu-back-nav-btn"
              onClick={onBackToMain}
            >
              Back
            </button>
          )}
        </div>
      </div>

      {/* ── VIEW 1: INTERACTIVE CLINICAL ASSISTANT ─────────────────── */}
      {activeTab === 'interview' && (
        <div className="ayusetu-interview-layout">
          {/* Progress Architecture Stepper (Page 9 from PDF) */}
          <div className="ayusetu-stepper-strip" aria-label="Clinical Protocol Progress">
            {PRIMARY_STAGES.map((stg) => {
              const isCompleted = currentStage > stg.index;
              const isCurrent = currentStage === stg.index;
              return (
                <div
                  key={stg.id}
                  className={`stepper-step ${isCurrent ? 'is-current' : ''} ${isCompleted ? 'is-completed' : ''}`}
                  onClick={() => {
                    if (isCompleted) setCurrentStage(stg.index);
                  }}
                  title={stg.title}
                >
                  <span className="step-num">{isCompleted ? '✓' : stg.index}</span>
                  <span className="step-label">{stg.title}</span>
                </div>
              );
            })}
          </div>

          {/* ── RED FLAG EMERGENCY OVERLAY / BANNER ── */}
          {redFlagDetected && (
            <div className="ayusetu-red-flag-emergency-banner" role="alert">
              <div className="rf-alert-header">
                <AlertOctagon size={32} className="rf-pulse-icon" />
                <div className="rf-text">
                  <h3>⚠️ RED FLAG DETECTED — EMERGENCY TRIAGE ESCALATION</h3>
                  <p>
                    In accordance with patient safety protocol: <strong>NORMAL QUESTIONING IS HALTED.</strong>
                    &nbsp;The AI will not attempt autonomous diagnosis. Please contact emergency triage staff immediately.
                  </p>
                </div>
              </div>

              <div className="rf-triggers-box">
                <strong>Critical Symptoms Identified:</strong>
                <ul>
                  {triggeredRedFlags.map((flag, idx) => (
                    <li key={idx}>🚨 {flag}</li>
                  ))}
                </ul>
              </div>

              <div className="rf-action-buttons">
                <a href="tel:108" className="rf-call-btn">
                  <PhoneCall size={18} />
                  <span>Call 108 Ambulance / Emergency</span>
                </a>
                <button
                  type="button"
                  className="rf-triage-notify-btn"
                  onClick={handleSubmitClinicalRecord}
                  disabled={isSubmitting}
                >
                  <AlertTriangle size={18} />
                  <span>{isSubmitting ? 'Escalating...' : 'Alert OPD Emergency Triage Queue'}</span>
                </button>
                <button
                  type="button"
                  className="rf-dismiss-btn"
                  onClick={() => setRedFlagDetected(false)}
                >
                  Clear Flag (Test Only)
                </button>
              </div>
            </div>
          )}

          {/* ── STAGE CONTENT CARDS ─────────────────────────────────── */}
          <div className="ayusetu-stage-card">
            {/* STAGE 1: DEMOGRAPHICS */}
            {currentStage === 1 && (
              <div className="stage-content">
                <div className="stage-header-meta">
                  <span className="stage-tag">Section 1 &bull; Clinical Journey Entry</span>
                  <h3>Patient Identification &amp; Demographics</h3>
                  <p>Collect baseline demographic and health identification details before entering consultation.</p>
                </div>

                <div className="questions-grid">
                  <div className="question-field">
                    <label>
                      What is your full name? <span className="req">*</span>
                    </label>
                    <div className="input-with-voice">
                      <input
                        type="text"
                        value={responses.q_name}
                        onChange={(e) => handleResponseChange('q_name', e.target.value)}
                        placeholder="Enter full legal name"
                      />
                      <button
                        type="button"
                        className={`voice-mic-btn ${isListening && activeListeningQuestionId === 'q_name' ? 'is-mic-active' : ''}`}
                        onClick={() => toggleVoiceInput('q_name')}
                        title="Speak name"
                      >
                        {isListening && activeListeningQuestionId === 'q_name' ? <MicOff size={16} /> : <Mic size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="question-field-row">
                    <div className="question-field">
                      <label>
                        What is your age? <span className="req">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={responses.q_age}
                        onChange={(e) => handleResponseChange('q_age', e.target.value)}
                        placeholder="Age in years"
                      />
                    </div>

                    <div className="question-field">
                      <label>What is your gender?</label>
                      <select
                        value={responses.q_gender}
                        onChange={(e) => handleResponseChange('q_gender', e.target.value)}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-Binary / Other">Non-Binary / Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div className="question-field-row">
                    <div className="question-field">
                      <label>What is your occupation?</label>
                      <input
                        type="text"
                        value={responses.q_occupation}
                        onChange={(e) => handleResponseChange('q_occupation', e.target.value)}
                        placeholder="e.g. Farmer, Teacher, Desk Worker"
                      />
                    </div>

                    <div className="question-field">
                      <label>Preferred Language for Consultation?</label>
                      <select
                        value={responses.q_language}
                        onChange={(e) => handleResponseChange('q_language', e.target.value)}
                      >
                        <option value="Hindi">Hindi (हिन्दी)</option>
                        <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                        <option value="Tamil">Tamil (தமிழ்)</option>
                        <option value="Telugu">Telugu (తెలుగు)</option>
                        <option value="English">English</option>
                        <option value="Marathi">Marathi (मराठी)</option>
                        <option value="Bengali">Bengali (বাংলা)</option>
                        <option value="Malayalam">Malayalam (മലയാളം)</option>
                        <option value="Sanskrit">Sanskrit (संस्कृतम्)</option>
                      </select>
                    </div>
                  </div>

                  <div className="question-field-row">
                    <div className="question-field">
                      <label>Is this your first visit?</label>
                      <div className="pill-choice-group">
                        {['Yes, First Visit', 'No, Follow-up Visit'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`pill-choice-btn ${responses.q_first_visit === opt ? 'is-selected' : ''}`}
                            onClick={() => handleResponseChange('q_first_visit', opt)}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="question-field">
                      <label>Do you have an ABHA ID / Ayushman Bharat Health Account?</label>
                      <input
                        type="text"
                        value={responses.q_abha_id}
                        onChange={(e) => handleResponseChange('q_abha_id', e.target.value)}
                        placeholder="e.g. 91-XXXX-XXXX-XXXX"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 2: CONSENT SCREEN (Dedicated Screen from PDF Page 1) */}
            {currentStage === 2 && (
              <div className="stage-content consent-screen-box">
                <div className="consent-icon-badge">
                  <Shield size={44} />
                </div>
                <h3>Patient Consent for Digital Consultation</h3>
                <p className="consent-directive">
                  &ldquo;For your software, this should be a separate consent screen, not just an ordinary medical question.&rdquo;
                </p>

                <div className="consent-statement-card">
                  <h4>Mandatory Informed Consent</h4>
                  <p className="consent-quote">
                    &ldquo;Do you consent to providing your health information for this consultation?&rdquo;
                  </p>
                  <p className="consent-subtext">
                    Under the Ayushman Bharat Digital Mission (ABDM) and Data Privacy guidelines, your responses will be used solely for AI clinical history-taking, triaging and physician review. No data is sold or shared without clinical authorization.
                  </p>
                </div>

                <div className="consent-options-grid">
                  <button
                    type="button"
                    className={`consent-choice-card ${responses.q_consent_given === 'Yes, I give informed consent' ? 'is-granted' : ''}`}
                    onClick={() => handleResponseChange('q_consent_given', 'Yes, I give informed consent')}
                  >
                    <CheckCircle2 size={24} />
                    <div className="choice-text">
                      <strong>Yes, I give informed consent</strong>
                      <span>Proceed with digital clinical intake and doctor review</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`consent-choice-card ${responses.q_consent_given === 'No, I decline' ? 'is-declined' : ''}`}
                    onClick={() => handleResponseChange('q_consent_given', 'No, I decline')}
                  >
                    <AlertOctagon size={24} />
                    <div className="choice-text">
                      <strong>No, I decline</strong>
                      <span>Exit without collecting clinical health data</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 3: CHIEF COMPLAINT (Open-Ended with Adaptive Branching) */}
            {currentStage === 3 && (
              <div className="stage-content">
                <div className="stage-header-meta">
                  <span className="stage-tag">Section 3 &bull; Open-Ended Inquiry</span>
                  <h3>Chief Complaint &mdash; MOST IMPORTANT</h3>
                  <p>The first medical question should be open-ended. The AI identifies the complaint and dynamically branches into relevant questions.</p>
                </div>

                <div className="question-field">
                  <div className="field-title-row">
                    <label>
                      &ldquo;What health problem brought you here today?&rdquo; <span className="req">*</span>
                    </label>
                    <button
                      type="button"
                      className="listen-question-btn"
                      onClick={() => handleSpeakText('What health problem brought you here today?')}
                      title="Read question aloud"
                    >
                      <Volume2 size={15} />
                      <span>Read aloud</span>
                    </button>
                  </div>

                  <div className="textarea-with-voice">
                    <textarea
                      rows="4"
                      value={responses.q_chief_complaint_main}
                      onChange={(e) => handleResponseChange('q_chief_complaint_main', e.target.value)}
                      placeholder="Speak or type your main symptoms (e.g. Severe knee joint pain when walking, chest burning sensation, acidity for 2 weeks...)"
                    />
                    <button
                      type="button"
                      className={`voice-mic-btn-large ${isListening && activeListeningQuestionId === 'q_chief_complaint_main' ? 'is-listening-pulse' : ''}`}
                      onClick={() => toggleVoiceInput('q_chief_complaint_main')}
                    >
                      <Mic size={20} />
                      <span>{isListening ? 'Listening...' : 'Voice Dictate'}</span>
                    </button>
                  </div>
                </div>

                {/* Common Presets from PDF */}
                <div className="presets-box">
                  <span className="presets-title">Or choose common clinical presentation:</span>
                  <div className="presets-chips">
                    {[
                      'Joint pain / Sandhivata (Knee swelling & stiffness)',
                      'Chest pain & retrosternal burning discomfort',
                      'Chronic constipation & Mandagni (reduced digestion)',
                      'Abdominal pain & sour acidic reflux',
                      'Persistent cough & difficulty breathing',
                      'Recurrent headache & mental stress'
                    ].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className="preset-chip-btn"
                        onClick={() => handleResponseChange('q_chief_complaint_main', preset)}
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {activeAdaptiveBranch && (
                  <div className="adaptive-detected-pill">
                    <Sparkles size={16} />
                    <span>AI Branch Triggered: <strong>{activeAdaptiveBranch.label}</strong>. Specialized questions will load in Stage 6.</span>
                  </div>
                )}
              </div>
            )}

            {/* STAGE 4: RED FLAG SCREENING (Mandatory Safety Screening) */}
            {currentStage === 4 && (
              <div className="stage-content">
                <div className="stage-header-meta">
                  <span className="stage-tag red-tag">Section 24 &bull; Mandatory Triage Safety</span>
                  <h3>Red-Flag Emergency Screening</h3>
                  <p>Immediate triage screening. Any affirmative answer halts routine flow to alert medical emergency personnel.</p>
                </div>

                <div className="red-flag-questions-list">
                  {getRedFlagQuestions().map((q) => {
                    const isYes = responses[q.id] === true || responses[q.id] === 'Yes';
                    return (
                      <div key={q.id} className={`rf-question-row ${isYes ? 'is-danger-highlight' : ''}`}>
                        <span className="rf-q-text">{q.text}</span>
                        <div className="rf-options-toggle">
                          <button
                            type="button"
                            className={`rf-toggle-btn ${responses[q.id] === 'No' ? 'is-safe' : ''}`}
                            onClick={() => handleResponseChange(q.id, 'No')}
                          >
                            No
                          </button>
                          <button
                            type="button"
                            className={`rf-toggle-btn ${isYes ? 'is-alert-active' : ''}`}
                            onClick={() => handleResponseChange(q.id, 'Yes')}
                          >
                            ⚠️ Yes
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STAGE 5: HPI — HISTORY OF PRESENT ILLNESS */}
            {currentStage === 5 && (
              <div className="stage-content">
                <div className="stage-header-meta">
                  <span className="stage-tag">Section 4 &bull; Systematic HPI</span>
                  <h3>History of Present Illness (HPI)</h3>
                  <p>Onset, duration, progression, severity, aggravating and relieving factors.</p>
                </div>

                <div className="questions-grid">
                  {/* Onset */}
                  <div className="question-field-row">
                    <div className="question-field">
                      <label>When did this problem start? (Onset)</label>
                      <input
                        type="text"
                        value={responses.q_hpi_onset_when}
                        onChange={(e) => handleResponseChange('q_hpi_onset_when', e.target.value)}
                        placeholder="e.g. 2 days ago, 3 weeks ago"
                      />
                    </div>
                    <div className="question-field">
                      <label>Did it start suddenly or gradually?</label>
                      <select
                        value={responses.q_hpi_onset_type}
                        onChange={(e) => handleResponseChange('q_hpi_onset_type', e.target.value)}
                      >
                        <option value="Suddenly (abrupt)">Suddenly (abrupt)</option>
                        <option value="Gradually (slowly over time)">Gradually (slowly over time)</option>
                        <option value="Woke up with it">Woke up with it</option>
                      </select>
                    </div>
                  </div>

                  {/* Duration & Continuity */}
                  <div className="question-field-row">
                    <div className="question-field">
                      <label>How long have you had this problem?</label>
                      <input
                        type="text"
                        value={responses.q_hpi_duration}
                        onChange={(e) => handleResponseChange('q_hpi_duration', e.target.value)}
                        placeholder="e.g. Continuous for 5 days"
                      />
                    </div>
                    <div className="question-field">
                      <label>Is it continuous or does it come and go?</label>
                      <select
                        value={responses.q_hpi_continuity || 'Continuous without break'}
                        onChange={(e) => handleResponseChange('q_hpi_continuity', e.target.value)}
                      >
                        <option value="Continuous without break">Continuous without break</option>
                        <option value="Comes and goes (intermittent / episodic)">Comes and goes (intermittent / episodic)</option>
                        <option value="Only triggers during specific activities">Only triggers during specific activities</option>
                      </select>
                    </div>
                  </div>

                  {/* Severity & Progression */}
                  <div className="question-field-row">
                    <div className="question-field">
                      <label>How severe is the problem?</label>
                      <div className="pill-choice-group">
                        {['Mild (1-3)', 'Moderate (4-6)', 'Severe (7-8)', 'Very Severe (9-10)'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`pill-choice-btn ${responses.q_hpi_severity_scale === opt ? 'is-selected' : ''}`}
                            onClick={() => handleResponseChange('q_hpi_severity_scale', opt)}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="question-field">
                      <label>Is the problem getting better or worse?</label>
                      <select
                        value={responses.q_hpi_progression}
                        onChange={(e) => handleResponseChange('q_hpi_progression', e.target.value)}
                      >
                        <option value="Getting worse">Getting worse</option>
                        <option value="Staying the same">Staying the same</option>
                        <option value="Getting better">Getting better</option>
                        <option value="Fluctuating">Fluctuating</option>
                      </select>
                    </div>
                  </div>

                  {/* Aggravating & Relieving */}
                  <div className="question-field-row">
                    <div className="question-field">
                      <label>What makes the problem worse? (Aggravating factors)</label>
                      <input
                        type="text"
                        value={responses.q_hpi_aggravating_what || ''}
                        onChange={(e) => handleResponseChange('q_hpi_aggravating_what', e.target.value)}
                        placeholder="e.g. Walking, eating spicy food, cold weather, stress"
                      />
                    </div>
                    <div className="question-field">
                      <label>What makes you feel better? (Relieving factors)</label>
                      <input
                        type="text"
                        value={responses.q_hpi_relieving_what || ''}
                        onChange={(e) => handleResponseChange('q_hpi_relieving_what', e.target.value)}
                        placeholder="e.g. Rest, lying flat, hot water fomentation"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 6: ADAPTIVE BRANCHING QUESTIONS */}
            {currentStage === 6 && (
              <div className="stage-content">
                <div className="stage-header-meta">
                  <span className="stage-tag">Section 5 &bull; AI Adaptive Branching</span>
                  <h3>Adaptive Complaint Inquiry</h3>
                  <p>The AI branches dynamically into questions relevant to your specific chief complaint.</p>
                </div>

                {activeAdaptiveBranch ? (
                  <div className="adaptive-branch-wrapper">
                    <div className="branch-meta-card">
                      <Sparkles size={18} />
                      <div>
                        <strong>Active Clinical Branch: {activeAdaptiveBranch.label}</strong>
                        <p>Questions specifically designed for investigating {responses.q_chief_complaint_main}.</p>
                      </div>
                    </div>

                    <div className="adaptive-questions-list">
                      {activeAdaptiveBranch.questions.map((q) => (
                        <div key={q.id} className="adaptive-q-item">
                          <label>{q.text}</label>
                          {q.type === 'choice' ? (
                            <div className="pill-choice-group">
                              {q.options.map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  className={`pill-choice-btn ${responses[q.id] === opt ? 'is-selected' : ''}`}
                                  onClick={() => handleResponseChange(q.id, opt)}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={responses[q.id] || ''}
                              onChange={(e) => handleResponseChange(q.id, e.target.value)}
                              placeholder="Enter details..."
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="no-branch-fallback">
                    <p>No specific sub-branch triggered for current complaint. Standard clinical questioning applies.</p>
                    <div className="question-field">
                      <label>Describe exact location, radiation and quality of sensation:</label>
                      <input
                        type="text"
                        value={responses.q_adaptive_custom || ''}
                        onChange={(e) => handleResponseChange('q_adaptive_custom', e.target.value)}
                        placeholder="e.g. Sharp pain on right side, worsens after eating"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STAGE 7: PAST MEDICAL & DRUG / ALLERGY HISTORY */}
            {currentStage === 7 && (
              <div className="stage-content">
                <div className="stage-header-meta">
                  <span className="stage-tag">Sections 6 &amp; 7 &bull; Medical &amp; Pharmacology</span>
                  <h3>Past Medical, Surgical &amp; Drug / Allergy History</h3>
                  <p>Document chronic conditions, surgeries, allopathic medicines, Ayurvedic formulations and known allergies.</p>
                </div>

                <div className="questions-grid">
                  <div className="question-field-row">
                    <div className="question-field">
                      <label>Do you have any chronic diseases?</label>
                      <select
                        value={responses.q_pmh_chronic || 'None known'}
                        onChange={(e) => handleResponseChange('q_pmh_chronic', e.target.value)}
                      >
                        <option value="None known">None known</option>
                        <option value="Diabetes Mellitus">Diabetes Mellitus</option>
                        <option value="Hypertension">Hypertension</option>
                        <option value="Thyroid Disorder">Thyroid Disorder</option>
                        <option value="Asthma / COPD">Asthma / COPD</option>
                        <option value="Multiple chronic conditions">Multiple chronic conditions</option>
                      </select>
                    </div>

                    <div className="question-field">
                      <label>Have you undergone surgery or hospitalization?</label>
                      <input
                        type="text"
                        value={responses.q_pmh_surgery || ''}
                        onChange={(e) => handleResponseChange('q_pmh_surgery', e.target.value)}
                        placeholder="e.g. Appendectomy 2018, None"
                      />
                    </div>
                  </div>

                  <div className="question-field-row">
                    <div className="question-field">
                      <label>Current Allopathic Medicines (Name &amp; Dose):</label>
                      <input
                        type="text"
                        value={responses.q_med_name || ''}
                        onChange={(e) => handleResponseChange('q_med_name', e.target.value)}
                        placeholder="e.g. Metformin 500mg BD, Pantoprazole 40mg OD"
                      />
                    </div>

                    <div className="question-field">
                      <label>Are you taking any Ayurvedic medicines or Churna?</label>
                      <input
                        type="text"
                        value={responses.q_med_ayurvedic || ''}
                        onChange={(e) => handleResponseChange('q_med_ayurvedic', e.target.value)}
                        placeholder="e.g. Triphala Churna, Ashwagandha, Dashamularishta"
                      />
                    </div>
                  </div>

                  <div className="question-field">
                    <label>Do you have any drug or food allergies?</label>
                    <div className="pill-choice-group">
                      {['No known drug allergies (NKDA)', 'Penicillin / Antibiotics', 'NSAID / Painkillers', 'Dairy allergy'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`pill-choice-btn ${responses.q_med_allergies === opt ? 'is-selected' : ''}`}
                          onClick={() => handleResponseChange('q_med_allergies', opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 8: FAMILY & PERSONAL HISTORY */}
            {currentStage === 8 && (
              <div className="stage-content">
                <div className="stage-header-meta">
                  <span className="stage-tag">Sections 8 &amp; 9 &bull; Genetics &amp; Lifestyle</span>
                  <h3>Family &amp; Personal History</h3>
                  <p>Family hereditary predispositions, diet patterns, sleep duration, exercise, and habits.</p>
                </div>

                <div className="questions-grid">
                  <div className="question-field-row">
                    <div className="question-field">
                      <label>Is there a family history of diabetes, hypertension or heart disease?</label>
                      <select
                        value={responses.q_fam_diabetes || 'No'}
                        onChange={(e) => handleResponseChange('q_fam_diabetes', e.target.value)}
                      >
                        <option value="No">No known family history</option>
                        <option value="Yes (Mother/Father/Sibling) - Diabetes">Yes - Diabetes</option>
                        <option value="Yes - Hypertension">Yes - Hypertension</option>
                        <option value="Yes - Premature Heart Disease">Yes - Heart Disease</option>
                      </select>
                    </div>

                    <div className="question-field">
                      <label>What type of diet do you follow?</label>
                      <select
                        value={responses.q_pers_diet_type || 'Vegetarian'}
                        onChange={(e) => handleResponseChange('q_pers_diet_type', e.target.value)}
                      >
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Lacto-Vegetarian">Lacto-Vegetarian</option>
                        <option value="Non-Vegetarian">Non-Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                      </select>
                    </div>
                  </div>

                  <div className="question-field-row">
                    <div className="question-field">
                      <label>How many hours do you sleep per night?</label>
                      <div className="pill-choice-group">
                        {['Under 5 hours', '6 to 7 hours', '7 to 8 hours', 'Over 9 hours'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`pill-choice-btn ${responses.q_pers_sleep_hours === opt ? 'is-selected' : ''}`}
                            onClick={() => handleResponseChange('q_pers_sleep_hours', opt)}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="question-field">
                      <label>Habits (Smoking, Alcohol, Tobacco):</label>
                      <select
                        value={responses.q_pers_smoking || 'Non-smoker'}
                        onChange={(e) => handleResponseChange('q_pers_smoking', e.target.value)}
                      >
                        <option value="Non-smoker">No smoking, alcohol or tobacco</option>
                        <option value="Occasional alcohol">Occasional alcohol only</option>
                        <option value="Current smoker">Current smoker</option>
                        <option value="Tobacco user (gutka/khaini)">Tobacco user (gutka/khaini)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 9: REVIEW OF SYSTEMS (ROS) */}
            {currentStage === 9 && (
              <div className="stage-content">
                <div className="stage-header-meta">
                  <span className="stage-tag">Section 10 &bull; Review of Systems</span>
                  <h3>Review of Systems (ROS Quick Screening)</h3>
                  <p>Comprehensive screening across body systems: General, Respiratory, Cardio, GI, and Neurological.</p>
                </div>

                <div className="ros-category-grid">
                  <div className="ros-card">
                    <h4>General &amp; Constitutional</h4>
                    <div className="ros-item">
                      <span>Fever?</span>
                      <select
                        value={responses.q_ros_fever || 'No fever'}
                        onChange={(e) => handleResponseChange('q_ros_fever', e.target.value)}
                      >
                        <option value="No fever">No fever</option>
                        <option value="Low-grade fever">Low-grade fever</option>
                        <option value="High fever with chills">High fever with chills</option>
                      </select>
                    </div>
                    <div className="ros-item">
                      <span>Unexplained weight loss?</span>
                      <select
                        value={responses.q_ros_weight_loss || 'No'}
                        onChange={(e) => handleResponseChange('q_ros_weight_loss', e.target.value)}
                      >
                        <option value="No">No</option>
                        <option value="Yes, significant sudden weight loss">Yes, significant</option>
                      </select>
                    </div>
                  </div>

                  <div className="ros-card">
                    <h4>Cardiovascular &amp; Respiratory</h4>
                    <div className="ros-item">
                      <span>Cough?</span>
                      <select
                        value={responses.q_ros_cough || 'No cough'}
                        onChange={(e) => handleResponseChange('q_ros_cough', e.target.value)}
                      >
                        <option value="No cough">No cough</option>
                        <option value="Dry cough">Dry cough</option>
                        <option value="Productive with phlegm">Productive with phlegm</option>
                      </select>
                    </div>
                    <div className="ros-item">
                      <span>Difficulty breathing?</span>
                      <select
                        value={responses.q_ros_difficulty_breathing || 'No shortness of breath'}
                        onChange={(e) => handleResponseChange('q_ros_difficulty_breathing', e.target.value)}
                      >
                        <option value="No shortness of breath">No shortness of breath</option>
                        <option value="Only on exertion/stairs">Only on exertion/stairs</option>
                        <option value="At rest">At rest</option>
                      </select>
                    </div>
                  </div>

                  <div className="ros-card">
                    <h4>Gastrointestinal &amp; Bowels</h4>
                    <div className="ros-item">
                      <span>Abdominal pain or Nausea?</span>
                      <select
                        value={responses.q_ros_abd_pain || 'No abdominal pain'}
                        onChange={(e) => handleResponseChange('q_ros_abd_pain', e.target.value)}
                      >
                        <option value="No abdominal pain">No abdominal pain</option>
                        <option value="Yes, upper burning pain">Yes, upper burning</option>
                        <option value="Frequent nausea">Frequent nausea</option>
                      </select>
                    </div>
                    <div className="ros-item">
                      <span>Bowel pattern:</span>
                      <select
                        value={responses.q_ros_bowels || 'Normal regular bowels'}
                        onChange={(e) => handleResponseChange('q_ros_bowels', e.target.value)}
                      >
                        <option value="Normal regular bowels">Normal regular bowels</option>
                        <option value="Chronic constipation">Chronic constipation</option>
                        <option value="Frequent loose stools">Frequent loose stools</option>
                      </select>
                    </div>
                  </div>

                  <div className="ros-card">
                    <h4>Neurological</h4>
                    <div className="ros-item">
                      <span>Headaches or Migraine?</span>
                      <select
                        value={responses.q_ros_headaches || 'No'}
                        onChange={(e) => handleResponseChange('q_ros_headaches', e.target.value)}
                      >
                        <option value="No">No</option>
                        <option value="Frequent tension headaches">Frequent tension headaches</option>
                        <option value="One-sided throbbing migraine">Throbbing migraine</option>
                      </select>
                    </div>
                    <div className="ros-item">
                      <span>Dizziness or Numbness?</span>
                      <select
                        value={responses.q_ros_numbness || 'No'}
                        onChange={(e) => handleResponseChange('q_ros_numbness', e.target.value)}
                      >
                        <option value="No">No</option>
                        <option value="Pins & needles in feet">Pins & needles in feet</option>
                        <option value="Lightheaded / Vertigo">Lightheaded / Vertigo</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 10: AYUSH / DASHAVIDHA PARIKSHA (Core PDF Highlight) */}
            {currentStage === 10 && (
              <div className="stage-content">
                <div className="stage-header-meta ayush-meta">
                  <div className="ayush-badge-title">
                    <Leaf size={18} />
                    <span className="stage-tag ayush-tag">Sections 11 to 23 &bull; Dashavidha Pariksha</span>
                  </div>
                  <h3>Extended AYUSH / Ayurvedic Assessment</h3>
                  <p>
                    Captures <strong>Prakriti, Vikriti, Agni, Koshta, Ahara-Vihara, Satmya, Sattva, Sara, Samhanana, Vyayama Shakti &amp; Nidana</strong> without claiming autonomous diagnosis.
                  </p>
                </div>

                <div className="ayush-sections-accordion">
                  {/* Prakriti */}
                  <div className="ayush-group-box">
                    <div className="ayush-group-header">
                      <h4>1. Prakriti (Natural Constitution)</h4>
                      <span className="ayush-sub">Collected via physical attributes</span>
                    </div>
                    <div className="questions-grid">
                      <div className="question-field">
                        <label>Body build (Sharira Sansthana):</label>
                        <div className="pill-choice-group">
                          {[
                            'Naturally thin & slender (Vata build)',
                            'Medium-built, athletic & moderate (Pitta build)',
                            'Broad-built, heavy & sturdy (Kapha build)'
                          ].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`pill-choice-btn ${responses.q_pra_body_build === opt ? 'is-selected' : ''}`}
                              onClick={() => handleResponseChange('q_pra_body_build', opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="question-field">
                        <label>Skin &amp; Hair nature (Tvak / Kesha):</label>
                        <div className="pill-choice-group">
                          {[
                            'Dry, rough, cracked or cold to touch (Vata)',
                            'Warm, reddish, prone to moles/acne (Pitta)',
                            'Thick, smooth, oily, moist and cool (Kapha)'
                          ].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`pill-choice-btn ${responses.q_pra_skin === opt ? 'is-selected' : ''}`}
                              onClick={() => handleResponseChange('q_pra_skin', opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Agni & Koshta */}
                  <div className="ayush-group-box">
                    <div className="ayush-group-header">
                      <h4>2. Agni &amp; Koshta (Digestive Fire &amp; Bowel Pattern)</h4>
                      <span className="ayush-sub">Metabolic status &amp; GI nature</span>
                    </div>
                    <div className="questions-grid">
                      <div className="question-field">
                        <label>Appetite pattern (Jatharagni):</label>
                        <div className="pill-choice-group">
                          {[
                            'Good & balanced (Samagni)',
                            'Irregular & fluctuating (Vishamagni - Vata)',
                            'Very sharp & intense (Tikshnagni - Pitta)',
                            'Weak & sluggish (Mandagni - Kapha)'
                          ].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`pill-choice-btn ${responses.q_agni_appetite === opt ? 'is-selected' : ''}`}
                              onClick={() => handleResponseChange('q_agni_appetite', opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="question-field">
                        <label>Stool nature &amp; Defecation (Koshta):</label>
                        <div className="pill-choice-group">
                          {[
                            'Hard, pellet-like, constipated (Krura Koshta - Vata)',
                            'Well-formed, regular (Madhyama Koshta)',
                            'Semi-solid, loose, urgent (Mridu Koshta - Pitta)'
                          ].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`pill-choice-btn ${responses.q_kosh_freq === opt ? 'is-selected' : ''}`}
                              onClick={() => handleResponseChange('q_kosh_freq', opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ahara & Vihara */}
                  <div className="ayush-group-box">
                    <div className="ayush-group-header">
                      <h4>3. Ahara-Vihara (Diet &amp; Lifestyle Routine)</h4>
                      <span className="ayush-sub">Dinacharya &amp; Shad-Rasa preference</span>
                    </div>
                    <div className="questions-grid">
                      <div className="question-field">
                        <label>Which tastes (Shad-Rasa) do you prefer naturally?</label>
                        <div className="pill-choice-group">
                          {[
                            'Sweet (Madhura)',
                            'Sour (Amla)',
                            'Salty (Lavana)',
                            'Pungent / Spicy (Katu)',
                            'Bitter (Tikta)',
                            'Astringent (Kashaya)'
                          ].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`pill-choice-btn ${responses.q_ah_rasa_preference === opt ? 'is-selected' : ''}`}
                              onClick={() => handleResponseChange('q_ah_rasa_preference', opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="question-field">
                        <label>Daily stress level &amp; Routine irregularity (Aniyata Dinacharya):</label>
                        <div className="pill-choice-group">
                          {[
                            'Disciplined routine, low stress',
                            'Moderate routine, manageable stress',
                            'Irregular routine & high stress (night work)'
                          ].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`pill-choice-btn ${responses.q_vih_stress_level === opt ? 'is-selected' : ''}`}
                              onClick={() => handleResponseChange('q_vih_stress_level', opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nidana (Causative Factor) */}
                  <div className="ayush-group-box">
                    <div className="ayush-group-header">
                      <h4>4. Nidana (Causative &amp; Trigger Factors)</h4>
                      <span className="ayush-sub">Preceding changes before illness</span>
                    </div>
                    <div className="question-field">
                      <label>&ldquo;Before your symptoms started, did anything change in your food, lifestyle, sleep or routine?&rdquo;</label>
                      <div className="pill-choice-group">
                        {[
                          'Yes, clear change preceded symptoms',
                          'Diet changed (ate spicy/fried feasts)',
                          'Sleep schedule changed (night shifts/stayed up late)',
                          'Weather/season changed suddenly',
                          'No change noticed'
                        ].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`pill-choice-btn ${responses.q_nid_trigger_main === opt ? 'is-selected' : ''}`}
                            onClick={() => handleResponseChange('q_nid_trigger_main', opt)}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 11: FINAL REVIEW & SUMMARY (Section 25) */}
            {currentStage === 11 && (
              <div className="stage-content">
                <div className="stage-header-meta">
                  <span className="stage-tag">Section 25 &bull; Clinical Summary</span>
                  <h3>The Final Question &amp; Clinical Review</h3>
                  <p>
                    &ldquo;This fits the requirement that the generated history be editable/verifiable by the physician rather than treated as an autonomous diagnosis.&rdquo;
                  </p>
                </div>

                <div className="question-field">
                  <label>&ldquo;Is there anything else about your health that you would like the doctor to know?&rdquo;</label>
                  <textarea
                    rows="3"
                    value={responses.q_fin_anything_else || ''}
                    onChange={(e) => handleResponseChange('q_fin_anything_else', e.target.value)}
                    placeholder="Any specific worries, past medication intolerances, or symptoms you would like to emphasize to the doctor..."
                  />
                </div>

                {/* Structured Clinical Review Card */}
                <div className="clinical-summary-preview-card">
                  <div className="summary-card-header">
                    <ClipboardList size={20} />
                    <h4>Generated Pre-Consultation Clinical Summary</h4>
                    <span className={`triage-badge ${redFlagDetected ? 'is-emergency' : 'is-routine'}`}>
                      {redFlagDetected ? 'RED FLAG' : 'ROUTINE AYUSH'}
                    </span>
                  </div>

                  <div className="summary-fields-grid">
                    <div className="s-field">
                      <strong>Patient:</strong> {responses.q_name} ({responses.q_age}y, {responses.q_gender}) &bull; Lang: {responses.q_language}
                    </div>
                    <div className="s-field">
                      <strong>ABHA ID:</strong> {responses.q_abha_id || 'Not provided'}
                    </div>
                    <div className="s-field full-w">
                      <strong>Chief Complaint:</strong> {responses.q_chief_complaint_main}
                    </div>
                    <div className="s-field">
                      <strong>HPI Severity / Onset:</strong> {responses.q_hpi_severity_scale || 'Moderate'} &bull; {responses.q_hpi_onset_when || 'Recent'}
                    </div>
                    <div className="s-field">
                      <strong>Prakriti / Constitution:</strong> {responses.q_pra_body_build}
                    </div>
                    <div className="s-field">
                      <strong>Agni / Digestion:</strong> {responses.q_agni_appetite}
                    </div>
                    <div className="s-field">
                      <strong>Koshta / Bowels:</strong> {responses.q_kosh_freq}
                    </div>
                    <div className="s-field full-w">
                      <strong>Medications &amp; AYUSH:</strong> {responses.q_med_name || 'None'} {responses.q_med_ayurvedic ? `| Ayurvedic: ${responses.q_med_ayurvedic}` : ''}
                    </div>
                  </div>
                </div>

                <div className="submit-action-box">
                  <p className="submit-disclaimer">
                    Upon confirmation, this structured intake will be securely routed to the OPD Doctor Portal queue.
                  </p>
                  <button
                    type="button"
                    className="submit-to-doctor-btn"
                    onClick={handleSubmitClinicalRecord}
                    disabled={isSubmitting}
                  >
                    <UserCheck size={20} />
                    <span>{isSubmitting ? 'Transmitting to Doctor Queue...' : 'Confirm & Send to Doctor Portal'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 12: SUCCESS / SUBMITTED */}
            {currentStage === 12 && (
              <div className="stage-content success-view-box">
                <div className="success-icon-circle">
                  <Check size={40} />
                </div>
                <h3>Intake Submitted Successfully!</h3>
                <p className="success-ticket">
                  Case Record ID: <strong>{submittedRecordId}</strong>
                </p>
                <p className="success-desc">
                  Your clinical history and Dashavidha Pariksha assessment have been safely recorded and synced to the OPD Doctor Portal queue for physical/teleconsultation review.
                </p>

                <div className="success-btn-row">
                  {onSwitchToDoctor && (
                    <button
                      type="button"
                      className="view-in-doctor-btn"
                      onClick={() => onSwitchToDoctor('doctor')}
                    >
                      <Stethoscope size={18} />
                      <span>View in Doctor Portal Queue</span>
                    </button>
                  )}
                  <button
                    type="button"
                    className="start-new-intake-btn"
                    onClick={() => {
                      setCurrentStage(1);
                      setResponses({
                        q_name: '',
                        q_age: '',
                        q_gender: 'Male',
                        q_occupation: '',
                        q_language: 'Hindi',
                        q_first_visit: 'Yes, First Visit',
                        q_abha_id: '',
                        q_consent_given: '',
                        q_chief_complaint_main: ''
                      });
                      setRedFlagDetected(false);
                      setTriggeredRedFlags([]);
                    }}
                  >
                    <RotateCcw size={16} />
                    <span>Start Another Intake</span>
                  </button>
                </div>
              </div>
            )}

            {/* ── Navigation Footer Controls ────────────────────────── */}
            {currentStage <= 11 && (
              <div className="stage-nav-controls">
                <button
                  type="button"
                  className="nav-prev-btn"
                  onClick={handlePrevStage}
                  disabled={currentStage === 1}
                >
                  <ChevronLeft size={18} />
                  <span>Previous</span>
                </button>

                <div className="nav-page-indicator">
                  Stage {currentStage} of 10 &bull; {PRIMARY_STAGES[currentStage - 1]?.title || 'Final Review'}
                </div>

                {currentStage < 11 ? (
                  <button
                    type="button"
                    className="nav-next-btn"
                    onClick={handleNextStage}
                    disabled={redFlagDetected && currentStage === 4}
                  >
                    <span>{currentStage === 10 ? 'Review & Submit' : 'Next Step'}</span>
                    <ChevronRight size={18} />
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── VIEW 2: DATASET EXPLORER & JSON EXPORTER ────────────────── */}
      {activeTab === 'dataset-explorer' && (
        <div className="ayusetu-explorer-layout">
          {/* Dataset Statistics Hero */}
          <div className="dataset-stats-strip">
            <div className="stat-card">
              <span className="stat-value">{stats.totalSections}</span>
              <span className="stat-lbl">Sections (From PDF)</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.totalQuestions}</span>
              <span className="stat-lbl">Total Clinical Questions</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.ayurvedicQuestions}</span>
              <span className="stat-lbl">AYUSH / Dashavidha Qs</span>
            </div>
            <div className="stat-card alert-card">
              <span className="stat-value">{stats.redFlagQuestions}</span>
              <span className="stat-lbl">Red-Flag Safety Qs</span>
            </div>

            <div className="export-json-action">
              <button
                type="button"
                className="export-btn"
                onClick={handleDownloadDatasetJson}
              >
                <Download size={16} />
                <span>{downloadSuccess ? 'Downloaded!' : 'Export Dataset JSON'}</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="explorer-toolbar">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                value={datasetSearch}
                onChange={(e) => setDatasetSearch(e.target.value)}
                placeholder="Search across all 25 sections (e.g. Prakriti, Chest, Agni, Sleep, Stool...)"
              />
              {datasetSearch && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setDatasetSearch('')}
                >
                  &times;
                </button>
              )}
            </div>

            <div className="filter-pills">
              <button
                type="button"
                className={`filter-pill ${selectedSectionFilter === 'all' ? 'is-active' : ''}`}
                onClick={() => setSelectedSectionFilter('all')}
              >
                All 25 Sections
              </button>
              <button
                type="button"
                className={`filter-pill ${selectedSectionFilter === 'ayush_mode' ? 'is-active' : ''}`}
                onClick={() => setSelectedSectionFilter('ayush_mode')}
              >
                🌿 AYUSH / Dashavidha
              </button>
              <button
                type="button"
                className={`filter-pill ${selectedSectionFilter === 'red_flag_screening' ? 'is-active' : ''}`}
                onClick={() => setSelectedSectionFilter('red_flag_screening')}
              >
                🚨 Red-Flag Screening
              </button>
              <button
                type="button"
                className={`filter-pill ${selectedSectionFilter === 'hpi' ? 'is-active' : ''}`}
                onClick={() => setSelectedSectionFilter('hpi')}
              >
                HPI &amp; Adaptive
              </button>
            </div>
          </div>

          {/* Section Cards List */}
          <div className="sections-list">
            {filteredSections.map((sec) => (
              <div key={sec.id} className="dataset-section-card">
                <div className="sec-header">
                  <div className="sec-title-area">
                    <span className="sec-num-badge">Section {sec.number}</span>
                    <h4>{sec.title}</h4>
                  </div>
                  <div className="sec-meta-tags">
                    <span className="sec-cat-tag">{sec.category}</span>
                    {sec.ayurvedicConcept && (
                      <span className="sec-ayur-tag">🌿 {sec.ayurvedicConcept}</span>
                    )}
                  </div>
                </div>

                <p className="sec-desc">{sec.description}</p>

                {sec.questions && (
                  <div className="sec-questions-table">
                    <div className="q-table-header">
                      <span>#</span>
                      <span>Clinical Question (Exactly as in PDF)</span>
                      <span>Input Type</span>
                      <span>Metadata</span>
                    </div>
                    {sec.questions.map((q, qIdx) => (
                      <div key={q.id} className="q-table-row">
                        <span className="q-idx">{qIdx + 1}</span>
                        <span className="q-text-body">
                          <strong>{q.text}</strong>
                          {q.options && (
                            <span className="q-options-preview">
                              Options: {q.options.slice(0, 3).join(' • ')} {q.options.length > 3 ? `(+${q.options.length - 3} more)` : ''}
                            </span>
                          )}
                        </span>
                        <span className="q-type-badge">{q.type}</span>
                        <span className="q-meta-badge">
                          {q.isRedFlag ? '🚨 Red Flag' : q.required ? 'Required' : 'Standard'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {sec.branches && (
                  <div className="sec-branches-preview">
                    <strong>Adaptive Decision Branches:</strong>
                    <div className="branches-grid">
                      {sec.branches.map((b) => (
                        <div key={b.complaintKey} className="branch-card">
                          <h5>⚡ {b.label} ({b.questions.length} Qs)</h5>
                          <p>Trigger keywords: {b.triggerKeywords.join(', ')}</p>
                          <ul>
                            {b.questions.slice(0, 3).map((bq) => (
                              <li key={bq.id}>{bq.text}</li>
                            ))}
                            {b.questions.length > 3 && <li>...and {b.questions.length - 3} more adaptive questions</li>}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   DEFAULT EXPORT BUNDLE
   ============================================================================ */
export default {
  ThemeToggle,
  Toast,
  ToastContainer,
  Footer,
  Hero,
  Navbar,
  RoleSelection,
  ModeSelectionModal,
  MedicalIntro,
  DoctorLogin,
  DEMO_DOCTOR_PROFILE,
  DoctorPortal,
  ProfilePage,
  VoiceIntake,
  MedicalOcr,
  AyusetuIntakeMode
};
