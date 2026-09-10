import React, { useEffect } from 'react';
import {
  Scale,
  Shield,
  ExternalLink,
  ArrowLeft,
  AlertTriangle,
  Lock,
  HeartPulse,
  Activity,
  FileCheck2,
  Share2
} from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';
import nidanLogo from '../assets/NIDAN_logo.png';
import './LegalPage.css';

const GITHUB_REPO_URL = 'https://github.com/nitishbhuvan/SIH_2026_Tensor_Titans';

export default function LegalPage({
  type = 'terms', // 'terms' | 'privacy'
  theme,
  onToggleTheme,
  onNavigate
}) {
  const isTerms = type === 'terms';

  // Scroll to top on load or switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = isTerms
      ? 'Terms & Conditions — NIDAN PreConsult (SIH 2026)'
      : 'Privacy Policy — NIDAN PreConsult (SIH 2026)';
  }, [isTerms]);

  return (
    <div className={`legal-page-root ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      {/* Top Navigation Bar */}
      <header className="legal-topbar">
        <div className="legal-topbar-container">
          <div className="legal-topbar-left">
            <a
              href="#/role-select"
              className="legal-brand-link"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('role-select');
                }
              }}
            >
              <img src={nidanLogo} alt="NIDAN Logo" className="legal-topbar-logo-img" />
              <div className="legal-brand-logo">
                NIDAN <span>PreConsult</span>
              </div>
            </a>
            <span className="legal-badge-pill">SIH 2026 Prototype</span>
          </div>

          {/* Doc Switcher Tabs */}
          <nav className="legal-doc-switcher" aria-label="Legal document switcher">
            <a
              href="#/terms"
              className={`legal-switcher-btn ${isTerms ? 'active' : ''}`}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('terms');
                }
              }}
            >
              <Scale size={15} />
              <span>Terms of Service</span>
            </a>

            <a
              href="#/privacy"
              className={`legal-switcher-btn ${!isTerms ? 'active' : ''}`}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('privacy');
                }
              }}
            >
              <Shield size={15} />
              <span>Privacy Policy</span>
            </a>
          </nav>

          {/* Right actions */}
          <div className="legal-topbar-right">
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="legal-github-btn"
              title="View source on GitHub"
            >
              <svg
                height="16"
                width="16"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              <span>GitHub</span>
              <ExternalLink size={13} />
            </a>

            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="legal-hero">
        <div className="legal-content-container">
          <div className="legal-hero-badge">
            {isTerms ? <Scale size={16} /> : <Lock size={16} />}
            <span>Legal Documentation • Tensor Titans</span>
          </div>

          <h1 className="legal-hero-title">
            {isTerms ? 'Terms and Conditions' : 'Privacy Policy'}
          </h1>

          <p className="legal-hero-desc">
            {isTerms
              ? 'Guidelines, clinical disclaimers, and open-source usage terms governing the PreConsult digital pre-consultation prototype.'
              : 'Our commitment to patient privacy, local data storage, client-side speech intake handling, and ethical AI in healthcare.'}
          </p>

          <div className="legal-meta-row">
            <span className="legal-meta-chip">
              <FileCheck2 size={14} /> Version 1.0 (SIH 2026)
            </span>
            <span className="legal-meta-chip">
              <Activity size={14} /> Smart India Hackathon 2026
            </span>
            <span className="legal-meta-chip">
              <HeartPulse size={14} /> PreConsult Platform
            </span>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <main className="legal-main">
        <div className="legal-content-container">
          {/* Medical Notice Alert */}
          <div className="legal-alert-box">
            <AlertTriangle size={22} className="legal-alert-icon" />
            <div className="legal-alert-body">
              <h3>Important Medical &amp; Academic Disclaimer</h3>
              <p>
                <strong>PreConsult</strong> is an academic prototype developed by team{' '}
                <strong>Tensor Titans</strong> for the <strong>Smart India Hackathon 2026</strong>.
                It is designed to demonstrate multilingual voice symptom aggregation and AI-assisted
                SOAP note generation for licensed healthcare providers. It is{' '}
                <strong>not an emergency service</strong> and does <strong>not</strong> provide
                binding medical diagnoses. For life-threatening emergencies, dial{' '}
                <strong>108</strong> or <strong>112</strong> immediately.
              </p>
            </div>
          </div>

          {isTerms ? (
            /* =================================================================
               TERMS AND CONDITIONS CONTENT
               ================================================================= */
            <article className="legal-article">
              <section className="legal-card">
                <div className="legal-card-header">
                  <span className="legal-card-num">01</span>
                  <h2>Acceptance of Terms</h2>
                </div>
                <div className="legal-card-content">
                  <p>
                    By accessing, downloading, or using the PreConsult application, voice intake
                    systems, or clinical practitioner portals, you agree to comply with and be bound
                    by these Terms and Conditions.
                  </p>
                  <p>
                    If you do not agree to these terms, please do not use the application. These
                    terms apply equally to patients, healthcare professionals, student evaluators,
                    and hackathon jury members.
                  </p>
                </div>
              </section>

              <section className="legal-card">
                <div className="legal-card-header">
                  <span className="legal-card-num">02</span>
                  <h2>Clinical Scope &amp; AI Triage Limitations</h2>
                </div>
                <div className="legal-card-content">
                  <p>
                    PreConsult uses speech recognition (Whisper) and Large Language Models to
                    synthesize patient-reported symptoms into structured clinical notes:
                  </p>
                  <ul className="legal-bullet-list">
                    <li>
                      <strong>Physician Prerogative:</strong> All clinical summaries, triage tags
                      (Routine, Urgent, Red Flag), and Ayurvedic term extractions (Dosha, Agni,
                      formulations) are advisory tools. They require independent validation by a
                      licensed medical doctor.
                    </li>
                    <li>
                      <strong>No Doctor-Patient Relationship:</strong> Using the patient portal does
                      not establish a formal doctor-patient relationship until an authorized
                      physician accepts and conducts the formal consultation.
                    </li>
                    <li>
                      <strong>Prescription Authorization:</strong> Automated AI systems do not
                      issue prescriptions. Prescriptions can only be drafted and finalized by verified
                      practitioners in the Doctor Portal.
                    </li>
                  </ul>
                </div>
              </section>

              <section className="legal-card">
                <div className="legal-card-header">
                  <span className="legal-card-num">03</span>
                  <h2>User Obligations &amp; Acceptable Use</h2>
                </div>
                <div className="legal-card-content">
                  <p>When using the PreConsult platform, you agree to:</p>
                  <ul className="legal-bullet-list">
                    <li>Provide accurate, genuine symptom descriptions to the best of your ability.</li>
                    <li>Refrain from uploading malicious audio recordings or unauthorized patient files.</li>
                    <li>
                      Use the Doctor Portal only if you are an authorized healthcare provider or
                      participating in testing/evaluation of the SIH 2026 prototype.
                    </li>
                    <li>
                      Not reverse engineer or misuse backend serverless inference functions.
                    </li>
                  </ul>
                </div>
              </section>

              <section className="legal-card">
                <div className="legal-card-header">
                  <span className="legal-card-num">04</span>
                  <h2>Intellectual Property &amp; Open Source</h2>
                </div>
                <div className="legal-card-content">
                  <p>
                    PreConsult is open-source software crafted by <strong>Tensor Titans</strong> for{' '}
                    <strong>Smart India Hackathon 2026</strong>. The project source code is available
                    at our official repository:
                  </p>
                  <p>
                    <a
                      href={GITHUB_REPO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="legal-repo-link"
                    >
                      <svg
                        height="16"
                        width="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                      </svg>
                      <span>github.com/nitishbhuvan/SIH_2026_Tensor_Titans</span>
                      <ExternalLink size={14} />
                    </a>
                  </p>
                  <p>
                    Contributions, feature proposals, and academic citations are welcomed in
                    accordance with the project's repository guidelines.
                  </p>
                </div>
              </section>

              <section className="legal-card">
                <div className="legal-card-header">
                  <span className="legal-card-num">05</span>
                  <h2>Limitation of Liability &amp; Warranty Disclaimer</h2>
                </div>
                <div className="legal-card-content">
                  <p>
                    The platform is provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; without
                    any express or implied warranties. Tensor Titans, its contributors, and affiliated
                    educational institutions shall not be held liable for any clinical
                    misinterpretations, software interruptions, or health outcomes resulting from
                    the use of this prototype.
                  </p>
                </div>
              </section>
            </article>
          ) : (
            /* =================================================================
               PRIVACY POLICY CONTENT
               ================================================================= */
            <article className="legal-article">
              <section className="legal-card">
                <div className="legal-card-header">
                  <span className="legal-card-num">01</span>
                  <h2>Privacy-First Architecture</h2>
                </div>
                <div className="legal-card-content">
                  <p>
                    At PreConsult, we prioritize patient confidentiality, data sovereignty, and
                    secure health information management. Our application is architected to minimize
                    server-side footprints and process health inputs ethically.
                  </p>
                </div>
              </section>

              <section className="legal-card">
                <div className="legal-card-header">
                  <span className="legal-card-num">02</span>
                  <h2>Voice Data &amp; Audio Processing</h2>
                </div>
                <div className="legal-card-content">
                  <p>When you record your symptoms using our Multilingual Voice Intake system:</p>
                  <ul className="legal-bullet-list">
                    <li>
                      <strong>Ephemeral In-Memory Handling:</strong> Microphone audio recorded during
                      voice intake is processed in-memory solely for transcription. Audio files are
                      never archived in permanent surveillance databases.
                    </li>
                    <li>
                      <strong>Explicit User Initiation:</strong> Voice recording triggers strictly
                      upon your manual tap on the microphone button after granting browser
                      microphone permissions.
                    </li>
                    <li>
                      <strong>Zero Data Commercialization:</strong> We never sell, rent, or monetize
                      your voice recordings or medical transcripts with advertisers.
                    </li>
                  </ul>
                </div>
              </section>

              <section className="legal-card">
                <div className="legal-card-header">
                  <span className="legal-card-num">03</span>
                  <h2>Local Storage &amp; Session Management</h2>
                </div>
                <div className="legal-card-content">
                  <p>
                    PreConsult uses browser <code>localStorage</code> to store:
                  </p>
                  <ul className="legal-bullet-list">
                    <li>Your selected UI language and accessibility mode (Elderly / Modern).</li>
                    <li>Theme preference (Dark / Light mode).</li>
                    <li>
                      Active doctor session tokens and triage patient records during clinical
                      demonstration sessions.
                    </li>
                  </ul>
                  <p>
                    This data remains on your local machine and can be cleared at any time via your
                    browser settings or by clicking &quot;Clear Records&quot; in the Doctor Portal.
                  </p>
                </div>
              </section>

              <section className="legal-card">
                <div className="legal-card-header">
                  <span className="legal-card-num">04</span>
                  <h2>Secure AI Entity Inference</h2>
                </div>
                <div className="legal-card-content">
                  <p>
                    Transcribed symptom texts are analyzed using secure HTTPS endpoints for clinical
                    entity extraction (SOAP note structuring, Ayurvedic Dosha/Agni analysis).
                    Inference requests do not link queries to your personal identifying credentials.
                  </p>
                </div>
              </section>

              <section className="legal-card">
                <div className="legal-card-header">
                  <span className="legal-card-num">05</span>
                  <h2>Patient Rights &amp; Control</h2>
                </div>
                <div className="legal-card-content">
                  <p>
                    You maintain complete control over your health information. You can reset your
                    session, purge local medical records, revoke microphone permissions in your
                    browser settings, and switch between roles without tracking cookies.
                  </p>
                </div>
              </section>
            </article>
          )}

          {/* Bottom navigation & Return */}
          <div className="legal-bottom-bar">
            <a
              href="#/role-select"
              className="legal-return-btn"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('role-select');
                }
              }}
            >
              <ArrowLeft size={16} />
              <span>Return to PreConsult Portal</span>
            </a>

            <div className="legal-bottom-links">
              <a
                href={isTerms ? '#/privacy' : '#/terms'}
                className="legal-switch-link"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate(isTerms ? 'privacy' : 'terms');
                  }
                }}
              >
                {isTerms ? 'Read Privacy Policy →' : 'Read Terms of Service →'}
              </a>

              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="legal-repo-badge-btn"
              >
                <Share2 size={14} />
                <span>Tensor Titans GitHub</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="legal-footer">
        <div className="legal-content-container">
          <p className="legal-footer-copy">
            &copy; {new Date().getFullYear()} PreConsult • Developed by{' '}
            <strong>Tensor Titans</strong> for <strong>Smart India Hackathon 2026</strong>.
          </p>
          <p className="legal-footer-sub">
            Built with accessibility-first principles for Indian multilingual healthcare.
          </p>
        </div>
      </footer>
    </div>
  );
}
