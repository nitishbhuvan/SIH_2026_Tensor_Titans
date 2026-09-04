import React, { useState } from 'react';
import { Cloud, Check, Copy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function VercelGuide({ onTriggerToast }) {
  const [activeCodeTab, setActiveCodeTab] = useState('vercel-json');
  const [copiedKey, setCopiedKey] = useState('');

  // Interactive Checklist
  const [checks, setChecks] = useState({
    spaRewrite: true,
    buildCommand: true,
    cacheHeaders: true,
    edgeReady: true
  });

  const checklistItems = [
    {
      id: 'spaRewrite',
      title: 'SPA Routing Rewrites',
      desc: 'vercel.json rewrites configured to map all deep routes to index.html'
    },
    {
      id: 'buildCommand',
      title: 'Vite Production Build Pipeline',
      desc: 'Build command "npm run build" targeting "dist" output folder'
    },
    {
      id: 'cacheHeaders',
      title: 'Immutable Asset Caching',
      desc: 'Max-age 1-year cache headers configured for all /assets/* chunks'
    },
    {
      id: 'edgeReady',
      title: 'Global CDN & Edge Optimization',
      desc: 'Static assets instantly replicated across 300+ Vercel PoPs'
    }
  ];

  const checkedCount = Object.values(checks).filter(Boolean).length;
  const scorePercent = Math.round((checkedCount / checklistItems.length) * 100);

  const toggleCheck = (id) => {
    const nextState = { ...checks, [id]: !checks[id] };
    setChecks(nextState);

    const nextCount = Object.values(nextState).filter(Boolean).length;
    if (nextCount === checklistItems.length) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      onTriggerToast('🎉 100% Vercel Readiness Achieved!');
    }
  };

  const codeSnippets = {
    'vercel-json': `{\n  "framework": "vite",\n  "buildCommand": "npm run build",\n  "outputDirectory": "dist",\n  "rewrites": [\n    {\n      "source": "/(.*)",\n      "destination": "/index.html"\n    }\n  ],\n  "headers": [\n    {\n      "source": "/assets/(.*)",\n      "headers": [\n        {\n          "key": "Cache-Control",\n          "value": "public, max-age=31536000, immutable"\n        }\n      ]\n    }\n  ]\n}`,
    'package-json': `{\n  "name": "sih-2026-tensor-titans",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build",\n    "lint": "oxlint",\n    "preview": "vite preview"\n  }\n}`,
    'cli-deploy': `# Deploy directly from local machine using Vercel CLI\nnpx vercel\n\n# Deploy directly to production\nnpx vercel --prod`,
    'git-ops': `# Push latest changes to GitHub\ngit add .\ngit commit -m "feat: setup base website for vercel"\ngit push origin test\n\n# Vercel will automatically trigger a preview or production build!`
  };

  const handleCopyCode = (snippet, key) => {
    navigator.clipboard.writeText(snippet);
    setCopiedKey(key);
    onTriggerToast(`Copied ${key} to clipboard!`);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  return (
    <section id="vercel" className="section-wrapper">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="badge badge-accent section-badge">
            <Cloud size={14} />
            <span>Vercel Cloud Pipeline</span>
          </div>
          <h2 className="section-title">
            Deploy in Seconds to <span className="gradient-text">Vercel Edge</span>
          </h2>
          <p className="section-subtitle">
            Zero complex configuration needed. Connect your repository or run the CLI to go live worldwide with automatic CI/CD.
          </p>
        </div>

        {/* 3 Step Visual Pipeline */}
        <div className="deploy-steps-grid">
          <div className="glass-card step-card">
            <div className="step-num-pill">01</div>
            <h3 className="step-card-title">Push to Git</h3>
            <p className="step-card-desc">
              Push your code to GitHub, GitLab, or Bitbucket. Vercel automatically detects the Vite + React framework.
            </p>
          </div>

          <div className="glass-card step-card">
            <div className="step-num-pill">02</div>
            <h3 className="step-card-title">Link Repository</h3>
            <p className="step-card-desc">
              Import the project in your Vercel Dashboard or run <code style={{ color: 'var(--accent-primary)' }}>npx vercel</code>.
            </p>
          </div>

          <div className="glass-card step-card">
            <div className="step-num-pill">03</div>
            <h3 className="step-card-title">Live on Edge</h3>
            <p className="step-card-desc">
              Vercel builds your React bundle and delivers it worldwide on a blazing-fast Global Edge CDN.
            </p>
          </div>
        </div>

        {/* Split Inspector: Code Tabs & Readiness Checklist */}
        <div className="vercel-split-grid">
          {/* Code Configuration Panel */}
          <div className="glass-card vercel-code-panel">
            <div className="panel-tabs-header">
              <div className="panel-tab-btns">
                <button
                  className={`tab-btn ${activeCodeTab === 'vercel-json' ? 'active' : ''}`}
                  onClick={() => setActiveCodeTab('vercel-json')}
                >
                  vercel.json
                </button>
                <button
                  className={`tab-btn ${activeCodeTab === 'cli-deploy' ? 'active' : ''}`}
                  onClick={() => setActiveCodeTab('cli-deploy')}
                >
                  Vercel CLI
                </button>
                <button
                  className={`tab-btn ${activeCodeTab === 'git-ops' ? 'active' : ''}`}
                  onClick={() => setActiveCodeTab('git-ops')}
                >
                  Git-Ops
                </button>
                <button
                  className={`tab-btn ${activeCodeTab === 'package-json' ? 'active' : ''}`}
                  onClick={() => setActiveCodeTab('package-json')}
                >
                  package.json
                </button>
              </div>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleCopyCode(codeSnippets[activeCodeTab], activeCodeTab)}
              >
                {copiedKey === activeCodeTab ? (
                  <>
                    <Check size={13} color="var(--status-success)" />
                    <span style={{ color: 'var(--status-success)' }}>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <pre className="code-pre-block">
              <code>{codeSnippets[activeCodeTab]}</code>
            </pre>
          </div>

          {/* Interactive Readiness Checklist */}
          <div className="glass-card checklist-panel">
            <div className="checklist-header">
              <h3 style={{ fontSize: '1.15rem' }}>Deployment Readiness</h3>
              <div className="readiness-score-box">
                <span className="score-num">{scorePercent}%</span>
                <span className="score-total">Score</span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Interactive pre-flight checks for your React + Vercel stack. Click to toggle items:
            </p>

            <div className="checklist-items">
              {checklistItems.map((item) => {
                const isChecked = checks[item.id];
                return (
                  <div
                    key={item.id}
                    className={`check-item ${isChecked ? 'checked' : ''}`}
                    onClick={() => toggleCheck(item.id)}
                  >
                    <div className="check-box-square">
                      {isChecked && <Check size={14} strokeWidth={3} />}
                    </div>
                    <div className="check-item-text">
                      <span className="check-item-title">{item.title}</span>
                      <span className="check-item-desc">{item.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
