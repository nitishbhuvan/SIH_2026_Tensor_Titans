import React, { useState } from 'react';
import { Sparkles, Copy, Check, ArrowRight, Zap, Globe2, ShieldCheck, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Hero({ onTriggerToast }) {
  const [copied, setCopied] = useState(false);
  const commandText = "npx vercel --prod";

  const handleCopy = () => {
    navigator.clipboard.writeText(commandText);
    setCopied(true);
    onTriggerToast("Copied Vercel deployment command to clipboard!");

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#a855f7', '#ec4899', '#06b6d4', '#10b981']
    });

    setTimeout(() => setCopied(false), 2500);
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section">
      <div className="container">
        {/* Banner Pill */}
        <div className="hero-badge-wrap">
          <div className="badge badge-accent">
            <span className="badge-pulse-dot"></span>
            <span>React 19 &bull; Vite 6 &bull; Vercel Edge Ready</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="hero-title">
          Build Fast. Ship Global with <br />
          <span className="gradient-text">React &amp; Vercel</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          An ultra-optimized base website scaffold engineered for instant Vercel cloud deployment,
          single-page client routing resilience, and a modern glassmorphism UI design system.
        </p>

        {/* Call to Actions */}
        <div className="hero-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => scrollTo('vercel')}
          >
            <Sparkles size={18} />
            <span>Deploy to Vercel</span>
            <ArrowRight size={18} />
          </button>

          <button
            className="btn btn-secondary btn-lg"
            onClick={() => scrollTo('playground')}
          >
            <Zap size={18} />
            <span>Explore Playground</span>
          </button>
        </div>

        {/* Copyable Quick Snippet */}
        <div className="hero-snippet-bar">
          <div className="hero-snippet-text">
            <span className="hero-snippet-prefix">$</span>
            <span>{commandText}</span>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleCopy}
            title="Copy deployment command"
          >
            {copied ? (
              <>
                <Check size={14} color="var(--status-success)" />
                <span style={{ color: 'var(--status-success)' }}>Copied</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy Command</span>
              </>
            )}
          </button>
        </div>

        {/* Key Metrics Grid */}
        <div className="hero-metrics-grid">
          <div className="glass-card metric-card">
            <div className="metric-icon-box">
              <Zap size={20} />
            </div>
            <div className="metric-value">0ms</div>
            <div className="metric-label">HMR Hot-Reload with Vite</div>
          </div>

          <div className="glass-card metric-card">
            <div className="metric-icon-box">
              <Globe2 size={20} />
            </div>
            <div className="metric-value">300+</div>
            <div className="metric-label">Vercel Global Edge Points</div>
          </div>

          <div className="glass-card metric-card">
            <div className="metric-icon-box">
              <ShieldCheck size={20} />
            </div>
            <div className="metric-value">100%</div>
            <div className="metric-label">SPA Route Resilience (vercel.json)</div>
          </div>

          <div className="glass-card metric-card">
            <div className="metric-icon-box">
              <Cpu size={20} />
            </div>
            <div className="metric-value">React 19</div>
            <div className="metric-label">Modern Concurrent Architecture</div>
          </div>
        </div>
      </div>
    </section>
  );
}
