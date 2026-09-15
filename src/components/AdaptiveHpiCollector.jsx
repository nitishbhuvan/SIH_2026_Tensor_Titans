import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Activity,
  Flame,
  Plus
} from 'lucide-react';
import {
  HPI_FIELDS,
  analyzeHpiCompleteness,
  generateAdaptiveHpiPrompts,
  synthesizeHpiNarrative,
  identifySymptomCategory
} from '../services/hpiService.js';
import './AdaptiveHpiCollector.css';

export default function AdaptiveHpiCollector({
  hpiData = {},
  onHpiChange,
  chiefComplaint = '',
  transcript = '',
  userLanguage = 'en',
  isElderly = false,
  patientInfo = {}
}) {
  const [customInputs, setCustomInputs] = useState({});

  // Compute completeness score & identify gaps
  const analysis = useMemo(() => {
    return analyzeHpiCompleteness(transcript || chiefComplaint, hpiData, userLanguage);
  }, [transcript, chiefComplaint, hpiData, userLanguage]);

  const symptomCat = useMemo(() => {
    return identifySymptomCategory(chiefComplaint || transcript);
  }, [chiefComplaint, transcript]);

  // Generate adaptive prompts for unfulfilled fields
  const missingPrompts = useMemo(() => {
    return generateAdaptiveHpiPrompts(analysis.missing_fields, symptomCat.key, userLanguage);
  }, [analysis.missing_fields, symptomCat.key, userLanguage]);

  // Handle single field update
  const handleUpdateField = (fieldKey, value) => {
    const updated = {
      ...hpiData,
      [fieldKey]: value
    };
    onHpiChange?.(updated);
  };

  // Quick chip selection handler
  const handleSelectChip = (fieldId, chip) => {
    const fieldMeta = HPI_FIELDS.find(f => f.id === fieldId);
    if (!fieldMeta) return;

    if (fieldId === 'severity') {
      handleUpdateField('severity_score', chip.score || 5);
      return;
    }

    const currentVal = hpiData[fieldMeta.key] || '';
    const selectedLabel = chip[userLanguage] || chip.label || chip.en || chip.id;

    // If field already has content, append or replace
    const newVal = currentVal ? `${currentVal}, ${selectedLabel}` : selectedLabel;
    handleUpdateField(fieldMeta.key, newVal);
  };

  const handleCustomInputSubmit = (fieldId) => {
    const text = (customInputs[fieldId] || '').trim();
    if (!text) return;
    const fieldMeta = HPI_FIELDS.find(f => f.id === fieldId);
    if (fieldMeta) {
      const currentVal = hpiData[fieldMeta.key] || '';
      handleUpdateField(fieldMeta.key, currentVal ? `${currentVal}, ${text}` : text);
      setCustomInputs(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  // Real-time synthesized narrative
  const liveNarrative = useMemo(() => {
    return synthesizeHpiNarrative(hpiData, patientInfo);
  }, [hpiData, patientInfo]);

  const score = analysis.completeness_score;
  const scoreBadgeClass = score >= 80 ? 'score-high' : score >= 50 ? 'score-med' : 'score-low';

  return (
    <div className={`adaptive-hpi-card ${isElderly ? 'hpi-elderly-mode' : ''}`}>
      {/* ── Header & Completeness Progress ────────────────────────────── */}
      <div className="hpi-card-header">
        <div className="hpi-title-block">
          <span className="hpi-badge">
            <Sparkles size={14} className="hpi-sparkle-icon" />
            AI Adaptive Clinical History (HPI)
          </span>
          <h3 className="hpi-heading">
            {userLanguage === 'hi'
              ? 'वर्तमान बीमारी का विस्तृत विवरण (HPI)'
              : userLanguage === 'kn'
              ? 'ಪ್ರಸ್ತುತ ಅನಾರೋಗ್ಯದ ವಿವರವಾದ ಇತಿಹಾಸ (HPI)'
              : 'History of Present Illness (OLD CARTS Model)'}
          </h3>
          <p className="hpi-subtext">
            {userLanguage === 'hi'
              ? 'सटीक निदान के लिए इन महत्वपूर्ण जानकारियों को पूरा करें:'
              : userLanguage === 'kn'
              ? 'ನಿಖರವಾದ ರೋಗನಿರ್ಣಯಕ್ಕಾಗಿ ಈ ವಿವರಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ:'
              : 'Answer key parameters to complete your structured clinical profile for the doctor:'}
          </p>
        </div>

        {/* Completeness Ring / Bar */}
        <div className={`hpi-score-badge ${scoreBadgeClass}`}>
          <div className="score-number">{score}%</div>
          <div className="score-label">
            {score >= 80 ? 'Clinical Ready' : score >= 50 ? 'Good Progress' : 'Needs Details'}
          </div>
        </div>
      </div>

      {/* Progress Track */}
      <div className="hpi-progress-bar-track" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`hpi-progress-bar-fill ${scoreBadgeClass}`}
          style={{ width: `${Math.max(8, score)}%` }}
        />
      </div>

      {/* ── Already Detected Clinical Facts (Auto-extracted) ───────────── */}
      {analysis.detected_fields.length > 0 && (
        <div className="hpi-detected-section">
          <div className="hpi-section-label">
            <CheckCircle2 size={14} className="text-success" />
            <span>Captured from your narrative:</span>
          </div>
          <div className="hpi-detected-chips">
            {analysis.detected_fields.map((fieldId) => {
              const fieldMeta = HPI_FIELDS.find(f => f.id === fieldId);
              const val = hpiData[fieldMeta?.key];
              if (!val) return null;
              return (
                <div key={fieldId} className="hpi-detected-chip">
                  <span className="chip-key">{fieldMeta?.label.split(' ')[0]}:</span>
                  <span className="chip-val">{String(val)}</span>
                  <button
                    type="button"
                    className="chip-edit-btn"
                    onClick={() => handleUpdateField(fieldMeta.key, '')}
                    title="Clear to re-enter"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Adaptive Prompts for Missing Gaps ──────────────────────────── */}
      {missingPrompts.length > 0 && (
        <div className="hpi-prompts-container">
          <div className="hpi-section-label">
            <HelpCircle size={14} className="text-accent" />
            <span>
              {userLanguage === 'hi'
                ? `डॉक्टर के लिए आवश्यक प्रश्न (${missingPrompts.length} शेष):`
                : userLanguage === 'kn'
                ? `ವೈದ್ಯರಿಗಾಗಿ ಅಗತ್ಯವಿರುವ ಪ್ರಶ್ನೆಗಳು (${missingPrompts.length} ಉಳಿದಿವೆ):`
                : `Recommended details for physician review (${missingPrompts.length} remaining):`}
            </span>
          </div>

          <div className="hpi-prompt-cards-grid">
            {missingPrompts.map((prompt) => (
              <div key={prompt.id} className="hpi-prompt-card">
                <div className="prompt-card-top">
                  <span className="prompt-field-title">{prompt.title}</span>
                </div>
                <h4 className="prompt-question-text">{prompt.question}</h4>

                {/* Quick Selection Chips */}
                <div className="prompt-chips-wrapper">
                  {prompt.chips.map((chip, idx) => (
                    <button
                      key={`${prompt.id}-chip-${idx}`}
                      type="button"
                      className="prompt-option-chip"
                      onClick={() => handleSelectChip(prompt.id, chip)}
                    >
                      <Plus size={12} className="chip-plus" />
                      <span>{chip[userLanguage] || chip.label || chip.en}</span>
                    </button>
                  ))}
                </div>

                {/* Custom Text Option */}
                <div className="prompt-custom-input-row">
                  <input
                    type="text"
                    className="prompt-custom-input"
                    placeholder={
                      userLanguage === 'hi'
                        ? 'या यहाँ टाइप करें...'
                        : userLanguage === 'kn'
                        ? 'ಅಥವಾ ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...'
                        : 'Or type specific details...'
                    }
                    value={customInputs[prompt.id] || ''}
                    onChange={(e) => setCustomInputs(prev => ({ ...prev, [prompt.id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCustomInputSubmit(prompt.id);
                    }}
                  />
                  <button
                    type="button"
                    className="prompt-custom-submit-btn"
                    onClick={() => handleCustomInputSubmit(prompt.id)}
                    disabled={!customInputs[prompt.id]?.trim()}
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Visual Pain/Severity VAS Scale Slider (1 to 10) ────────────── */}
      <div className="hpi-severity-slider-card">
        <div className="severity-slider-header">
          <div className="severity-title-row">
            <Activity size={16} className="text-accent" />
            <span className="severity-label">
              {userLanguage === 'hi'
                ? 'तकलीफ / दर्द की गंभीरता (1 से 10 VAS स्केल)'
                : userLanguage === 'kn'
                ? 'ನೋವಿನ ತೀವ್ರತೆ (1 ರಿಂದ 10 VAS ಪ್ರಮಾಣ)'
                : 'Pain / Discomfort Severity Rating (1 to 10 Scale)'}
            </span>
          </div>
          <span className="severity-current-val">
            <b>{hpiData.severity_score || 5}</b> / 10
            <small className="severity-adjective">
              {(hpiData.severity_score || 5) <= 3
                ? ' (Mild)'
                : (hpiData.severity_score || 5) <= 6
                ? ' (Moderate)'
                : (hpiData.severity_score || 5) <= 8
                ? ' (Severe)'
                : ' (Critical)'}
            </small>
          </span>
        </div>

        <input
          type="range"
          min="1"
          max="10"
          step="1"
          className="hpi-vas-slider"
          value={hpiData.severity_score || 5}
          onChange={(e) => handleUpdateField('severity_score', parseInt(e.target.value, 10))}
        />

        <div className="severity-scale-ticks">
          <span>1 Mild 😊</span>
          <span>4 Moderate 😐</span>
          <span>7 Severe 😣</span>
          <span>10 Excruciating 😫</span>
        </div>
      </div>

      {/* ── Live Generated Clinical HPI Narrative Preview ───────────────── */}
      <div className="hpi-narrative-preview-card">
        <div className="narrative-preview-header">
          <span className="narrative-tag">
            <Flame size={13} />
            Physician SOAP Synthesis Preview
          </span>
          <span className="narrative-hint">Auto-compiled for Doctor</span>
        </div>
        <p className="narrative-body-text">{liveNarrative}</p>
      </div>
    </div>
  );
}
