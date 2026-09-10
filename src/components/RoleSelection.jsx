import React from 'react';
import { Heart, Stethoscope, ChevronRight, Activity, Mic, Shield, Leaf } from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';
import './RoleSelection.css';

export default function RoleSelection({ theme, onToggleTheme, onSelectRole }) {
  return (
    <div className="role-selection-page">
      {/* Fixed Top Bar */}
      <header className="rs-topbar">
        <span className="rs-topbar-brand">PreConsult</span>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </header>

      <div className="rs-topbar-spacer" />

      <div className="role-selection-inner">
        {/* Brand / Logo */}
        <div className="rs-brand-area">
          <div className="rs-brand-logo">
            Pre<span>Consult</span>
          </div>
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
