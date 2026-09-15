import React from 'react';
import { Mic, FileText, Leaf } from 'lucide-react';
import './Hero.css';

export default function Hero({ isElderly, t, onVoiceIntake, onOcrIntake, onAyusetuIntake }) {
  return (
    <section className="hero-section">

      {/* Hero Content */}
      <div className="hero-content">
        <h1 className="hero-title">
          {isElderly ? (t.heroTitleElderly || 'Welcome to AYUSETU') : (t.heroTitleModern || 'Smart Healthcare Pre-Consultation')}
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
            <span>{t.heroPreConsultCta || 'Pre-Consultation (AYUSETU Protocol)'}</span>
          </button>

          <button
            type="button"
            className="hero-cta hero-cta-voice"
            onClick={onVoiceIntake}
            aria-label="Start Voice Intake"
          >
            <Mic size={isElderly ? 22 : 18} aria-hidden="true" />
            <span>{t.heroVoiceCta || 'Speak Symptoms (Voice Intake)'}</span>
          </button>

          <button
            type="button"
            className="hero-cta hero-cta-secondary"
            onClick={onOcrIntake}
            aria-label="Scan Prescription"
          >
            <FileText size={isElderly ? 20 : 16} aria-hidden="true" />
            <span>{t.heroOcrCta || 'Scan Prescription / Lab (OCR)'}</span>
          </button>
        </div>
      </div>

    </section>
  );
}
