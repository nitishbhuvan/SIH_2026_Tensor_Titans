import React, { useState } from 'react';
import './ThemeToggle.css';

export default function ThemeToggle({ theme, onToggle }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const isDark = theme === 'dark';

  const handleToggle = () => {
    setIsSpinning(true);
    onToggle();
    setTimeout(() => {
      setIsSpinning(false);
    }, 650);
  };

  return (
    <button
      type="button"
      className={`theme-toggle-btn ${isDark ? 'is-dark' : 'is-light'} ${isSpinning ? 'is-animating' : ''}`}
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="theme-toggle-disc">
        {/* Animated Sun & Moon Icons */}
        <svg
          className="theme-toggle-svg"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Sun Group */}
          <g className="theme-sun-group">
            {/* Sun Core Disc */}
            <circle cx="12" cy="12" r="4.6" className="theme-sun-core" />
            {/* 8 Radiating Sun Rays */}
            <g className="theme-sun-rays">
              <line x1="12" y1="2" x2="12" y2="4.2" />
              <line x1="12" y1="19.8" x2="12" y2="22" />
              <line x1="2" y1="12" x2="4.2" y2="12" />
              <line x1="19.8" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="4.93" x2="6.48" y2="6.48" />
              <line x1="17.52" y1="17.52" x2="19.07" y2="19.07" />
              <line x1="4.93" y1="19.07" x2="6.48" y2="17.52" />
              <line x1="17.52" y1="6.48" x2="19.07" y2="4.93" />
            </g>
          </g>

          {/* Moon Group */}
          <g className="theme-moon-group">
            {/* Crescent Moon Body */}
            <path
              className="theme-moon-crescent"
              d="M 20.4 14.8 C 19.3 18.6 15.8 21.3 11.7 21 C 6.8 20.6 3 16.4 3.2 11.5 C 3.4 8 5.7 5 9.1 4.1 C 8.6 5.4 8.5 6.9 8.9 8.4 C 9.7 11.5 12.3 13.9 15.5 14.4 C 17.1 14.6 18.8 14.3 20.4 14.8 Z"
            />
            {/* Twinkling Stars in Night Sky */}
            <circle cx="17.8" cy="5.8" r="1.1" className="theme-moon-star star-1" />
            <circle cx="20.4" cy="9.8" r="0.8" className="theme-moon-star star-2" />
            <circle cx="15.2" cy="2.8" r="0.7" className="theme-moon-star star-3" />
          </g>
        </svg>
      </div>

      {/* Ripple Animation Shockwave */}
      <span className="theme-toggle-wave" aria-hidden="true" />
    </button>
  );
}
