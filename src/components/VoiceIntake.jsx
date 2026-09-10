import React, { useState, useEffect } from 'react';
import {
  Mic,
  Activity,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Volume2,
  Copy,
  Printer,
  RotateCcw,
  Sparkles,
  Settings,
  Pill,
  Stethoscope,
  Leaf,
  Clock,
  ChevronRight,
  FileText,
  Zap,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { VOICE_LANGUAGES } from '../translations.js';
import { addClinicalRecord } from '../services/clinicalRecordsService.js';
import VoiceRecorder from './VoiceRecorder.jsx';
import './VoiceIntake.css';

const CLINICAL_PRESETS = [
  {
    id: 'preset-hi-cardiac',
    lang: 'hi',
    badge: 'Acute Pyrosis / Red Flag',
    label: 'Hindi: छाती में जलन व भारीपन (Metformin/Pyrosis)',
    transcript: 'मुझे दो दिन से छाती में बहुत जलन हो रही है और भारीपन लगता है। पेट भी भारी रहता है। मैं शुगर के लिए मेटफॉर्मिन और पेंटोप्रजोल ले रहा हूँ। चक्कर भी आते हैं।'
  },
  {
    id: 'preset-kn-ayur',
    lang: 'kn',
    badge: 'Mandagni / Ayurvedic Routine',
    label: 'Kannada: ಹೊಟ್ಟೆ ಉಬ್ಬರ, ಮಂದಾಗ್ನಿ & ತ್ರಿಫಲಾ ಚೂರ್ಣ',
    transcript: 'ನನಗೆ ಮೂರು ವಾರಗಳಿಂದ ಹೊಟ್ಟೆ ಸರಿಯಾಗಿ ಸ್ವಚ್ಛವಾಗುತ್ತಿಲ್ಲ, ಮಲಬದ್ಧತೆ ಇದೆ ಮತ್ತು ಮಂದಾಗ್ನಿ ಆಗಿದೆ. ರಾತ್ರಿ ತ್ರಿಫಲಾ ಚೂರ್ಣ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ.'
  },
  {
    id: 'preset-ta-sandhi',
    lang: 'ta',
    badge: 'Sandhivata / Urgent',
    label: 'Tamil: மூட்டு வலி, வாதம் & அஸ்வகந்தா',
    transcript: 'எனக்கு இரண்டு வாரங்களாக மூட்டு வலி மற்றும் முழங்கால் வீக்கம் உள்ளது. வாத பிரச்சனை அதிகம் உள்ளது. அஸ்வகந்தா மாத்திரை சாப்பிடுகிறேன்.'
  },
  {
    id: 'preset-sa-ayush',
    lang: 'sa',
    badge: 'Classical AYUSH',
    label: 'Sanskrit: वात-पित्त प्रकोप & मन्दाग्नि',
    transcript: 'मम द्वे दिनेभ्यः हृदये दाहः मंदाग्निः च वर्तते। वात-पित्त प्रकोपः अस्ति। अश्वगन्धा चूर्णम् सेवयामि।'
  }
];

export default function VoiceIntake({
  userLanguage = 'en',
  isElderly = false,
  t,
  onNotify
}) {
  const [selectedVoiceLang, setSelectedVoiceLang] = useState(() => {
    return userLanguage === 'en' ? 'hi' : userLanguage;
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [clinicalData, setClinicalData] = useState(null);
  const [activeTab, setActiveTab] = useState('clinical'); // 'clinical' | 'original'
  const [errorMessage, setErrorMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const [groqApiKey, setGroqApiKey] = useState(() => {
    return localStorage.getItem('preconsult_groq_api_key') || '';
  });

  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return localStorage.getItem('preconsult_gemini_api_key') || '';
  });

  // Sync voice language when user changes global language
  useEffect(() => {
    if (userLanguage && userLanguage !== 'en') {
      setSelectedVoiceLang(userLanguage);
    }
  }, [userLanguage]);

  // ── Handle Recorded 16kHz Base64 Audio from VoiceRecorder ──
  const handleRecordingComplete = async (audioBase64, durationSeconds) => {
    await processVoiceIntakePayload({
      audioBase64,
      language: selectedVoiceLang,
      duration: durationSeconds
    });
  };

  // ── Unified API Intake Processor ──
  const processVoiceIntakePayload = async ({ audioBase64, transcript, language }) => {
    try {
      setIsProcessing(true);
      setErrorMessage('');

      const payload = {
        language: language || selectedVoiceLang,
        apiKey: groqApiKey.trim() || undefined,
        geminiKey: geminiApiKey.trim() || undefined
      };

      if (audioBase64) {
        payload.audioBase64 = audioBase64;
      }
      if (transcript) {
        payload.transcript = transcript;
      }

      const response = await fetch('/api/voice-intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(groqApiKey ? { 'x-groq-api-key': groqApiKey.trim() } : {}),
          ...(geminiApiKey ? { 'x-gemini-api-key': geminiApiKey.trim() } : {})
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${response.status}`);
      }

      const resData = await response.json();
      const parsedRecord = resData.data || resData;

      if (parsedRecord && (parsedRecord.clinical_english_summary || parsedRecord.translated_clinical_english)) {
        setClinicalData(parsedRecord);
        setIsProcessing(false);

        // Push to shared Doctor Portal queue
        addClinicalRecord(parsedRecord, {
          language: selectedVoiceLang,
          languageLabel: getLanguageLabel(selectedVoiceLang),
          isElderly: isElderly
        });

        if (onNotify) {
          const engineLabel = parsedRecord.asr_engine_used === 'bhashini_ai4bharat'
            ? 'Bhashini ULCA Primary'
            : parsedRecord.asr_engine_used === 'groq_whisper_fallback'
            ? 'Groq Whisper Fallback'
            : 'Clinical Engine';

          onNotify(`Voice intake transcribed via ${engineLabel} and normalized with Gemini 1.5 Flash.`, 'success');
        }
      } else {
        throw new Error(resData.error || 'Failed to extract clinical consultation note.');
      }
    } catch (err) {
      console.error('Voice Intake processing error:', err);
      setIsProcessing(false);
      setErrorMessage(err.message || 'Clinical intake processing error. Please try again.');
      if (onNotify) {
        onNotify('Processing failed: ' + (err.message || 'Unknown error'), 'error');
      }
    }
  };

  // ── Preset Trigger ──
  const handleSelectPreset = (preset) => {
    setSelectedVoiceLang(preset.lang);
    processVoiceIntakePayload({
      transcript: preset.transcript,
      language: preset.lang
    });
  };

  const handleReset = () => {
    setClinicalData(null);
    setIsProcessing(false);
    setErrorMessage('');
  };

  // ── Text-to-Speech (Read Aloud) ──
  const handleSpeakAloud = () => {
    if (!clinicalData) return;
    const textToSpeak =
      activeTab === 'clinical'
        ? `Chief complaint: ${clinicalData.chief_complaint}. Duration: ${clinicalData.duration}. Summary: ${clinicalData.clinical_english_summary || clinicalData.translated_clinical_english}`
        : (clinicalData.raw_transcript || clinicalData.original_transcript);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
      if (onNotify) {
        onNotify('Reading clinical summary aloud…', 'info');
      }
    }
  };

  // ── Copy Note ──
  const handleCopyNote = () => {
    if (!clinicalData) return;
    const note = `PRECONSULT CLINICAL INTAKE (OPD SLIP)
=====================================
Detected Language: ${clinicalData.detected_language || getLanguageLabel(selectedVoiceLang)}
ASR Engine: ${clinicalData.asr_engine_used || 'Dual-Engine Indic ASR'}
Triage Urgency: ${clinicalData.triage_urgency} (${clinicalData.triage_reason})

CHIEF COMPLAINT:
${clinicalData.chief_complaint} (${clinicalData.duration})

PHYSICIAN SOAP CLINICAL SUMMARY:
${clinicalData.clinical_english_summary || clinicalData.translated_clinical_english}

ASSOCIATED SYMPTOMS:
${(clinicalData.associated_symptoms || []).join(', ') || 'None reported'}

MEDICATIONS PRESERVED:
${(clinicalData.medications_detected || clinicalData.medications_mentioned || []).join(', ') || 'None'}

AYURVEDIC / AYUSH PARAMETERS:
- Dosha Imbalance: ${(clinicalData.ayush_parameters || clinicalData.ayurvedic_factors)?.dosha_imbalance || 'N/A'}
- Agni Status: ${(clinicalData.ayush_parameters || clinicalData.ayurvedic_factors)?.agni_status || 'N/A'}

RAW PATIENT TRANSCRIPT:
"${clinicalData.raw_transcript || clinicalData.original_transcript}"
`;
    navigator.clipboard.writeText(note);
    if (onNotify) {
      onNotify('Clinical SOAP note copied to clipboard.', 'success');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveApiKeys = (e) => {
    e.preventDefault();
    localStorage.setItem('preconsult_groq_api_key', groqApiKey.trim());
    localStorage.setItem('preconsult_gemini_api_key', geminiApiKey.trim());
    setShowSettings(false);
    if (onNotify) {
      onNotify('API credentials updated successfully.', 'success');
    }
  };

  const getLanguageLabel = (code) => {
    const found = VOICE_LANGUAGES.find((l) => l.id === code);
    return found ? `${found.nativeLabel} (${found.label})` : code;
  };

  const currentVoiceLangObj = VOICE_LANGUAGES.find((l) => l.id === selectedVoiceLang) || VOICE_LANGUAGES[0];

  const getTriageBadge = (urgency) => {
    switch (urgency) {
      case 'RED_FLAG':
        return {
          icon: <AlertOctagon size={18} className="triage-icon red-flag" />,
          label: 'RED FLAG (Immediate Attention)',
          className: 'triage-badge red-flag'
        };
      case 'URGENT':
        return {
          icon: <AlertTriangle size={18} className="triage-icon urgent" />,
          label: 'URGENT (Priority OPD)',
          className: 'triage-badge urgent'
        };
      default:
        return {
          icon: <CheckCircle2 size={18} className="triage-icon routine" />,
          label: 'ROUTINE (Standard OPD)',
          className: 'triage-badge routine'
        };
    }
  };

  const getEngineBadge = (engineKey) => {
    switch (engineKey) {
      case 'bhashini_ai4bharat':
        return {
          icon: <Zap size={14} className="engine-icon bhashini" />,
          label: 'Bhashini AI4Bharat ULCA (Primary ASR)',
          colorClass: 'engine-bhashini'
        };
      case 'groq_whisper_fallback':
        return {
          icon: <Layers size={14} className="engine-icon groq" />,
          label: 'Groq Whisper-large-v3 (Fallback ASR)',
          colorClass: 'engine-groq'
        };
      default:
        return {
          icon: <ShieldCheck size={14} className="engine-icon local" />,
          label: 'Local Clinical Rules Engine',
          colorClass: 'engine-local'
        };
    }
  };

  return (
    <section className={`voice-intake-container ${isElderly ? 'is-elderly' : ''}`} id="voice-intake-section">
      {/* Institutional Header Bar */}
      <div className="voice-header-bar">
        <div className="voice-header-meta">
          <span className="voice-badge-mono">
            <Activity size={14} /> NIDAN-AI // DUAL-ENGINE INDIC VOICE INTAKE
          </span>
          <span className="voice-badge-status">
            <span className="status-dot"></span> BHASHINI ULCA + GROQ WHISPER + GEMINI 1.5 FLASH
          </span>
        </div>
        <button
          type="button"
          className="voice-settings-btn"
          onClick={() => setShowSettings(!showSettings)}
          aria-label="API Key Settings"
          title="Configure API Keys"
        >
          <Settings size={16} />
          <span>{(groqApiKey || geminiApiKey) ? 'Custom Keys Active' : 'API Settings'}</span>
        </button>
      </div>

      {/* Settings Drawer */}
      {showSettings && (
        <div className="voice-settings-drawer">
          <form onSubmit={handleSaveApiKeys} className="voice-settings-form">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div>
                <label htmlFor="groq-key-input" style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Groq API Key (Optional for Whisper Fallback):
                </label>
                <input
                  id="groq-key-input"
                  type="password"
                  placeholder="gsk_..."
                  value={groqApiKey}
                  onChange={(e) => setGroqApiKey(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color, #cbd5e1)' }}
                />
              </div>
              <div>
                <label htmlFor="gemini-key-input" style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Gemini API Key (Optional for Clinical Scribe):
                </label>
                <input
                  id="gemini-key-input"
                  type="password"
                  placeholder="AIzaSy..."
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color, #cbd5e1)' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <button type="submit" className="settings-save-btn">Save Credentials</button>
              {(groqApiKey || geminiApiKey) && (
                <button
                  type="button"
                  className="settings-clear-btn"
                  onClick={() => {
                    setGroqApiKey('');
                    setGeminiApiKey('');
                    localStorage.removeItem('preconsult_groq_api_key');
                    localStorage.removeItem('preconsult_gemini_api_key');
                  }}
                >
                  Clear All
                </button>
              )}
            </div>
            <p className="settings-help" style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted, #64748b)' }}>
              Server environment variables (`BHASHINI_API_KEY`, `GROQ_API_KEY`, `GEMINI_API_KEY`) are utilized by default on Cloudflare Pages.
            </p>
          </form>
        </div>
      )}

      {/* Main Stage */}
      <div className="voice-stage">
        {/* Title & Instructions */}
        <div className="voice-intro">
          <h2 className="voice-title">{t.voiceIntakeTitle || 'Multilingual Indic Voice Intake'}</h2>
          <p className="voice-subtitle">
            {isElderly
              ? (t.voiceIntakeElderlyPrompt || 'Tap the big microphone and speak your symptoms')
              : (t.voiceIntakeSubtitle || 'Speak in your native Indian language. Our dual-engine pipeline transcribes and normalizes symptoms with term preservation.')}
          </p>
        </div>

        {/* Spoken Language Selector Bar */}
        <div className="voice-lang-bar">
          <span className="lang-bar-label">{t.voiceSelectLang || 'Patient Spoken Language:'}</span>
          <div className="lang-chips-scroll" role="group" aria-label="Select voice language">
            {VOICE_LANGUAGES.map((lang) => {
              const isActive = selectedVoiceLang === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  className={`lang-chip ${isActive ? 'is-active' : ''}`}
                  onClick={() => setSelectedVoiceLang(lang.id)}
                  aria-pressed={isActive}
                >
                  <span className="lang-chip-glyph">{lang.glyph}</span>
                  <span className="lang-chip-native">{lang.nativeLabel}</span>
                  <span className="lang-chip-code">({lang.label})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 16kHz High-Clarity Voice Recorder Component */}
        {!clinicalData && (
          <div style={{ marginTop: '16px', marginBottom: '24px' }}>
            <VoiceRecorder
              onRecordingComplete={handleRecordingComplete}
              isProcessing={isProcessing}
              isElderly={isElderly}
              language={selectedVoiceLang}
              languageName={currentVoiceLangObj.nativeLabel || currentVoiceLangObj.label}
              onNotify={onNotify}
            />
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="voice-error-box" style={{ margin: '16px 0' }}>
            <AlertTriangle size={20} />
            <div className="error-text-wrap">
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Preset clinical scenarios */}
        {!clinicalData && !isProcessing && (
          <div className="presets-container">
            <div className="presets-header">
              <span className="presets-title">
                <Sparkles size={16} /> {t.voicePresetLabel || 'Quick Clinical Presets (Instant Demonstration):'}
              </span>
            </div>
            <div className="presets-grid">
              {CLINICAL_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className="preset-card"
                  onClick={() => handleSelectPreset(preset)}
                >
                  <div className="preset-card-top">
                    <span className="preset-badge">{preset.badge}</span>
                    <ChevronRight size={14} />
                  </div>
                  <strong className="preset-label">{preset.label}</strong>
                  <p className="preset-snippet">"{preset.transcript}"</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── CLINICAL RESULT CARD ── */}
        {clinicalData && (
          <div className="clinical-result-card" id="clinical-slip">
            {/* Header & Badges */}
            <div className="result-header">
              <div className="result-title-group">
                <span className="slip-meta-tag">OPD INTAKE RECORD // PC-MED-09</span>
                <h3 className="result-heading">Clinical Intake Summary</h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {/* Engine Badge */}
                {(() => {
                  const engine = getEngineBadge(clinicalData.asr_engine_used);
                  return (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        background: 'rgba(2, 132, 199, 0.1)',
                        color: '#0284c7',
                        border: '1px solid rgba(2, 132, 199, 0.2)'
                      }}
                    >
                      {engine.icon}
                      <span>{engine.label}</span>
                    </div>
                  );
                })()}

                {/* Triage Urgency Badge */}
                {(() => {
                  const badge = getTriageBadge(clinicalData.triage_urgency);
                  return (
                    <div className={badge.className}>
                      {badge.icon}
                      <span>{badge.label}</span>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Triage Reason */}
            {clinicalData.triage_reason && (
              <div className="triage-reason-box">
                <strong>Triage Assessment:</strong> {clinicalData.triage_reason}
              </div>
            )}

            {/* Chief Complaint & Duration */}
            <div className="chief-complaint-banner">
              <div className="cc-item">
                <span className="cc-label">
                  <Stethoscope size={16} /> {t.voiceChiefComplaint || 'Chief Complaint'}:
                </span>
                <strong className="cc-value">{clinicalData.chief_complaint}</strong>
              </div>
              <div className="cc-item duration">
                <span className="cc-label">
                  <Clock size={16} /> {t.voiceDuration || 'Duration'}:
                </span>
                <strong className="cc-value">{clinicalData.duration}</strong>
              </div>
            </div>

            {/* Tabs for SOAP Note vs Raw Native Voice Transcript */}
            <div className="result-tab-nav" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'clinical'}
                className={`result-tab ${activeTab === 'clinical' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('clinical')}
              >
                <FileText size={16} />
                <span>{t.voiceTabClinical || 'Physician Clinical Note (SOAP / English)'}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'original'}
                className={`result-tab ${activeTab === 'original' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('original')}
              >
                <Mic size={16} />
                <span>{t.voiceTabOriginal || 'Original Patient Voice Transcript'}</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="result-tab-content">
              {activeTab === 'clinical' ? (
                <div className="clinical-soap-view">
                  <p className="soap-narrative">
                    {clinicalData.clinical_english_summary || clinicalData.translated_clinical_english}
                  </p>
                </div>
              ) : (
                <div className="original-transcript-view">
                  <span className="transcript-lang-tag">
                    Detected Language: <strong>{clinicalData.detected_language || getLanguageLabel(selectedVoiceLang)}</strong>
                  </span>
                  <blockquote className="raw-transcript-quote">
                    "{clinicalData.raw_transcript || clinicalData.original_transcript}"
                  </blockquote>
                </div>
              )}
            </div>

            {/* Entities & Clinical Factors */}
            <div className="entities-grid">
              {/* Associated Symptoms */}
              {clinicalData.associated_symptoms && clinicalData.associated_symptoms.length > 0 && (
                <div className="entity-card">
                  <span className="entity-card-title">
                    <Activity size={16} /> {t.voiceAssociatedSymptoms || 'Associated Symptoms'}
                  </span>
                  <div className="entity-tags-wrap">
                    {clinicalData.associated_symptoms.map((symptom, idx) => (
                      <span key={idx} className="entity-tag symptom-tag">{symptom}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Medications Detected */}
              {(clinicalData.medications_detected || clinicalData.medications_mentioned) &&
                (clinicalData.medications_detected || clinicalData.medications_mentioned).length > 0 && (
                <div className="entity-card">
                  <span className="entity-card-title">
                    <Pill size={16} /> {t.voiceMedications || 'Medications Preserved'}
                  </span>
                  <div className="entity-tags-wrap">
                    {(clinicalData.medications_detected || clinicalData.medications_mentioned).map((med, idx) => (
                      <span key={idx} className="entity-tag medication-tag">{med}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ayurvedic & AYUSH Parameters */}
              {(clinicalData.ayush_parameters || clinicalData.ayurvedic_factors) && (
                <div className="entity-card ayurvedic-card">
                  <span className="entity-card-title">
                    <Leaf size={16} /> {t.voiceAyurvedicFactors || 'Ayurvedic & AYUSH Parameters'}
                  </span>
                  <div className="ayurvedic-factors-list">
                    <div className="ayur-factor-row">
                      <span className="ayur-key">{t.voiceDosha || 'Dosha Imbalance'}:</span>
                      <span className="ayur-val">
                        {(clinicalData.ayush_parameters || clinicalData.ayurvedic_factors).dosha_imbalance || 'None specifically indicated'}
                      </span>
                    </div>
                    <div className="ayur-factor-row">
                      <span className="ayur-key">{t.voiceAgni || 'Agni Status'}:</span>
                      <span className="ayur-val">
                        {(clinicalData.ayush_parameters || clinicalData.ayurvedic_factors).agni_status || 'Samagni (balanced)'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="result-actions-bar">
              <div className="action-btns-left">
                <button
                  type="button"
                  className="slip-action-btn"
                  onClick={handleSpeakAloud}
                  title="Read clinical note aloud"
                >
                  <Volume2 size={16} />
                  <span>{t.voiceSpeakAloud || 'Read Aloud'}</span>
                </button>
                <button
                  type="button"
                  className="slip-action-btn"
                  onClick={handleCopyNote}
                  title="Copy formatted note"
                >
                  <Copy size={16} />
                  <span>{t.voiceCopySlip || 'Copy Note'}</span>
                </button>
                <button
                  type="button"
                  className="slip-action-btn"
                  onClick={handlePrint}
                  title="Print intake record"
                >
                  <Printer size={16} />
                  <span>{t.voicePrintSlip || 'Print Slip'}</span>
                </button>
              </div>

              <div className="action-btns-right">
                <button
                  type="button"
                  className="slip-action-btn primary-new-btn"
                  onClick={handleReset}
                >
                  <RotateCcw size={16} />
                  <span>{t.voiceNewIntake || 'New Voice Intake'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
