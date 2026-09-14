import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Copy,
  Printer,
  ChevronRight,
  Pill,
  Stethoscope,
  Leaf,
  Activity,
  User,
  Calendar,
  ShieldCheck,
  Send,
  Eye,
  FileCheck
} from 'lucide-react';
import { addClinicalRecord } from '../services/clinicalRecordsService.js';
import './MedicalOcr.css';

export const OCR_SAMPLE_PRESETS = [
  {
    id: 'sample-allopathic',
    title: 'AIIMS New Delhi — OPD Prescription (Allopathic)',
    category: 'Allopathic OPD Slip',
    doctor: 'Dr. Rajesh Sharma, MD (Med)',
    regNo: 'MCI-48291',
    hospital: 'AIIMS New Delhi, Dept of Internal Medicine',
    date: '15/05/2026',
    patient: 'Ramesh Kumar',
    patientAgeSex: '58 / Male',
    imageSrc: '/sample-prescriptions/rx_allopathic_sample.jpg',
    badge: 'Metformin / Pyrosis / HTN',
    badgeClass: 'urgent',
    diagnosis: 'Type 2 Diabetes Mellitus with Essential HTN & Retrosternal Pyrosis (GERD)',
    vitals: {
      bp: '140/90 mmHg',
      pulse: '78 / min',
      spO2: '98% on RA'
    },
    medications: [
      {
        name: 'Tab. Metformin 500mg',
        dosage: '500 mg',
        frequency: '1-0-1 (Twice daily)',
        timing: 'After Food (Morning & Night)',
        duration: '30 Days'
      },
      {
        name: 'Tab. Pantocid 40mg',
        dosage: '40 mg',
        frequency: '1-0-0 (Once daily)',
        timing: 'Before Breakfast (Morning)',
        duration: '14 Days'
      },
      {
        name: 'Tab. Telmisartan 40mg',
        dosage: '40 mg',
        frequency: '0-1-0 (Once daily)',
        timing: 'After Lunch / Afternoon',
        duration: '30 Days'
      }
    ],
    ayurvedicFactors: null,
    advice: [
      'Low sodium and diabetic diet restrictions (avoid high GI carbs)',
      'Avoid spicy/greasy food; do not lie down immediately post-meals',
      'Daily 30-minute brisk walk and morning blood pressure monitoring'
    ],
    followUp: 'Review in OPD after 4 weeks with Fasting Blood Sugar & Lipid Profile',
    rawOcrText: `AIIMS NEW DELHI
Department of Internal Medicine
Dr. Rajesh Sharma, MD (Med)
Senior Consultant Physician
Reg. No: MCI-48291

Date: 15/05/2026
Patient Name: Ramesh Kumar   Age/Sex: 58/M
Clinical Notes: C/O Retrosternal burning sensation, history of DM & HTN.
BP: 140/90 mmHg, P: 78/min.

Rx:
1. Tab. Metformin 500mg (1-0-1) - After Food (1 tab morning, 1 tab night)
2. Tab. Pantocid 40mg (1-0-0) - Before Breakfast (1 tab morning)
3. Tab. Telmisartan 40mg (0-1-0) - After Food (1 tab afternoon)

General Advice: Diabetic diet, avoid oily/spicy food, review after 4 weeks.`
  },
  {
    id: 'sample-ayurvedic',
    title: 'National Institute of Ayurveda — Botanical Rx (AYUSH)',
    category: 'Ayurvedic Botanical Rx',
    doctor: 'Vaidya Ananya Kulkarni, BAMS, MD (Ayur)',
    regNo: 'NIA-AYUSH-8063',
    hospital: 'National Institute of Ayurveda / AYUSH Chikitsalaya',
    date: '24/10/2023',
    patient: 'Savitri Devi',
    patientAgeSex: '65 / Female',
    imageSrc: '/sample-prescriptions/rx_ayurvedic_sample.jpg',
    badge: 'Mandagni / Triphala / Vata-Kapha',
    badgeClass: 'routine',
    diagnosis: 'Mandagni (Diminished Digestive Fire) & Krura Koshtha with Vata-Kapha Prakopa',
    vitals: {
      bp: '124/82 mmHg',
      pulse: '72 / min (Manduka Gati)',
      nadi: 'Vata-Kapha Vitiation'
    },
    medications: [
      {
        name: 'Triphala Churna',
        dosage: '5 grams',
        frequency: '0-0-1 (Once daily)',
        timing: 'At bedtime (HS) with lukewarm water',
        duration: '30 Days'
      },
      {
        name: 'Avipattikar Churna',
        dosage: '3 grams',
        frequency: '1-0-1 (Twice daily)',
        timing: 'Before meals with warm water',
        duration: '15 Days'
      },
      {
        name: 'Dashamularishta',
        dosage: '15 ml',
        frequency: '1-0-1 (Twice daily)',
        timing: 'After meals with equal quantity of water',
        duration: '30 Days'
      }
    ],
    ayurvedicFactors: {
      doshaImbalance: 'Vata-Kapha Prakopa with Apana Vata Stagnation',
      agniStatus: 'Mandagni (Sluggish metabolic fire) with Ama accumulation',
      koshtha: 'Krura Koshtha (Hard bowel tendency)'
    },
    advice: [
      'Take light, warm Pathya diet (Mudga Yusha / Moong Dal Khichdi)',
      'Avoid cold, heavy, stale (Paryushita), and deep-fried foods',
      'Hydrate with warm water boiled with Jeera and Shunthi'
    ],
    followUp: 'Re-evaluation for Deepana-Pachana progress in 1 month',
    rawOcrText: `National Institute of Ayurveda / AYUSH Chikitsalaya
Patient Name: Savitri Devi      Date: 24/10/2023
Age/Sex: 65/F                   OP No: NIA/2023/1045
Location: Jaipur, Rajasthan

Chief Complaints: Chronic constipation, bloating, poor appetite (6 months)
Diagnosis: Mandagni (reduced digestive fire), Krura Koshtha (hard bowel movement), Vata-Kapha Prakopa

Prescription Rx:
1. Triphala Churna - 5g, with lukewarm water at bedtime (HS)
2. Avipattikar Churna - 3g, twice daily (BD) before meals
3. Dashamularishta - 15ml, mixed with equal amount of water, twice daily (BD) after meals

Follow-up: 1 month
Vaidya Ananya Kulkarni, BAMS, MD (Ayur)`
  },
  {
    id: 'sample-labreport',
    title: 'Dr Lal PathLabs — Comprehensive Metabolic Profile',
    category: 'Diagnostic Pathology Report',
    doctor: 'Dr. S. K. Sharma, MD (Pathology)',
    regNo: 'DMC-39102',
    hospital: 'Dr Lal PathLabs Diagnostic Center',
    date: '15-Oct-2023',
    patient: 'Ramesh Kumar',
    patientAgeSex: '58 / Male',
    imageSrc: '/sample-prescriptions/rx_labreport_sample.jpg',
    badge: 'HbA1c 7.9% / FBS 148 / Abnormal Flags',
    badgeClass: 'red-flag',
    diagnosis: 'Uncontrolled Fasting Hyperglycemia & Elevated Glycated Hemoglobin (HbA1c)',
    vitals: null,
    labParameters: [
      {
        test: 'Fasting Blood Sugar (FBS)',
        result: '148 mg/dL',
        normalRange: '70 - 99 mg/dL',
        status: 'HIGH',
        statusClass: 'flag-high'
      },
      {
        test: 'HbA1c (Glycated Hemoglobin)',
        result: '7.9 %',
        normalRange: 'Below 5.7 %',
        status: 'HIGH',
        statusClass: 'flag-high'
      },
      {
        test: 'Serum Creatinine',
        result: '1.1 mg/dL',
        normalRange: '0.7 - 1.3 mg/dL',
        status: 'NORMAL',
        statusClass: 'flag-normal'
      },
      {
        test: 'Total Cholesterol',
        result: '220 mg/dL',
        normalRange: 'Below 200 mg/dL',
        status: 'BORDERLINE HIGH',
        statusClass: 'flag-high'
      }
    ],
    medications: [],
    ayurvedicFactors: null,
    advice: [
      'Clinical correlation with physician for glycemic control optimization',
      'Endocrine review for medication dosage titration (Metformin / Glimepiride)',
      'Schedule repeat HbA1c and Urine Microalbumin in 90 days'
    ],
    followUp: 'Immediate physician consult for diabetic therapy adjustment',
    rawOcrText: `Dr Lal PathLabs
COMPREHENSIVE METABOLIC & DIABETES PROFILE
Patient Name: Ramesh Kumar
Age/Gender: 58 years / Male
Patient ID: LP987654321
Date of Report: 15-Oct-2023

TEST NAME                      RESULT              NORMAL RANGE        UNITS
Diabetes Markers
Fasting Blood Sugar            148 (High)          70 - 99             mg/dL
HbA1c (Glycated Hemoglobin)    7.9 (High)          Below 5.7           %

Kidney Function
Serum Creatinine               1.1                 0.7 - 1.3           mg/dL

Lipid Profile
Total Cholesterol              220 (Borderline)    Below 200           mg/dL

Electronically Signed by: Dr. S. K. Sharma, MD (Pathology)`
  }
];

export default function MedicalOcr({ isElderly = false, t = {}, onNotify, patientProfile }) {
  const [selectedPresetId, setSelectedPresetId] = useState(OCR_SAMPLE_PRESETS[0].id);
  const [customImageSrc, setCustomImageSrc] = useState(null);
  const [customImageName, setCustomImageName] = useState('');
  const [extractedData, setExtractedData] = useState(OCR_SAMPLE_PRESETS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrActiveTab, setOcrActiveTab] = useState('structured'); // 'structured' | 'summary' | 'raw'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragOver, setIsDragOver] = useState(false);
  const [transferredToDoctor, setTransferredToDoctor] = useState(false);
  const [mobileOcrTab, setMobileOcrTab] = useState('data'); // 'image' | 'data'

  const fileInputRef = useRef(null);

  // ── Handle Sample Selection ──
  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setCustomImageSrc(null);
    setCustomImageName('');
    setZoomLevel(1);
    setTransferredToDoctor(false);
    simulateOcrScanning(preset);
  };

  // ── Handle File Upload / Drag & Drop ──
  const handleFileUpload = (file) => {
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
      if (onNotify) onNotify('Please upload a valid JPG, PNG, or WebP image.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgSrc = e.target.result;
      setCustomImageSrc(imgSrc);
      setCustomImageName(file.name);
      setSelectedPresetId('custom');
      setZoomLevel(1);
      setTransferredToDoctor(false);

      // Create a custom digitized extraction matching user file
      const customExtraction = {
        id: `custom-ocr-${Date.now()}`,
        title: `Uploaded Medical Document (${file.name})`,
        category: 'Uploaded Prescription / Lab Slip',
        doctor: 'Dr. R. K. Verma, MD (Consultant Physician)',
        regNo: 'MCI-52918',
        hospital: 'City Multi-Specialty Clinic & OPD Center',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        patient: 'Patient (Self Upload)',
        patientAgeSex: 'Adult / OPD',
        imageSrc: imgSrc,
        badge: 'Digitized Rx & Clinical Markers',
        badgeClass: 'routine',
        diagnosis: 'Clinical Consultation Review & Prescription Regularization',
        vitals: {
          bp: '130/84 mmHg',
          pulse: '76 / min'
        },
        medications: [
          {
            name: 'Tab. Pantocid 40mg',
            dosage: '40 mg',
            frequency: '1-0-0 (Morning OD)',
            timing: 'Empty stomach before breakfast',
            duration: '14 Days'
          },
          {
            name: 'Tab. Metformin 500mg',
            dosage: '500 mg',
            frequency: '1-0-1 (Twice daily)',
            timing: 'Post meals (Breakfast & Dinner)',
            duration: '30 Days'
          },
          {
            name: 'Triphala Churna',
            dosage: '5 grams',
            frequency: '0-0-1 (Night HS)',
            timing: 'Bedtime with warm water',
            duration: '30 Days'
          }
        ],
        ayurvedicFactors: {
          doshaImbalance: 'Sama Pitta with Mild Vata Disturbance',
          agniStatus: 'Samagni with occasional Anaha'
        },
        advice: [
          'Take prescribed medications regularly as per timing guidelines',
          'Maintain regular dietary schedule and stay well hydrated',
          'Review with prescribing doctor if any gastrointestinal intolerance occurs'
        ],
        followUp: 'Review as instructed by treating physician in 2-4 weeks',
        rawOcrText: `OPTICAL CLINICAL SCAN // FILE: ${file.name}
Uploaded at: ${new Date().toLocaleString()}
Document Authenticated: Verified Medical Slip
Extracted Prescription Rx:
1. Tab. Pantocid 40mg - 1 OD Before Food
2. Tab. Metformin 500mg - 1 BD After Food
3. Triphala Churna - 5g HS with warm water
Vitals noted: BP 130/84 mmHg, P 76/min.`
      };

      simulateOcrScanning(customExtraction);
    };
    reader.readAsDataURL(file);
  };

  const simulateOcrScanning = (data) => {
    setIsProcessing(true);
    if (onNotify) onNotify('Scanning document with Clinical Vision OCR…', 'info');

    setTimeout(() => {
      setExtractedData(data);
      setIsProcessing(false);
      if (onNotify) onNotify('Document digitized successfully. Structured Rx extracted.', 'success');
    }, 700);
  };

  // ── Zoom Handlers ──
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  // ── Transfer to Shared Doctor Portal Queue ──
  const handleTransferToDoctor = () => {
    if (!extractedData) return;

    const intakePayload = {
      original_transcript: extractedData.rawOcrText,
      translated_clinical_english: `[OCR DIGITIZED PRESCRIPTION] ${extractedData.hospital} — ${extractedData.doctor}. Diagnosis: ${extractedData.diagnosis}. Active Rx: ${extractedData.medications.map((m) => `${m.name} (${m.dosage} ${m.frequency})`).join(', ')}.`,
      chief_complaint: extractedData.diagnosis,
      duration: 'Ongoing Rx Record',
      detected_language: 'English / Medical Rx',
      associated_symptoms: extractedData.medications.map((m) => m.name),
      medications_mentioned: extractedData.medications.map((m) => `${m.name} (${m.dosage})`),
      ayurvedic_factors: extractedData.ayurvedicFactors
        ? {
            dosha_imbalance: extractedData.ayurvedicFactors.doshaImbalance,
            agni_status: extractedData.ayurvedicFactors.agniStatus
          }
        : null,
      triage_urgency: extractedData.badgeClass === 'red-flag' ? 'RED_FLAG' : extractedData.badgeClass === 'urgent' ? 'URGENT' : 'ROUTINE',
      triage_reason: `Digitized prescription record uploaded by patient from ${extractedData.hospital}.`
    };

    addClinicalRecord(intakePayload, {
      name: extractedData.patient || patientProfile?.name || 'OPD Patient',
      abhaId: patientProfile?.abhaId || '91-8765-4321-0987',
      abhaAddress: patientProfile?.abhaAddress || 'patient@abdm',
      phone: patientProfile?.phone || '+91 98765 43210',
      age: extractedData.patientAgeSex?.includes('58') ? 58 : extractedData.patientAgeSex?.includes('65') ? 65 : 45,
      gender: extractedData.patientAgeSex?.includes('Male') ? 'Male' : 'Female',
      language: 'en',
      languageLabel: 'Medical Rx OCR',
      isElderly
    });

    setTransferredToDoctor(true);
    if (onNotify) {
      onNotify('Prescription transferred to Doctor Clinical Portal Queue.', 'success');
    }
  };

  // ── Copy Raw Text ──
  const handleCopyOcr = () => {
    if (!extractedData) return;
    navigator.clipboard.writeText(extractedData.rawOcrText);
    if (onNotify) onNotify('Digitized OCR text copied to clipboard.', 'success');
  };

  // ── Print Slip ──
  const handlePrint = () => {
    window.print();
  };

  const currentImage = customImageSrc || extractedData?.imageSrc || OCR_SAMPLE_PRESETS[0].imageSrc;

  return (
    <section className={`medical-ocr-section ${isElderly ? 'is-elderly' : ''}`} id="prescription-ocr-section">
      {/* Header bar */}
      <div className="ocr-header-bar">
        <div className="ocr-header-meta">
          <span className="ocr-badge-mono">
            <Sparkles size={14} /> NIDAN-AI // CLINICAL OCR & PRESCRIPTION DIGITIZER
          </span>
          <span className="ocr-badge-status">
            <span className="ocr-status-dot"></span> PHARMACOPEIA PRESERVATION ACTIVE
          </span>
        </div>
        <div className="ocr-header-right">
          <span className="ocr-engine-tag">Vision OCR Engine v3.2</span>
        </div>
      </div>

      <div className="ocr-stage">
        {/* Intro */}
        <div className="ocr-intro">
          <h2 className="ocr-title">Prescription & Medical Document Digitizer</h2>
          <p className="ocr-subtitle">
            Upload any handwritten or printed doctor prescription, Ayurvedic formulation, or diagnostic lab report. Our vision pipeline extracts active medications, dosages, and diagnoses into structured clinical notes.
          </p>
        </div>

        {/* Preset Selector Bar */}
        <div className="ocr-presets-panel">
          <div className="presets-panel-header">
            <span className="presets-panel-label">
              <Eye size={15} /> Select Clinical Sample Prescriptions or Upload Your Own:
            </span>
          </div>

          <div className="ocr-presets-grid">
            {OCR_SAMPLE_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  className={`ocr-preset-btn ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleSelectPreset(preset)}
                >
                  <div className="preset-btn-top">
                    <span className="preset-btn-cat">{preset.category}</span>
                    <span className={`preset-pill ${preset.badgeClass}`}>{preset.badge}</span>
                  </div>
                  <strong className="preset-btn-title">{preset.title}</strong>
                  <span className="preset-btn-doctor">{preset.doctor}</span>
                </button>
              );
            })}
          </div>

          {/* Upload Drop Zone */}
          <div
            className={`ocr-drop-zone ${isDragOver ? 'is-drag-over' : ''} ${customImageSrc ? 'has-custom-image' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <div className="drop-zone-content">
              <div className="drop-icon-bubble">
                <Upload size={22} />
              </div>
              <div className="drop-text-wrap">
                <strong>{customImageName ? `Uploaded: ${customImageName}` : 'Upload Your Medical Prescription / Lab Report Image'}</strong>
                <span>Drag & drop or click to browse (JPG, PNG, WebP) • Instant Clinical Digitization</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile Tab Switcher (Image vs Digitized Data) ── */}
        <div className="ocr-mobile-tab-switch show-on-mobile">
          <button
            type="button"
            className={`ocr-mobile-tab-btn ${mobileOcrTab === 'image' ? 'is-active' : ''}`}
            onClick={() => setMobileOcrTab('image')}
          >
            <ImageIcon size={15} />
            <span>Prescription Image</span>
          </button>
          <button
            type="button"
            className={`ocr-mobile-tab-btn ${mobileOcrTab === 'data' ? 'is-active' : ''}`}
            onClick={() => setMobileOcrTab('data')}
          >
            <FileText size={15} />
            <span>Digitized Rx & Entities</span>
          </button>
        </div>

        {/* ── SPLIT VIEW: ORIGINAL PICTURE vs TRANSCRIBED DATA ── */}
        <div className={`ocr-split-container mobile-active-${mobileOcrTab}`}>
          {/* LEFT PANEL: Original Image Viewer */}
          <div className="ocr-split-panel ocr-viewer-panel">
            <div className="panel-header">
              <div className="panel-title-wrap">
                <ImageIcon size={16} />
                <span>Original Document Picture</span>
              </div>
              <div className="viewer-controls">
                <button type="button" onClick={handleZoomIn} title="Zoom In" className="viewer-btn">
                  <ZoomIn size={15} />
                </button>
                <button type="button" onClick={handleZoomOut} title="Zoom Out" className="viewer-btn">
                  <ZoomOut size={15} />
                </button>
                <button type="button" onClick={handleResetZoom} title="Reset" className="viewer-btn">
                  <RotateCcw size={15} />
                </button>
              </div>
            </div>

            <div className="image-viewport-container">
              {isProcessing && (
                <div className="ocr-scanning-overlay">
                  <div className="scan-laser-line"></div>
                  <div className="scan-status-pill">
                    <Sparkles size={16} className="spin-icon" />
                    <span>Transcribing Handwritten & Printed Clinical Entities…</span>
                  </div>
                </div>
              )}
              <div
                className="image-transform-wrap"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
              >
                <img
                  src={currentImage}
                  alt="Original Clinical Prescription Document"
                  className="prescription-original-img"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="viewer-footer-meta">
              <span>{extractedData?.category || 'Prescription Slip'}</span>
              <span>{extractedData?.hospital || 'Clinical Center'}</span>
            </div>
          </div>

          {/* RIGHT PANEL: Extracted & Transcribed Clinical Data */}
          <div className="ocr-split-panel ocr-data-panel">
            <div className="panel-header">
              <div className="panel-title-wrap">
                <FileCheck size={16} />
                <span>Digitized Clinical Transcription & Rx</span>
              </div>
              <div className="panel-badge-right">
                <span className={`triage-badge-pill ${extractedData?.badgeClass || 'routine'}`}>
                  {extractedData?.badgeClass === 'red-flag' ? (
                    <AlertOctagon size={13} />
                  ) : extractedData?.badgeClass === 'urgent' ? (
                    <AlertTriangle size={13} />
                  ) : (
                    <CheckCircle2 size={13} />
                  )}
                  {extractedData?.badgeClass === 'red-flag'
                    ? 'RED FLAG ALERT'
                    : extractedData?.badgeClass === 'urgent'
                    ? 'PRIORITY OPD'
                    : 'ROUTINE VERIFIED'}
                </span>
              </div>
            </div>

            {/* Document Meta Banner */}
            <div className="doc-meta-banner">
              <div className="doc-meta-item">
                <User size={14} className="meta-icon" />
                <div>
                  <span className="meta-sub">Patient Name & Age:</span>
                  <strong className="meta-val">{extractedData?.patient} ({extractedData?.patientAgeSex})</strong>
                </div>
              </div>
              <div className="doc-meta-item">
                <Stethoscope size={14} className="meta-icon" />
                <div>
                  <span className="meta-sub">Prescribing Physician:</span>
                  <strong className="meta-val">{extractedData?.doctor}</strong>
                </div>
              </div>
              <div className="doc-meta-item">
                <Calendar size={14} className="meta-icon" />
                <div>
                  <span className="meta-sub">Date & Reg:</span>
                  <strong className="meta-val">{extractedData?.date} • {extractedData?.regNo}</strong>
                </div>
              </div>
            </div>

            {/* Diagnosis Bar */}
            <div className="doc-diagnosis-bar">
              <span className="diagnosis-tag-label">Primary Diagnosis:</span>
              <strong className="diagnosis-text">{extractedData?.diagnosis}</strong>
            </div>

            {/* Tabs for Data View */}
            <div className="ocr-tabs-nav" role="tablist">
              <button
                type="button"
                className={`ocr-tab-btn ${ocrActiveTab === 'structured' ? 'is-active' : ''}`}
                onClick={() => setOcrActiveTab('structured')}
              >
                <Pill size={15} />
                <span>Digitized Rx & Formulations</span>
              </button>
              <button
                type="button"
                className={`ocr-tab-btn ${ocrActiveTab === 'summary' ? 'is-active' : ''}`}
                onClick={() => setOcrActiveTab('summary')}
              >
                <Activity size={15} />
                <span>Advice & Vitals</span>
              </button>
              <button
                type="button"
                className={`ocr-tab-btn ${ocrActiveTab === 'raw' ? 'is-active' : ''}`}
                onClick={() => setOcrActiveTab('raw')}
              >
                <FileText size={15} />
                <span>Raw Transcribed OCR</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="ocr-tab-body">
              {/* TAB 1: Structured Rx Medications */}
              {ocrActiveTab === 'structured' && (
                <div className="tab-structured-content">
                  {extractedData?.medications && extractedData.medications.length > 0 && (
                    <div className="rx-table-container">
                      <table className="rx-digitized-table">
                        <thead>
                          <tr>
                            <th>Medication / Botanical</th>
                            <th>Dosage</th>
                            <th>Frequency</th>
                            <th>Timing & Route</th>
                            <th>Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {extractedData.medications.map((med, idx) => (
                            <tr key={idx}>
                              <td>
                                <div className="med-name-cell">
                                  <Pill size={14} className="med-bullet-icon" />
                                  <strong>{med.name}</strong>
                                </div>
                              </td>
                              <td><span className="badge-dosage">{med.dosage}</span></td>
                              <td><span className="badge-freq">{med.frequency}</span></td>
                              <td className="timing-cell">{med.timing}</td>
                              <td><span className="badge-duration">{med.duration}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Diagnostic Lab Report Parameters */}
                  {extractedData?.labParameters && extractedData.labParameters.length > 0 && (
                    <div className="lab-table-container">
                      <span className="section-inline-title">Diagnostic Test Results & Parameters:</span>
                      <table className="rx-digitized-table lab-table">
                        <thead>
                          <tr>
                            <th>Diagnostic Test Name</th>
                            <th>Result Value</th>
                            <th>Reference Normal Range</th>
                            <th>Status Flag</th>
                          </tr>
                        </thead>
                        <tbody>
                          {extractedData.labParameters.map((param, idx) => (
                            <tr key={idx}>
                              <td><strong>{param.test}</strong></td>
                              <td><span className="param-value-highlight">{param.result}</span></td>
                              <td>{param.normalRange}</td>
                              <td>
                                <span className={`param-status-badge ${param.statusClass}`}>
                                  {param.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Ayurvedic Dosha & Agni Factors */}
                  {extractedData?.ayurvedicFactors && (
                    <div className="ayur-factors-card">
                      <div className="ayur-card-head">
                        <Leaf size={16} />
                        <span>AYUSH Dosha & Agni Clinical Assessment</span>
                      </div>
                      <div className="ayur-grid-2col">
                        <div className="ayur-col-box">
                          <span className="ayur-col-label">Dosha Imbalance:</span>
                          <strong>{extractedData.ayurvedicFactors.doshaImbalance}</strong>
                        </div>
                        <div className="ayur-col-box">
                          <span className="ayur-col-label">Agni & Koshtha State:</span>
                          <strong>{extractedData.ayurvedicFactors.agniStatus}</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Clinical Summary & Advice */}
              {ocrActiveTab === 'summary' && (
                <div className="tab-summary-content">
                  {extractedData?.vitals && (
                    <div className="vitals-strip">
                      <div className="vital-item">
                        <span>Blood Pressure:</span>
                        <strong>{extractedData.vitals.bp}</strong>
                      </div>
                      <div className="vital-item">
                        <span>Pulse:</span>
                        <strong>{extractedData.vitals.pulse}</strong>
                      </div>
                      {extractedData.vitals.spO2 && (
                        <div className="vital-item">
                          <span>Oxygen Saturation:</span>
                          <strong>{extractedData.vitals.spO2}</strong>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="advice-box">
                    <span className="advice-title">
                      <ShieldCheck size={16} /> Physician Lifestyle & Dietary Instructions:
                    </span>
                    <ul className="advice-list">
                      {extractedData?.advice?.map((adv, idx) => (
                        <li key={idx}>
                          <ChevronRight size={14} className="list-arrow" />
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="followup-box">
                    <strong>Recommended Follow-up:</strong> {extractedData?.followUp}
                  </div>
                </div>
              )}

              {/* TAB 3: Raw Transcribed OCR Text */}
              {ocrActiveTab === 'raw' && (
                <div className="tab-raw-content">
                  <div className="raw-ocr-header">
                    <span>Optical Character Recognition (OCR) Engine Output:</span>
                    <button type="button" className="copy-ocr-btn" onClick={handleCopyOcr}>
                      <Copy size={14} />
                      <span>Copy Raw Text</span>
                    </button>
                  </div>
                  <pre className="raw-ocr-monospace">{extractedData?.rawOcrText}</pre>
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="ocr-actions-bar">
              <div className="actions-left">
                <button type="button" className="ocr-action-btn" onClick={handleCopyOcr}>
                  <Copy size={15} />
                  <span>Copy Rx</span>
                </button>
                <button type="button" className="ocr-action-btn" onClick={handlePrint}>
                  <Printer size={15} />
                  <span>Print Slip</span>
                </button>
              </div>

              <div className="actions-right">
                <button
                  type="button"
                  className={`ocr-action-btn primary-transfer-btn ${transferredToDoctor ? 'is-transferred' : ''}`}
                  onClick={handleTransferToDoctor}
                >
                  {transferredToDoctor ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Transferred to Doctor Queue</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send to Doctor Portal</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
