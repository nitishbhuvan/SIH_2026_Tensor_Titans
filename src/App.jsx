import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Features from './components/Features.jsx';
import InteractivePlayground from './components/InteractivePlayground.jsx';
import VercelGuide from './components/VercelGuide.jsx';
import Footer from './components/Footer.jsx';
import { CheckCircle } from 'lucide-react';
import './App.css';

export default function App() {
  const [currentTheme, setCurrentTheme] = useState('indigo');
  const [toasts, setToasts] = useState([]);

  // Sync theme changes to data-theme attribute on <html> element
  useEffect(() => {
    if (currentTheme === 'indigo') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', currentTheme);
    }
  }, [currentTheme]);

  // Toast trigger utility
  const triggerToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  return (
    <div className="app-wrapper">
      {/* Ambient Lighting Gradients */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />
      <div className="ambient-glow-3" />

      {/* Navigation */}
      <Navbar
        currentTheme={currentTheme}
        setTheme={setCurrentTheme}
        onTriggerToast={triggerToast}
      />

      {/* Main Content */}
      <main>
        <Hero onTriggerToast={triggerToast} />
        <Features />
        <InteractivePlayground
          currentTheme={currentTheme}
          setTheme={setCurrentTheme}
          onTriggerToast={triggerToast}
        />
        <VercelGuide onTriggerToast={triggerToast} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Toast Notification System */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            <CheckCircle size={16} color="var(--accent-primary)" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
