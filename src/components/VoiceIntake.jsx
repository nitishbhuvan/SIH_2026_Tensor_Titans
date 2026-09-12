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
  Edit3,
  Send,
  X
} from 'lucide-react';
import { VOICE_LANGUAGES } from '../translations.js';
import { addClinicalRecord } from '../services/clinicalRecordsService.js';
import { executeClientClinicalNLP } from '../services/clinicalNlpService.js';
import { encodeWAV, resampleAudioBuffer } from '../utils/wavEncoder.js';
import './VoiceIntake.css';

// Language locale mapping for SpeechRecognition API
const SPEECH_LANG_MAP = {
  hi: 'hi-IN',
  kn: 'kn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  ml: 'ml-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  sa: 'hi-IN',
  en: 'en-IN'
};

// Cross-platform audio format detector for Mobile (iOS Safari / Android Chrome) & Desktop
const getSupportedAudioMimeType = () => {
  if (typeof window === 'undefined' || typeof window.MediaRecorder === 'undefined') return '';
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/aac',
    'audio/ogg;codecs=opus'
  ];
  for (const t of candidates) {
    if (typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported(t)) {
      return t;
    }
  }
  return '';
};

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
    id: 'preset-te-jvara',
    lang: 'te',
    badge: 'Jwara / Acute Fever',
    label: 'Telugu: తీవ్రమైన జ్వరం, దగ్గు & పారాసిటమాల్',
    transcript: 'నాకు మూడు రోజుల నుండి తీవ్రమైన జ్వరం, దగ్గు మరియు గొంతు నొప్పి ఉన్నాయి. పారాసిటమాల్ వేసుకున్నాను.'
  },
  {
    id: 'preset-mr-pitta',
    lang: 'mr',
    badge: 'Pitta / Acidity',
    label: 'Marathi: छातीत जळजळ आणि पोटात गॅस',
    transcript: 'मला दोन दिवसांपासून छातीत जळजळ आणि पोटात खूप गॅस होतोय. चक्कर पण येते आणि मळमळ वाटते.'
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
  t = {},
  onNotify,
  patientProfile
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

  // Live real-time speech recognition state
  const [liveTranscript, setLiveTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [transcribeElapsedSec, setTranscribeElapsedSec] = useState(0);

  // Microphone permission modal states
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionBlocked, setPermissionBlocked] = useState(false);

  const [groqApiKey, setGroqApiKey] = useState(() => {
    return localStorage.getItem('preconsult_groq_api_key') || '';
  });

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const pcmChunksRef = useRef([]);
  const scriptProcessorRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const recognitionRef = useRef(null);
  const finalTranscriptAccumulatorRef = useRef('');

  const stopRecordingCleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (scriptProcessorRef.current) {
      try {
        scriptProcessorRef.current.disconnect();
      } catch (_) {}
      scriptProcessorRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    setAudioLevel(0);
  }, []);

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
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, [stopRecordingCleanup]);

  const [inputMethod, setInputMethod] = useState('voice'); // 'voice' | 'type'
  const [customTypedText, setCustomTypedText] = useState('');

  // ── Handle Mic Click ──
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

    // Direct recording start
    startRecordingDirect();
  };

  // ── Start Audio Recording & Live Speech Recognition ──
  const startRecordingDirect = async () => {
    try {
      setShowPermissionModal(false);
      setPermissionBlocked(false);
      setErrorMessage('');
      setLiveTranscript('');
      setInterimText('');
      finalTranscriptAccumulatorRef.current = '';
      audioChunksRef.current = [];
      pcmChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      mediaStreamRef.current = stream;

      // ── Web Audio Analyser & Raw Float32 PCM Capture ──
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        if (audioCtx.state === 'suspended') {
          await audioCtx.resume().catch(() => {});
        }
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);

        // 1. Analyser for Waveform Visualizer
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

        // 2. ScriptProcessor for direct 16kHz PCM capture (Zero-loss WAV pipeline)
        try {
          const processor = audioCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const channelData = e.inputBuffer.getChannelData(0);
            pcmChunksRef.current.push(new Float32Array(channelData));
          };
          source.connect(processor);
          processor.connect(audioCtx.destination);
          scriptProcessorRef.current = processor;
        } catch (procErr) {
          console.warn('ScriptProcessor setup warning:', procErr);
        }
      }

      // ── Browser Live Speech Recognition (Bhashini / Web Speech API) ──
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = SPEECH_LANG_MAP[selectedVoiceLang] || 'hi-IN';

          recognition.onresult = (event) => {
            let interim = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcriptPiece = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscriptAccumulatorRef.current += (finalTranscriptAccumulatorRef.current ? ' ' : '') + transcriptPiece;
              } else {
                interim += transcriptPiece;
              }
            }
            setLiveTranscript(finalTranscriptAccumulatorRef.current);
            setInterimText(interim);
          };

          recognition.onerror = (e) => {
            console.warn('SpeechRecognition notice:', e.error);
          };

          recognition.start();
          recognitionRef.current = recognition;
        } catch (e) {
          console.warn('Could not start live SpeechRecognition:', e);
        }
      }

      // ── MediaRecorder for fallback recording ──
      const mimeType = getSupportedAudioMimeType();
      let mediaRecorder;
      try {
        mediaRecorder = mimeType
          ? new MediaRecorder(stream, { mimeType })
          : new MediaRecorder(stream);
      } catch (e) {
        console.warn('Fallback to standard MediaRecorder options:', e);
        mediaRecorder = new MediaRecorder(stream);
      }
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        await handleAudioConversionAndProcess();
      };

      mediaRecorder.start(250);
      setRecordingState('recording');
      setRecordDuration(0);

      timerRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);

      if (onNotify) {
        onNotify(isElderly ? 'माइक चालू है, बोलिए…' : 'Microphone active. Speak your symptoms naturally.', 'info');
      }
    } catch (err) {
      console.warn('Microphone permission notice:', err);
      setRecordingState('idle');
      stopRecordingCleanup();

      const isMobileInsecure = typeof window !== 'undefined' &&
        window.location.protocol !== 'https:' &&
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1';

      if (isMobileInsecure) {
        setErrorMessage(
          'Mobile browsers require HTTPS for microphone access over WiFi. You can type your symptoms below for instant clinical intake.'
        );
        setInputMethod('type');
      } else {
        setPermissionBlocked(true);
        setShowPermissionModal(true);
        setErrorMessage(
          'Microphone is unavailable or blocked. You can type your symptoms below.'
        );
      }

      if (onNotify) {
        onNotify(isMobileInsecure ? 'Microphone requires HTTPS on mobile. Switched to typing mode.' : 'Microphone access blocked. You can type your symptoms.', 'warning');
      }
    }
  };

  // ── Stop Audio Recording ──
  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    } else {
      handleAudioConversionAndProcess();
    }
  };

  // ── Convert Audio to 16kHz Mono WAV and Send to Server ──
  const handleAudioConversionAndProcess = async () => {
    setRecordingState('transcribing');

    let wavBlob = null;
    const sampleRate = audioContextRef.current?.sampleRate || 44100;
    const capturedUserText = (finalTranscriptAccumulatorRef.current + ' ' + interimText).trim();

    // 1. Primary: Encode directly from raw PCM chunks collected in real-time
    if (pcmChunksRef.current && pcmChunksRef.current.length > 0) {
      try {
        const resampled = resampleAudioBuffer(pcmChunksRef.current, sampleRate, 16000);
        wavBlob = encodeWAV(resampled, 16000);
      } catch (pcmErr) {
        console.warn('PCM encoding error:', pcmErr);
      }
    }

    // 2. Secondary fallback: Decode from MediaRecorder compressed blob
    if (!wavBlob && audioChunksRef.current.length > 0) {
      try {
        const mimeType = getSupportedAudioMimeType();
        const rawBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        const arrayBuf = await rawBlob.arrayBuffer();
        const decodeCtx = new (window.AudioContext || window.webkitAudioContext)();
        const decodedBuffer = await decodeCtx.decodeAudioData(arrayBuf);
        const channelData = decodedBuffer.getChannelData(0);
        const resampled = resampleAudioBuffer([channelData], decodedBuffer.sampleRate, 16000);
        wavBlob = encodeWAV(resampled, 16000);
        await decodeCtx.close().catch(() => {});
      } catch (decodeErr) {
        console.warn('decodeAudioData fallback error:', decodeErr);
      }
    }

    stopRecordingCleanup();
    await processAudioIntake(wavBlob, capturedUserText || null);
  };

  // ── Process Audio or Direct Spoken/Typed Transcript (Direct Bhashini Testing, No Timeout) ──
  const processAudioIntake = async (audioBlob, spokenTranscript) => {
    const rawText = (spokenTranscript || customTypedText || liveTranscript || '').trim();

    // If nothing was captured at all
    if (!rawText && (!audioBlob || audioBlob.size === 0)) {
      setRecordingState('idle');
      setErrorMessage('No speech was detected. Please ensure your microphone is active and speak clearly, or type your symptoms.');
      return;
    }

    setTranscribeElapsedSec(0);
    const ticker = setInterval(() => {
      setTranscribeElapsedSec((s) => s + 1);
    }, 1000);

    try {
      setRecordingState('transcribing');
      setErrorMessage('');

      let clinicalResult = null;

      // 1. Send Audio / Transcript to Server (Direct Bhashini ASR, waiting full response time)
      if (audioBlob || rawText) {
        try {
          let response;
          if (audioBlob && audioBlob.size > 0) {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'audio.wav');
            formData.append('language', selectedVoiceLang);
            if (rawText) formData.append('transcript', rawText);
            if (groqApiKey) formData.append('apiKey', groqApiKey);

            response = await fetch('/api/voice-intake', {
              method: 'POST',
              headers: groqApiKey ? { 'x-groq-api-key': groqApiKey } : {},
              body: formData
            });
          } else {
            response = await fetch('/api/voice-intake', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(groqApiKey ? { 'x-groq-api-key': groqApiKey } : {})
              },
              body: JSON.stringify({
                language: selectedVoiceLang,
                transcript: rawText,
                apiKey: groqApiKey
              })
            });
          }

          if (response.ok) {
            const resData = await response.json();
            if (resData.success && resData.data) {
              clinicalResult = resData.data;
            }
          } else {
            const errData = await response.json().catch(() => ({}));
            console.error('Bhashini endpoint error:', errData);
            setErrorMessage(errData.error || `Server error (${response.status}) from Bhashini`);
          }
        } catch (fetchErr) {
          console.error('Voice intake error:', fetchErr);
          setErrorMessage(`Transcription failed: ${fetchErr.message}`);
        }
      }

      clearInterval(ticker);

      // 2. Client-Side Clinical NLP Fallback
      if (!clinicalResult) {
        clinicalResult = executeClientClinicalNLP(
          rawText || 'Patient reports clinical symptoms for evaluation.',
          selectedVoiceLang
        );
        clinicalResult.transcription_engine = 'Client Indic Fallback';
      }

      setClinicalData(clinicalResult);
      setRecordingState('success');

      // Persist to shared Doctor Portal queue
      addClinicalRecord(clinicalResult, {
        name: patientProfile?.name || 'Anonymous Patient',
        abhaId: patientProfile?.abhaId || '91-8765-4321-0987',
        abhaAddress: patientProfile?.abhaAddress || 'patient@abdm',
        phone: patientProfile?.phone || '+91 98765 43210',
        age: patientProfile?.age || null,
        gender: patientProfile?.gender || 'Unknown',
        language: selectedVoiceLang,
        languageLabel: (() => {
          const LANG_MAP = {
            hi: 'Hindi',
            kn: 'Kannada',
            ta: 'Tamil',
            te: 'Telugu',
            ml: 'Malayalam',
            mr: 'Marathi',
            bn: 'Bengali',
            gu: 'Gujarati',
            pa: 'Punjabi',
            sa: 'Sanskrit',
            en: 'English'
          };
          return LANG_MAP[selectedVoiceLang] || selectedVoiceLang;
        })(),
        isElderly: isElderly
      });

      if (onNotify) {
        onNotify('Voice intake processed. SOAP note generated & attached to Doctor OPD queue.', 'success');
      }
    } catch (err) {
      console.error('Intake pipeline error:', err);
      const fallback = executeClientClinicalNLP(
        rawText || 'Patient reports clinical symptoms for review.',
        selectedVoiceLang
      );
      fallback.transcription_engine = 'Client Indic Fallback';
      setClinicalData(fallback);
      setRecordingState('success');
    }
  };

  // ── Handle Manual Typing Submission ──
  const handleTypedSubmit = (e) => {
    e.preventDefault();
    if (!customTypedText.trim()) return;
    setLiveTranscript(customTypedText.trim());
    processAudioIntake(null, customTypedText.trim());
  };

  // ── Execute Preset Scenario (Explicit Demo Only) ──
  const handleSelectPreset = (preset) => {
    setShowPermissionModal(false);
    setSelectedVoiceLang(preset.lang);
    setLiveTranscript(preset.transcript);
    processAudioIntake(null, preset.transcript);
  };

  // ── Reset Intake ──
  const handleReset = () => {
    setClinicalData(null);
    setRecordingState('idle');
    setRecordDuration(0);
    setErrorMessage('');
    setLiveTranscript('');
    setInterimText('');
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
      onNotify('API Key configuration saved.', 'success');
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
            <span className="status-dot"></span> REAL-TIME BHASHINI & INDIC ASR
          </span>
        </div>
        <button
          type="button"
          className="voice-settings-btn"
          onClick={() => setShowSettings(!showSettings)}
          aria-label="API Key Settings"
          title="Configure Cloud API Keys"
        >
          <Settings size={16} />
          <span>{groqApiKey ? 'Cloud AI Active' : 'AI Settings'}</span>
        </button>
      </div>

      {/* Optional API Key Configuration Drawer */}
      {showSettings && (
        <div className="voice-settings-drawer">
          <form onSubmit={handleSaveApiKey} className="voice-settings-form">
            <label htmlFor="groq-key-input">
              <strong>Custom Cloud API Key (Groq / Bhashini / Gemini):</strong>
            </label>
            <div className="settings-input-group">
              <input
                id="groq-key-input"
                type="password"
                placeholder="gsk_... or Cloudflare Secret Key"
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
              Browser-native speech recognition runs 100% locally in your browser for all Indian languages without requiring any API key.
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
                  onClick={() => {
                    if (recordingState === 'idle') {
                      setSelectedVoiceLang(lang.id);
                    }
                  }}
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

        {/* Input Method Switcher (Voice vs Type) */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="intake-method-toggle-bar">
            <button
              type="button"
              className={`method-toggle-btn ${inputMethod === 'voice' ? 'is-active' : ''}`}
              onClick={() => setInputMethod('voice')}
            >
              <Mic size={16} />
              <span>Voice Microphone</span>
            </button>
            <button
              type="button"
              className={`method-toggle-btn ${inputMethod === 'type' ? 'is-active' : ''}`}
              onClick={() => setInputMethod('type')}
            >
              <Edit3 size={16} />
              <span>Type / Paste Symptoms</span>
            </button>
          </div>
        </div>

        {/* Microphone / Typing Recording Console */}
        <div className="voice-recording-console">
          {inputMethod === 'type' && recordingState === 'idle' && (
            <div className="typed-action-box">
              <form onSubmit={handleTypedSubmit} className="typed-input-form">
                <div className="typed-textarea-wrap">
                  <textarea
                    className="typed-symptoms-input"
                    rows={4}
                    value={customTypedText}
                    onChange={(e) => setCustomTypedText(e.target.value)}
                    placeholder={`Describe symptoms in ${currentVoiceLangObj.nativeLabel} / English (e.g. 'मुझे 2 दिन से तेज बुखार, खांसी और सिरदर्द है')`}
                  />
                </div>
                <div className="typed-form-footer">
                  <span className="typed-lang-badge">
                    <Activity size={14} /> Processing in {currentVoiceLangObj.nativeLabel} ({currentVoiceLangObj.label})
                  </span>
                  <button
                    type="submit"
                    className="typed-submit-btn"
                    disabled={!customTypedText.trim() || recordingState === 'transcribing' || recordingState === 'analyzing'}
                  >
                    <Send size={16} />
                    <span>Analyze & Generate SOAP Note</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {inputMethod === 'voice' && recordingState === 'idle' && (
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
                Spoken language: <strong>{currentVoiceLangObj.nativeLabel} ({currentVoiceLangObj.label})</strong> • Tap microphone to speak your symptoms
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

              {/* LIVE TRANSCRIPTION SPEECH BUBBLE */}
              <div className="live-speech-card">
                <div className="live-speech-header">
                  <span className="live-pulse-dot"></span>
                  <strong>Listening to your voice ({currentVoiceLangObj.nativeLabel}):</strong>
                </div>
                <div className="live-speech-body">
                  {liveTranscript || interimText ? (
                    <p className="live-speech-text">
                      <span className="final-text">{liveTranscript}</span>
                      <span className="interim-text"> {interimText}</span>
                    </p>
                  ) : (
                    <p className="live-speech-placeholder">
                      Start speaking now… Your words in {currentVoiceLangObj.nativeLabel} will appear here in real time.
                    </p>
                  )}
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
                {t.voiceStatusRecording || 'Listening… Speak clearly into your microphone'}
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
                  ? `Transcribing voice with Bhashini Bodhan ASR... (${transcribeElapsedSec}s)`
                  : (t.voiceStatusAnalyzing || 'Generating SOAP Note & Preserving Ayurvedic Formulations…')}
              </h3>
              {liveTranscript && (
                <div className="processed-snippet-box">
                  <span>Detected Speech:</span>
                  <p>"{liveTranscript}"</p>
                </div>
              )}
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

        {/*
          ── SAMPLE PRESETS TEMPORARILY COMMENTED OUT FOR TESTING ──
          [REMINDER BEFORE PUSH: Uncomment the block below if you want demo sample scenarios visible on production]
        */}
        {/* {!clinicalData && (
          <div className="presets-container">
            <div className="presets-header">
              <span className="presets-title">
                <Sparkles size={16} /> {t.voicePresetLabel || 'Or Test With Instant Sample Scenarios:'}
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
        )} */}

        {/* ── CLINICAL INTAKE RESULT CARD ── */}
        {clinicalData && (
          <div className="clinical-result-card" id="clinical-slip">
            {/* Slip Header & Triage Badge */}
            <div className="result-header">
              <div className="result-title-group">
                <div className="slip-meta-badges">
                  <span className="slip-meta-tag">OPD CLINICAL INTAKE RECORD // PC-MED-09</span>
                  {clinicalData.transcription_engine && (
                    <span className="engine-meta-tag">
                      <Sparkles size={12} /> {clinicalData.transcription_engine}
                    </span>
                  )}
                </div>
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
              <button
                type="button"
                className="mic-perm-btn primary-grant-btn"
                onClick={startRecordingDirect}
              >
                <Mic size={18} />
                <span>{permissionBlocked ? 'Try Microphone Again' : (t.micPermAllowBtn || 'Allow Microphone & Speak')}</span>
              </button>

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
