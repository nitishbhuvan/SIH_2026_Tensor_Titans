import React from 'react';
import './Hero.css';

export default function Hero({ isElderly, t }) {
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
          SYSTEM ONLINE
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
      </div>

      {/* Bottom metadata */}
      <div className="hero-footer-meta">
        <span>PRECONSULT CLINICAL SUITE</span>
        <span>DATE: {dateStr}</span>
      </div>
    </section>
  );
}
