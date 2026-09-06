import React from 'react';
import ThemeToggle from './ThemeToggle.jsx';

export default function Navbar({ currentMode, onOpenModeModal, currentTheme, onToggleTheme }) {
  const isElderly = currentMode === 'elderly';

  return (
    <header className="navbar-wrapper">
      <div className="container-wide">
        <nav className="navbar-content">
          <a
            href="#"
            className="brand-logo"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            PreConsult
          </a>

          {/* Actions in Navbar: Mode Switcher Button & Logo-Only Theme Toggle */}
          <div className="navbar-actions">
            <button
              type="button"
              className={`navbar-mode-btn ${isElderly ? 'is-elderly' : 'is-modern'}`}
              onClick={onOpenModeModal}
              title="Click to change viewing mode / मोड बदलने के लिए क्लिक करें"
              aria-label={`Current mode: ${isElderly ? 'Elderly Mode (वरिष्ठ मोड)' : 'Modern Mode (आधुनिक मोड)'}. Click to switch.`}
            >
              <span className="navbar-mode-icon" aria-hidden="true">
                {isElderly ? '🧓' : '⚡'}
              </span>
              <span className="navbar-mode-text">
                <span className="navbar-mode-primary">
                  {isElderly ? 'Elderly Mode' : 'Modern Mode'}
                </span>
                <span className="navbar-mode-secondary">
                  {isElderly ? 'वरिष्ठ मोड' : 'आधुनिक मोड'}
                </span>
              </span>
              <span className="navbar-mode-switch-tag">
                Switch • बदलें
              </span>
            </button>

            {/* Pure logo, zero words, animated theme switch */}
            <ThemeToggle
              theme={currentTheme}
              onToggle={onToggleTheme}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
