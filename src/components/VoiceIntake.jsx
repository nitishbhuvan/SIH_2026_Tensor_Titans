import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
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
  Lock,
  X,
  HelpCircle
} from 'lucide-react';
import { VOICE_LANGUAGES } from '../translations.js';
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
    transcript: 'எனக்கு இரண்டு வாரங்களாக மூட்டு வலி மற்றும் முழங்கால் வீக்கம் உள்ளது. வாத பிரச்சனை அதிகம் உள்ளது. அஸ்வகந்தா மற்றும் தಶಮೂಲಾರಿಷ್ಟ சாப்பிடுகிறேன்.'
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

  const [recordingState, setRecordingState] = useState('idle'); // 'idle' | 'recording' | 'transcribing' | 'analyzing' | 'success' | 'error'
  const [recordDuration, setRecordDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [clinicalData, setClinicalData] = useState(null);
  const [activeTab, setActiveTab] = useState('clinical'); // 'clinical' | 'original'
  const [errorMessage, setErrorMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  // Microphone permission modal states
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionBlocked, setPermissionBlocked] = useState(false);

  const [groqApiKey, setGroqApiKey] = useState(() => {
    return localStorage.getItem('preconsult_groq_api_key') || '';
  });

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Sync voice language when user changes global language
  useEffect(() => {
    if (userLanguage && userLanguage !== 'en') {
      setSelectedVoiceLang(userLanguage);
    }
  }, [userLanguage]);

  // Clean up Web Audio and Timer on unmount
  useEffect(() => {
    return () => {
      stopRecordingCleanup();
    };
  }, []);

  const stopRecordingCleanup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
    setAudioLevel(0);
  };

  // ── Handle Mic Click: Check Permission First or Open Modal ──
  const handleMicButtonClick = async () => {
    if (recordingState === 'recording') {
      stopRecording();
      return;
    }

    // Check if browser permission was already granted in Permissions API
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const status = await navigator.permissions.query({ name: 'microphone' });
        if (status.state === 'granted') {
          startRecordingDirect();
          return;
        } else if (status.state === 'denied') {
          setPermissionBlocked(true);
          setShowPermissionModal(true);
          return;
        }
      } catch (_) {
        // Fallback for browsers that don't support query for microphone
      }
    }

    // Open explicit pre-permission modal to guide user
    setPermissionBlocked(false);
    setShowPermissionModal(true);
  };

  // ── Start Audio Recording Direct (Calls getUserMedia) ──
  const startRecordingDirect = async () => {
    try {
      setShowPermissionModal(false);
      setPermissionBlocked(false);
      setErrorMessage('');
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      // Web Audio Analyser for real-time waveform level
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateLevel = () => {
          if (analyserRef.current) {
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
            animationFrameRef.current = requestAnimationFrame(updateLevel);
          }
        };
        updateLevel();
      }

      // MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        stopRecordingCleanup();

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudioIntake(audioBlob, null);
      };

      mediaRecorder.start(250);
      setRecordingState('recording');
      setRecordDuration(0);

      timerRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);

      if (onNotify) {
        onNotify(isElderly ? 'माइक चालू है, बोलिए…' : 'Microphone recording active. Speak your symptoms.', 'info');
      }
    } catch (err) {
      console.warn('Microphone permission error:', err);
      setRecordingState('idle');
      stopRecordingCleanup();
      
      // If user denied in browser prompt, show the blocked guidance modal
      setPermissionBlocked(true);
      setShowPermissionModal(true);

      setErrorMessage(
        'Microphone permission is required to record voice. You can also test clinical intake with the sample presets below.'
      );
      if (onNotify) {
        onNotify('Microphone permission blocked or dismissed.', 'warning');
      }
    }
  };

  // ── Stop Audio Recording ──
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setRecordingState('transcribing');
    }
  };

  // ── Process Audio or Direct Transcript with API ──
  const processAudioIntake = async (audioBlob, presetTranscript) => {
    try {
      setRecordingState('transcribing');
      setErrorMessage('');

      // Send to /api/voice-intake
      let response;

      if (audioBlob) {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'intake.webm');
        formData.append('language', selectedVoiceLang);
        if (groqApiKey) {
          formData.append('apiKey', groqApiKey);
        }

        setTimeout(() => {
          setRecordingState('analyzing');
        }, 800);

        response = await fetch('/api/voice-intake', {
          method: 'POST',
          headers: groqApiKey ? { 'x-groq-api-key': groqApiKey } : {},
          body: formData
        });
      } else {
        setTimeout(() => {
          setRecordingState('analyzing');
        }, 500);

        response = await fetch('/api/voice-intake', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(groqApiKey ? { 'x-groq-api-key': groqApiKey } : {})
          },
          body: JSON.stringify({
            language: selectedVoiceLang,
            transcript: presetTranscript,
            apiKey: groqApiKey
          })
        });
      }

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        setClinicalData(resData.data);
        setRecordingState('success');
        if (onNotify) {
          onNotify('Clinical Intake & Ayurvedic extraction completed.', 'success');
        }
      } else {
        throw new Error(resData.error || 'Failed to parse clinical intake');
      }
    } catch (err) {
      console.error('Intake pipeline error:', err);
      setRecordingState('error');
      setErrorMessage(err.message || 'Error processing clinical voice intake. Please try again.');
    }
  };

  // ── Execute Preset Scenario ──
  const handleSelectPreset = (preset) => {
    setShowPermissionModal(false);
    setSelectedVoiceLang(preset.lang);
    processAudioIntake(null, preset.transcript);
  };

  // ── Reset Intake ──
  const handleReset = () => {
    setClinicalData(null);
    setRecordingState('idle');
    setRecordDuration(0);
    setErrorMessage('');
  };

  // ── Text-to-Speech (Read Aloud) ──
  const handleSpeakAloud = () => {
    if (!clinicalData) return;
    const textToSpeak =
      activeTab === 'clinical'
        ? `Chief complaint: ${clinicalData.chief_complaint}. Duration: ${clinicalData.duration}. Summary: ${clinicalData.translated_clinical_english}`
        : clinicalData.original_transcript;

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

  // ── Copy Clinical SOAP Note ──
  const handleCopyNote = () => {
    if (!clinicalData) return;
    const note = `PRECONSULT CLINICAL INTAKE (OPD SLIP)
=====================================
Detected Language: ${clinicalData.detected_language}
Triage Level: ${clinicalData.triage_urgency} (${clinicalData.triage_reason})

CHIEF COMPLAINT:
${clinicalData.chief_complaint} (${clinicalData.duration})

PHYSICIAN SOAP CLINICAL SUMMARY:
${clinicalData.translated_clinical_english}

ASSOCIATED SYMPTOMS:
${(clinicalData.associated_symptoms || []).join(', ')}

CURRENT MEDICATIONS:
${(clinicalData.medications_mentioned || []).join(', ')}

AYURVEDIC / AYUSH FACTORS:
- Dosha Imbalance: ${clinicalData.ayurvedic_factors?.dosha_imbalance || 'N/A'}
- Agni Status: ${clinicalData.ayurvedic_factors?.agni_status || 'N/A'}

RAW NATIVE PATIENT TRANSCRIPT:
"${clinicalData.original_transcript}"
`;
    navigator.clipboard.writeText(note);
    if (onNotify) {
      onNotify('Clinical SOAP note copied to clipboard.', 'success');
    }
  };

  // ── Print Slip ──
  const handlePrint = () => {
    window.print();
  };

  // ── Save API Key ──
  const handleSaveApiKey = (e) => {
    e.preventDefault();
    localStorage.setItem('preconsult_groq_api_key', groqApiKey.trim());
    setShowSettings(false);
    if (onNotify) {
      onNotify('Groq API Key configuration saved.', 'success');
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

  const currentVoiceLangObj = VOICE_LANGUAGES.find((l) => l.id === selectedVoiceLang) || VOICE_LANGUAGES[0];

  return (
    <section className={`voice-intake-container ${isElderly ? 'is-elderly' : ''}`} id="voice-intake-section">
      {/* Institutional Section Header */}
      <div className="voice-header-bar">
        <div className="voice-header-meta">
          <span className="voice-badge-mono">
            <Activity size={14} /> NIDAN-AI // VOICE CLINICAL INTAKE
          </span>
          <span className="voice-badge-status">
            <span className="status-dot"></span> ASR & TERM PRESERVATION
          </span>
        </div>
        <button
          type="button"
          className="voice-settings-btn"
          onClick={() => setShowSettings(!showSettings)}
          aria-label="API Key Settings"
          title="Configure Groq API Key"
        >
          <Settings size={16} />
          <span>{groqApiKey ? 'API Key Active' : 'API Settings'}</span>
        </button>
      </div>

      {/* Optional API Key Configuration Drawer */}
      {showSettings && (
        <div className="voice-settings-drawer">
          <form onSubmit={handleSaveApiKey} className="voice-settings-form">
            <label htmlFor="groq-key-input">
              <strong>Groq API Key (Optional for live Cloud Whisper & Llama 3.1):</strong>
            </label>
            <div className="settings-input-group">
              <input
                id="groq-key-input"
                type="password"
                placeholder="gsk_..."
                value={groqApiKey}
                onChange={(e) => setGroqApiKey(e.target.value)}
              />
              <button type="submit" className="settings-save-btn">Save Key</button>
              {groqApiKey && (
                <button
                  type="button"
                  className="settings-clear-btn"
                  onClick={() => {
                    setGroqApiKey('');
                    localStorage.removeItem('preconsult_groq_api_key');
                  }}
                >
                  Clear
                </button>
              )}
            </div>
            <p className="settings-help">
              If left blank, the system automatically uses the embedded high-fidelity clinical and Ayurvedic normalizer fallback.
            </p>
          </form>
        </div>
      )}

      {/* Main Interactive Stage */}
      <div className="voice-stage">
        {/* Title & Patient Instructions */}
        <div className="voice-intro">
          <h2 className="voice-title">{t.voiceIntakeTitle || 'Multilingual Clinical Voice Intake'}</h2>
          <p className="voice-subtitle">
            {isElderly
              ? (t.voiceIntakeElderlyPrompt || 'Tap the big microphone and speak your symptoms')
              : (t.voiceIntakeSubtitle || 'Speak naturally in your native language. Our clinical pipeline preserves medical & Ayurvedic formulations.')}
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

        {/* Microphone Recording Console */}
        <div className="voice-recording-console">
          {recordingState === 'idle' && (
            <div className="mic-action-box">
              <button
                type="button"
                className="big-mic-button mic-idle"
                onClick={handleMicButtonClick}
                aria-label={t.voiceStartRecording || 'Tap to Speak'}
              >
                <div className="mic-icon-wrap">
                  <Mic size={isElderly ? 52 : 44} />
                </div>
                <span className="mic-cta-text">{t.voiceStartRecording || 'Tap to Speak'}</span>
              </button>
              <p className="mic-subtext">
                Spoken language: <strong>{currentVoiceLangObj.nativeLabel} ({currentVoiceLangObj.label})</strong> • Tap microphone to begin
              </p>
            </div>
          )}

          {recordingState === 'recording' && (
            <div className="mic-action-box is-active-recording">
              <div className="recording-visualizer">
                <div className="audio-wave-bars">
                  <span className="wave-bar" style={{ height: `${Math.max(15, audioLevel * 0.9)}%` }}></span>
                  <span className="wave-bar" style={{ height: `${Math.max(25, audioLevel * 1.3)}%` }}></span>
                  <span className="wave-bar" style={{ height: `${Math.max(10, audioLevel * 0.7)}%` }}></span>
                  <span className="wave-bar" style={{ height: `${Math.max(30, audioLevel * 1.5)}%` }}></span>
                  <span className="wave-bar" style={{ height: `${Math.max(18, audioLevel * 1.0)}%` }}></span>
                </div>
                <div className="recording-timer">
                  <span className="recording-pulse-dot"></span>
                  <Clock size={16} />
                  <span>{formatTimer(recordDuration)}</span>
                </div>
              </div>

              <button
                type="button"
                className="big-mic-button mic-recording"
                onClick={stopRecording}
                aria-label={t.voiceStopRecording || 'Tap to Stop'}
              >
                <div className="mic-icon-wrap stop-pulse">
                  <MicOff size={isElderly ? 52 : 44} />
                </div>
                <span className="mic-cta-text">{t.voiceStopRecording || 'Tap to Finish'}</span>
              </button>

              <p className="recording-instruction">
                {t.voiceStatusRecording || 'Listening… Speak clearly into the microphone'}
              </p>
            </div>
          )}

          {(recordingState === 'transcribing' || recordingState === 'analyzing') && (
            <div className="processing-indicator">
              <div className="spinner-orbit">
                <Sparkles size={36} className="spin-icon" />
              </div>
              <h3 className="processing-heading">
                {recordingState === 'transcribing'
                  ? (t.voiceStatusTranscribing || 'Transcribing Indic Speech (Whisper v3)…')
                  : (t.voiceStatusAnalyzing || 'Extracting Clinical Entities & Ayurvedic Dosha Factors…')}
              </h3>
              <p className="processing-sub">
                Ensuring Sanskrit formulations (*Triphala, Ashwagandha, Mandagni*) and modern medications (*Metformin, Pantoprazole*) are preserved.
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="voice-error-box">
              <AlertTriangle size={20} />
              <div className="error-text-wrap">
                <span>{errorMessage}</span>
                <button
                  type="button"
                  className="error-action-link"
                  onClick={() => setShowPermissionModal(true)}
                >
                  View Permission Guide
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Clinical Test Presets (For instant demonstration) */}
        {!clinicalData && (
          <div className="presets-container">
            <div className="presets-header">
              <span className="presets-title">
                <Sparkles size={16} /> {t.voicePresetLabel || 'Quick Clinical Test Scenarios (Instant Demo):'}
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

        {/* ── CLINICAL INTAKE RESULT CARD ── */}
        {clinicalData && (
          <div className="clinical-result-card" id="clinical-slip">
            {/* Slip Header & Triage Badge */}
            <div className="result-header">
              <div className="result-title-group">
                <span className="slip-meta-tag">OPD CLINICAL INTAKE RECORD // PC-MED-09</span>
                <h3 className="result-heading">Clinical Intake Summary</h3>
              </div>

              {/* Triage Badge */}
              <div className="triage-wrapper">
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

            {/* Triage Reason Bar */}
            {clinicalData.triage_reason && (
              <div className="triage-reason-box">
                <strong>Triage Assessment:</strong> {clinicalData.triage_reason}
              </div>
            )}

            {/* Chief Complaint & Duration Banner */}
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
                  <p className="soap-narrative">{clinicalData.translated_clinical_english}</p>
                </div>
              ) : (
                <div className="original-transcript-view">
                  <span className="transcript-lang-tag">
                    Detected Language: <strong>{clinicalData.detected_language}</strong>
                  </span>
                  <blockquote className="raw-transcript-quote">
                    "{clinicalData.original_transcript}"
                  </blockquote>
                </div>
              )}
            </div>

            {/* Entities & Clinical Factors Grid */}
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

              {/* Medications Mentioned */}
              {clinicalData.medications_mentioned && clinicalData.medications_mentioned.length > 0 && (
                <div className="entity-card">
                  <span className="entity-card-title">
                    <Pill size={16} /> {t.voiceMedications || 'Medications Mentioned'}
                  </span>
                  <div className="entity-tags-wrap">
                    {clinicalData.medications_mentioned.map((med, idx) => (
                      <span key={idx} className="entity-tag medication-tag">{med}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ayurvedic & AYUSH Factors */}
              {clinicalData.ayurvedic_factors && (
                <div className="entity-card ayurvedic-card">
                  <span className="entity-card-title">
                    <Leaf size={16} /> {t.voiceAyurvedicFactors || 'Ayurvedic & AYUSH Factors'}
                  </span>
                  <div className="ayurvedic-factors-list">
                    <div className="ayur-factor-row">
                      <span className="ayur-key">{t.voiceDosha || 'Dosha Imbalance'}:</span>
                      <span className="ayur-val">
                        {clinicalData.ayurvedic_factors.dosha_imbalance || 'None specifically indicated'}
                      </span>
                    </div>
                    <div className="ayur-factor-row">
                      <span className="ayur-key">{t.voiceAgni || 'Agni Status'}:</span>
                      <span className="ayur-val">
                        {clinicalData.ayurvedic_factors.agni_status || 'Samagni (balanced)'}
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

      {/* ── EXPLICIT MICROPHONE PERMISSION POPUP MODAL ── */}
      {showPermissionModal && (
        <div className="mic-perm-overlay" role="dialog" aria-modal="true" aria-labelledby="mic-perm-title">
          <div className="mic-perm-modal-box">
            <button
              type="button"
              className="mic-perm-close-btn"
              onClick={() => setShowPermissionModal(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="mic-perm-header">
              <div className={`mic-perm-icon-bubble ${permissionBlocked ? 'is-blocked' : ''}`}>
                {permissionBlocked ? <AlertTriangle size={32} /> : <Mic size={32} />}
              </div>
              <h3 id="mic-perm-title" className="mic-perm-title">
                {permissionBlocked
                  ? (t.micPermBlockedTitle || 'Microphone Permission Blocked')
                  : (t.micPermModalTitle || 'Microphone Permission Needed')}
              </h3>
              <p className="mic-perm-subtitle">
                {permissionBlocked
                  ? (t.micPermBlockedHelp || 'Your browser is currently blocking microphone access. Please allow microphone in your address bar.')
                  : (t.micPermModalSubtitle || 'PreConsult needs access to your microphone so you can speak your symptoms naturally.')}
              </p>
            </div>

            {/* Browser Permission Visual Guide Box */}
            <div className="mic-perm-guide-card">
              <div className="guide-card-header">
                <Lock size={14} />
                <span>Browser Address Bar Permission Guide</span>
              </div>
              <div className="guide-steps-list">
                <div className="guide-step-item">
                  <span className="guide-step-num">1</span>
                  <span>{t.micPermStep1 || 'Click "Allow Microphone" below to initiate the request.'}</span>
                </div>
                <div className="guide-step-item">
                  <span className="guide-step-num">2</span>
                  <span>{t.micPermStep2 || 'When your browser shows a popup at the top, select "Allow".'}</span>
                </div>
                <div className="guide-step-item">
                  <span className="guide-step-num">3</span>
                  <span>{t.micPermStep3 || 'Speak your symptoms naturally in your chosen language.'}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mic-perm-actions">
              {!permissionBlocked ? (
                <button
                  type="button"
                  className="mic-perm-btn primary-grant-btn"
                  onClick={startRecordingDirect}
                >
                  <Mic size={18} />
                  <span>{t.micPermAllowBtn || 'Allow Microphone & Speak'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="mic-perm-btn primary-grant-btn"
                  onClick={startRecordingDirect}
                >
                  <RotateCcw size={18} />
                  <span>Try Microphone Again</span>
                </button>
              )}

              <button
                type="button"
                className="mic-perm-btn secondary-preset-btn"
                onClick={() => {
                  setShowPermissionModal(false);
                  handleSelectPreset(CLINICAL_PRESETS[0]);
                }}
              >
                <Sparkles size={16} />
                <span>{t.micPermPresetBtn || 'Use Test Presets Instead'}</span>
              </button>

              <button
                type="button"
                className="mic-perm-btn text-cancel-btn"
                onClick={() => setShowPermissionModal(false)}
              >
                {t.micPermCancelBtn || 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
