import React from 'react';
import { Shield, Scale, ExternalLink } from 'lucide-react';
import './Footer.css';

const GITHUB_REPO_URL = 'https://github.com/nitishbhuvan/SIH_2026_Tensor_Titans';

export default function Footer({ t = {}, isElderly = false }) {
  return (
    <footer className={`site-footer ${isElderly ? 'is-elderly' : ''}`}>
      <div className="container">
        <div className="footer-inner">
          {/* Legal and Project Navigation Links - Each opens in a new tab */}
          <nav className="footer-nav" aria-label="Footer navigation">
            <a
              href="#/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-nav-link"
              title="Open Terms & Conditions in a new tab"
            >
              <Scale size={14} className="footer-link-icon" />
              <span>{t.termsOfService || 'Terms & Conditions'}</span>
              <ExternalLink size={11} className="footer-ext-icon" />
            </a>

            <span className="footer-nav-divider" aria-hidden="true">•</span>

            <a
              href="#/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-nav-link"
              title="Open Privacy Policy in a new tab"
            >
              <Shield size={14} className="footer-link-icon" />
              <span>{t.privacyPolicy || 'Privacy Policy'}</span>
              <ExternalLink size={11} className="footer-ext-icon" />
            </a>

            <span className="footer-nav-divider" aria-hidden="true">•</span>

            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-nav-link footer-github-link"
              title="Tensor Titans SIH 2026 GitHub Repository (Opens in new tab)"
            >
              <svg
                height="15"
                width="15"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="footer-link-icon"
                aria-hidden="true"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              <span>{t.githubRepo || 'GitHub Repository'}</span>
              <ExternalLink size={11} className="footer-ext-icon" />
            </a>
          </nav>

          {/* Medical disclaimer note */}
          <p className="footer-disclaimer">
            {t.medicalDisclaimerShort || 'Academic prototype for SIH 2026. Not a substitute for licensed clinical diagnosis.'}
          </p>

          {/* Copyright & Tagline */}
          <div className="footer-bottom">
            <span className="footer-meta" aria-hidden="true">
              PRECONSULT • TENSOR TITANS • SMART INDIA HACKATHON 2026
            </span>
            <p className="footer-text">
              &copy; {new Date().getFullYear()} {t.footerTagline || 'PreConsult • Tensor Titans. Accessibility First Design.'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
