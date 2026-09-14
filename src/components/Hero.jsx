import React from 'react';
import { Mic, FileText, Leaf } from 'lucide-react';
import './Hero.css';

export default function Hero({ isElderly, t, onVoiceIntake, onOcrIntake, onAyusetuIntake }) {
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
