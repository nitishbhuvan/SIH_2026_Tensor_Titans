import React from 'react';
import { Heart, Stethoscope, ChevronRight, Activity, Mic, Shield, Scale, ExternalLink } from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';
import nidanLogo from '../assets/NIDAN_logo.png';
import './RoleSelection.css';

const GITHUB_REPO_URL = 'https://github.com/nitishbhuvan/SIH_2026_Tensor_Titans';

export default function RoleSelection({ theme, onToggleTheme, onSelectRole }) {
  return (
    <div className="role-selection-page">
      {/* Fixed Top Bar */}
      <header className="rs-topbar">
        <div className="rs-topbar-brand">
          <img src={nidanLogo} alt="NIDAN Logo" className="rs-topbar-logo-img" />
          <span>NIDAN</span>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </header>

      <div className="rs-topbar-spacer" />

      <div className="role-selection-inner">
        {/* Brand / Logo */}
        <div className="rs-brand-area">
          <img src={nidanLogo} alt="NIDAN Logo" className="rs-brand-hero-logo" />
          <div className="rs-brand-logo">
            NIDAN <span>PreConsult</span>
          </div>
          <p className="rs-brand-tagline">
            Multilingual Clinical Voice Intake &amp; OPD Pre-Consultation Triage • Smart India Hackathon 2026 — Tensor Titans
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
                Multilingual Indic Voice Symptom Intake (Hindi, Kannada, Tamil, Telugu &amp; more)
              </li>
              <li>
                <span className="rs-feature-dot" />
                Elderly-accessible mode with large text &amp; high contrast
              </li>
              <li>
                <span className="rs-feature-dot" />
                AI-powered SOAP note generation with Ayurvedic term preservation
              </li>
              <li>
                <span className="rs-feature-dot" />
                Emergency helpline &amp; OPD consultation booking
              </li>
            </ul>

            <span className="rs-card-cta">
              <Mic size={15} />
              Enter as Patient
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
                Structured SOAP notes from patient voice intake in seconds
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

        {/* Legal & GitHub Navigation Links (opens in separate tabs) */}
        <div className="rs-footer-links">
          <a
            href="#/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="rs-footer-link"
            title="Open Terms & Conditions in a new tab"
          >
            <Scale size={13} />
            <span>Terms &amp; Conditions</span>
            <ExternalLink size={10} />
          </a>
          <span className="rs-footer-dot">•</span>
          <a
            href="#/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="rs-footer-link"
            title="Open Privacy Policy in a new tab"
          >
            <Shield size={13} />
            <span>Privacy Policy</span>
            <ExternalLink size={10} />
          </a>
          <span className="rs-footer-dot">•</span>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rs-footer-link rs-github-link"
            title="Open GitHub Repository in a new tab"
          >
            <svg
              height="13"
              width="13"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span>GitHub Repository</span>
            <ExternalLink size={10} />
          </a>
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
