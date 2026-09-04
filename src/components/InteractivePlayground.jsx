import React, { useState } from 'react';
import { Sparkles, Activity, RotateCcw, Plus, Minus, Server, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function InteractivePlayground({ currentTheme, setTheme, onTriggerToast }) {
  // Demo State: Counter & Velocity
  const [count, setCount] = useState(42);
  const [step, setStep] = useState(1);
  const [history, setHistory] = useState([40, 41, 42]);

  // Demo State: Edge Ping Simulator
  const [isPinging, setIsPinging] = useState(false);
  const [edgeNodes, setEdgeNodes] = useState([
    { region: 'iad1 (Washington, US)', latency: 24, status: 'Active' },
    { region: 'sfo1 (San Francisco, US)', latency: 38, status: 'Active' },
    { region: 'lhr1 (London, UK)', latency: 52, status: 'Active' },
    { region: 'sin1 (Singapore, SG)', latency: 68, status: 'Active' },
    { region: 'hnd1 (Tokyo, JP)', latency: 74, status: 'Active' }
  ]);

  const handleIncrement = () => {
    const nextVal = count + step;
    setCount(nextVal);
    setHistory((prev) => [...prev.slice(-4), nextVal]);
    if (nextVal % 10 === 0) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 }
      });
      onTriggerToast(`Milestone reached: ${nextVal}! 🎉`);
    }
  };

  const handleDecrement = () => {
    const nextVal = Math.max(0, count - step);
    setCount(nextVal);
    setHistory((prev) => [...prev.slice(-4), nextVal]);
  };

  const handleReset = () => {
    setCount(0);
    setHistory([0]);
    onTriggerToast('Counter reset to 0');
  };

  const handleSimulatePing = () => {
    setIsPinging(true);
    onTriggerToast('Simulating Edge CDN round-trip latency...');

    setTimeout(() => {
      setEdgeNodes((prev) =>
        prev.map((node) => ({
          ...node,
          latency: Math.floor(Math.random() * 30) + (node.region.includes('US') ? 18 : 45)
        }))
      );
      setIsPinging(false);
      onTriggerToast('Edge latency refreshed across 5 regions');
    }, 600);
  };

  return (
    <section id="playground" className="section-wrapper">
      <div className="container">
        <div className="section-header">
          <div className="badge badge-accent section-badge">
            <Cpu size={14} />
            <span>Interactive State &amp; Edge Playground</span>
          </div>
          <h2 className="section-title">
            Test <span className="gradient-text">React 19 &amp; Edge</span> in Action
          </h2>
          <p className="section-subtitle">
            Experience real-time state reactivity, particle physics, and simulated Vercel Edge response times.
          </p>
        </div>

        <div className="playground-grid">
          {/* Card 1: Live React State Playground */}
          <div className="glass-card interactive-demo-card">
            <div>
              <div className="demo-card-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Reactive State Engine</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Instant React 19 State &amp; Particle dispatch</p>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={handleReset} title="Reset Counter">
                  <RotateCcw size={15} />
                  <span>Reset</span>
                </button>
              </div>

              {/* Counter Display */}
              <div className="demo-counter-display">
                <button
                  className="counter-ctrl-btn"
                  onClick={handleDecrement}
                  aria-label="Decrease counter"
                >
                  <Minus size={20} />
                </button>

                <div className="counter-digit gradient-text">
                  {count}
                </div>

                <button
                  className="counter-ctrl-btn"
                  onClick={handleIncrement}
                  aria-label="Increase counter"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Step Size Selector */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Step Increment</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 5, 10].map((s) => (
                    <button
                      key={s}
                      className={`tab-btn ${step === s ? 'active' : ''}`}
                      onClick={() => setStep(s)}
                    >
                      +{s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Value Stream */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <span>State Stream:</span>
                {history.map((val, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.15rem 0.5rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '4px',
                      color: idx === history.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)'
                    }}
                  >
                    {val}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => {
                  confetti({
                    particleCount: 100,
                    spread: 80,
                    origin: { y: 0.6 }
                  });
                  onTriggerToast('✨ Celebration Triggered!');
                }}
              >
                <Sparkles size={16} />
                <span>Trigger Particle Blast</span>
              </button>
            </div>
          </div>

          {/* Card 2: Vercel Edge PoP Latency Simulator */}
          <div className="glass-card interactive-demo-card">
            <div>
              <div className="demo-card-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Global Edge Network</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Simulated CDN Points of Presence</p>
                </div>
                <div className="badge badge-accent">
                  <span className="badge-pulse-dot"></span>
                  <span>Operational</span>
                </div>
              </div>

              {/* Edge Node Ping List */}
              <div className="edge-ping-list">
                {edgeNodes.map((node, i) => (
                  <div key={i} className="edge-node-row">
                    <div className="edge-node-info">
                      <Server size={16} color="var(--accent-primary)" />
                      <span style={{ fontSize: '0.88rem', fontWeight: '500' }}>{node.region}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span className="edge-region-tag">HTTP/3</span>
                      <span className="edge-latency-pill">{node.latency} ms</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                className="btn btn-secondary"
                style={{ width: '100%' }}
                onClick={handleSimulatePing}
                disabled={isPinging}
              >
                <Activity size={16} />
                <span>{isPinging ? 'Pinging PoPs...' : 'Simulate Edge Ping'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
