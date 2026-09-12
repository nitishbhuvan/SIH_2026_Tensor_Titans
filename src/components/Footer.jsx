import React from 'react';
import './Footer.css';

export default function Footer({ t }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-inner">
          <span className="footer-meta" aria-hidden="true">
            PRECONSULT / PATIENT SERVICES
          </span>
          <p className="footer-text">
            &copy; {new Date().getFullYear()} {t.footerTagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
