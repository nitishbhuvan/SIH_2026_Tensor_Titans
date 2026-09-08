import React from 'react';
import { ArrowRight, Mic } from 'lucide-react';
import './Hero.css';

export default function Hero({ isElderly, t, onFindDoctor, onVoiceIntake }) {
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
          {'// CLINICAL OPD INTAKE & HEALTHCARE SERVICES'}
        </span>
        <span className="hero-meta__status">
          <span className="hero-status-dot" aria-hidden="true" />
          SYSTEM OPERATIONAL
        </span>
      </div>

      {/* Hero Content */}
      <div className="hero-content">
        <h1 className="hero-title">
          {isElderly ? t.heroTitleElderly : t.heroTitleModern}
        </h1>

        <p className="hero-subtitle">
          {isElderly ? t.heroSubElderly : t.heroSubModern}
        </p>

        <div className="hero-actions">
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
            onClick={onFindDoctor}
          >
            {isElderly ? t.cardDoctorBtnElderly : t.cardDoctorBtnModern}
            <ArrowRight size={isElderly ? 20 : 16} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Bottom metadata */}
      <div className="hero-footer-meta">
        <span>PRECONSULT / PATIENT SERVICES</span>
        <span>LAST UPDATED {dateStr}</span>
      </div>
    </section>
  );
}
