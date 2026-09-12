import React, { useState, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { Mic, FileText, Activity, Leaf } from 'lucide-react';
import Navbar from './components/Navbar.jsx';
import ModeSelectionModal from './components/ModeSelectionModal.jsx';
import ProfilePage from './components/ProfilePage.jsx';
import Hero from './components/Hero.jsx';
import VoiceIntake from './components/VoiceIntake.jsx';
import MedicalOcr from './components/MedicalOcr.jsx';
import AyusetuIntakeMode from './components/AyusetuIntakeMode.jsx';
import ToastContainer from './components/Toast.jsx';
import Footer from './components/Footer.jsx';
import RoleSelection from './components/RoleSelection.jsx';
import DoctorPortal from './components/DoctorPortal.jsx';
import DoctorLogin, { DEMO_DOCTOR_PROFILE } from './components/DoctorLogin.jsx';
import MedicalIntro from './components/MedicalIntro.jsx';
import { translations } from './translations.js';
import {
  getPatientProfile,
  savePatientProfile,
  clearPatientProfile,
  DEMO_PATIENT_PROFILE
} from './services/patientProfileService.js';

const ROLE_STORAGE_KEY = 'preconsult_user_role';
const LANGUAGE_STORAGE_KEY = 'preconsult_user_language';
const MODE_STORAGE_KEY = 'preconsult_user_mode';
const THEME_STORAGE_KEY = 'preconsult_color_theme';
const DOCTOR_SESSION_KEY = 'preconsult_doctor_session';

let toastIdCounter = 0;

function getInitialRole() {
  const hash = window.location.hash.toLowerCase();
  if (hash === '#/doctor' || hash === '#doctor') return 'doctor';
  if (hash === '#/profile' || hash === '#profile') return 'profile';
  if (hash === '#/patient' || hash === '#patient' || hash === '#/ayusetu' || hash === '#ayusetu' || hash === '#/ayush' || hash === '#ayush') return 'patient';
  if (hash === '#/role-select' || hash === '#role-select') return 'role-select';
  if (hash === '#/intro' || hash === '#intro') return 'intro';

  // Returning user: If role is saved in storage, directly enter their role without showing intro
  const savedRole = localStorage.getItem(ROLE_STORAGE_KEY);
  if (savedRole === 'patient' || savedRole === 'doctor') {
    return savedRole;
  }

  // First visit / logged out: Default to animated intro screen
  return 'intro';
}

function getInitialIntakeModule() {
  const hash = window.location.hash.toLowerCase();
  if (hash === '#/ayusetu' || hash === '#ayusetu' || hash === '#/ayush' || hash === '#ayush') return 'ayusetu';
  return 'ayusetu'; // Default to AYUSETU 25-Section Protocol on Patient page
}

export default function App() {
  // Current active view / role: 'intro' | 'role-select' | 'patient' | 'doctor'
  const [currentRole, setCurrentRole] = useState(getInitialRole);

  // Active intake module in Patient portal: 'ayusetu' | 'voice' | 'ocr' | 'all'
  const [activeIntakeModule, setActiveIntakeModule] = useState(getInitialIntakeModule);

  // Stored Patient Profile & ABHA Identity
  const [patientProfile, setPatientProfile] = useState(() => {
    return getPatientProfile() || DEMO_PATIENT_PROFILE;
  });

  // Language Preference
  const [userLanguage, setUserLanguage] = useState(() => {
    const profile = getPatientProfile();
    return profile?.language || localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en';
  });

  // Accessibility Mode: Elderly vs Modern
  const [userMode, setUserMode] = useState(() => {
    const profile = getPatientProfile();
    return profile?.mode || localStorage.getItem(MODE_STORAGE_KEY) || 'modern';
  });

  // Onboarding / Setup Modal State (Shown on first visit if profile not yet setup)
  const [showModeModal, setShowModeModal] = useState(() => {
    return !getPatientProfile() && !localStorage.getItem(ROLE_STORAGE_KEY);
  });

  // Modal Step ('language' | 'mode' | 'abha')
  const [modalStep, setModalStep] = useState('language');

  // Dark vs Light Mode (Defaults to Light)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  const [doctorSession, setDoctorSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(DOCTOR_SESSION_KEY)) || null;
    } catch {
      return null;
    }
  });

  // Theme sweep bar
  const [sweepState, setSweepState] = useState({ active: false, targetTheme: 'light' });

  // Toasts
  const [toasts, setToasts] = useState([]);

  // ── Sync URL hash on hashchange ──
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#/doctor' || hash === '#doctor') {
        setCurrentRole('doctor');
      } else if (hash === '#/profile' || hash === '#profile') {
        setCurrentRole('profile');
      } else if (hash === '#/ayusetu' || hash === '#ayusetu' || hash === '#/ayush' || hash === '#ayush') {
        setCurrentRole('patient');
        setActiveIntakeModule('ayusetu');
      } else if (hash === '#/patient' || hash === '#patient') {
        setCurrentRole('patient');
      } else if (hash === '#/role-select' || hash === '#role-select') {
        setCurrentRole('role-select');
      } else if (hash === '#/intro' || hash === '#intro' || hash === '' || hash === '#/') {
        const savedRole = localStorage.getItem(ROLE_STORAGE_KEY);
        if (savedRole === 'patient' || savedRole === 'doctor') {
          setCurrentRole(savedRole);
        } else {
          setCurrentRole('intro');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // ── Toast helpers ──
  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Navigation handler ──
  const navigateToRole = (role) => {
    if (role === 'doctor') {
      window.location.hash = '#/doctor';
      localStorage.setItem(ROLE_STORAGE_KEY, 'doctor');
      setCurrentRole('doctor');
    } else if (role === 'profile') {
      window.location.hash = '#/profile';
      setCurrentRole('profile');
    } else if (role === 'patient') {
      window.location.hash = '#/patient';
      localStorage.setItem(ROLE_STORAGE_KEY, 'patient');
      setCurrentRole('patient');
      // If patient has no profile saved, prompt onboarding
      if (!getPatientProfile()) {
        setModalStep('language');
        setShowModeModal(true);
      }
    } else if (role === 'ayusetu') {
      window.location.hash = '#/patient';
      localStorage.setItem(ROLE_STORAGE_KEY, 'patient');
      setCurrentRole('patient');
      setActiveIntakeModule('ayusetu');
      setTimeout(() => {
        const el = document.getElementById('ayusetu-intake-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    } else if (role === 'intro') {
      window.location.hash = '#/intro';
      setCurrentRole('intro');
    } else {
      window.location.hash = '#/role-select';
      setCurrentRole('role-select');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Synchronize body classes with accessibility mode ──
  useEffect(() => {
    if (userMode === 'elderly') {
      document.body.classList.add('mode-elderly');
      document.body.classList.remove('mode-modern');
    } else {
      document.body.classList.add('mode-modern');
      document.body.classList.remove('mode-elderly');
    }
  }, [userMode]);

  // ── Synchronize html + body with theme ──
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

  // ── Theme toggle with top-to-bottom sweep ──
  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
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
      }, 600);
    }
  };

  // ── Language & Mode handlers ──
  const handleSelectLanguage = (lang) => {
    setUserLanguage(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    if (patientProfile) {
      savePatientProfile({ ...patientProfile, language: lang });
    }
  };

  const handleSelectMode = (mode) => {
    setUserMode(mode);
    localStorage.setItem(MODE_STORAGE_KEY, mode);
    if (patientProfile) {
      savePatientProfile({ ...patientProfile, mode });
    }
  };

  const handleOpenLanguageModal = () => {
    setModalStep('language');
    setShowModeModal(true);
  };

  const handleCloseModal = () => {
    setShowModeModal(false);
  };

  // ── Patient Profile Update from Profile Modal ──
  const handleSavePatientProfile = (updatedProfile) => {
    const saved = savePatientProfile(updatedProfile);
    setPatientProfile(saved);
    if (saved.language) setUserLanguage(saved.language);
    if (saved.mode) setUserMode(saved.mode);
    addToast('Profile & ABHA details saved.', 'success');
  };

  // ── Patient Onboarding Complete (Step 1 -> 2 -> 3) ──
  const handleCompleteOnboarding = (profileData) => {
    const saved = savePatientProfile(profileData);
    setPatientProfile(saved);
    if (saved.language) setUserLanguage(saved.language);
    if (saved.mode) setUserMode(saved.mode);
    localStorage.setItem(ROLE_STORAGE_KEY, 'patient');
    setShowModeModal(false);
    addToast(`Welcome ${saved.name || 'Patient'}! ABHA ID linked.`, 'success');
  };

  // ── Log Out Handler ──
  const handleLogout = () => {
    localStorage.removeItem(ROLE_STORAGE_KEY);
    localStorage.removeItem(DOCTOR_SESSION_KEY);
    clearPatientProfile();
    setPatientProfile(null);
    setDoctorSession(null);
    setCurrentRole('intro');
    window.location.hash = '#/intro';
    addToast('Logged out successfully. Select your role to sign in again.', 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToAyusetuIntake = () => {
    setActiveIntakeModule('ayusetu');
    setTimeout(() => {
      const el = document.getElementById('ayusetu-intake-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const scrollToVoiceIntake = () => {
    setActiveIntakeModule('voice');
    setTimeout(() => {
      const el = document.getElementById('voice-intake-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const scrollToOcrIntake = () => {
    setActiveIntakeModule('ocr');
    setTimeout(() => {
      const el = document.getElementById('prescription-ocr-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const isElderly = userMode === 'elderly';
  const t = translations[userLanguage] || translations.en;

  // ── Render Medical Intro Animation (First-Time or Logged-Out Screen) ──
  if (currentRole === 'intro') {
    return (
      <MedicalIntro
        onEnterPatient={() => navigateToRole('patient')}
        onEnterDoctor={() => navigateToRole('doctor')}
        onSkip={() => navigateToRole('role-select')}
      />
    );
  }

  // ── Render Role Gate View ──
  if (currentRole === 'role-select') {
    return (
      <div className={`app-wrapper ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
        <RoleSelection
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onSelectRole={navigateToRole}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  // ── Render Doctor Clinical Portal ──
  if (currentRole === 'doctor') {
    if (!doctorSession) {
      return (
        <div className={`app-wrapper ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
          <DoctorLogin
            onLogin={(profile) => {
              localStorage.setItem(DOCTOR_SESSION_KEY, JSON.stringify(profile));
              localStorage.setItem(ROLE_STORAGE_KEY, 'doctor');
              setDoctorSession(profile);
            }}
            onBack={() => navigateToRole('role-select')}
          />
          <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </div>
      );
    }

    return (
      <div className={`app-wrapper ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
        <DoctorPortal
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onSwitchRole={navigateToRole}
          doctorProfile={doctorSession || DEMO_DOCTOR_PROFILE}
          onLogout={handleLogout}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  // ── Render Full Separate Patient Profile Page ──
  if (currentRole === 'profile') {
    return (
      <div className={`app-wrapper ${isElderly ? 'is-elderly-theme' : 'is-modern-theme'} ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
        {sweepState.active && (
          <div
            className={`theme-sweep-bar to-${sweepState.targetTheme}`}
            aria-hidden="true"
          />
        )}
        <ProfilePage
          patientProfile={patientProfile}
          onSaveProfile={handleSavePatientProfile}
          onLogout={handleLogout}
          onBack={() => navigateToRole('patient')}
          currentLanguage={userLanguage}
          onSelectLanguage={handleSelectLanguage}
          currentMode={userMode}
          onSelectMode={handleSelectMode}
          currentTheme={theme}
          onToggleTheme={handleToggleTheme}
          onNotify={(msg, type) => addToast(msg, type)}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  // ── Render Patient Portal (Default, includes AYUSETU Mode) ──
  return (
    <div className={`app-wrapper ${isElderly ? 'is-elderly-theme' : 'is-modern-theme'} ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      {/* Theme sweep bar */}
      {sweepState.active && (
        <div
          className={`theme-sweep-bar to-${sweepState.targetTheme}`}
          aria-hidden="true"
        />
      )}

      {/* Navbar with Language, Theme & Top-Right Profile PFP */}
      <Navbar
        currentLanguage={userLanguage}
        onOpenLanguageModal={handleOpenLanguageModal}
        currentTheme={theme}
        onToggleTheme={handleToggleTheme}
        patientProfile={patientProfile}
        onOpenProfile={() => navigateToRole('profile')}
      />

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Hero */}
          <Hero
            isElderly={isElderly}
            t={t}
            onAyusetuIntake={scrollToAyusetuIntake}
            onVoiceIntake={scrollToVoiceIntake}
            onOcrIntake={scrollToOcrIntake}
          />

          {/* Clinical Module Switcher */}
          <div className="intake-module-switcher">
            <button
              type="button"
              className={`module-switch-btn ${activeIntakeModule === 'ayusetu' ? 'is-active' : ''}`}
              onClick={() => setActiveIntakeModule('ayusetu')}
            >
              <Leaf size={18} style={{ color: '#16A34A' }} />
              <span>{isElderly ? 'पूर्व-परामर्श (Pre-Consultation)' : 'Pre-Consultation'}</span>
            </button>
            <button
              type="button"
              className={`module-switch-btn ${activeIntakeModule === 'voice' ? 'is-active' : ''}`}
              onClick={() => setActiveIntakeModule('voice')}
            >
              <Mic size={18} />
              <span>{isElderly ? 'माइक से लक्षण बताएं (Voice Intake)' : 'Multilingual Voice Intake'}</span>
            </button>
            <button
              type="button"
              className={`module-switch-btn ${activeIntakeModule === 'ocr' ? 'is-active' : ''}`}
              onClick={() => setActiveIntakeModule('ocr')}
            >
              <FileText size={18} />
              <span>{isElderly ? 'दवा पर्ची स्कैन करें (Prescription OCR)' : 'Prescription & Lab OCR Digitizer'}</span>
            </button>
            <button
              type="button"
              className={`module-switch-btn ${activeIntakeModule === 'all' ? 'is-active' : ''}`}
              onClick={() => setActiveIntakeModule('all')}
            >
              <Activity size={18} />
              <span>View All Clinical Tools</span>
            </button>
          </div>

          {/* Module 0: Pre-Consultation Protocol with Dashavidha Pariksha & Dataset Explorer */}
          {(activeIntakeModule === 'ayusetu' || activeIntakeModule === 'all') && (
            <div id="ayusetu-intake-section">
              <AyusetuIntakeMode
                userLanguage={userLanguage}
                isElderly={isElderly}
                patientProfile={patientProfile}
                onNotify={(msg, type) => addToast(msg, type)}
                onSwitchToDoctor={() => navigateToRole('doctor')}
                onBackToMain={() => navigateToRole('role-select')}
              />
            </div>
          )}

          {/* Module 1: Multilingual Indic Voice Intake */}
          {(activeIntakeModule === 'voice' || activeIntakeModule === 'all') && (
            <VoiceIntake
              userLanguage={userLanguage}
              isElderly={isElderly}
              patientProfile={patientProfile}
              t={t}
              onNotify={(msg, type) => addToast(msg, type)}
            />
          )}

          {/* Module 2: Medical Prescription & Lab Document OCR */}
          {(activeIntakeModule === 'ocr' || activeIntakeModule === 'all') && (
            <MedicalOcr
              isElderly={isElderly}
              patientProfile={patientProfile}
              t={t}
              onNotify={(msg, type) => addToast(msg, type)}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer t={t} />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Onboarding / Setup Preference Modal (shown only on first visit if not setup) */}
      <ModeSelectionModal
        isOpen={showModeModal}
        step={modalStep}
        onStepChange={setModalStep}
        currentLanguage={userLanguage}
        onSelectLanguage={handleSelectLanguage}
        currentMode={userMode}
        onSelectMode={handleSelectMode}
        patientProfile={patientProfile}
        onCompleteSetup={handleCompleteOnboarding}
        onClose={handleCloseModal}
      />
    </div>
  );
}
