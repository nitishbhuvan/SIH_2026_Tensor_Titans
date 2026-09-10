import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  FileText,
  HeartPulse,
  ShieldCheck,
  Activity,
  Stethoscope,
  Zap
} from 'lucide-react';
import './MedicalIntro.css';

export default function MedicalIntro({ onEnterPatient, onEnterDoctor, onSkip }) {
  const stageRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onSkip?.();
      } else if (e.key === 'Enter') {
        onEnterPatient?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSkip, onEnterPatient]);

  // Subtle 3D mouse parallax on stage
  const handleMouseMove = (e) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const maxTilt = 6; // degrees
    const tiltX = -(mouseY / (rect.height / 2)) * maxTilt;
    const tiltY = (mouseX / (rect.width / 2)) * maxTilt;
    setTilt({
      x: Math.max(-maxTilt, Math.min(maxTilt, tiltX)),
      y: Math.max(-maxTilt, Math.min(maxTilt, tiltY))
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <main
      className="medical-intro"
      onMouseMove={() => !isHovered && setIsHovered(true)}
    >
      {/* AYUSETU Mountain & Bridge Scenery Artwork Backdrop */}
      <div className="medical-mountain-backdrop" aria-hidden="true">
        <div className="mountain-scenery-artwork" />
        <div className="mountain-scenery-radiance" />
        <div className="mountain-scenery-overlay" />
      </div>

      {/* Background Ambience & Perspective Grid */}
      <div className="medical-intro-grid" aria-hidden="true" />
      <div className="medical-pulse-backdrop" aria-hidden="true">
        <HeartPulse className="background-heart-outline" size={440} strokeWidth={1.2} />
        <span className="background-heart-core" />
      </div>
      <div className="medical-particle-field" aria-hidden="true" />
      <div className="medical-intro-glow medical-intro-glow-one" aria-hidden="true" />
      <div className="medical-intro-glow medical-intro-glow-two" aria-hidden="true" />

      {/* Live Background ECG Waveform */}
      <div className="medical-ecg-stream" aria-hidden="true">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8fc4bd" stopOpacity="0" />
              <stop offset="15%" stopColor="#8fc4bd" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#48dfb2" stopOpacity="0.85" />
              <stop offset="85%" stopColor="#8fc4bd" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#8fc4bd" stopOpacity="0" />
            </linearGradient>
            <filter id="ecgGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            className="ecg-path"
            d="M 0 60 L 180 60 L 200 60 L 215 48 L 225 72 L 235 60 L 250 60 L 265 18 L 280 102 L 295 60 L 310 60 L 325 50 L 340 60 L 520 60 L 540 60 L 555 48 L 565 72 L 575 60 L 590 60 L 605 18 L 620 102 L 635 60 L 650 60 L 665 50 L 680 60 L 860 60 L 880 60 L 895 48 L 905 72 L 915 60 L 930 60 L 945 18 L 960 102 L 975 60 L 990 60 L 1005 50 L 1020 60 L 1200 60"
            fill="none"
            stroke="url(#ecgGrad)"
            strokeWidth="2.4"
            filter="url(#ecgGlow)"
          />
        </svg>
      </div>

      {/* Top Telemetry Header */}
      <header className="medical-intro-header">
        <div className="medical-intro-brand">
          <span className="brand-dot" />
          Pre<span>Consult</span>
          <span className="brand-badge">AYUSETU</span>
        </div>
        <div className="medical-intro-telemetry">
          <span className="telemetry-pill">
            <Activity size={13} className="telemetry-pulse-icon" />
            <b>72 BPM</b> SINUS RHYTHM
          </span>
          <span className="telemetry-pill live-status">
            <i className="status-live-dot" /> NIDAN-AI ONLINE
          </span>
        </div>
      </header>

      {/* Central 3D Interactive Stage */}
      <section
        className="medical-intro-stage"
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(950px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
        }}
        aria-label="Ayusetu introduction interactive stage"
      >
        {/* Document 1: Back Left (Vitals) */}
        <div className="medical-document medical-document-back-left" aria-hidden="true">
          <div className="doc-chip"><Activity size={12} /> VITALS</div>
          <div className="doc-vital-row">
            <span>HR</span>
            <b>72 bpm</b>
          </div>
          <div className="doc-vital-row">
            <span>SpO2</span>
            <b>99%</b>
          </div>
          <div className="doc-vital-row">
            <span>BP</span>
            <b>120/80</b>
          </div>
          <div className="doc-badge-optimal">STABLE</div>
        </div>

        {/* Document 2: Front Left (Patient File) */}
        <div className="medical-document medical-document-left" aria-hidden="true">
          <div className="doc-header">
            <FileText size={16} />
            <div>
              <span className="doc-title">Patient Intake</span>
              <small className="doc-sub">OPD / PC-2048</small>
            </div>
          </div>
          <div className="doc-meta-item">
            <span className="doc-label">Prakriti:</span>
            <span className="doc-val">Pitta-Vata</span>
          </div>
          <div className="doc-meta-item">
            <span className="doc-label">Voice Intake:</span>
            <span className="doc-val highlight">Indic ASR Ready</span>
          </div>
          <div className="doc-lines">
            <b />
            <b />
            <b />
          </div>
          <small className="doc-footer-tag">AYUSH CLINICAL FILE</small>
        </div>

        {/* Document 3: Back Right (Diagnostic Triage) */}
        <div className="medical-document medical-document-back-right" aria-hidden="true">
          <div className="doc-chip"><Zap size={12} /> TRIAGE</div>
          <div className="doc-vital-row">
            <span>Triage</span>
            <b>Routine</b>
          </div>
          <div className="doc-vital-row">
            <span>Red Flags</span>
            <b>0 Alert</b>
          </div>
          <div className="doc-vital-row">
            <span>Terms</span>
            <b>100% Retained</b>
          </div>
          <div className="doc-badge-optimal">VERIFIED</div>
        </div>

        {/* Document 4: Front Right (SOAP Clinical Note) */}
        <div className="medical-document medical-document-right" aria-hidden="true">
          <div className="doc-header">
            <FileText size={16} />
            <div>
              <span className="doc-title">Clinical Note</span>
              <small className="doc-sub">SOAP SYNTHESIS</small>
            </div>
          </div>
          <div className="doc-soap-snippet">
            <div><b>S:</b> Retrosternal pyrosis</div>
            <div><b>O:</b> Stable Vitals (72 bpm)</div>
            <div><b>A:</b> Amlapitta (Mild GERD)</div>
            <div><b>P:</b> Triphala + Dashamula</div>
          </div>
          <small className="doc-footer-tag verified">
            <ShieldCheck size={12} /> PRESERVED & SECURE
          </small>
        </div>

        {/* Pulse Concentric Rings */}
        <div className="medical-intro-orbit medical-intro-orbit-one" aria-hidden="true" />
        <div className="medical-intro-orbit medical-intro-orbit-two" aria-hidden="true" />
        <div className="medical-pulse-ring pulse-ring-1" aria-hidden="true" />
        <div className="medical-pulse-ring pulse-ring-2" aria-hidden="true" />

        {/* Magnifier Glass Scanner */}
        <div className="medical-magnifier" aria-hidden="true">
          <span className="magnifier-lens"><i /></span>
          <span className="magnifier-handle" />
        </div>

        {/* Central Realistic Stethoscope with Gradient Light */}
        <div className="medical-stethoscope" aria-hidden="true">
          <svg viewBox="0 0 180 190" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="stethoscopeTube" x1="35" y1="20" x2="145" y2="155" gradientUnits="userSpaceOnUse">
                <stop stopColor="#e4f4f0" />
                <stop offset="0.32" stopColor="#8fc4bd" />
                <stop offset="0.75" stopColor="#41847e" />
                <stop offset="1" stopColor="#1e4e4a" />
              </linearGradient>
              <radialGradient id="stethoscopeChest" cx="35%" cy="25%" r="80%">
                <stop stopColor="#fff3d6" />
                <stop offset="0.45" stopColor="#c9a769" />
                <stop offset="1" stopColor="#5c442a" />
              </radialGradient>
              <filter id="stethoscopeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#000000" floodOpacity="0.5" />
                <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#8fc4bd" floodOpacity="0.25" />
              </filter>
            </defs>
            <path className="stethoscope-tube-shadow" d="M43 20V62C43 91 61 108 90 108C119 108 137 91 137 62V20" />
            <path className="stethoscope-tube" d="M43 20V62C43 91 61 108 90 108C119 108 137 91 137 62V20" filter="url(#stethoscopeGlow)" />
            <path className="stethoscope-branch" d="M43 20L36 12M137 20L144 12" />
            <circle className="stethoscope-ear" cx="35" cy="10" r="6" />
            <circle className="stethoscope-ear" cx="145" cy="10" r="6" />
            <path className="stethoscope-stem" d="M90 108V130C90 141 99 149 110 149H123" />
            <circle className="stethoscope-chest" cx="137" cy="149" r="20" />
            <circle className="stethoscope-diaphragm" cx="137" cy="149" r="13" />
            <path className="stethoscope-highlight" d="M128 141C131 137 136 135 141 136" />
          </svg>
        </div>
      </section>

      {/* Typography & Call-To-Actions Section */}
      <section className="medical-intro-copy">
        <div className="medical-intro-eyebrow">
          <ShieldCheck size={14} className="shield-icon" />
          <span>ACCESSIBLE MULTILINGUAL PRE-CONSULTATION</span>
          <span className="eyebrow-divider">•</span>
          <span className="eyebrow-highlight">AYURVEDA + ALLOPATHY</span>
        </div>

        {/* AYUSETU Brand Lockup */}
        <div className="medical-title-lockup">
          <span className="medical-title-line line-left" />
          <h1 aria-label="AYUSETU" className="ayusetu-title">
            {Array.from('AYUSETU').map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                style={{ animationDelay: `${0.45 + index * 0.05}s` }}
                aria-hidden="true"
              >
                {letter}
              </span>
            ))}
          </h1>
          <span className="medical-title-line line-right" />
        </div>

        {/* Authentic Devanagari Native Script & Slogan from Artwork */}
        <div className="medical-native-lockup">
          <span className="native-rule" />
          <span className="medical-native-title">आयुसेतु</span>
          <span className="native-rule" />
        </div>

        <p className="medical-title-tagline">
          CONNECTING CARE <span className="tagline-dot">•</span> ACROSS LIVES
        </p>

        <p className="medical-intro-message">
          Bridging patients and healthcare through Indic voice intake, Ayurvedic clinical correlation,
          and physician-ready SOAP documentation before consultation begins.
        </p>

        <div className="medical-intro-actions">
          <button
            type="button"
            className="medical-intro-primary"
            onClick={onEnterPatient}
          >
            <span className="btn-shine" />
            <span>Enter Patient Portal</span>
            <ArrowRight size={17} className="btn-arrow" />
          </button>

          <button
            type="button"
            className="medical-intro-secondary"
            onClick={onEnterDoctor}
          >
            <Stethoscope size={16} />
            <span>Doctor Clinical Login</span>
          </button>
        </div>

        <button
          type="button"
          className="medical-intro-skip"
          onClick={onSkip}
        >
          Skip intro and choose role <kbd className="kbd-shortcut">Esc</kbd>
        </button>
      </section>

      {/* Footer System Specs */}
      <footer className="medical-intro-footer">
        <div className="footer-left">
          <span>PRECONSULT / NIDAN-AI</span>
          <span className="footer-dot">•</span>
          <span>SIH 2026 CLINICAL ACCESS</span>
        </div>
        <div className="footer-right">
          <span>Multilingual Indic Voice</span>
          <span className="footer-dot">•</span>
          <span>HIPAA &amp; Ayush Compliant</span>
        </div>
      </footer>
    </main>
  );
}
