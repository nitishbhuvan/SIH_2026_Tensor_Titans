import React from 'react';
import {
  ArrowRight,
  FileText,
  HeartPulse,
  Search,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import './MedicalIntro.css';

export default function MedicalIntro({ onEnterPatient, onEnterDoctor, onSkip }) {
  return (
    <main className="medical-intro">
      <div className="medical-intro-grid" aria-hidden="true" />
      <div className="medical-intro-glow medical-intro-glow-one" aria-hidden="true" />
      <div className="medical-intro-glow medical-intro-glow-two" aria-hidden="true" />

      <header className="medical-intro-header">
        <span className="medical-intro-brand">Pre<span>Consult</span></span>
        <span className="medical-intro-status"><i /> Clinical access system online</span>
      </header>

      <section className="medical-intro-stage" aria-label="PreConsult introduction">
        <div className="medical-document medical-document-left" aria-hidden="true">
          <FileText size={22} />
          <span>Patient History</span>
          <b />
          <b />
          <b />
          <small>OPD / PC-2048</small>
        </div>
        <div className="medical-document medical-document-right" aria-hidden="true">
          <FileText size={22} />
          <span>Clinical Note</span>
          <b />
          <b />
          <b />
          <small>SOAP / VERIFIED</small>
        </div>

        <div className="medical-intro-orbit medical-intro-orbit-one" aria-hidden="true" />
        <div className="medical-intro-orbit medical-intro-orbit-two" aria-hidden="true" />
        <div className="medical-magnifier" aria-hidden="true"><Search size={43} /></div>
        <div className="medical-heart" aria-hidden="true"><HeartPulse size={70} /></div>
        <div className="medical-stethoscope" aria-hidden="true"><Stethoscope size={142} strokeWidth={1.1} /></div>
      </section>

      <section className="medical-intro-copy">
        <span className="medical-intro-eyebrow"><ShieldCheck size={15} /> ACCESSIBLE DIGITAL HEALTHCARE</span>
        <h1>Your health story,<br /><em>understood better.</em></h1>
        <p>Begin a calmer, clearer pre-consultation journey with multilingual voice intake and clinical support.</p>
        <div className="medical-intro-actions">
          <button type="button" className="medical-intro-primary" onClick={onEnterPatient}>
            Enter Patient Portal <ArrowRight size={18} />
          </button>
          <button type="button" className="medical-intro-secondary" onClick={onEnterDoctor}>
            Doctor Login
          </button>
        </div>
        <button type="button" className="medical-intro-skip" onClick={onSkip}>Skip intro and choose a role</button>
      </section>

      <footer className="medical-intro-footer">
        <span>PRECONSULT / NIDAN-AI</span>
        <span>Multilingual • Private • Patient-first</span>
      </footer>
    </main>
  );
}
