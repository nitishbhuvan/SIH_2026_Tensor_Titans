import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import ModeSelectionModal from './components/ModeSelectionModal.jsx';
import './App.css';

const STORAGE_KEY = 'preconsult_user_mode';

export default function App() {
  const [userMode, setUserMode] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || null;
  });

  const [showModeModal, setShowModeModal] = useState(() => {
    return !localStorage.getItem(STORAGE_KEY);
  });

  // Keep document.body class synchronized with the current mode
  useEffect(() => {
    if (userMode === 'elderly') {
      document.body.classList.add('mode-elderly');
      document.body.classList.remove('mode-modern');
    } else {
      document.body.classList.add('mode-modern');
      document.body.classList.remove('mode-elderly');
    }
  }, [userMode]);

  const handleSelectMode = (mode) => {
    setUserMode(mode);
    localStorage.setItem(STORAGE_KEY, mode);
    setShowModeModal(false);
  };

  const handleOpenModal = () => {
    setShowModeModal(true);
  };

  const handleCloseModal = () => {
    setShowModeModal(false);
  };


  const isElderly = userMode === 'elderly';

  return (
    <div className={`app-wrapper ${isElderly ? 'is-elderly-theme' : 'is-modern-theme'}`}>
      <Navbar
        currentMode={userMode}
        onOpenModeModal={handleOpenModal}
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
                  {isElderly ? 'Senior / Elderly Mode Active' : 'Modern Mode Active'}
                  <span style={{ fontSize: '0.88em', fontWeight: 600, color: 'inherit', marginLeft: '0.5rem' }}>
                    {isElderly ? '(वरिष्ठ मोड सक्रिय)' : '(आधुनिक मोड सक्रिय)'}
                  </span>
                </h2>
                <p className="mode-banner-sub">
                  {isElderly
                    ? 'Simplified view with large text & high contrast for easy reading • बड़े अक्षर और आसान दृश्य'
                    : 'Standard modern layout with full interactive features • मानक आधुनिक लेआउट'}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="btn-banner-switch"
              onClick={handleOpenModal}
              aria-label="Change Mode / मोड बदलें"
            >
              Change Mode • मोड बदलें
            </button>
          </div>

          {/* Hero Presentation */}
          <section className="hero-box">
            <h1 className="hero-box-title">
              {isElderly ? 'Welcome to PreConsult' : 'Smart Healthcare Pre-Consultation'}
              {isElderly && (
                <div style={{ fontSize: '0.7em', color: '#B45309', marginTop: '0.25rem' }}>
                  प्री-कंसल्ट में आपका स्वागत है
                </div>
              )}
            </h1>
            <p className="hero-box-subtitle">
              {isElderly
                ? 'Doctor consultations made simple, comfortable, and easy to understand for everyone.'
                : 'Empowering seamless pre-consultation diagnostics, scheduling, and patient history aggregation.'}
              {isElderly && (
                <span style={{ display: 'block', marginTop: '0.35rem', color: '#4B5563' }}>
                  डॉक्टर परामर्श को सभी के लिए सरल, आरामदायक और समझने में आसान बनाया गया है।
                </span>
              )}
            </p>
          </section>

          {/* Quick Action Cards */}
          <div className="cards-grid">
            <div className="action-card">
              <span className="action-card-icon" aria-hidden="true">👨‍⚕️</span>
              <h3 className="action-card-title">
                Find a Doctor
                {isElderly && <span style={{ display: 'block', fontSize: '0.85em', color: '#4B5563' }}>डॉक्टर खोजें</span>}
              </h3>
              <p className="action-card-desc">
                {isElderly
                  ? 'Connect with verified specialists near you with simple 1-click booking.'
                  : 'Search by specialty, location, availability, and user reviews.'}
                {isElderly && (
                  <span style={{ display: 'block', marginTop: '0.25rem' }}>
                    आसान 1-क्लिक बुकिंग के साथ अपने नजदीकी विशेषज्ञ से जुड़ें।
                  </span>
                )}
              </p>
              <button type="button" className="action-card-btn">
                {isElderly ? 'Book Doctor • डॉक्टर चुनें' : 'Find Specialists'}
              </button>
            </div>

            <div className="action-card">
              <span className="action-card-icon" aria-hidden="true">📋</span>
              <h3 className="action-card-title">
                Health Records
                {isElderly && <span style={{ display: 'block', fontSize: '0.85em', color: '#4B5563' }}>स्वास्थ्य रिपोर्ट</span>}
              </h3>
              <p className="action-card-desc">
                {isElderly
                  ? 'View your prescriptions, tests, and medical history in large, clear format.'
                  : 'Encrypted storage for lab reports, previous vitals, and longitudinal insights.'}
                {isElderly && (
                  <span style={{ display: 'block', marginTop: '0.25rem' }}>
                    अपने नुस्खे, जांच और चिकित्सा इतिहास को बड़े, स्पष्ट रूप में देखें।
                  </span>
                )}
              </p>
              <button type="button" className="action-card-btn">
                {isElderly ? 'View Records • रिपोर्ट देखें' : 'Manage Records'}
              </button>
            </div>

            <div className="action-card">
              <span className="action-card-icon" aria-hidden="true">🚨</span>
              <h3 className="action-card-title">
                Emergency Help
                {isElderly && <span style={{ display: 'block', fontSize: '0.85em', color: '#DC2626' }}>आपातकालीन सहायता</span>}
              </h3>
              <p className="action-card-desc">
                {isElderly
                  ? 'Instant access to emergency helpline, ambulance, and hospital support.'
                  : 'Direct link to rapid emergency response teams and nearest trauma centers.'}
                {isElderly && (
                  <span style={{ display: 'block', marginTop: '0.25rem' }}>
                    आपातकालीन हेल्पलाइन, एम्बुलेंस और अस्पताल सहायता तक त्वरित पहुंच।
                  </span>
                )}
              </p>
              <button
                type="button"
                className="action-card-btn"
                style={isElderly ? { backgroundColor: '#DC2626' } : {}}
              >
                {isElderly ? 'Call Helpline • कॉल करें (108)' : 'Emergency Response'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="simple-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} PreConsult &bull; Tensor Titans. Accessibility First Design.</p>
        </div>
      </footer>

      {/* Pop-up Modal */}
      <ModeSelectionModal
        isOpen={showModeModal}
        onSelectMode={handleSelectMode}
        currentMode={userMode}
        onClose={handleCloseModal}
      />
    </div>
  );
}
