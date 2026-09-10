import React, { useState, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { Stethoscope, FileText, Phone } from 'lucide-react';
import Navbar from './components/Navbar.jsx';
import ModeSelectionModal from './components/ModeSelectionModal.jsx';
import LegalPage from './components/LegalPage.jsx';
import Hero from './components/Hero.jsx';
import VoiceIntake from './components/VoiceIntake.jsx';
import ActionCard from './components/ActionCard.jsx';
import ToastContainer from './components/Toast.jsx';
import Footer from './components/Footer.jsx';
import RoleSelection from './components/RoleSelection.jsx';
import DoctorPortal from './components/DoctorPortal.jsx';
import DoctorLogin, { DEMO_DOCTOR_PROFILE } from './components/DoctorLogin.jsx';
import { translations } from './translations.js';

const ROLE_STORAGE_KEY = 'preconsult_user_role';
const LANGUAGE_STORAGE_KEY = 'preconsult_user_language';
const MODE_STORAGE_KEY = 'preconsult_user_mode';
const THEME_STORAGE_KEY = 'preconsult_color_theme';
const DOCTOR_SESSION_KEY = 'preconsult_doctor_session';

let toastIdCounter = 0;

function getInitialRole() {
  const hash = window.location.hash.toLowerCase();
  if (hash === '#/terms' || hash === '#terms') return 'terms';
  if (hash === '#/privacy' || hash === '#privacy') return 'privacy';
  if (hash === '#/doctor' || hash === '#doctor') return 'doctor';
  if (hash === '#/patient' || hash === '#patient') return 'patient';
  if (hash === '#/role-select' || hash === '#role-select') return 'role-select';
  
  const savedRole = localStorage.getItem(ROLE_STORAGE_KEY);
  if (savedRole === 'doctor' || savedRole === 'patient') {
    return savedRole;
  }
  return 'role-select';
}

export default function App() {
  // Current active view / role: 'role-select' | 'patient' | 'doctor' | 'terms' | 'privacy'
  const [currentRole, setCurrentRole] = useState(getInitialRole);

  // Language Preference
  const [userLanguage, setUserLanguage] = useState(() => {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en';
  });

  // Accessibility Mode: Elderly vs Modern
  const [userMode, setUserMode] = useState(() => {
    return localStorage.getItem(MODE_STORAGE_KEY) || 'modern';
  });

  // Onboarding / Preference Modal State (First Visit in Patient Portal)
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
      if (hash === '#/terms' || hash === '#terms') {
        setCurrentRole('terms');
      } else if (hash === '#/privacy' || hash === '#privacy') {
        setCurrentRole('privacy');
      } else if (hash === '#/doctor' || hash === '#doctor') {
        setCurrentRole('doctor');
      } else if (hash === '#/patient' || hash === '#patient') {
        setCurrentRole('patient');
      } else if (hash === '#/role-select' || hash === '#role-select' || hash === '' || hash === '#/') {
        setCurrentRole('role-select');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // ── Navigation handler ──
  const navigateToRole = (role) => {
    if (role === 'terms') {
      window.location.hash = '#/terms';
      setCurrentRole('terms');
    } else if (role === 'privacy') {
      window.location.hash = '#/privacy';
      setCurrentRole('privacy');
    } else if (role === 'doctor') {
      window.location.hash = '#/doctor';
      localStorage.setItem(ROLE_STORAGE_KEY, 'doctor');
      setCurrentRole('doctor');
    } else if (role === 'patient') {
      window.location.hash = '#/patient';
      localStorage.setItem(ROLE_STORAGE_KEY, 'patient');
      setCurrentRole('patient');
    } else {
      window.location.hash = '#/role-select';
      localStorage.removeItem(ROLE_STORAGE_KEY);
      localStorage.removeItem(DOCTOR_SESSION_KEY);
      setDoctorSession(null);
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

  // ── Toast helpers ──
  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Language & Mode handlers ──
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

  const scrollToVoiceIntake = () => {
    const el = document.getElementById('voice-intake-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const isElderly = userMode === 'elderly';
  const t = translations[userLanguage] || translations.en;

  // ── Dedicated Standalone Full Page: Terms and Conditions ──
  if (currentRole === 'terms') {
    return (
      <LegalPage
        type="terms"
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onNavigate={navigateToRole}
      />
    );
  }

  // ── Dedicated Standalone Full Page: Privacy Policy ──
  if (currentRole === 'privacy') {
    return (
      <LegalPage
        type="privacy"
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onNavigate={navigateToRole}
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
          onLogout={() => {
            localStorage.removeItem(DOCTOR_SESSION_KEY);
            setDoctorSession(null);
          }}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  // ── Render Patient Portal (Default) ──
  return (
    <div className={`app-wrapper ${isElderly ? 'is-elderly-theme' : 'is-modern-theme'} ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      {/* Theme sweep bar */}
      {sweepState.active && (
        <div
          className={`theme-sweep-bar to-${sweepState.targetTheme}`}
          aria-hidden="true"
        />
      )}

      {/* Navbar with Direct Mode, Language Controls & Switch Role */}
      <Navbar
        currentMode={userMode}
        currentLanguage={userLanguage}
        onOpenModeModal={handleOpenModeModal}
        onOpenLanguageModal={handleOpenLanguageModal}
        onSwitchRole={navigateToRole}
        currentTheme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Hero */}
          <Hero
            isElderly={isElderly}
            t={t}
            onVoiceIntake={scrollToVoiceIntake}
            onFindDoctor={() => addToast(
              isElderly
                ? (t.cardDoctorDescElderly || 'Searching for doctors near you…')
                : 'Searching for specialists in your area…',
              'info'
            )}
          />

          {/* Multilingual Indic Voice Intake & Clinical Translation Section */}
          <VoiceIntake
            userLanguage={userLanguage}
            isElderly={isElderly}
            t={t}
            onNotify={(msg, type) => addToast(msg, type)}
          />

          {/* Service Modules Grid */}
          <div className="service-grid">
            <ActionCard
              icon={Stethoscope}
              title={t.cardDoctorTitle}
              description={isElderly ? t.cardDoctorDescElderly : t.cardDoctorDescModern}
              buttonLabel={isElderly ? t.cardDoctorBtnElderly : t.cardDoctorBtnModern}
              serviceId="SVC-001"
              isElderly={isElderly}
              onClick={() => addToast(
                isElderly
                  ? (t.cardDoctorDescElderly || 'Finding doctors…')
                  : 'Loading specialist directory…',
                'info'
              )}
            />

            <ActionCard
              icon={FileText}
              title={t.cardRecordsTitle}
              description={isElderly ? t.cardRecordsDescElderly : t.cardRecordsDescModern}
              buttonLabel={isElderly ? t.cardRecordsBtnElderly : t.cardRecordsBtnModern}
              serviceId="SVC-002"
              isElderly={isElderly}
              onClick={() => addToast(
                isElderly
                  ? (t.cardRecordsBtnElderly || 'Opening records…')
                  : 'Loading health records…',
                'success'
              )}
            />

            <ActionCard
              icon={Phone}
              title={t.cardEmergencyTitle}
              description={isElderly ? t.cardEmergencyDescElderly : t.cardEmergencyDescModern}
              buttonLabel={isElderly ? t.cardEmergencyBtnElderly : t.cardEmergencyBtnModern}
              variant="emergency"
              serviceId="SVC-003"
              isElderly={isElderly}
              onClick={() => addToast(
                isElderly
                  ? (t.cardEmergencyBtnElderly || 'Contacting helpline…')
                  : 'Connecting to emergency response…',
                'warning'
              )}
            />
          </div>
        </div>
      </main>

      {/* Footer with New-Tab Links */}
      <Footer
        t={t}
        isElderly={isElderly}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Onboarding / Language & Mode Preference Modal */}
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
