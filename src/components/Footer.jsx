import React from 'react';
import { Layers, ExternalLink, Sparkles } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="architecture" className="footer-wrapper">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Col */}
          <div className="footer-brand-col">
            <div className="brand-logo">
              <div className="brand-icon-box">
                <Layers size={20} />
              </div>
              <span>Tensor<span className="gradient-text">Titans</span></span>
            </div>
            <p className="footer-desc">
              Production-ready React 19 + Vite base website scaffold engineered for instant Vercel cloud deployment and edge performance.
            </p>
            <div className="badge badge-accent" style={{ marginTop: '0.5rem' }}>
              <span className="badge-pulse-dot"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              <li><a href="#features" className="footer-link" onClick={(e) => { e.preventDefault(); scrollTo('features'); }}>Features</a></li>
              <li><a href="#playground" className="footer-link" onClick={(e) => { e.preventDefault(); scrollTo('playground'); }}>Playground</a></li>
              <li><a href="#vercel" className="footer-link" onClick={(e) => { e.preventDefault(); scrollTo('vercel'); }}>Vercel Deploy Hub</a></li>
              <li><a href="#architecture" className="footer-link" onClick={(e) => { e.preventDefault(); scrollTo('architecture'); }}>Architecture</a></li>
            </ul>
          </div>

          {/* Col 3: Stack */}
          <div>
            <h4 className="footer-col-title">Tech Stack</h4>
            <ul className="footer-links">
              <li><span className="footer-link" style={{ cursor: 'default' }}>React 19.x</span></li>
              <li><span className="footer-link" style={{ cursor: 'default' }}>Vite 6.x</span></li>
              <li><span className="footer-link" style={{ cursor: 'default' }}>Vercel Edge Network</span></li>
              <li><span className="footer-link" style={{ cursor: 'default' }}>Vanilla CSS Design Tokens</span></li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div>
            <h4 className="footer-col-title">Deployment</h4>
            <ul className="footer-links">
              <li>
                <a href="https://vercel.com/docs" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>Vercel Documentation</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://vite.dev" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>Vite Guide</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>React Docs</span>
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} Tensor Titans. Built for rapid development and cloud scaling.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <span>Powered by React &amp; Vercel</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
