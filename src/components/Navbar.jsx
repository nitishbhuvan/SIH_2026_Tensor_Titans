import React, { useState, useEffect } from 'react';
import { Layers, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar({ currentTheme, setTheme, onTriggerToast }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const themes = [
    { id: 'indigo', name: 'Indigo Aura', color: '#6366f1' },
    { id: 'emerald', name: 'Cyber Emerald', color: '#10b981' },
    { id: 'amber', name: 'Solar Amber', color: '#f59e0b' },
    { id: 'rose', name: 'Electric Rose', color: '#ec4899' },
    { id: 'cyan', name: 'Neon Cyan', color: '#06b6d4' }
  ];

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className={`navbar-wrapper ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container-wide">
          <nav className="navbar-content">
            {/* Logo */}
            <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <div className="brand-icon-box">
                <Layers size={22} strokeWidth={2.4} />
              </div>
              <span>Tensor<span className="gradient-text">Titans</span></span>
            </a>

            {/* Desktop Navigation Links */}
            <ul className="nav-links">
              <li><a href="#features" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('features'); }}>Features</a></li>
              <li><a href="#playground" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('playground'); }}>Playground</a></li>
              <li><a href="#vercel" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('vercel'); }}>Vercel Deploy</a></li>
              <li><a href="#architecture" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('architecture'); }}>Architecture</a></li>
            </ul>

            {/* Actions & Theme Switcher */}
            <div className="nav-actions">
              {/* Theme Dot Picker */}
              <div className="theme-picker-pill" title="Switch Theme Palette">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    className={`theme-color-dot ${currentTheme === t.id ? 'active' : ''}`}
                    style={{ backgroundColor: t.color }}
                    onClick={() => {
                      setTheme(t.id);
                      onTriggerToast(`Theme accent changed to ${t.name}`);
                    }}
                    aria-label={`Select ${t.name} theme`}
                  />
                ))}
              </div>

              {/* Status Badge */}
              <div className="badge badge-accent" style={{ display: 'none' }}>
                <span className="badge-pulse-dot"></span>
                <span>Vercel Edge Ready</span>
              </div>

              {/* Deploy CTA */}
              <a
                href="#vercel"
                className="btn btn-primary btn-sm"
                onClick={(e) => { e.preventDefault(); scrollTo('vercel'); }}
              >
                <Sparkles size={14} />
                <span>Deploy Hub</span>
              </a>

              {/* Mobile Hamburger Toggle */}
              <button
                className="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer open">
          <ul className="mobile-nav-links">
            <li><a href="#features" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('features'); }}>Features</a></li>
            <li><a href="#playground" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('playground'); }}>Playground</a></li>
            <li><a href="#vercel" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('vercel'); }}>Vercel Deploy</a></li>
            <li><a href="#architecture" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('architecture'); }}>Architecture</a></li>
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Theme Accent</span>
            <div className="theme-picker-pill">
              {themes.map((t) => (
                <button
                  key={t.id}
                  className={`theme-color-dot ${currentTheme === t.id ? 'active' : ''}`}
                  style={{ backgroundColor: t.color }}
                  onClick={() => {
                    setTheme(t.id);
                    onTriggerToast(`Theme accent changed to ${t.name}`);
                  }}
                  aria-label={`Select ${t.name} theme`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
