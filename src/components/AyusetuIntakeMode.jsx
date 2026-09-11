import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Shield,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Mic,
  MicOff,
  Volume2,
  Database,
  PlayCircle,
  Download,
  Search,
  Sparkles,
  Stethoscope,
  Heart,
  Leaf,
  Activity,
  FileText,
  RotateCcw,
  Check,
  PhoneCall,
  UserCheck,
  ClipboardList
} from 'lucide-react';
import {
  AYUSETU_DATASET_METADATA,
  PRIMARY_STAGES,
  AYUSETU_SECTIONS,
  getAllSections,
  getRedFlagQuestions,
  getAdaptiveBranch,
  getDatasetStats
} from '../data/ayusetuQuestionnaireDataset.js';
import { addClinicalRecord } from '../services/clinicalRecordsService.js';
import './AyusetuIntakeMode.css';

export default function AyusetuIntakeMode({
  userLanguage = 'en',
  isElderly = false,
  onNotify,
  onSwitchToDoctor,
  onBackToMain
}) {
  // Main View: 'interview' (Live AI Clinical Flow) | 'dataset-explorer' (Browse PDF Dataset)
  const [activeTab, setActiveTab] = useState('interview');

  // ── INTERVIEW STATE MACHINE ─────────────────────────────────────────
  // Stages: 1=Demographics, 2=Consent, 3=Chief Complaint, 4=Red Flag Check,
  // 5=HPI, 6=Adaptive Branch, 7=Past & Drug History, 8=Family & Personal,
  // 9=ROS, 10=AYUSH Dashavidha Pariksha, 11=Summary & Submit, 12=Submitted/Success
  const [currentStage, setCurrentStage] = useState(1);

  // Form responses stored keyed by question ID
  const [responses, setResponses] = useState({
    // Defaults for easy demo / fast test
    q_name: '',
    q_age: '',
    q_gender: 'Male',
    q_occupation: '',
    q_language: 'Hindi',
    q_first_visit: 'Yes, First Visit',
    q_abha_id: '',
    q_consent_given: '',
    q_chief_complaint_main: '',
    // HPI
    q_hpi_onset_when: '',
    q_hpi_onset_type: 'Gradually (slowly over time)',
    q_hpi_duration: '',
    q_hpi_severity_scale: 'Moderate (4-6)',
    q_hpi_progression: 'Getting worse',
    // Prakriti
    q_pra_body_build: 'Naturally thin & slender (Vata build)',
    q_pra_skin: 'Dry, rough, cracked or cold to touch (Vata)',
    q_pra_appetite_level: 'Variable / Irregular (Vishamagni - Vata)',
    // Agni & Koshta
    q_agni_appetite: 'Irregular & fluctuating (Vishamagni)',
    q_agni_indigestion: 'Frequently experience indigestion',
    q_kosh_freq: 'Once every 2-3 days (Krura Koshta)',
    q_kosh_constipation: 'Chronic stubborn constipation',
    // Ahara
    q_ah_daily_diet: 'Rice, dal, chapati and occasional curd',
    q_ah_spicy_food: 'Moderate spice',
    // Nidana
    q_nid_trigger_main: 'Yes, clear change preceded symptoms'
  });

  // Red Flag Alert state
  const [redFlagDetected, setRedFlagDetected] = useState(false);
  const [triggeredRedFlags, setTriggeredRedFlags] = useState([]);

  // Adaptive branch detected from chief complaint
  const [activeAdaptiveBranch, setActiveAdaptiveBranch] = useState(null);

  // Voice Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const [activeListeningQuestionId, setActiveListeningQuestionId] = useState(null);
  const speechRecognitionRef = useRef(null);

  // Dataset Explorer Search & Filters
  const [datasetSearch, setDatasetSearch] = useState('');
  const [selectedSectionFilter, setSelectedSectionFilter] = useState('all');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Summary submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecordId, setSubmittedRecordId] = useState(null);

  // Auto-detect adaptive branch when chief complaint changes
  useEffect(() => {
    const text = responses.q_chief_complaint_main || '';
    const branch = getAdaptiveBranch(text);
    setActiveAdaptiveBranch(branch);
  }, [responses.q_chief_complaint_main]);

  // Handle Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = false;
      recognizer.lang = userLanguage === 'en' ? 'en-IN' : 'hi-IN';

      recognizer.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (activeListeningQuestionId) {
          handleResponseChange(activeListeningQuestionId, transcript);
          if (onNotify) onNotify(`Voice captured: "${transcript}"`, 'info');
        }
        setIsListening(false);
        setActiveListeningQuestionId(null);
      };

      recognizer.onerror = () => {
        setIsListening(false);
        setActiveListeningQuestionId(null);
      };

      recognizer.onend = () => {
        setIsListening(false);
        setActiveListeningQuestionId(null);
      };

      speechRecognitionRef.current = recognizer;
    }
  }, [userLanguage, activeListeningQuestionId]);

  const toggleVoiceInput = (questionId) => {
    if (!speechRecognitionRef.current) {
      if (onNotify) onNotify('Speech Recognition is not supported on this browser.', 'warning');
      return;
    }
    if (isListening && activeListeningQuestionId === questionId) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
      setActiveListeningQuestionId(null);
    } else {
      setActiveListeningQuestionId(questionId);
      setIsListening(true);
      try {
        speechRecognitionRef.current.start();
        if (onNotify) onNotify('Listening... Please speak your answer.', 'info');
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleSpeakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));

    // Real-time Red-Flag Checker
    const rfList = getRedFlagQuestions();
    const isRfQuestion = rfList.find((q) => q.id === questionId);
    if (isRfQuestion) {
      if (value === true || value === 'Yes' || value === 'true') {
        setRedFlagDetected(true);
        setTriggeredRedFlags((prev) => [...new Set([...prev, isRfQuestion.text])]);
      } else {
        setTriggeredRedFlags((prev) => prev.filter((item) => item !== isRfQuestion.text));
      }
    }
  };

  // ── Navigation Between Stages ──────────────────────────────────────
  const handleNextStage = () => {
    // Stage 1 validation: Name & Age
    if (currentStage === 1) {
      if (!responses.q_name.trim()) {
        if (onNotify) onNotify('Please enter patient name to proceed.', 'warning');
        return;
      }
    }

    // Stage 2 validation: Consent Check
    if (currentStage === 2) {
      if (responses.q_consent_given !== 'Yes, I give informed consent') {
        if (onNotify) onNotify('Informed consent is mandatory before collecting clinical health information.', 'warning');
        return;
      }
    }

    // Stage 3 validation: Chief Complaint
    if (currentStage === 3) {
      if (!responses.q_chief_complaint_main.trim()) {
        if (onNotify) onNotify('Please state the primary health problem bringing you to the hospital.', 'warning');
        return;
      }
    }

    // Check if red flags triggered during Stage 4
    if (currentStage === 4 && redFlagDetected) {
      // In accordance with PDF Page 8:
      // "RED FLAG DETECTED -> STOP NORMAL QUESTIONING -> ALERT TRIAGE STAFF -> PRIORITY ASSESSMENT"
      return;
    }

    // Advance
    if (currentStage < 11) {
      setCurrentStage((prev) => prev + 1);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const handlePrevStage = () => {
    if (currentStage > 1) {
      setCurrentStage((prev) => prev - 1);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  // ── Final Submission to Doctor Portal ─────────────────────────────
  const handleSubmitClinicalRecord = () => {
    setIsSubmitting(true);

    const recordId = `AYUSETU-${Date.now().toString().slice(-5)}`;

    // Build structured SOAP & Dashavidha profile
    const clinicalPayload = {
      id: recordId,
      timestamp: new Date().toISOString(),
      status: 'pending',
      protocol: 'AYUSETU_SIH_2026',
      patientInfo: {
        name: responses.q_name || 'Anonymous Patient',
        age: parseInt(responses.q_age, 10) || 45,
        gender: responses.q_gender || 'Not specified',
        language: responses.q_language || 'Hindi',
        languageLabel: responses.q_language || 'Hindi',
        occupation: responses.q_occupation || 'Unspecified',
        abhaId: responses.q_abha_id || '91-ABHA-TENSOR-2026',
        isElderly: isElderly || (parseInt(responses.q_age, 10) >= 60)
      },
      intake: {
        original_transcript: responses.q_chief_complaint_main,
        translated_clinical_english: `Patient ${responses.q_name}, ${responses.q_age}y ${responses.q_gender} presented with: ${responses.q_chief_complaint_main}. HPI indicates onset ${responses.q_hpi_onset_when || 'gradual'}, severity rated as ${responses.q_hpi_severity_scale}.`,
        chief_complaint: responses.q_chief_complaint_main,
        duration: responses.q_hpi_duration || 'Recent onset',
        detected_language: responses.q_language || 'Hindi',
        associated_symptoms: [
          responses.q_hpi_assoc_symptoms,
          responses.q_ros_fever !== 'No fever' ? responses.q_ros_fever : null,
          responses.q_ros_cough !== 'No cough' ? responses.q_ros_cough : null,
          responses.q_ros_bowels !== 'Normal regular bowels' ? responses.q_ros_bowels : null
        ].filter(Boolean),
        medications_mentioned: [
          responses.q_med_name,
          responses.q_med_ayurvedic,
          responses.q_med_supplements
        ].filter(Boolean),
        ayurvedic_factors: {
          prakriti_assessment: responses.q_pra_body_build || 'Vata-dominant',
          vikriti_state: responses.q_vik_recent_changes || 'Acute imbalance reported',
          agni_status: responses.q_agni_appetite || 'Vishamagni / Mandagni',
          koshtha_status: responses.q_kosh_constipation || 'Krura Koshtha tendency',
          ahara_patterns: responses.q_ah_daily_diet || 'Standard diet',
          vihara_stress: responses.q_vih_stress_level || 'Moderate',
          dashavidha_summary: 'Comprehensive Dashavidha Pariksha captured via AYUSETU protocol.'
        },
        triage_urgency: redFlagDetected ? 'RED_FLAG' : 'ROUTINE',
        triage_reason: redFlagDetected
          ? `EMERGENCY ALERT: Triggered red flags (${triggeredRedFlags.join(', ')}). Immediate doctor assessment required.`
          : 'Standard clinical pre-consultation completed via AYUSETU 25-section questionnaire.'
      },
      doctorNote: '',
      prescription: []
    };

    // Save to shared clinical records service
    addClinicalRecord(clinicalPayload);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedRecordId(recordId);
      setCurrentStage(12); // Success view
      if (onNotify) onNotify(`Case record ${recordId} successfully created for doctor review!`, 'success');
    }, 600);
  };

  // ── Download Dataset as JSON ──────────────────────────────────────
  const handleDownloadDatasetJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(AYUSETU_SECTIONS, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'ayusetu_clinical_questions_dataset.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
    if (onNotify) onNotify('AYUSETU Question Dataset exported as JSON!', 'success');
  };

  // ── Filtered Questions for Explorer ───────────────────────────────
  const filteredSections = useMemo(() => {
    return AYUSETU_SECTIONS.filter((sec) => {
      const matchesCategory = selectedSectionFilter === 'all' || sec.stage === selectedSectionFilter;
      const searchLower = datasetSearch.toLowerCase().trim();
      if (!searchLower) return matchesCategory;

      const titleMatch = sec.title.toLowerCase().includes(searchLower);
      const descMatch = sec.description.toLowerCase().includes(searchLower);
      const questionMatch = sec.questions && sec.questions.some((q) => q.text.toLowerCase().includes(searchLower));
      const branchMatch = sec.branches && sec.branches.some((b) => b.questions.some((q) => q.text.toLowerCase().includes(searchLower)));

      return matchesCategory && (titleMatch || descMatch || questionMatch || branchMatch);
    });
  }, [datasetSearch, selectedSectionFilter]);

  const stats = useMemo(() => getDatasetStats(), []);

  // ── Quick Fill Demo Case ──────────────────────────────────────────
  const handleQuickFillJointPainCase = () => {
    setResponses({
      q_name: 'Shankaracharya Bhat',
      q_age: '62',
      q_gender: 'Male',
      q_occupation: 'Temple Priest / Farmer',
      q_language: 'Kannada',
      q_first_visit: 'Yes, First Visit',
      q_abha_id: '91-8834-2931-1002',
      q_consent_given: 'Yes, I give informed consent',
      q_chief_complaint_main: 'Severe bilateral knee joint pain with morning stiffness and cracking sound on walking (Sandhivata)',
      q_hpi_onset_when: '3 months ago, gradually worsening',
      q_hpi_onset_type: 'Gradually (slowly over time)',
      q_hpi_duration: '3 months',
      q_hpi_severity_scale: 'Severe (7-8)',
      q_hpi_progression: 'Getting worse',
      q_hpi_aggravating_what: 'Climbing stairs, walking in cold early mornings',
      q_hpi_agg_weather: 'Worse in cold/rainy weather',
      q_hpi_rel_rest: 'Yes, improves with rest',
      q_pmh_major_illness: 'No major illnesses',
      q_pmh_chronic: 'Hypertension',
      q_med_ayurvedic: 'Ashwagandha Churna with warm milk at night',
      q_pra_body_build: 'Naturally thin & slender (Vata build)',
      q_pra_skin: 'Dry, rough, cracked or cold to touch (Vata)',
      q_pra_temp_preference: 'Aversion to cold, feels chilly easily (Vata)',
      q_pra_sleep_nature: 'Light, restless, easily interrupted (Vata)',
      q_pra_appetite_level: 'Variable / Irregular (Vishamagni - Vata)',
      q_vik_recent_changes: 'Increased joint stiffness and dry skin over last 6 weeks',
      q_vik_dryness: 'Yes, severe new dryness (Vata aggravation)',
      q_vik_is_it_normal: 'This is a RECENT CHANGE from my normal state',
      q_agni_appetite: 'Irregular & fluctuating (Vishamagni)',
      q_agni_indigestion: 'Frequently experience indigestion',
      q_kosh_freq: 'Once every 2-3 days (Krura Koshta)',
      q_kosh_constipation: 'Chronic stubborn constipation',
      q_ah_daily_diet: 'Ragi mudde, sambar, rice, occasional fried papad',
      q_vih_wake_time: '4:45 AM (Brahma Muhurta)',
      q_vih_sleep_hours: '6 to 7 hours',
      q_sat_weather: 'Immediately catch cold/cough/joint pain with weather shifts',
      q_sat_emotional: 'Anxious and restless (Vata/Rajas)',
      q_sara_phys_strength: 'Moderate average strength (Madhyama Sara)',
      q_vya_activity_level: 'Only very light movement (Avara Vyayama Shakti)',
      q_vaya_strength_change: 'Noticeable decrease in strength',
      q_nid_trigger_main: 'Yes, clear change preceded symptoms',
      q_fin_anything_else: 'Looking for natural Ayurvedic remedies and joint oil fomentation (Janu Basti).'
    });
    setCurrentStage(3);
    if (onNotify) onNotify('Loaded pre-configured Sandhivata (Ayurvedic Joint Pain) case!', 'success');
  };

  return (
    <div className={`ayusetu-intake-container ${isElderly ? 'is-elderly' : ''}`}>
      {/* ── Top Header Strip ────────────────────────────────────────── */}
      <div className="ayusetu-header">
        <div className="ayusetu-brand-title">
          <div className="ayusetu-badge">
            <Leaf size={15} />
            <span>SIH 2026 AI Standard</span>
          </div>
          <h2>Pre-Consultation: Clinical &amp; AYUSH Intake</h2>
          <p className="ayusetu-subtitle">
            Adaptive 10-Stage Clinical Assessment with Dashavidha Pariksha &amp; Ahara-Vihara Dataset
          </p>
        </div>

        <div className="ayusetu-actions-bar">
          {/* View Tab Switcher */}
          <div className="ayusetu-tab-group" role="tablist">
            <button
              type="button"
              className={`ayusetu-tab-btn ${activeTab === 'interview' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('interview')}
            >
              <Activity size={16} />
              <span>Interactive Clinical Assistant</span>
            </button>
            <button
              type="button"
              className={`ayusetu-tab-btn ${activeTab === 'dataset-explorer' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('dataset-explorer')}
            >
              <Database size={16} />
              <span>Dataset Explorer ({stats.totalSections} Sec / {stats.totalQuestions} Qs)</span>
            </button>
          </div>

          {/* Quick Demo Pre-fill */}
          {activeTab === 'interview' && currentStage <= 3 && (
            <button
              type="button"
              className="ayusetu-demo-btn"
              onClick={handleQuickFillJointPainCase}
              title="Quickly fill sample Ayurvedic Sandhivata patient data"
            >
              <Sparkles size={15} />
              <span>Load Demo Case (Sandhivata)</span>
            </button>
          )}

          {onBackToMain && (
            <button
              type="button"
              className="ayusetu-back-nav-btn"
              onClick={onBackToMain}
            >
              Back
            </button>
          )}
        </div>
      </div>

      {/* ── VIEW 1: INTERACTIVE CLINICAL ASSISTANT ─────────────────── */}
      {activeTab === 'interview' && (
        <div className="ayusetu-interview-layout">
          {/* Progress Architecture Stepper (Page 9 from PDF) */}
          <div className="ayusetu-stepper-strip" aria-label="Clinical Protocol Progress">
            {PRIMARY_STAGES.map((stg) => {
              const isCompleted = currentStage > stg.index;
              const isCurrent = currentStage === stg.index;
              return (
                <div
                  key={stg.id}
                  className={`stepper-step ${isCurrent ? 'is-current' : ''} ${isCompleted ? 'is-completed' : ''}`}
                  onClick={() => {
                    if (isCompleted) setCurrentStage(stg.index);
                  }}
                  title={stg.title}
                >
                  <span className="step-num">{isCompleted ? '✓' : stg.index}</span>
                  <span className="step-label">{stg.title}</span>
                </div>
              );
            })}
          </div>

          {/* ── RED FLAG EMERGENCY OVERLAY / BANNER ── */}
          {redFlagDetected && (
            <div className="ayusetu-red-flag-emergency-banner" role="alert">
              <div className="rf-alert-header">
                <AlertOctagon size={32} className="rf-pulse-icon" />
                <div className="rf-text">
                  <h3>⚠️ RED FLAG DETECTED — EMERGENCY TRIAGE ESCALATION</h3>
                  <p>
                    In accordance with patient safety protocol: <strong>NORMAL QUESTIONING IS HALTED.</strong>
                    &nbsp;The AI will not attempt autonomous diagnosis. Please contact emergency triage staff immediately.
                  </p>
                </div>
              </div>

              <div className="rf-triggers-box">
                <strong>Critical Symptoms Identified:</strong>
                <ul>
                  {triggeredRedFlags.map((flag, idx) => (
                    <li key={idx}>🚨 {flag}</li>
                  ))}
                </ul>
              </div>

              <div className="rf-action-buttons">
                <a href="tel:108" className="rf-call-btn">
                  <PhoneCall size={18} />
                  <span>Call 108 Ambulance / Emergency</span>
                </a>
                <button
                  type="button"
                  className="rf-triage-notify-btn"
                  onClick={handleSubmitClinicalRecord}
                  disabled={isSubmitting}
                >
                  <AlertTriangle size={18} />
                  <span>{isSubmitting ? 'Escalating...' : 'Alert OPD Emergency Triage Queue'}</span>
                </button>
                <button
                  type="button"
                  className="rf-dismiss-btn"
                  onClick={() => setRedFlagDetected(false)}
                >
                  Clear Flag (Test Only)
                </button>
              </div>
            </div>
          )}

          {/* ── STAGE CONTENT CARDS ─────────────────────────────────── */}
          <div className="ayusetu-stage-card">
            {/* STAGE 1: DEMOGRAPHICS */}
            {currentStage === 1 && (
              <div className="stage-content">
                <div className="stage-header-meta">
                  <span className="stage-tag">Section 1 &bull; Clinical Journey Entry</span>
                  <h3>Patient Identification &amp; Demographics</h3>
                  <p>Collect baseline demographic and health identification details before entering consultation.</p>
                </div>

                <div className="questions-grid">
                  <div className="question-field">
                    <label>
                      What is your full name? <span className="req">*</span>
                    </label>
                    <div className="input-with-voice">
                      <input
                        type="text"
                        value={responses.q_name}
                        onChange={(e) => handleResponseChange('q_name', e.target.value)}
                        placeholder="Enter full legal name"
                      />
                      <button
                        type="button"
                        className={`voice-mic-btn ${isListening && activeListeningQuestionId === 'q_name' ? 'is-mic-active' : ''}`}
                        onClick={() => toggleVoiceInput('q_name')}
                        title="Speak name"
                      >
                        {isListening && activeListeningQuestionId === 'q_name' ? <MicOff size={16} /> : <Mic size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="question-field-row">
                    <div className="question-field">
                      <label>
                        What is your age? <span className="req">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={responses.q_age}
                        onChange={(e) => handleResponseChange('q_age', e.target.value)}
                        placeholder="Age in years"
                      />
                    </div>

                    <div className="question-field">
                      <label>What is your gender?</label>
                      <select
                        value={responses.q_gender}
                        onChange={(e) => handleResponseChange('q_gender', e.target.value)}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-Binary / Other">Non-Binary / Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div className="question-field-row">
                    <div className="question-field">
                      <label>What is your occupation?</label>
                      <input
                        type="text"
                        value={responses.q_occupation}
                        onChange={(e) => handleResponseChange('q_occupation', e.target.value)}
                        placeholder="e.g. Farmer, Teacher, Desk Worker"
                      />
                    </div>

                    <div className="question-field">
                      <label>Preferred Language for Consultation?</label>
                      <select
                        value={responses.q_language}
                        onChange={(e) => handleResponseChange('q_language', e.target.value)}
                      >
                        <option value="Hindi">Hindi (हिन्दी)</option>
                        <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                        <option value="Tamil">Tamil (தமிழ்)</option>
                        <option value="Telugu">Telugu (తెలుగు)</option>
                        <option value="English">English</option>
                        <option value="Marathi">Marathi (मराठी)</option>
                        <option value="Bengali">Bengali (বাংলা)</option>
                        <option value="Malayalam">Malayalam (മലയാളം)</option>
                        <option value="Sanskrit">Sanskrit (संस्कृतम्)</option>
                      </select>
                    </div>
                  </div>

                  <div className="question-field-row">
                    <div className="question-field">
                      <label>Is this your first visit?</label>
                      <div className="pill-choice-group">
                        {['Yes, First Visit', 'No, Follow-up Visit'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`pill-choice-btn ${responses.q_first_visit === opt ? 'is-selected' : ''}`}
                            onClick={() => handleResponseChange('q_first_visit', opt)}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="question-field">
                      <label>Do you have an ABHA ID / Ayushman Bharat Health Account?</label>
                      <input
                        type="text"
                        value={responses.q_abha_id}
                        onChange={(e) => handleResponseChange('q_abha_id', e.target.value)}
                        placeholder="e.g. 91-XXXX-XXXX-XXXX"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 2: CONSENT SCREEN (Dedicated Screen from PDF Page 1) */}
            {currentStage === 2 && (
              <div className="stage-content consent-screen-box">
                <div className="consent-icon-badge">
                  <Shield size={44} />
                </div>
                <h3>Patient Consent for Digital Consultation</h3>
                <p className="consent-directive">
                  &ldquo;For your software, this should be a separate consent screen, not just an ordinary medical question.&rdquo;
                </p>

                <div className="consent-statement-card">
                  <h4>Mandatory Informed Consent</h4>
                  <p className="consent-quote">
                    &ldquo;Do you consent to providing your health information for this consultation?&rdquo;
                  </p>
                  <p className="consent-subtext">
                    Under the Ayushman Bharat Digital Mission (ABDM) and Data Privacy guidelines, your responses will be used solely for AI clinical history-taking, triaging and physician review. No data is sold or shared without clinical authorization.
                  </p>
                </div>

                <div className="consent-options-grid">
                  <button
                    type="button"
                    className={`consent-choice-card ${responses.q_consent_given === 'Yes, I give informed consent' ? 'is-granted' : ''}`}
                    onClick={() => handleResponseChange('q_consent_given', 'Yes, I give informed consent')}
                  >
                    <CheckCircle2 size={24} />
                    <div className="choice-text">
                      <strong>Yes, I give informed consent</strong>
                      <span>Proceed with digital clinical intake and doctor review</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`consent-choice-card ${responses.q_consent_given === 'No, I decline' ? 'is-declined' : ''}`}
                    onClick={() => handleResponseChange('q_consent_given', 'No, I decline')}
                  >
                    <AlertOctagon size={24} />
                    <div className="choice-text">
                      <strong>No, I decline</strong>
                      <span>Exit without collecting clinical health data</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 3: CHIEF COMPLAINT (Open-Ended with Adaptive Branching) */}
            {currentStage === 3 && (
              <div className="stage-content">
                <div className="stage-header-meta">
                  <span className="stage-tag">Section 3 &bull; Open-Ended Inquiry</span>
                  <h3>Chief Complaint &mdash; MOST IMPORTANT</h3>
                  <p>The first medical question should be open-ended. The AI identifies the complaint and dynamically branches into relevant questions.</p>
                </div>

                <div className="question-field">
                  <div className="field-title-row">
                    <label>
                      &ldquo;What health problem brought you here today?&rdquo; <span className="req">*</span>
                    </label>
                    <button
                      type="button"
                      className="listen-question-btn"
                      onClick={() => handleSpeakText('What health problem brought you here today?')}
                      title="Read question aloud"
                    >
                      <Volume2 size={15} />
                      <span>Read aloud</span>
                    </button>
                  </div>

                  <div className="textarea-with-voice">
                    <textarea
                      rows="4"
                      value={responses.q_chief_complaint_main}
                      onChange={(e) => handleResponseChange('q_chief_complaint_main', e.target.value)}
                      placeholder="Speak or type your main symptoms (e.g. Severe knee joint pain when walking, chest burning sensation, acidity for 2 weeks...)"
                    />
                    <button
                      type="button"
                      className={`voice-mic-btn-large ${isListening && activeListeningQuestionId === 'q_chief_complaint_main' ? 'is-listening-pulse' : ''}`}
                      onClick={() => toggleVoiceInput('q_chief_complaint_main')}
                    >
                      <Mic size={20} />
                      <span>{isListening ? 'Listening...' : 'Voice Dictate'}</span>
                    </button>
                  </div>
                </div>

                {/* Common Presets from PDF */}
                <div className="presets-box">
                  <span className="presets-title">Or choose common clinical presentation:</span>
                  <div className="presets-chips">
                    {[
                      'Joint pain / Sandhivata (Knee swelling & stiffness)',
                      'Chest pain & retrosternal burning discomfort',
                      'Chronic constipation & Mandagni (reduced digestion)',
                      'Abdominal pain & sour acidic reflux',
                      'Persistent cough & difficulty breathing',
                      'Recurrent headache & mental stress'
                    ].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className="preset-chip-btn"
                        onClick={() => handleResponseChange('q_chief_complaint_main', preset)}
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {activeAdaptiveBranch && (
                  <div className="adaptive-detected-pill">
                    <Sparkles size={16} />
                    <span>AI Branch Triggered: <strong>{activeAdaptiveBranch.label}</strong>. Specialized questions will load in Stage 6.</span>
                  </div>
                )}
              </div>
            )}

            {/* STAGE 4: RED FLAG SCREENING (Mandatory Safety Screening) */}
            {currentStage === 4 && (
              <div className="stage-content">
                <div className="stage-header-meta">
                  <span className="stage-tag red-tag">Section 24 &bull; Mandatory Triage Safety</span>
                  <h3>Red-Flag Emergency Screening</h3>
                  <p>Immediate triage screening. Any affirmative answer halts routine flow to alert medical emergency personnel.</p>
                </div>

                <div className="red-flag-questions-list">
                  {getRedFlagQuestions().map((q) => {
                    const isYes = responses[q.id] === true || responses[q.id] === 'Yes';
                    return (
                      <div key={q.id} className={`rf-question-row ${isYes ? 'is-danger-highlight' : ''}`}>
                        <span className="rf-q-text">{q.text}</span>
                        <div className="rf-options-toggle">
                          <button
                            type="button"
                            className={`rf-toggle-btn ${responses[q.id] === 'No' ? 'is-safe' : ''}`}
                            onClick={() => handleResponseChange(q.id, 'No')}
                          >
                            No
                          </button>
                          <button
                            type="button"
                            className={`rf-toggle-btn ${isYes ? 'is-alert-active' : ''}`}
                            onClick={() => handleResponseChange(q.id, 'Yes')}
                          >
                            ⚠️ Yes
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STAGE 5: HPI — HISTORY OF PRESENT ILLNESS */}
            {currentStage === 5 && (
              <div className="stage-content">
                <div className="stage-header-meta">
                  <span className="stage-tag">Section 4 &bull; Systematic HPI</span>
                  <h3>History of Present Illness (HPI)</h3>
                  <p>Onset, duration, progression, severity, aggravating and relieving factors.</p>
                </div>

                <div className="questions-grid">
                  {/* Onset */}
                  <div className="question-field-row">
                    <div className="question-field">
                      <label>When did this problem start? (Onset)</label>
                      <input
                        type="text"
                        value={responses.q_hpi_onset_when}
                        onChange={(e) => handleResponseChange('q_hpi_onset_when', e.target.value)}
                        placeholder="e.g. 2 days ago, 3 weeks ago"
                      />
                    </div>
                    <div className="question-field">
                      <label>Did it start suddenly or gradually?</label>
                      <select
                        value={responses.q_hpi_onset_type}
                        onChange={(e) => handleResponseChange('q_hpi_onset_type', e.target.value)}
                      >
                        <option value="Suddenly (abrupt)">Suddenly (abrupt)</option>
                        <option value="Gradually (slowly over time)">Gradually (slowly over time)</option>
                        <option value="Woke up with it">Woke up with it</option>
                      </select>
                    </div>
                  </div>

                  {/* Duration & Continuity */}
                  <div className="question-field-row">
                    <div className="question-field">
                      <label>How long have you had this problem?</label>
                      <input
                        type="text"
                        value={responses.q_hpi_duration}
                        onChange={(e) => handleResponseChange('q_hpi_duration', e.target.value)}
                        placeholder="e.g. Continuous for 5 days"
                      />
                    </div>
                    <div className="question-field">
                      <label>Is it continuous or does it come and go?</label>
                      <select
                        value={responses.q_hpi_continuity || 'Continuous without break'}
                        onChange={(e) => handleResponseChange('q_hpi_continuity', e.target.value)}
                      >
                        <option value="Continuous without break">Continuous without break</option>
                        <option value="Comes and goes (intermittent / episodic)">Comes and goes (intermittent / episodic)</option>
                        <option value="Only triggers during specific activities">Only triggers during specific activities</option>
                      </select>
                    </div>
                  </div>

                  {/* Severity & Progression */}
                  <div className="question-field-row">
                    <div className="question-field">
                      <label>How severe is the problem?</label>
                      <div className="pill-choice-group">
                        {['Mild (1-3)', 'Moderate (4-6)', 'Severe (7-8)', 'Very Severe (9-10)'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`pill-choice-btn ${responses.q_hpi_severity_scale === opt ? 'is-selected' : ''}`}
                            onClick={() => handleResponseChange('q_hpi_severity_scale', opt)}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="question-field">
                      <label>Is the problem getting better or worse?</label>
                      <select
                        value={responses.q_hpi_progression}
                        onChange={(e) => handleResponseChange('q_hpi_progression', e.target.value)}
                      >
                        <option value="Getting worse">Getting worse</option>
                        <option value="Staying the same">Staying the same</option>
                        <option value="Getting better">Getting better</option>
                        <option value="Fluctuating">Fluctuating</option>
                      </select>
                    </div>
                  </div>

                  {/* Aggravating & Relieving */}
                  <div className="question-field-row">
                    <div className="question-field">
                      <label>What makes the problem worse? (Aggravating factors)</label>
                      <input
                        type="text"
                        value={responses.q_hpi_aggravating_what || ''}
                        onChange={(e) => handleResponseChange('q_hpi_aggravating_what', e.target.value)}
                        placeholder="e.g. Walking, eating spicy food, cold weather, stress"
                      />
                    </div>
                    <div className="question-field">
                      <label>What makes you feel better? (Relieving factors)</label>
                      <input
                        type="text"
                        value={responses.q_hpi_relieving_what || ''}
                        onChange={(e) => handleResponseChange('q_hpi_relieving_what', e.target.value)}
                        placeholder="e.g. Rest, lying flat, hot water fomentation"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 6: ADAPTIVE BRANCHING QUESTIONS */}
            {currentStage === 6 && (
              <div className="stage-content">
                <div className="stage-header-meta">
                  <span className="stage-tag">Section 5 &bull; AI Adaptive Branching</span>
                  <h3>Adaptive Complaint Inquiry</h3>
                  <p>The AI branches dynamically into questions relevant to your specific chief complaint.</p>
                </div>

                {activeAdaptiveBranch ? (
                  <div className="adaptive-branch-wrapper">
                    <div className="branch-meta-card">
                      <Sparkles size={18} />
                      <div>
                        <strong>Active Clinical Branch: {activeAdaptiveBranch.label}</strong>
                        <p>Questions specifically designed for investigating {responses.q_chief_complaint_main}.</p>
                      </div>
                    </div>

                    <div className="adaptive-questions-list">
                      {activeAdaptiveBranch.questions.map((q) => (
                        <div key={q.id} className="adaptive-q-item">
                          <label>{q.text}</label>
                          {q.type === 'choice' ? (
                            <div className="pill-choice-group">
                              {q.options.map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  className={`pill-choice-btn ${responses[q.id] === opt ? 'is-selected' : ''}`}
                                  onClick={() => handleResponseChange(q.id, opt)}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={responses[q.id] || ''}
                              onChange={(e) => handleResponseChange(q.id, e.target.value)}
                              placeholder="Enter details..."
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="no-branch-fallback">
                    <p>No specific sub-branch triggered for current complaint. Standard clinical questioning applies.</p>
                    <div className="question-field">
                      <label>Describe exact location, radiation and quality of sensation:</label>
                      <input
                        type="text"
                        value={responses.q_adaptive_custom || ''}
                        onChange={(e) => handleResponseChange('q_adaptive_custom', e.target.value)}
                        placeholder="e.g. Sharp pain on right side, worsens after eating"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STAGE 7: PAST MEDICAL & DRUG / ALLERGY HISTORY */}
            {currentStage === 7 && (
              <div className="stage-content">
                <div className="stage-header-meta">
                  <span className="stage-tag">Sections 6 &amp; 7 &bull; Medical &amp; Pharmacology</span>
                  <h3>Past Medical, Surgical &amp; Drug / Allergy History</h3>
                  <p>Document chronic conditions, surgeries, allopathic medicines, Ayurvedic formulations and known allergies.</p>
                </div>

                <div className="questions-grid">
                  <div className="question-field-row">
                    <div className="question-field">
                      <label>Do you have any chronic diseases?</label>
                      <select
                        value={responses.q_pmh_chronic || 'None known'}
                        onChange={(e) => handleResponseChange('q_pmh_chronic', e.target.value)}
                      >
                        <option value="None known">None known</option>
                        <option value="Diabetes Mellitus">Diabetes Mellitus</option>
                        <option value="Hypertension">Hypertension</option>
                        <option value="Thyroid Disorder">Thyroid Disorder</option>
                        <option value="Asthma / COPD">Asthma / COPD</option>
                        <option value="Multiple chronic conditions">Multiple chronic conditions</option>
                      </select>
                    </div>

                    <div className="question-field">
                      <label>Have you undergone surgery or hospitalization?</label>
                      <input
                        type="text"
                        value={responses.q_pmh_surgery || ''}
                        onChange={(e) => handleResponseChange('q_pmh_surgery', e.target.value)}
                        placeholder="e.g. Appendectomy 2018, None"
                      />
                    </div>
                  </div>

                  <div className="question-field-row">
                    <div className="question-field">
                      <label>Current Allopathic Medicines (Name &amp; Dose):</label>
                      <input
                        type="text"
                        value={responses.q_med_name || ''}
                        onChange={(e) => handleResponseChange('q_med_name', e.target.value)}
                        placeholder="e.g. Metformin 500mg BD, Pantoprazole 40mg OD"
                      />
                    </div>

                    <div className="question-field">
                      <label>Are you taking any Ayurvedic medicines or Churna?</label>
                      <input
                        type="text"
                        value={responses.q_med_ayurvedic || ''}
                        onChange={(e) => handleResponseChange('q_med_ayurvedic', e.target.value)}
                        placeholder="e.g. Triphala Churna, Ashwagandha, Dashamularishta"
                      />
                    </div>
                  </div>

                  <div className="question-field">
                    <label>Do you have any drug or food allergies?</label>
                    <div className="pill-choice-group">
                      {['No known drug allergies (NKDA)', 'Penicillin / Antibiotics', 'NSAID / Painkillers', 'Dairy allergy'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`pill-choice-btn ${responses.q_med_allergies === opt ? 'is-selected' : ''}`}
                          onClick={() => handleResponseChange('q_med_allergies', opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 8: FAMILY & PERSONAL HISTORY */}
            {currentStage === 8 && (
              <div className="stage-content">
                <div className="stage-header-meta">
                  <span className="stage-tag">Sections 8 &amp; 9 &bull; Genetics &amp; Lifestyle</span>
                  <h3>Family &amp; Personal History</h3>
                  <p>Family hereditary predispositions, diet patterns, sleep duration, exercise, and habits.</p>
                </div>

                <div className="questions-grid">
                  <div className="question-field-row">
                    <div className="question-field">
                      <label>Is there a family history of diabetes, hypertension or heart disease?</label>
                      <select
                        value={responses.q_fam_diabetes || 'No'}
                        onChange={(e) => handleResponseChange('q_fam_diabetes', e.target.value)}
                      >
                        <option value="No">No known family history</option>
                        <option value="Yes (Mother/Father/Sibling) - Diabetes">Yes - Diabetes</option>
                        <option value="Yes - Hypertension">Yes - Hypertension</option>
                        <option value="Yes - Premature Heart Disease">Yes - Heart Disease</option>
                      </select>
                    </div>

                    <div className="question-field">
                      <label>What type of diet do you follow?</label>
                      <select
                        value={responses.q_pers_diet_type || 'Vegetarian'}
                        onChange={(e) => handleResponseChange('q_pers_diet_type', e.target.value)}
                      >
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Lacto-Vegetarian">Lacto-Vegetarian</option>
                        <option value="Non-Vegetarian">Non-Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                      </select>
                    </div>
                  </div>

                  <div className="question-field-row">
                    <div className="question-field">
                      <label>How many hours do you sleep per night?</label>
                      <div className="pill-choice-group">
                        {['Under 5 hours', '6 to 7 hours', '7 to 8 hours', 'Over 9 hours'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`pill-choice-btn ${responses.q_pers_sleep_hours === opt ? 'is-selected' : ''}`}
                            onClick={() => handleResponseChange('q_pers_sleep_hours', opt)}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="question-field">
                      <label>Habits (Smoking, Alcohol, Tobacco):</label>
                      <select
                        value={responses.q_pers_smoking || 'Non-smoker'}
                        onChange={(e) => handleResponseChange('q_pers_smoking', e.target.value)}
                      >
                        <option value="Non-smoker">No smoking, alcohol or tobacco</option>
                        <option value="Occasional alcohol">Occasional alcohol only</option>
                        <option value="Current smoker">Current smoker</option>
                        <option value="Tobacco user (gutka/khaini)">Tobacco user (gutka/khaini)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 9: REVIEW OF SYSTEMS (ROS) */}
            {currentStage === 9 && (
              <div className="stage-content">
                <div className="stage-header-meta">
                  <span className="stage-tag">Section 10 &bull; Review of Systems</span>
                  <h3>Review of Systems (ROS Quick Screening)</h3>
                  <p>Comprehensive screening across body systems: General, Respiratory, Cardio, GI, and Neurological.</p>
                </div>

                <div className="ros-category-grid">
                  <div className="ros-card">
                    <h4>General &amp; Constitutional</h4>
                    <div className="ros-item">
                      <span>Fever?</span>
                      <select
                        value={responses.q_ros_fever || 'No fever'}
                        onChange={(e) => handleResponseChange('q_ros_fever', e.target.value)}
                      >
                        <option value="No fever">No fever</option>
                        <option value="Low-grade fever">Low-grade fever</option>
                        <option value="High fever with chills">High fever with chills</option>
                      </select>
                    </div>
                    <div className="ros-item">
                      <span>Unexplained weight loss?</span>
                      <select
                        value={responses.q_ros_weight_loss || 'No'}
                        onChange={(e) => handleResponseChange('q_ros_weight_loss', e.target.value)}
                      >
                        <option value="No">No</option>
                        <option value="Yes, significant sudden weight loss">Yes, significant</option>
                      </select>
                    </div>
                  </div>

                  <div className="ros-card">
                    <h4>Cardiovascular &amp; Respiratory</h4>
                    <div className="ros-item">
                      <span>Cough?</span>
                      <select
                        value={responses.q_ros_cough || 'No cough'}
                        onChange={(e) => handleResponseChange('q_ros_cough', e.target.value)}
                      >
                        <option value="No cough">No cough</option>
                        <option value="Dry cough">Dry cough</option>
                        <option value="Productive with phlegm">Productive with phlegm</option>
                      </select>
                    </div>
                    <div className="ros-item">
                      <span>Difficulty breathing?</span>
                      <select
                        value={responses.q_ros_difficulty_breathing || 'No shortness of breath'}
                        onChange={(e) => handleResponseChange('q_ros_difficulty_breathing', e.target.value)}
                      >
                        <option value="No shortness of breath">No shortness of breath</option>
                        <option value="Only on exertion/stairs">Only on exertion/stairs</option>
                        <option value="At rest">At rest</option>
                      </select>
                    </div>
                  </div>

                  <div className="ros-card">
                    <h4>Gastrointestinal &amp; Bowels</h4>
                    <div className="ros-item">
                      <span>Abdominal pain or Nausea?</span>
                      <select
                        value={responses.q_ros_abd_pain || 'No abdominal pain'}
                        onChange={(e) => handleResponseChange('q_ros_abd_pain', e.target.value)}
                      >
                        <option value="No abdominal pain">No abdominal pain</option>
                        <option value="Yes, upper burning pain">Yes, upper burning</option>
                        <option value="Frequent nausea">Frequent nausea</option>
                      </select>
                    </div>
                    <div className="ros-item">
                      <span>Bowel pattern:</span>
                      <select
                        value={responses.q_ros_bowels || 'Normal regular bowels'}
                        onChange={(e) => handleResponseChange('q_ros_bowels', e.target.value)}
                      >
                        <option value="Normal regular bowels">Normal regular bowels</option>
                        <option value="Chronic constipation">Chronic constipation</option>
                        <option value="Frequent loose stools">Frequent loose stools</option>
                      </select>
                    </div>
                  </div>

                  <div className="ros-card">
                    <h4>Neurological</h4>
                    <div className="ros-item">
                      <span>Headaches or Migraine?</span>
                      <select
                        value={responses.q_ros_headaches || 'No'}
                        onChange={(e) => handleResponseChange('q_ros_headaches', e.target.value)}
                      >
                        <option value="No">No</option>
                        <option value="Frequent tension headaches">Frequent tension headaches</option>
                        <option value="One-sided throbbing migraine">Throbbing migraine</option>
                      </select>
                    </div>
                    <div className="ros-item">
                      <span>Dizziness or Numbness?</span>
                      <select
                        value={responses.q_ros_numbness || 'No'}
                        onChange={(e) => handleResponseChange('q_ros_numbness', e.target.value)}
                      >
                        <option value="No">No</option>
                        <option value="Pins & needles in feet">Pins & needles in feet</option>
                        <option value="Lightheaded / Vertigo">Lightheaded / Vertigo</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 10: AYUSH / DASHAVIDHA PARIKSHA (Core PDF Highlight) */}
            {currentStage === 10 && (
              <div className="stage-content">
                <div className="stage-header-meta ayush-meta">
                  <div className="ayush-badge-title">
                    <Leaf size={18} />
                    <span className="stage-tag ayush-tag">Sections 11 to 23 &bull; Dashavidha Pariksha</span>
                  </div>
                  <h3>Extended AYUSH / Ayurvedic Assessment</h3>
                  <p>
                    Captures <strong>Prakriti, Vikriti, Agni, Koshta, Ahara-Vihara, Satmya, Sattva, Sara, Samhanana, Vyayama Shakti &amp; Nidana</strong> without claiming autonomous diagnosis.
                  </p>
                </div>

                <div className="ayush-sections-accordion">
                  {/* Prakriti */}
                  <div className="ayush-group-box">
                    <div className="ayush-group-header">
                      <h4>1. Prakriti (Natural Constitution)</h4>
                      <span className="ayush-sub">Collected via physical attributes</span>
                    </div>
                    <div className="questions-grid">
                      <div className="question-field">
                        <label>Body build (Sharira Sansthana):</label>
                        <div className="pill-choice-group">
                          {[
                            'Naturally thin & slender (Vata build)',
                            'Medium-built, athletic & moderate (Pitta build)',
                            'Broad-built, heavy & sturdy (Kapha build)'
                          ].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`pill-choice-btn ${responses.q_pra_body_build === opt ? 'is-selected' : ''}`}
                              onClick={() => handleResponseChange('q_pra_body_build', opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="question-field">
                        <label>Skin &amp; Hair nature (Tvak / Kesha):</label>
                        <div className="pill-choice-group">
                          {[
                            'Dry, rough, cracked or cold to touch (Vata)',
                            'Warm, reddish, prone to moles/acne (Pitta)',
                            'Thick, smooth, oily, moist and cool (Kapha)'
                          ].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`pill-choice-btn ${responses.q_pra_skin === opt ? 'is-selected' : ''}`}
                              onClick={() => handleResponseChange('q_pra_skin', opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Agni & Koshta */}
                  <div className="ayush-group-box">
                    <div className="ayush-group-header">
                      <h4>2. Agni &amp; Koshta (Digestive Fire &amp; Bowel Pattern)</h4>
                      <span className="ayush-sub">Metabolic status &amp; GI nature</span>
                    </div>
                    <div className="questions-grid">
                      <div className="question-field">
                        <label>Appetite pattern (Jatharagni):</label>
                        <div className="pill-choice-group">
                          {[
                            'Good & balanced (Samagni)',
                            'Irregular & fluctuating (Vishamagni - Vata)',
                            'Very sharp & intense (Tikshnagni - Pitta)',
                            'Weak & sluggish (Mandagni - Kapha)'
                          ].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`pill-choice-btn ${responses.q_agni_appetite === opt ? 'is-selected' : ''}`}
                              onClick={() => handleResponseChange('q_agni_appetite', opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="question-field">
                        <label>Stool nature &amp; Defecation (Koshta):</label>
                        <div className="pill-choice-group">
                          {[
                            'Hard, pellet-like, constipated (Krura Koshta - Vata)',
                            'Well-formed, regular (Madhyama Koshta)',
                            'Semi-solid, loose, urgent (Mridu Koshta - Pitta)'
                          ].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`pill-choice-btn ${responses.q_kosh_freq === opt ? 'is-selected' : ''}`}
                              onClick={() => handleResponseChange('q_kosh_freq', opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ahara & Vihara */}
                  <div className="ayush-group-box">
                    <div className="ayush-group-header">
                      <h4>3. Ahara-Vihara (Diet &amp; Lifestyle Routine)</h4>
                      <span className="ayush-sub">Dinacharya &amp; Shad-Rasa preference</span>
                    </div>
                    <div className="questions-grid">
                      <div className="question-field">
                        <label>Which tastes (Shad-Rasa) do you prefer naturally?</label>
                        <div className="pill-choice-group">
                          {[
                            'Sweet (Madhura)',
                            'Sour (Amla)',
                            'Salty (Lavana)',
                            'Pungent / Spicy (Katu)',
                            'Bitter (Tikta)',
                            'Astringent (Kashaya)'
                          ].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`pill-choice-btn ${responses.q_ah_rasa_preference === opt ? 'is-selected' : ''}`}
                              onClick={() => handleResponseChange('q_ah_rasa_preference', opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="question-field">
                        <label>Daily stress level &amp; Routine irregularity (Aniyata Dinacharya):</label>
                        <div className="pill-choice-group">
                          {[
                            'Disciplined routine, low stress',
                            'Moderate routine, manageable stress',
                            'Irregular routine & high stress (night work)'
                          ].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`pill-choice-btn ${responses.q_vih_stress_level === opt ? 'is-selected' : ''}`}
                              onClick={() => handleResponseChange('q_vih_stress_level', opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nidana (Causative Factor) */}
                  <div className="ayush-group-box">
                    <div className="ayush-group-header">
                      <h4>4. Nidana (Causative &amp; Trigger Factors)</h4>
                      <span className="ayush-sub">Preceding changes before illness</span>
                    </div>
                    <div className="question-field">
                      <label>&ldquo;Before your symptoms started, did anything change in your food, lifestyle, sleep or routine?&rdquo;</label>
                      <div className="pill-choice-group">
                        {[
                          'Yes, clear change preceded symptoms',
                          'Diet changed (ate spicy/fried feasts)',
                          'Sleep schedule changed (night shifts/stayed up late)',
                          'Weather/season changed suddenly',
                          'No change noticed'
                        ].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`pill-choice-btn ${responses.q_nid_trigger_main === opt ? 'is-selected' : ''}`}
                            onClick={() => handleResponseChange('q_nid_trigger_main', opt)}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 11: FINAL REVIEW & SUMMARY (Section 25) */}
            {currentStage === 11 && (
              <div className="stage-content">
                <div className="stage-header-meta">
                  <span className="stage-tag">Section 25 &bull; Clinical Summary</span>
                  <h3>The Final Question &amp; Clinical Review</h3>
                  <p>
                    &ldquo;This fits the requirement that the generated history be editable/verifiable by the physician rather than treated as an autonomous diagnosis.&rdquo;
                  </p>
                </div>

                <div className="question-field">
                  <label>&ldquo;Is there anything else about your health that you would like the doctor to know?&rdquo;</label>
                  <textarea
                    rows="3"
                    value={responses.q_fin_anything_else || ''}
                    onChange={(e) => handleResponseChange('q_fin_anything_else', e.target.value)}
                    placeholder="Any specific worries, past medication intolerances, or symptoms you would like to emphasize to the doctor..."
                  />
                </div>

                {/* Structured Clinical Review Card */}
                <div className="clinical-summary-preview-card">
                  <div className="summary-card-header">
                    <ClipboardList size={20} />
                    <h4>Generated Pre-Consultation Clinical Summary</h4>
                    <span className={`triage-badge ${redFlagDetected ? 'is-emergency' : 'is-routine'}`}>
                      {redFlagDetected ? 'RED FLAG' : 'ROUTINE AYUSH'}
                    </span>
                  </div>

                  <div className="summary-fields-grid">
                    <div className="s-field">
                      <strong>Patient:</strong> {responses.q_name} ({responses.q_age}y, {responses.q_gender}) &bull; Lang: {responses.q_language}
                    </div>
                    <div className="s-field">
                      <strong>ABHA ID:</strong> {responses.q_abha_id || 'Not provided'}
                    </div>
                    <div className="s-field full-w">
                      <strong>Chief Complaint:</strong> {responses.q_chief_complaint_main}
                    </div>
                    <div className="s-field">
                      <strong>HPI Severity / Onset:</strong> {responses.q_hpi_severity_scale || 'Moderate'} &bull; {responses.q_hpi_onset_when || 'Recent'}
                    </div>
                    <div className="s-field">
                      <strong>Prakriti / Constitution:</strong> {responses.q_pra_body_build}
                    </div>
                    <div className="s-field">
                      <strong>Agni / Digestion:</strong> {responses.q_agni_appetite}
                    </div>
                    <div className="s-field">
                      <strong>Koshta / Bowels:</strong> {responses.q_kosh_freq}
                    </div>
                    <div className="s-field full-w">
                      <strong>Medications &amp; AYUSH:</strong> {responses.q_med_name || 'None'} {responses.q_med_ayurvedic ? `| Ayurvedic: ${responses.q_med_ayurvedic}` : ''}
                    </div>
                  </div>
                </div>

                <div className="submit-action-box">
                  <p className="submit-disclaimer">
                    Upon confirmation, this structured intake will be securely routed to the OPD Doctor Portal queue.
                  </p>
                  <button
                    type="button"
                    className="submit-to-doctor-btn"
                    onClick={handleSubmitClinicalRecord}
                    disabled={isSubmitting}
                  >
                    <UserCheck size={20} />
                    <span>{isSubmitting ? 'Transmitting to Doctor Queue...' : 'Confirm & Send to Doctor Portal'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 12: SUCCESS / SUBMITTED */}
            {currentStage === 12 && (
              <div className="stage-content success-view-box">
                <div className="success-icon-circle">
                  <Check size={40} />
                </div>
                <h3>Intake Submitted Successfully!</h3>
                <p className="success-ticket">
                  Case Record ID: <strong>{submittedRecordId}</strong>
                </p>
                <p className="success-desc">
                  Your clinical history and Dashavidha Pariksha assessment have been safely recorded and synced to the OPD Doctor Portal queue for physical/teleconsultation review.
                </p>

                <div className="success-btn-row">
                  {onSwitchToDoctor && (
                    <button
                      type="button"
                      className="view-in-doctor-btn"
                      onClick={() => onSwitchToDoctor('doctor')}
                    >
                      <Stethoscope size={18} />
                      <span>View in Doctor Portal Queue</span>
                    </button>
                  )}
                  <button
                    type="button"
                    className="start-new-intake-btn"
                    onClick={() => {
                      setCurrentStage(1);
                      setResponses({
                        q_name: '',
                        q_age: '',
                        q_gender: 'Male',
                        q_occupation: '',
                        q_language: 'Hindi',
                        q_first_visit: 'Yes, First Visit',
                        q_abha_id: '',
                        q_consent_given: '',
                        q_chief_complaint_main: ''
                      });
                      setRedFlagDetected(false);
                      setTriggeredRedFlags([]);
                    }}
                  >
                    <RotateCcw size={16} />
                    <span>Start Another Intake</span>
                  </button>
                </div>
              </div>
            )}

            {/* ── Navigation Footer Controls ────────────────────────── */}
            {currentStage <= 11 && (
              <div className="stage-nav-controls">
                <button
                  type="button"
                  className="nav-prev-btn"
                  onClick={handlePrevStage}
                  disabled={currentStage === 1}
                >
                  <ChevronLeft size={18} />
                  <span>Previous</span>
                </button>

                <div className="nav-page-indicator">
                  Stage {currentStage} of 10 &bull; {PRIMARY_STAGES[currentStage - 1]?.title || 'Final Review'}
                </div>

                {currentStage < 11 ? (
                  <button
                    type="button"
                    className="nav-next-btn"
                    onClick={handleNextStage}
                    disabled={redFlagDetected && currentStage === 4}
                  >
                    <span>{currentStage === 10 ? 'Review & Submit' : 'Next Step'}</span>
                    <ChevronRight size={18} />
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── VIEW 2: DATASET EXPLORER & JSON EXPORTER ────────────────── */}
      {activeTab === 'dataset-explorer' && (
        <div className="ayusetu-explorer-layout">
          {/* Dataset Statistics Hero */}
          <div className="dataset-stats-strip">
            <div className="stat-card">
              <span className="stat-value">{stats.totalSections}</span>
              <span className="stat-lbl">Sections (From PDF)</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.totalQuestions}</span>
              <span className="stat-lbl">Total Clinical Questions</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.ayurvedicQuestions}</span>
              <span className="stat-lbl">AYUSH / Dashavidha Qs</span>
            </div>
            <div className="stat-card alert-card">
              <span className="stat-value">{stats.redFlagQuestions}</span>
              <span className="stat-lbl">Red-Flag Safety Qs</span>
            </div>

            <div className="export-json-action">
              <button
                type="button"
                className="export-btn"
                onClick={handleDownloadDatasetJson}
              >
                <Download size={16} />
                <span>{downloadSuccess ? 'Downloaded!' : 'Export Dataset JSON'}</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="explorer-toolbar">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                value={datasetSearch}
                onChange={(e) => setDatasetSearch(e.target.value)}
                placeholder="Search across all 25 sections (e.g. Prakriti, Chest, Agni, Sleep, Stool...)"
              />
              {datasetSearch && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setDatasetSearch('')}
                >
                  &times;
                </button>
              )}
            </div>

            <div className="filter-pills">
              <button
                type="button"
                className={`filter-pill ${selectedSectionFilter === 'all' ? 'is-active' : ''}`}
                onClick={() => setSelectedSectionFilter('all')}
              >
                All 25 Sections
              </button>
              <button
                type="button"
                className={`filter-pill ${selectedSectionFilter === 'ayush_mode' ? 'is-active' : ''}`}
                onClick={() => setSelectedSectionFilter('ayush_mode')}
              >
                🌿 AYUSH / Dashavidha
              </button>
              <button
                type="button"
                className={`filter-pill ${selectedSectionFilter === 'red_flag_screening' ? 'is-active' : ''}`}
                onClick={() => setSelectedSectionFilter('red_flag_screening')}
              >
                🚨 Red-Flag Screening
              </button>
              <button
                type="button"
                className={`filter-pill ${selectedSectionFilter === 'hpi' ? 'is-active' : ''}`}
                onClick={() => setSelectedSectionFilter('hpi')}
              >
                HPI &amp; Adaptive
              </button>
            </div>
          </div>

          {/* Section Cards List */}
          <div className="sections-list">
            {filteredSections.map((sec) => (
              <div key={sec.id} className="dataset-section-card">
                <div className="sec-header">
                  <div className="sec-title-area">
                    <span className="sec-num-badge">Section {sec.number}</span>
                    <h4>{sec.title}</h4>
                  </div>
                  <div className="sec-meta-tags">
                    <span className="sec-cat-tag">{sec.category}</span>
                    {sec.ayurvedicConcept && (
                      <span className="sec-ayur-tag">🌿 {sec.ayurvedicConcept}</span>
                    )}
                  </div>
                </div>

                <p className="sec-desc">{sec.description}</p>

                {sec.questions && (
                  <div className="sec-questions-table">
                    <div className="q-table-header">
                      <span>#</span>
                      <span>Clinical Question (Exactly as in PDF)</span>
                      <span>Input Type</span>
                      <span>Metadata</span>
                    </div>
                    {sec.questions.map((q, qIdx) => (
                      <div key={q.id} className="q-table-row">
                        <span className="q-idx">{qIdx + 1}</span>
                        <span className="q-text-body">
                          <strong>{q.text}</strong>
                          {q.options && (
                            <span className="q-options-preview">
                              Options: {q.options.slice(0, 3).join(' • ')} {q.options.length > 3 ? `(+${q.options.length - 3} more)` : ''}
                            </span>
                          )}
                        </span>
                        <span className="q-type-badge">{q.type}</span>
                        <span className="q-meta-badge">
                          {q.isRedFlag ? '🚨 Red Flag' : q.required ? 'Required' : 'Standard'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {sec.branches && (
                  <div className="sec-branches-preview">
                    <strong>Adaptive Decision Branches:</strong>
                    <div className="branches-grid">
                      {sec.branches.map((b) => (
                        <div key={b.complaintKey} className="branch-card">
                          <h5>⚡ {b.label} ({b.questions.length} Qs)</h5>
                          <p>Trigger keywords: {b.triggerKeywords.join(', ')}</p>
                          <ul>
                            {b.questions.slice(0, 3).map((bq) => (
                              <li key={bq.id}>{bq.text}</li>
                            ))}
                            {b.questions.length > 3 && <li>...and {b.questions.length - 3} more adaptive questions</li>}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
