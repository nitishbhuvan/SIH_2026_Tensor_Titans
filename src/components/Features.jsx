import React from 'react';
import { Zap, CloudLightning, ShieldCheck, Palette, Code2, Terminal, Sparkles } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast Vite Bundling',
      desc: 'Instant server start with native ES modules and near-instantaneous Hot Module Replacement (HMR) for friction-free dev velocity.',
      large: true
    },
    {
      icon: CloudLightning,
      title: 'Vercel Edge Acceleration',
      desc: 'Global distribution across 300+ Edge points with automatic asset compression (Brotli/Gzip) and immutable caching.',
      large: false
    },
    {
      icon: ShieldCheck,
      title: 'SPA Routing Safeguard',
      desc: 'Built-in vercel.json rewrite routing prevents 404 errors on deep client-side routes when refreshing or sharing direct links.',
      large: false
    },
    {
      icon: Palette,
      title: 'Dynamic Design Token Engine',
      desc: 'Pure Vanilla CSS custom properties with real-time accent palette shifting, glassmorphism blur, and buttery micro-interactions.',
      large: true
    },
    {
      icon: Code2,
      title: 'React 19 Foundations',
      desc: 'Structured with clean component architecture, reusable hooks, and scalable folder organization ready for full-scale growth.',
      large: false
    },
    {
      icon: Terminal,
      title: 'Developer Ergonomics',
      desc: 'Standardized build scripts, instant linting with Oxlint, and zero-configuration CI/CD directly from your git repository.',
      large: false
    }
  ];

  return (
    <section id="features" className="section-wrapper">
      <div className="container">
        <div className="section-header">
          <div className="badge badge-accent section-badge">
            <Sparkles size={14} />
            <span>Core Architecture</span>
          </div>
          <h2 className="section-title">
            Engineered for <span className="gradient-text">Performance &amp; Scale</span>
          </h2>
          <p className="section-subtitle">
            Everything you need for an enterprise-ready frontend: instant builds, rock-solid routing, and a stunning design system.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="features-bento-grid">
          {features.map((feat, index) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={index}
                className={`glass-card bento-card glass-card-interactive ${feat.large ? 'bento-card-large' : ''}`}
              >
                <div>
                  <div className="bento-icon-wrapper">
                    <IconComponent size={22} />
                  </div>
                  <h3 className="bento-title">{feat.title}</h3>
                  <p className="bento-desc">{feat.desc}</p>
                </div>

                <div className="bento-decor">
                  <div style={{ height: '3px', width: '40px', background: 'var(--accent-gradient)', borderRadius: '2px' }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
