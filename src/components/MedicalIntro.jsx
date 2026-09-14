import React, { useEffect } from 'react';
import {
  Mic,
  FileText,
  Stethoscope,
  ArrowRight,
  Heart,
  ShieldCheck,
  Languages,
  Sparkles
} from 'lucide-react';
import './MedicalIntro.css';

export default function MedicalIntro({ onEnterPatient, onEnterDoctor }) {
  // Keyboard shortcut: Pressing Enter starts patient check-in
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        onEnterPatient?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEnterPatient]);

  return (
    <main className="soothing-intro">
      {/* Gentle ambient background rings (calming, slow, soft) */}
      <div className="soothing-bg-glow glow-top" aria-hidden="true" />
      <div className="soothing-bg-glow glow-bottom" aria-hidden="true" />

      {/* Top Friendly Header */}
      <header className="soothing-header">
        <div className="soothing-brand">
          <div className="soothing-logo-badge">
            <Heart size={20} className="heart-icon" />
          </div>
          <div className="brand-text-group">
            <span className="brand-name">PreConsult <strong>AYUSETU</strong></span>
            <span className="brand-native">आयुसेतु</span>
          </div>
        </div>

        <div className="soothing-header-pills">
          <span className="header-pill">
            <Languages size={15} />
            <span>10+ Indian Languages</span>
          </span>
          <span className="header-pill abha-pill">
            <ShieldCheck size={15} />
            <span>ABHA Ready</span>
          </span>
        </div>
      </header>

      {/* Center Welcome Container */}
      <section className="soothing-content">
        {/* Gentle Emblem Badge */}
        <div className="soothing-emblem-wrap">
          <div className="soothing-emblem-aura" aria-hidden="true" />
          <div className="soothing-emblem">
            <div className="emblem-inner">
              <Heart size={42} className="emblem-heart" />
              <Stethoscope size={28} className="emblem-stethoscope" />
            </div>
          </div>
        </div>

        {/* Soothing Greeting & Titles */}
        <div className="soothing-text-center">
          <div className="soothing-eyebrow">
            <Sparkles size={14} className="sparkle-icon" />
            <span>नमस्ते • WELCOME TO EASY HEALTHCARE</span>
          </div>

          <h1 className="soothing-title">
            <span className="title-native">आयुसेतु</span>
            <span className="title-english">AYUSETU</span>
          </h1>

          <p className="soothing-tagline">
            Simple Health Check-In Before You Meet Your Doctor
          </p>

          <p className="soothing-description">
            No complicated forms or tech hassle. Just speak in your own language
            or share your previous prescriptions. We prepare everything neatly for your doctor.
          </p>
        </div>

        {/* 3 Simple Visual Steps (Especially clear for elderly) */}
        <div className="soothing-steps-grid">
          <div className="soothing-step-card">
            <div className="step-icon-box step-icon-mic">
              <Mic size={24} />
            </div>
            <div className="step-content">
              <span className="step-num">Step 1</span>
              <h3 className="step-heading">Speak Naturally</h3>
              <p className="step-desc">
                Talk in Hindi, Kannada, Tamil, English, or your mother tongue.
              </p>
            </div>
          </div>

          <div className="soothing-step-card">
            <div className="step-icon-box step-icon-doc">
              <FileText size={24} />
            </div>
            <div className="step-content">
              <span className="step-num">Step 2</span>
              <h3 className="step-heading">Past Medicines</h3>
              <p className="step-desc">
                Optionally take a photo of old medicine slips or lab reports.
              </p>
            </div>
          </div>

          <div className="soothing-step-card">
            <div className="step-icon-box step-icon-care">
              <Stethoscope size={24} />
            </div>
            <div className="step-content">
              <span className="step-num">Step 3</span>
              <h3 className="step-heading">Meet Your Doctor</h3>
              <p className="step-desc">
                Your doctor gets your complete summary ready before you walk in.
              </p>
            </div>
          </div>
        </div>

        {/* Big, Friendly, Easy-to-Tap Action Buttons */}
        <div className="soothing-actions">
          <button
            type="button"
            className="soothing-btn-primary"
            onClick={onEnterPatient}
            aria-label="Start Patient Check-In"
          >
            <div className="btn-main-label">
              <span className="btn-text-large">Start Patient Check-In</span>
              <span className="btn-text-sub">मरीज़ परामर्श शुरू करें • Easy Voice & Steps</span>
            </div>
            <div className="btn-arrow-bubble">
              <ArrowRight size={22} />
            </div>
          </button>

          <button
            type="button"
            className="soothing-btn-doctor"
            onClick={onEnterDoctor}
            aria-label="Doctor & Hospital Staff Login"
          >
            <Stethoscope size={18} />
            <span>Doctor & Clinic Portal</span>
          </button>
        </div>

        {/* Warm Comfort Footnote */}
        <div className="soothing-footer-note">
          <span>🌿 Ayurveda &amp; Modern Health Integrated</span>
          <span className="note-bullet">•</span>
          <span>🔒 100% Private &amp; Secure</span>
          <span className="note-bullet">•</span>
          <span>🎙️ Voice Assistance Enabled</span>
        </div>
      </section>
    </main>
  );
}
