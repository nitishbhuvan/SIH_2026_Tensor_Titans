/**
 * PreConsult — Clinical Records Service
 * Shared data layer between Patient Portal and Doctor Portal.
 * Uses localStorage + StorageEvent API for real-time cross-tab sync.
 */

const STORAGE_KEY = 'preconsult_clinical_records';

// ── Seed Cases (realistic demo data) ────────────────────────────────────────
const SEED_RECORDS = [
  {
    id: 'REC-SEED-001',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    status: 'pending',
    patientInfo: {
      name: 'Ramesh Kumar',
      age: 58,
      gender: 'Male',
      language: 'hi',
      languageLabel: 'Hindi',
      isElderly: true,
    },
    intake: {
      original_transcript:
        'मुझे दो दिन से छाती में बहुत जलन हो रही है और भारीपन लगता है। पेट भी भारी रहता है। मैं शुगर के लिए मेटफॉर्मिन और पेंटोप्रजोल ले रहा हूँ। चक्कर भी आते हैं।',
      translated_clinical_english:
        'Patient presents with 2-day history of retrosternal burning (pyrosis) and epigastric fullness, worsening post-prandially. Associated with presyncope / vertigo episodes. Currently on Metformin 500mg BD for DM Type 2 and Pantoprazole 40mg OD. Probable GERD with Pitta-dominant Amlapitta overlay.',
      chief_complaint: 'Retrosternal pyrosis and acute chest discomfort with radiating burning sensation',
      duration: '2 days, worsening post-prandially',
      detected_language: 'Hindi',
      associated_symptoms: ['Retrosternal burning / Pyrosis', 'Epigastric fullness', 'Presyncope / Vertigo', 'Diaphoresis'],
      medications_mentioned: ['Metformin 500mg', 'Pantoprazole 40mg'],
      ayurvedic_factors: {
        dosha_imbalance: 'Pitta-Vata aggravation with Amlapitta manifestation',
        agni_status: 'Samagni with early Vishamagni tendency',
      },
      triage_urgency: 'RED_FLAG',
      triage_reason: 'Acute chest pain with burning quality in diabetic patient — cardiac aetiology must be excluded.',
    },
    doctorNote: '',
    prescription: [],
  },
  {
    id: 'REC-SEED-002',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: 'in-consultation',
    patientInfo: {
      name: 'Savitri Devi',
      age: 65,
      gender: 'Female',
      language: 'kn',
      languageLabel: 'Kannada',
      isElderly: true,
    },
    intake: {
      original_transcript:
        'ನನಗೆ ಮೂರು ವಾರಗಳಿಂದ ಹೊಟ್ಟೆ ಸರಿಯಾಗಿ ಸ್ವಚ್ಛವಾಗುತ್ತಿಲ್ಲ, ಮಲಬದ್ಧತೆ ಇದೆ ಮತ್ತು ಮಂದಾಗ್ನಿ ಆಗಿದೆ. ರಾತ್ರಿ ತ್ರಿಫಲಾ ಚೂರ್ಣ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ.',
      translated_clinical_english:
        'Female patient presents with 3-week history of chronic constipation and irregular bowel movements consistent with Mandagni (diminished digestive capacity). Currently self-medicating with Triphala Churna nightly. No red-flag symptoms identified. Ayurvedic evaluation warranted.',
      chief_complaint: 'Chronic constipation and Mandagni (reduced digestive fire)',
      duration: '3 weeks, progressive',
      detected_language: 'Kannada',
      associated_symptoms: ['Chronic constipation / Irregular bowel movements', 'Abdominal bloating', 'Reduced appetite'],
      medications_mentioned: ['Triphala Churna (self-administered, nightly)'],
      ayurvedic_factors: {
        dosha_imbalance: 'Vata-Kapha aggravation with Krura Koshtha presentation',
        agni_status: 'Mandagni (significantly diminished digestive fire)',
      },
      triage_urgency: 'ROUTINE',
      triage_reason: 'Chronic non-acute constipation with Ayurvedic overlay — stable, no red-flag features.',
    },
    doctorNote: 'Patient is well-known with chronic GI complaints. Consider Vamana or Virechana Panchakarma evaluation.',
    prescription: [
      { medicine: 'Triphala Churna', dosage: '5g', frequency: 'Once daily at bedtime', duration: '4 weeks', route: 'Oral with warm water' },
      { medicine: 'Avipattikar Churna', dosage: '3g', frequency: 'Twice daily before meals', duration: '2 weeks', route: 'Oral' },
    ],
  },
  {
    id: 'REC-SEED-003',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'pending',
    patientInfo: {
      name: 'Arjunan Pillai',
      age: 72,
      gender: 'Male',
      language: 'ta',
      languageLabel: 'Tamil',
      isElderly: true,
    },
    intake: {
      original_transcript:
        'எனக்கு இரண்டு வாரங்களாக மூட்டு வலி மற்றும் முழங்கால் வீக்கம் உள்ளது. வாத பிரச்சனை அதிகம் உள்ளது. அஸ்வகந்தா மற்றும் தஷமூலாரிஷ்ட சாப்பிடுகிறேன்.',
      translated_clinical_english:
        'Elderly male patient with 2-week history of bilateral knee pain (polyarthralgia) with swelling, consistent with Sandhivata (Vata-predominant osteoarthritis). Currently on Ashwagandha and Dashamularishta (Ayurvedic formulations). Requires clinical examination to rule out septic arthritis and osteoporotic fracture.',
      chief_complaint: 'Bilateral knee pain and joint swelling (Sandhivata)',
      duration: '2 weeks, progressive',
      detected_language: 'Tamil',
      associated_symptoms: ['Bilateral knee arthralgia', 'Periarticular swelling', 'Morning stiffness > 30 min', 'Crepitus on movement'],
      medications_mentioned: ['Ashwagandha (Withania somnifera)', 'Dashamularishta'],
      ayurvedic_factors: {
        dosha_imbalance: 'Vata-dominant Sandhivata with Shleshaka Kapha depletion',
        agni_status: 'Vishamagni (irregular digestive fire)',
      },
      triage_urgency: 'URGENT',
      triage_reason: 'Elderly patient with progressive arthropathy — septic arthritis and fracture must be urgently excluded.',
    },
    doctorNote: '',
    prescription: [],
  },
  {
    id: 'REC-SEED-004',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: 'pending',
    patientInfo: {
      name: 'Priya Menon',
      age: 29,
      gender: 'Female',
      language: 'ml',
      languageLabel: 'Malayalam',
      isElderly: false,
    },
    intake: {
      original_transcript:
        'ഒരു ആഴ്ചയായി തലവേദനയും പനിയും ഉണ്ട്. കഴുത്ത് വേദന, ഒക്ക ഇരിക്കുമ്പോൾ ശരീരം വേദനിക്കുന്നു. ഡോൾഫ്ലം ഗോളി കഴിക്കുന്നുണ്ട്.',
      translated_clinical_english:
        'Young female presenting with 1-week history of persistent headache, low-grade pyrexia, cervicalgia, and generalised myalgia. Currently self-medicating with Diclofenac (Dolofin). Clinical examination required to exclude meningitis, viral encephalitis, and dengue.',
      chief_complaint: 'Headache, fever, neck pain and body aches',
      duration: '1 week, persistent',
      detected_language: 'Malayalam',
      associated_symptoms: ['Cephalgia (persistent)', 'Low-grade pyrexia', 'Cervicalgia (neck pain)', 'Generalised myalgia'],
      medications_mentioned: ['Diclofenac / Dolofin (self-administered)'],
      ayurvedic_factors: {
        dosha_imbalance: 'Pitta-Vata aggravation with Ama accumulation',
        agni_status: 'Vishamagni with Ama formation',
      },
      triage_urgency: 'URGENT',
      triage_reason: 'Headache with neck pain and fever in young adult — meningitis must be urgently excluded.',
    },
    doctorNote: '',
    prescription: [],
  },
];

// ── Core functions ───────────────────────────────────────────────────────────

function getRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with seed data on first use
      const seed = SEED_RECORDS;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch {
    return [...SEED_RECORDS];
  }
}

function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  // Dispatch custom event for same-tab listeners
  window.dispatchEvent(new CustomEvent('preconsult_records_updated', { detail: records }));
}

/**
 * Get all clinical records sorted by most recent first.
 */
export function getClinicalRecords() {
  const records = getRecords();
  return [...records].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/**
 * Add a new clinical record from the patient voice intake.
 * @param {object} intakeData - The processed clinical data from VoiceIntake.
 * @param {object} patientInfo - Optional patient info (name, age, language, etc).
 * @returns {string} - The generated record ID.
 */
export function addClinicalRecord(intakeData, patientInfo = {}) {
  const records = getRecords();
  const id = `REC-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  const newRecord = {
    id,
    timestamp: new Date().toISOString(),
    status: 'pending',
    patientInfo: {
      name: patientInfo.name || 'Anonymous Patient',
      age: patientInfo.age || null,
      gender: patientInfo.gender || 'Unknown',
      language: patientInfo.language || 'en',
      languageLabel: patientInfo.languageLabel || 'English',
      isElderly: patientInfo.isElderly || false,
    },
    intake: intakeData,
    doctorNote: '',
    prescription: [],
  };
  records.unshift(newRecord);
  saveRecords(records);
  return id;
}

/**
 * Update a clinical record by ID (e.g., change status, add doctor note, prescription).
 */
export function updateClinicalRecord(id, updates) {
  const records = getRecords();
  const idx = records.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  records[idx] = { ...records[idx], ...updates };
  saveRecords(records);
  return true;
}

/**
 * Subscribe to record changes (cross-tab + same-tab).
 * @param {function} callback - Called with updated records array.
 * @returns {function} - Unsubscribe function.
 */
export function subscribeToRecords(callback) {
  const onStorage = (e) => {
    if (e.key === STORAGE_KEY) {
      try {
        callback(JSON.parse(e.newValue) || []);
      } catch {
        callback([]);
      }
    }
  };
  const onCustom = (e) => {
    callback(e.detail || []);
  };

  window.addEventListener('storage', onStorage);
  window.addEventListener('preconsult_records_updated', onCustom);

  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('preconsult_records_updated', onCustom);
  };
}

/**
 * Get triage urgency summary counts.
 */
export function getTriageSummary() {
  const records = getClinicalRecords();
  return {
    total: records.length,
    red_flag: records.filter((r) => r.intake?.triage_urgency === 'RED_FLAG' && r.status !== 'completed').length,
    urgent: records.filter((r) => r.intake?.triage_urgency === 'URGENT' && r.status !== 'completed').length,
    routine: records.filter((r) => r.intake?.triage_urgency === 'ROUTINE' && r.status !== 'completed').length,
    completed: records.filter((r) => r.status === 'completed').length,
    pending: records.filter((r) => r.status === 'pending').length,
  };
}
