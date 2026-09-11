/**
 * AYUSETU / AYUSH Clinical Case-Taking Questionnaire Dataset
 * Smart India Hackathon (SIH) 2026 — Tensor Titans
 * 
 * Sourced directly from the official AYUSETU Clinical Protocol document.
 * Contains 25 clinical sections categorized into 10 primary stages with
 * full Dashavidha Pariksha, Ahara-Vihara, and Red-Flag screening logic.
 */

export const AYUSETU_DATASET_METADATA = {
  id: 'ayusetu-clinical-v1',
  name: 'AYUSETU Clinical History Taking & AYUSH Questionnaire Dataset',
  version: '1.0.0',
  standard: 'SIH 2026 AYUSH / ABDM Clinical History Standard',
  totalSections: 25,
  primaryStagesCount: 10,
  dashavidhaParikshaIncluded: true,
  redFlagScreeningMandatory: true,
  description: 'AI-assisted adaptive pre-consultation questionnaire dataset for standard clinical history and extended Ayurvedic Dashavidha Pariksha + Ahara-Vihara assessment.'
};

export const PRIMARY_STAGES = [
  { id: 'patient_details', index: 1, title: 'Patient Details & Consent', description: 'Demographics, ABHA ID & explicit digital consent' },
  { id: 'chief_complaint', index: 2, title: 'Chief Complaint', description: 'Primary health concern bringing patient to hospital' },
  { id: 'red_flag_screening', index: 3, title: 'Red-Flag Screening', description: 'Emergency triage assessment requiring immediate doctor escalation' },
  { id: 'hpi', index: 4, title: 'History of Present Illness (HPI)', description: 'Onset, duration, progression, severity, aggravating & relieving factors' },
  { id: 'adaptive_branching', index: 5, title: 'Adaptive Clinical Branching', description: 'Deep-dive inquiry dynamically tailored to the chief complaint' },
  { id: 'past_history', index: 6, title: 'Past Medical & Surgical History', description: 'Chronic illnesses, surgeries, hospitalizations, prior diagnoses' },
  { id: 'drug_allergy', index: 7, title: 'Drug & Allergy History', description: 'Current medicines, Ayurvedic formulations, supplements & allergies' },
  { id: 'family_personal', index: 8, title: 'Family & Personal History', description: 'Hereditary predispositions, diet, sleep, exercise & habits' },
  { id: 'ros', index: 9, title: 'Review of Systems (ROS)', description: 'Screening across General, Resp, Cardio, GI & Neuro body systems' },
  { id: 'ayush_mode', index: 10, title: 'AYUSH / Dashavidha Pariksha', description: 'Prakriti, Vikriti, Agni, Koshta, Ahara-Vihara, Satmya, Sattva, Sara, Samhanana, Pramana, Vyayama, Vaya, Nidana' }
];

export const AYUSETU_SECTIONS = [
  // ── 1. PATIENT DETAILS ──────────────────────────────────────────────
  {
    id: 'sec_01_patient_details',
    number: 1,
    title: 'Patient Details',
    stage: 'patient_details',
    category: 'Demographics',
    description: 'Basic demographic and identification information',
    questions: [
      { id: 'q_name', text: 'What is your name?', type: 'text', placeholder: 'Enter full name', required: true },
      { id: 'q_age', text: 'What is your age?', type: 'number', placeholder: 'Age in years', required: true },
      { id: 'q_gender', text: 'What is your gender?', type: 'choice', options: ['Male', 'Female', 'Non-Binary / Other', 'Prefer not to say'], required: true },
      { id: 'q_occupation', text: 'What is your occupation?', type: 'text', placeholder: 'e.g. Teacher, Farmer, IT Professional, Homemaker' },
      { id: 'q_language', text: 'What is your preferred language?', type: 'choice', options: ['Hindi', 'English', 'Kannada', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Malayalam', 'Sanskrit'] },
      { id: 'q_first_visit', text: 'Is this your first visit?', type: 'choice', options: ['Yes, First Visit', 'No, Follow-up Visit'] },
      { id: 'q_abha_id', text: 'Do you have an ABHA ID?', type: 'text', placeholder: 'e.g. 91-XXXX-XXXX-XXXX or ABHA Address' }
    ]
  },

  // ── 2. CONSENT SCREEN ──────────────────────────────────────────────
  {
    id: 'sec_02_consent',
    number: 2,
    title: 'Informed Consent',
    stage: 'patient_details',
    category: 'Consent',
    isSpecialScreen: true,
    description: 'Separate consent screen required before collecting clinical health information',
    statement: 'Before collecting health information: "Do you consent to providing your health information for this consultation?"',
    subtext: 'Your health data is protected under ABDM guidelines and used solely for clinical triaging and doctor consultation.',
    questions: [
      {
        id: 'q_consent_given',
        text: 'Do you consent to providing your health information for this consultation?',
        type: 'choice',
        options: ['Yes, I give informed consent', 'No, I decline'],
        required: true
      }
    ]
  },

  // ── 3. CHIEF COMPLAINT ──────────────────────────────────────────────
  {
    id: 'sec_03_chief_complaint',
    number: 3,
    title: 'Chief Complaint — MOST IMPORTANT',
    stage: 'chief_complaint',
    category: 'Chief Complaint',
    description: 'What problem brought the patient to the hospital (open-ended inquiry)',
    instruction: 'The first medical question should be open-ended. Then the AI should identify the complaint and branch accordingly.',
    questions: [
      {
        id: 'q_chief_complaint_main',
        text: 'What health problem brought you here today?',
        type: 'text',
        multiline: true,
        placeholder: 'Describe your primary health complaint (e.g., severe joint pain in both knees, burning chest sensation, constant acidity...)',
        required: true,
        commonPresets: [
          'Joint pain / Arthritis',
          'Chest pain / Burning discomfort',
          'Abdominal pain & Acidity',
          'Persistent cough & Breathlessness',
          'Digestive issues & Constipation',
          'Severe headache / Migraine',
          'High fever & Body fatigue'
        ]
      }
    ]
  },

  // ── 24. RED-FLAG QUESTIONS (Evaluated Right After Chief Complaint) ───
  {
    id: 'sec_24_red_flag',
    number: 24,
    title: 'Red-Flag Screening (Emergency Triage)',
    stage: 'red_flag_screening',
    category: 'Emergency Screening',
    description: 'Mandatory software-safety screening for emergency symptoms requiring immediate triage escalation',
    triageProtocol: 'RED FLAG DETECTED -> STOP NORMAL QUESTIONING -> ALERT TRIAGE STAFF -> PRIORITY ASSESSMENT (AI should not attempt to diagnose the emergency)',
    questions: [
      { id: 'q_rf_chest_pain', text: 'Are you having severe chest pain right now?', type: 'boolean', isRedFlag: true, severity: 'EMERGENCY' },
      { id: 'q_rf_breathing', text: 'Are you having severe difficulty breathing?', type: 'boolean', isRedFlag: true, severity: 'EMERGENCY' },
      { id: 'q_rf_unilateral_weakness', text: 'Have you suddenly developed weakness on one side?', type: 'boolean', isRedFlag: true, severity: 'EMERGENCY_STROKE' },
      { id: 'q_rf_speech', text: 'Are you having difficulty speaking?', type: 'boolean', isRedFlag: true, severity: 'EMERGENCY_STROKE' },
      { id: 'q_rf_consciousness', text: 'Have you lost consciousness or fainted?', type: 'boolean', isRedFlag: true, severity: 'EMERGENCY' },
      { id: 'q_rf_bleeding', text: 'Are you experiencing severe uncontrolled bleeding?', type: 'boolean', isRedFlag: true, severity: 'EMERGENCY' },
      { id: 'q_rf_headache', text: 'Are you experiencing a sudden, thunderclap severe headache?', type: 'boolean', isRedFlag: true, severity: 'EMERGENCY' },
      { id: 'q_rf_abdomen', text: 'Are you experiencing severe, acute abdominal pain?', type: 'boolean', isRedFlag: true, severity: 'EMERGENCY' }
    ]
  },

  // ── 4. HPI — HISTORY OF PRESENT ILLNESS ─────────────────────────────
  {
    id: 'sec_04_hpi',
    number: 4,
    title: 'HPI — History of Present Illness',
    stage: 'hpi',
    category: 'HPI',
    description: 'Detailed systematic breakdown of the current complaint',
    questions: [
      // Onset
      { id: 'q_hpi_onset_when', text: 'When did this problem start?', type: 'text', placeholder: 'e.g. 2 days ago, 3 weeks ago, this morning' },
      { id: 'q_hpi_onset_type', text: 'Did it start suddenly or gradually?', type: 'choice', options: ['Suddenly (abrupt)', 'Gradually (slowly over time)', 'Woke up with it'] },
      { id: 'q_hpi_onset_activity', text: 'What were you doing when it started?', type: 'text', placeholder: 'e.g. Resting, exercising, eating spicy food, lifting heavy weights' },
      // Duration
      { id: 'q_hpi_duration', text: 'How long have you had this problem?', type: 'text', placeholder: 'e.g. 4 days, 2 months' },
      { id: 'q_hpi_continuity', text: 'Is it continuous or does it come and go?', type: 'choice', options: ['Continuous without break', 'Comes and goes (intermittent / episodic)', 'Only triggers during specific activities'] },
      // Progression
      { id: 'q_hpi_progression', text: 'Is the problem getting better or worse?', type: 'choice', options: ['Getting worse', 'Staying the same', 'Getting better', 'Fluctuating'] },
      { id: 'q_hpi_severity_change', text: 'Has the severity changed over time?', type: 'choice', options: ['Yes, significantly increased', 'No, unchanged', 'Mild initially, now severe', 'Reduced'] },
      // Severity
      { id: 'q_hpi_severity_scale', text: 'How severe is the problem (1 to 10 scale)?', type: 'choice', options: ['Mild (1-3)', 'Moderate (4-6)', 'Severe (7-8)', 'Very Severe / Excruciating (9-10)'] },
      { id: 'q_hpi_daily_activities', text: 'Does it interfere with your daily activities?', type: 'choice', options: ['Completely unable to work or walk', 'Significantly interferes', 'Mildly interferes', 'No interference'] },
      // Associated symptoms
      { id: 'q_hpi_assoc_symptoms', text: 'What other symptoms are you experiencing?', type: 'text', placeholder: 'e.g. Fever, sweating, dizziness, nausea' },
      { id: 'q_hpi_assoc_onset', text: 'Did any other symptoms start at the same time?', type: 'text', placeholder: 'Describe associated symptoms onset' },
      // Aggravating factors
      { id: 'q_hpi_aggravating_what', text: 'What makes the problem worse?', type: 'text', placeholder: 'e.g. Cold air, spicy meals, walking, sitting for long' },
      { id: 'q_hpi_agg_food', text: 'Does food affect it?', type: 'choice', options: ['Worse after eating', 'Better after eating', 'Worse with empty stomach', 'No effect'] },
      { id: 'q_hpi_agg_activity', text: 'Does physical activity affect it?', type: 'choice', options: ['Worse with activity', 'Better with light movement', 'No effect'] },
      { id: 'q_hpi_agg_weather', text: 'Does weather affect it?', type: 'choice', options: ['Worse in cold/rainy weather', 'Worse in hot weather', 'No effect'] },
      { id: 'q_hpi_agg_stress', text: 'Does stress affect it?', type: 'choice', options: ['Significantly worsens with stress', 'Mild effect', 'No effect'] },
      // Relieving factors
      { id: 'q_hpi_relieving_what', text: 'What makes you feel better?', type: 'text', placeholder: 'e.g. Lying flat, warm compress, drinking warm water' },
      { id: 'q_hpi_rel_rest', text: 'Does rest help?', type: 'choice', options: ['Yes, improves with rest', 'No, rest does not help', 'Feels stiffer with rest'] },
      { id: 'q_hpi_rel_medication', text: 'Have you taken anything that provides relief?', type: 'text', placeholder: 'e.g. Paracetamol, antacid, ginger tea, hot water fomentation' }
    ]
  },

  // ── 5. ADAPTIVE QUESTIONS — BRANCHED BY CHIEF COMPLAINT ────────────
  {
    id: 'sec_05_adaptive',
    number: 5,
    title: 'Adaptive Branching Questions',
    stage: 'adaptive_branching',
    category: 'Adaptive Branching',
    description: 'Dynamically branches based on chief complaint and prior answers (Chest pain, Joint pain, Abdominal pain, etc.)',
    branches: [
      {
        complaintKey: 'chest_pain',
        label: 'Chest Pain Branch',
        triggerKeywords: ['chest', 'heart', 'burning chest', 'retrosternal', 'angina'],
        questions: [
          { id: 'q_ad_cp_begin', text: 'When did the chest pain begin?', type: 'text' },
          { id: 'q_ad_cp_location', text: 'Where exactly do you feel the pain?', type: 'choice', options: ['Center of chest (retrosternal)', 'Left side of chest', 'Upper abdomen / Epigastric', 'Right side'] },
          { id: 'q_ad_cp_quality', text: 'What does the pain feel like?', type: 'choice', options: ['Burning sensation (pyrosis / acidity)', 'Heavy pressure or squeezing tightness', 'Sharp / Stabbing like a needle', 'Dull ache'] },
          { id: 'q_ad_cp_radiation', text: 'Does the pain spread to your arm, shoulder, neck or jaw?', type: 'choice', options: ['Yes, radiates to left arm / shoulder / jaw', 'Yes, radiates to back', 'No radiation, localized only'] },
          { id: 'q_ad_cp_physical', text: 'Does it occur during physical activity?', type: 'choice', options: ['Yes, occurs on exertion/walking', 'Occurs at rest', 'Occurs after heavy meals'] },
          { id: 'q_ad_cp_rest', text: 'Does it improve with rest?', type: 'choice', options: ['Yes, resolves with rest', 'No change with rest', 'Improves with antacids'] },
          { id: 'q_ad_cp_breathing', text: 'Are you experiencing difficulty breathing?', type: 'choice', options: ['Yes, breathlessness present', 'No shortness of breath'] },
          { id: 'q_ad_cp_sweating', text: 'Are you sweating unusually (cold sweats)?', type: 'choice', options: ['Yes, excessive cold sweating (Diaphoresis)', 'No unusual sweating'] },
          { id: 'q_ad_cp_dizziness', text: 'Are you feeling dizzy or lightheaded?', type: 'choice', options: ['Yes, dizziness / near fainting', 'No dizziness'] },
          { id: 'q_ad_cp_previous', text: 'Have you experienced this before?', type: 'choice', options: ['Never before (first time)', 'Yes, had similar episodes previously'] }
        ]
      },
      {
        complaintKey: 'joint_pain',
        label: 'Joint Pain (Sandhivata / Amavata) Branch',
        triggerKeywords: ['joint', 'knee', 'arthritis', 'sandhivata', 'back pain', 'stiffness', 'sandhi'],
        questions: [
          { id: 'q_ad_jp_affected', text: 'Which joints are affected?', type: 'choice', options: ['Bilateral knees (both knees)', 'Single knee', 'Small joints of fingers / hands', 'Lower back / Spine', 'Multiple joints across body'] },
          { id: 'q_ad_jp_morning_stiff', text: 'Is there morning stiffness, swelling, or redness?', type: 'choice', options: ['Severe morning stiffness (> 30-60 mins)', 'Mild stiffness (< 15 mins)', 'Swelling & warmth present', 'No swelling, only crepitus/pain'] },
          { id: 'q_ad_jp_movement', text: 'Does movement or rest make the pain better or worse?', type: 'choice', options: ['Worse with movement / walking, better with rest (Sandhivata / OA pattern)', 'Worse with rest, improves after moving around (Amavata / RA pattern)', 'Constant severe pain'] },
          { id: 'q_ad_jp_symmetrical', text: 'Is the joint involvement symmetrical on both sides?', type: 'choice', options: ['Yes, symmetrical both sides', 'No, only one side / asymmetrical'] }
        ]
      },
      {
        complaintKey: 'abdominal_pain',
        label: 'Abdominal & Digestive (Udarashoola / Agni) Branch',
        triggerKeywords: ['abdomen', 'stomach', 'belly', 'acid', 'gastric', 'bloat', 'indigestion', 'acidity'],
        questions: [
          { id: 'q_ad_ab_location', text: 'Where exactly in your abdomen is the pain located?', type: 'choice', options: ['Upper abdomen (epigastric / pit of stomach)', 'Lower right abdomen', 'Lower abdomen / pelvic', 'All over abdomen / generalized'] },
          { id: 'q_ad_ab_nature', text: 'What is the nature of the pain?', type: 'choice', options: ['Burning / sour burning', 'Cramping / colicky spasms', 'Dull constant ache', 'Sharp piercing'] },
          { id: 'q_ad_ab_meals', text: 'How is it related to meal times?', type: 'choice', options: ['Worse immediately after meals (heavy food)', 'Worse 2-3 hours after meals or empty stomach', 'Relieved by drinking milk or cold water', 'No meal relation'] },
          { id: 'q_ad_ab_vomit', text: 'Are you experiencing nausea, vomiting or vomiting blood?', type: 'choice', options: ['Nausea only', 'Vomiting food content', 'Vomiting sour/bitter bile', 'No nausea or vomiting'] }
        ]
      }
    ]
  },

  // ── 6. PAST MEDICAL HISTORY ────────────────────────────────────────
  {
    id: 'sec_06_past_history',
    number: 6,
    title: 'Past Medical History',
    stage: 'past_history',
    category: 'Past Medical History',
    description: 'Previous diseases, surgeries and hospitalizations',
    questions: [
      { id: 'q_pmh_major_illness', text: 'Have you had any major illnesses before?', type: 'choice', options: ['No major illnesses', 'Yes (Tuberculosis, Jaundice, Typhoid, etc.)'] },
      { id: 'q_pmh_chronic', text: 'Do you have any chronic diseases?', type: 'choice', options: ['None known', 'Diabetes Mellitus', 'Hypertension', 'Thyroid Disorder', 'Asthma / COPD', 'Multiple chronic conditions'] },
      { id: 'q_pmh_hospitalized', text: 'Have you ever been hospitalized?', type: 'text', placeholder: 'Describe past hospital admissions if any' },
      { id: 'q_pmh_surgery', text: 'Have you undergone surgery?', type: 'text', placeholder: 'Specify surgical procedures & year if any' },
      { id: 'q_pmh_diabetes', text: 'Have you previously been diagnosed with diabetes?', type: 'choice', options: ['No', 'Yes, Type 2 DM', 'Yes, Type 1 DM', 'Borderline / Pre-diabetic'] },
      { id: 'q_pmh_htn', text: 'Do you have high blood pressure?', type: 'choice', options: ['No, normal BP', 'Yes, taking BP medication', 'Diagnosed but not on regular meds', 'Not sure'] },
      { id: 'q_pmh_heart', text: 'Do you have any heart problems?', type: 'choice', options: ['No heart issues', 'Coronary artery disease / Prior stent', 'Heart attack history', 'Arrhythmia / Palpitations'] },
      { id: 'q_pmh_resp', text: 'Do you have any respiratory problems?', type: 'choice', options: ['No', 'Asthma', 'Chronic Bronchitis / COPD', 'Frequent sinus/allergies'] },
      { id: 'q_pmh_injury', text: 'Have you had any major injuries or fractures?', type: 'text', placeholder: 'Detail any past trauma, fractures, or head injuries' }
    ]
  },

  // ── 7. DRUG AND ALLERGY HISTORY ────────────────────────────────────
  {
    id: 'sec_07_drug_allergy',
    number: 7,
    title: 'Drug and Allergy History',
    stage: 'drug_allergy',
    category: 'Drug & Allergy',
    description: 'Current medicines, Ayurvedic medicines, supplements and known allergies',
    questions: [
      { id: 'q_med_taking_any', text: 'Are you currently taking any medicines?', type: 'choice', options: ['Yes, regular medications', 'No, not taking any meds'] },
      { id: 'q_med_name', text: 'What is the name of the medicine?', type: 'text', placeholder: 'e.g. Metformin, Amlodipine, Pantoprazole, Thyronorm' },
      { id: 'q_med_dosage', text: 'What dosage do you take?', type: 'text', placeholder: 'e.g. 500mg, 5mg, 1 tablet' },
      { id: 'q_med_frequency', text: 'How often do you take it?', type: 'choice', options: ['Once daily (OD)', 'Twice daily (BD)', 'Thrice daily (TDS)', 'As needed (SOS)'] },
      { id: 'q_med_indication', text: 'Why are you taking it?', type: 'text', placeholder: 'e.g. For diabetes, blood pressure, acidity' },
      { id: 'q_med_ayurvedic', text: 'Are you taking any Ayurvedic medicines?', type: 'text', placeholder: 'e.g. Triphala Churna, Ashwagandha, Dashamularishta, Giloy, none' },
      { id: 'q_med_supplements', text: 'Are you taking any supplements?', type: 'text', placeholder: 'e.g. Vitamin D3, B12, Calcium, Chyawanprash, none' },
      { id: 'q_med_allergies', text: 'Do you have any medicine allergies?', type: 'choice', options: ['No known drug allergies (NKDA)', 'Yes, Penicillin / Antibiotic allergy', 'Yes, NSAID / Painkiller allergy', 'Other allergies'] },
      { id: 'q_med_prior_reaction', text: 'Have you previously experienced a reaction to any medicine?', type: 'text', placeholder: 'Describe past drug reactions (rashes, swelling, breathing trouble)' }
    ]
  },

  // ── 8. FAMILY HISTORY ──────────────────────────────────────────────
  {
    id: 'sec_08_family_history',
    number: 8,
    title: 'Family History',
    stage: 'family_personal',
    category: 'Family History',
    description: 'Diseases running in the family & hereditary conditions',
    questions: [
      { id: 'q_fam_similar', text: 'Does anyone in your family have a similar condition?', type: 'choice', options: ['Yes, family member has same complaint', 'No one in family', 'Not sure'] },
      { id: 'q_fam_diabetes', text: 'Is there a family history of diabetes?', type: 'choice', options: ['Yes (Mother/Father/Sibling)', 'No', 'Not known'] },
      { id: 'q_fam_hypertension', text: 'Is there a family history of hypertension?', type: 'choice', options: ['Yes', 'No', 'Not known'] },
      { id: 'q_fam_heart', text: 'Is there a family history of heart disease or premature heart attacks?', type: 'choice', options: ['Yes', 'No', 'Not known'] },
      { id: 'q_fam_cancer', text: 'Is there a family history of cancer?', type: 'choice', options: ['Yes', 'No', 'Not known'] },
      { id: 'q_fam_hereditary', text: 'Are there any hereditary diseases in your family?', type: 'text', placeholder: 'e.g. Thalassemia, auto-immune conditions, asthma' }
    ]
  },

  // ── 9. PERSONAL HISTORY ────────────────────────────────────────────
  {
    id: 'sec_09_personal_history',
    number: 9,
    title: 'Personal History (Diet, Sleep, Activity & Habits)',
    stage: 'family_personal',
    category: 'Personal History',
    description: 'Lifestyle, habits, sleep, physical activity',
    questions: [
      // Diet
      { id: 'q_pers_diet_type', text: 'What type of diet do you follow?', type: 'choice', options: ['Vegetarian', 'Lacto-Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain Vegetarian'] },
      { id: 'q_pers_meals_count', text: 'How many meals do you eat each day?', type: 'choice', options: ['2 meals a day', '3 meals a day', '4 or more meals / frequent snacking'] },
      { id: 'q_pers_meal_time', text: 'What time do you normally eat?', type: 'text', placeholder: 'e.g. Breakfast 8am, Lunch 1:30pm, Dinner 9:30pm' },
      { id: 'q_pers_skip_meals', text: 'Do you frequently skip meals?', type: 'choice', options: ['Frequently skip breakfast', 'Frequently skip lunch or dinner', 'No, regular meal times'] },
      { id: 'q_pers_eat_outside', text: 'Do you frequently eat outside?', type: 'choice', options: ['Almost daily', '2-3 times a week', 'Rarely / Home cooked only'] },
      { id: 'q_pers_water_intake', text: 'How much water do you drink?', type: 'choice', options: ['Less than 1 liter', '1 to 2 liters', '2 to 3 liters', 'More than 3 liters'] },
      // Sleep
      { id: 'q_pers_sleep_time', text: 'What time do you normally sleep?', type: 'text', placeholder: 'e.g. 10:30 PM, 1:00 AM' },
      { id: 'q_pers_wake_time', text: 'What time do you wake up?', type: 'text', placeholder: 'e.g. 6:00 AM, 8:00 AM' },
      { id: 'q_pers_sleep_hours', text: 'How many hours do you sleep?', type: 'choice', options: ['Under 5 hours', '6 to 7 hours', '7 to 8 hours', 'Over 9 hours'] },
      { id: 'q_pers_sleep_difficulty', text: 'Do you have difficulty sleeping (falling or staying asleep)?', type: 'choice', options: ['Severe insomnia', 'Takes long time to fall asleep', 'Frequent disturbed sleep', 'Sound natural sleep'] },
      { id: 'q_pers_wake_freq', text: 'Do you wake up frequently during the night?', type: 'choice', options: ['Yes, wake up 3+ times', 'Wake up once or twice', 'No, sleep through night'] },
      // Activity
      { id: 'q_pers_exercise_reg', text: 'Do you exercise regularly?', type: 'choice', options: ['Regularly (4+ days/week)', 'Occasionally (1-2 days/week)', 'Sedentary / No regular exercise'] },
      { id: 'q_pers_exercise_type', text: 'What type of exercise do you do?', type: 'text', placeholder: 'e.g. Walking, Yoga, Gym, Cycling, None' },
      { id: 'q_pers_sitting_hours', text: 'How many hours do you sit during the day?', type: 'choice', options: ['More than 8 hours (desk job)', '4 to 8 hours', 'Active on feet most of day'] },
      // Habits
      { id: 'q_pers_smoking', text: 'Do you smoke?', type: 'choice', options: ['Non-smoker', 'Current smoker (specify cigs/day)', 'Past smoker (quit)'] },
      { id: 'q_pers_alcohol', text: 'Do you consume alcohol?', type: 'choice', options: ['Never / Teetotaler', 'Occasional / Social', 'Regular consumption'] },
      { id: 'q_pers_tobacco', text: 'Do you use tobacco (gutka / paan / khaini)?', type: 'choice', options: ['No', 'Yes, regularly', 'Past user'] }
    ]
  },

  // ── 10. REVIEW OF SYSTEMS (ROS) ────────────────────────────────────
  {
    id: 'sec_10_ros',
    number: 10,
    title: 'Review of Systems (ROS)',
    stage: 'ros',
    category: 'Review of Systems',
    description: 'Systematic screening across body systems',
    questions: [
      // General
      { id: 'q_ros_fever', text: 'Do you have fever?', type: 'choice', options: ['No fever', 'Low-grade fever', 'High fever with chills'] },
      { id: 'q_ros_weight_loss', text: 'Have you experienced unexplained weight loss?', type: 'choice', options: ['No', 'Yes, significant sudden weight loss', 'Weight gain recently'] },
      { id: 'q_ros_tired', text: 'Do you feel unusually tired?', type: 'choice', options: ['Severe chronic exhaustion', 'Moderate fatigue', 'Normal energy'] },
      { id: 'q_ros_weakness', text: 'Do you have weakness?', type: 'choice', options: ['Generalized body weakness', 'Localized muscle weakness', 'No weakness'] },
      // Respiratory
      { id: 'q_ros_cough', text: 'Do you have cough?', type: 'choice', options: ['No cough', 'Dry cough', 'Productive cough with phlegm', 'Chronic smoker cough'] },
      { id: 'q_ros_difficulty_breathing', text: 'Do you have difficulty breathing?', type: 'choice', options: ['No shortness of breath', 'Only on climbing stairs/exertion', 'Breathlessness even at rest'] },
      // Cardiovascular
      { id: 'q_ros_chest_pain', text: 'Do you have chest pain?', type: 'choice', options: ['No chest pain', 'Yes, active chest pain', 'Occasional fleeting pain'] },
      { id: 'q_ros_palpitations', text: 'Do you experience palpitations (rapid heart thumping)?', type: 'choice', options: ['No', 'Yes, sudden rapid racing heart', 'During anxiety or panic'] },
      { id: 'q_ros_leg_swelling', text: 'Do you have swelling in your legs or ankles (Pedal Edema)?', type: 'choice', options: ['No swelling', 'Bilateral ankle/feet swelling', 'Single leg swelling'] },
      // Gastrointestinal
      { id: 'q_ros_abd_pain', text: 'Do you have abdominal pain?', type: 'choice', options: ['No abdominal pain', 'Yes, recurrent abdominal pain'] },
      { id: 'q_ros_nausea', text: 'Do you have nausea?', type: 'choice', options: ['No', 'Frequent nausea', 'Morning nausea'] },
      { id: 'q_ros_vomiting', text: 'Do you have vomiting?', type: 'choice', options: ['No', 'Yes, had episodes of vomiting'] },
      { id: 'q_ros_bowels', text: 'Do you have constipation or diarrhoea?', type: 'choice', options: ['Normal regular bowels', 'Chronic constipation', 'Frequent loose stools / diarrhoea', 'Alternating constipation & loose stools'] },
      // Neurological
      { id: 'q_ros_headaches', text: 'Do you experience headaches?', type: 'choice', options: ['No', 'Frequent tension headaches', 'One-sided throbbing migraine', 'Sudden severe headache'] },
      { id: 'q_ros_dizziness', text: 'Dizziness or feeling faint?', type: 'choice', options: ['No', 'Yes, lightheadedness / vertigo'] },
      { id: 'q_ros_numbness', text: 'Numbness or tingling sensation in hands or feet?', type: 'choice', options: ['No', 'Pins & needles / tingling in feet (diabetic neuropathy)', 'Hand numbness'] },
      { id: 'q_ros_neuro_weakness', text: 'Weakness in arms or legs?', type: 'choice', options: ['No', 'Bilateral weakness', 'One limb weakness'] },
      { id: 'q_ros_walking', text: 'Difficulty walking or unsteadiness?', type: 'choice', options: ['Normal gait', 'Unsteady / Loss of balance', 'Joint pain restricts walking'] }
    ]
  },

  // ── 11 & 12. AYUSH: PRAKRITI QUESTIONS ─────────────────────────────
  {
    id: 'sec_11_12_prakriti',
    number: 12,
    title: 'Prakriti Assessment (Natural Constituent)',
    stage: 'ayush_mode',
    category: 'Dashavidha Pariksha',
    ayurvedicConcept: 'Prakriti',
    description: 'Constitutional assessment collected through patient questions rather than asking direct Prakriti label',
    questions: [
      // Body structure
      { id: 'q_pra_body_build', text: 'How would you describe your natural body build?', type: 'choice', options: ['Naturally thin & slender (Vata build)', 'Medium-built, athletic & moderate (Pitta build)', 'Broad-built, heavy & sturdy (Kapha build)'] },
      { id: 'q_pra_weight_gain', text: 'Do you gain weight easily?', type: 'choice', options: ['Difficulty gaining weight, loses weight rapidly (Vata)', 'Maintains weight steadily, gains/loses with effort (Pitta)', 'Gains weight very easily, difficult to lose (Kapha)'] },
      // Skin
      { id: 'q_pra_skin', text: 'Is your skin usually dry, oily or normal?', type: 'choice', options: ['Dry, rough, cracked or cold to touch (Vata)', 'Warm, reddish, prone to moles/freckles/acne (Pitta)', 'Thick, smooth, oily, moist and cool (Kapha)'] },
      { id: 'q_pra_temp_preference', text: 'Do you tend to feel excessive heat or cold?', type: 'choice', options: ['Aversion to cold, feels chilly easily (Vata)', 'Intolerant of heat, sweats easily, seeks cold (Pitta)', 'Tolerates most weather, dislikes cold dampness (Kapha)'] },
      // Hair
      { id: 'q_pra_hair', text: 'Is your hair naturally dry, oily or normal?', type: 'choice', options: ['Dry, brittle, thin, curly or split ends (Vata)', 'Soft, fine, early graying or thinning (Pitta)', 'Thick, lustrous, dark, wavy and oily (Kapha)'] },
      // Sleep
      { id: 'q_pra_sleep_nature', text: 'Is your natural sleep light, moderate or deep?', type: 'choice', options: ['Light, restless, easily interrupted (Vata)', 'Moderate (6-7 hrs), sound but easily awakened (Pitta)', 'Deep, heavy, prolonged, hard to wake up (Kapha)'] },
      { id: 'q_pra_wake_easily', text: 'Do you wake up easily with small sounds?', type: 'choice', options: ['Yes, wake at slightest sound (Vata)', 'Moderate light/sound sensitivity (Pitta)', 'No, sleep deeply through sounds (Kapha)'] },
      // Appetite
      { id: 'q_pra_appetite_level', text: 'Is your appetite usually low, moderate or strong?', type: 'choice', options: ['Variable / Irregular (Vishamagni - Vata)', 'Strong / Intense hunger, cannot tolerate skipping (Tikshnagni - Pitta)', 'Low but constant / Slow digestion (Mandagni - Kapha)'] },
      { id: 'q_pra_appetite_regularity', text: 'Is your appetite regular or irregular?', type: 'choice', options: ['Irregular: hungry sometimes, not hungry other times', 'Sharp and regular like clockwork', 'Slow to develop hunger'] }
    ]
  },

  // ── 13. VIKRITI QUESTIONS (Current State vs Normal State) ──────────
  {
    id: 'sec_13_vikriti',
    number: 13,
    title: 'Vikriti Assessment (Current Imbalance vs Baseline)',
    stage: 'ayush_mode',
    category: 'Dashavidha Pariksha',
    ayurvedicConcept: 'Vikriti',
    description: 'Patient current state versus baseline. Key query: "Is this normal for you, or is this a recent change?"',
    questions: [
      { id: 'q_vik_recent_changes', text: 'What changes have you noticed in your health recently?', type: 'text', placeholder: 'Describe notable recent departures from your usual state' },
      { id: 'q_vik_appetite_change', text: 'Has your appetite changed?', type: 'choice', options: ['No change from baseline', 'Loss of appetite (Aruchi)', 'Increased excessive hunger', 'Unpredictably fluctuating'] },
      { id: 'q_vik_digestion_change', text: 'Has your digestion changed?', type: 'choice', options: ['Normal as usual', 'Frequent heaviness & indigestion', 'Burning sensation & acid reflux', 'Severe bloating & gas'] },
      { id: 'q_vik_sleep_change', text: 'Has your sleep changed?', type: 'choice', options: ['No change', 'Severe sleep reduction / insomnia', 'Excessive drowsiness / lethargy', 'Disturbed sleep'] },
      { id: 'q_vik_bowel_change', text: 'Have your bowel habits changed?', type: 'choice', options: ['Same as usual', 'New onset constipation', 'New onset looseness / frequency'] },
      { id: 'q_vik_energy_change', text: 'Have your energy levels changed?', type: 'choice', options: ['Normal energy', 'Sudden drop in vitality / extreme fatigue', 'Restless agitation'] },
      { id: 'q_vik_dryness', text: 'Have you recently experienced unusual dryness (skin, mouth, eyes, throat)?', type: 'choice', options: ['Yes, severe new dryness (Vata aggravation)', 'No unusual dryness'] },
      { id: 'q_vik_heaviness', text: 'Do you feel unusually heavy in body or limbs (Gaurava)?', type: 'choice', options: ['Yes, heavy and lethargic (Kapha / Ama aggravation)', 'No heaviness'] },
      { id: 'q_vik_excessive_heat', text: 'Do you experience excessive internal or external heat (Daha)?', type: 'choice', options: ['Yes, feeling hot, burning eyes/palms/soles (Pitta aggravation)', 'No heat issues'] },
      { id: 'q_vik_excessive_cold', text: 'Do you feel unusually cold or shivering (Sheeta)?', type: 'choice', options: ['Yes, intolerance to cold (Vata/Kapha)', 'No cold feeling'] },
      { id: 'q_vik_is_it_normal', text: 'Is this normal for you, or is this a recent change?', type: 'choice', options: ['This is a RECENT CHANGE from my normal state', 'This is long-standing / chronic baseline for me'] }
    ]
  },

  // ── 14. AGNI / DIGESTIVE ASSESSMENT ────────────────────────────────
  {
    id: 'sec_14_agni',
    number: 14,
    title: 'Agni / Digestive Assessment',
    stage: 'ayush_mode',
    category: 'Dashavidha Pariksha',
    ayurvedicConcept: 'Agni',
    description: 'Assessment of digestive capacity (Jatharagni: Samagni, Vishamagni, Tikshnagni, Mandagni)',
    questions: [
      { id: 'q_agni_appetite', text: 'How is your appetite?', type: 'choice', options: ['Good & balanced (Samagni)', 'Irregular & fluctuating (Vishamagni)', 'Very sharp & intense (Tikshnagni)', 'Weak & sluggish (Mandagni)'] },
      { id: 'q_agni_hungry_regularly', text: 'Do you feel hungry regularly at expected times?', type: 'choice', options: ['Yes, predictable hunger times', 'No, irregular hunger patterns', 'Rarely feel true hunger'] },
      { id: 'q_agni_indigestion', text: 'Do you experience indigestion (Ajirna)?', type: 'choice', options: ['Frequently experience indigestion', 'Occasionally after heavy meals', 'Rarely or never'] },
      { id: 'q_agni_bloating', text: 'Do you experience bloating (Adhmana)?', type: 'choice', options: ['Severe bloating soon after eating', 'Occasional bloating', 'No bloating'] },
      { id: 'q_agni_gas', text: 'Do you have excessive gas (Flatulence / Anaha)?', type: 'choice', options: ['Yes, painful gas & distension', 'Mild gas', 'Normal'] },
      { id: 'q_agni_acidity', text: 'Do you experience acidity or burning in throat/chest (Vidaha / Amlapitta)?', type: 'choice', options: ['Severe daily burning & sour belching', 'Occasional acidity', 'No acidity'] },
      { id: 'q_agni_heaviness_post_meal', text: 'Do you feel heavy after meals?', type: 'choice', options: ['Yes, heavy for hours even after light food (Mandagni / Ama)', 'Only after large feast', 'Light and refreshed after eating'] },
      { id: 'q_agni_sleepy_after_eating', text: 'Do you feel sleepy immediately after eating (Tandra)?', type: 'choice', options: ['Overwhelming sleepiness & lethargy', 'Slight relaxed feeling', 'No sleepiness'] },
      { id: 'q_agni_hours_till_hunger', text: 'How long does it usually take before you feel hungry again?', type: 'choice', options: ['Under 3 hours (Tikshnagni)', '3 to 5 hours (Samagni)', 'More than 6-8 hours (Mandagni)'] }
    ]
  },

  // ── 15. KOSHTA / BOWEL-RELATED QUESTIONS ───────────────────────────
  {
    id: 'sec_15_koshta',
    number: 15,
    title: 'Koshta / Bowel-Related Assessment',
    stage: 'ayush_mode',
    category: 'Dashavidha Pariksha',
    ayurvedicConcept: 'Koshta',
    description: 'Assessment of gastrointestinal tract & bowel nature (Krura, Madhyama, Mridu Koshta)',
    questions: [
      { id: 'q_kosh_freq', text: 'How frequently do you pass stool?', type: 'choice', options: ['Once a day regularly', 'Twice a day', '3 or more times a day (Mridu Koshta)', 'Once every 2-3 days (Krura Koshta)'] },
      { id: 'q_kosh_consistency', text: 'Is your stool usually hard, normal or loose?', type: 'choice', options: ['Hard, dry or pellet-like (Krura / Vata)', 'Well-formed, normal (Madhyama)', 'Semi-solid or loose, yellowish (Mridu / Pitta)', 'Sticky, mucus-coated, sinks in water (Ama / Kapha)'] },
      { id: 'q_kosh_constipation', text: 'Do you experience constipation?', type: 'choice', options: ['Chronic stubborn constipation', 'Occasional constipation when traveling/routine changes', 'Never constipated'] },
      { id: 'q_kosh_strain', text: 'Do you need to strain during defecation?', type: 'choice', options: ['Need significant straining', 'Mild effort', 'Passes effortlessly'] },
      { id: 'q_kosh_diarrhoea', text: 'Do you experience diarrhoea or frequent loose stools?', type: 'choice', options: ['Frequent diarrhoea episodes', 'Loose stools after spicy/dairy foods', 'No diarrhoea'] },
      { id: 'q_kosh_relief', text: 'Do you feel completely relieved after passing stool?', type: 'choice', options: ['Complete feeling of relief & lightness', 'Incomplete evacuation sensation (feels unfinished)'] },
      { id: 'q_kosh_gas', text: 'Do you experience excessive foul-smelling gas?', type: 'choice', options: ['Yes, frequent foul gas', 'Normal minimal gas'] },
      { id: 'q_kosh_recent_change', text: 'Has your bowel pattern recently changed?', type: 'choice', options: ['Yes, new change in frequency/consistency', 'No change, same lifelong pattern'] }
    ]
  },

  // ── 16. AHARA — AYURVEDIC DIET QUESTIONS ───────────────────────────
  {
    id: 'sec_16_ahara',
    number: 16,
    title: 'Ahara — Ayurvedic Diet Assessment',
    stage: 'ayush_mode',
    category: 'Ahara-Vihara',
    ayurvedicConcept: 'Ahara Shakti',
    description: 'Ayurvedic dietary assessment: Ahara-vidhi, 6 Rasas, and incompatible food combinations',
    questions: [
      { id: 'q_ah_daily_diet', text: 'What do you normally eat in a day?', type: 'text', placeholder: 'e.g. Rice, roti, dal, curd, tea, vegetables' },
      { id: 'q_ah_meals_count', text: 'How many meals do you have?', type: 'choice', options: ['1-2 meals', '3 meals', '4+ meals with snacks'] },
      { id: 'q_ah_timing', text: 'What time do you usually eat your meals?', type: 'text', placeholder: 'Breakfast, lunch and dinner hours' },
      { id: 'q_ah_skip_meals', text: 'Do you skip meals?', type: 'choice', options: ['Yes, regularly skip', 'Occasionally skip', 'Never skip'] },
      { id: 'q_ah_late_night', text: 'Do you eat late at night (after 9:30 PM)?', type: 'choice', options: ['Frequently eat late night', 'Occasionally', 'Never, eat early before 8 PM'] },
      { id: 'q_ah_fried_food', text: 'Do you frequently eat fried foods?', type: 'choice', options: ['Daily or multiple times a week', 'Once a week', 'Rarely / Never'] },
      { id: 'q_ah_spicy_food', text: 'Do you frequently eat spicy foods?', type: 'choice', options: ['Very high spice preference', 'Moderate spice', 'Bland / Mild spice only'] },
      { id: 'q_ah_processed', text: 'Do you frequently eat processed / packaged foods?', type: 'choice', options: ['Regularly (instant noodles, chips, bakery)', 'Occasionally', 'Almost strictly fresh cooked'] },
      { id: 'q_ah_water_amount', text: 'How much water do you drink?', type: 'choice', options: ['Less than 1 liter', '1 to 2 liters', '2 to 3 liters', '3+ liters'] },
      { id: 'q_ah_rasa_preference', text: 'Which tastes (Shad-Rasa) do you prefer naturally?', type: 'choice', options: ['Sweet (Madhura)', 'Sour (Amla)', 'Salty (Lavana)', 'Pungent / Spicy (Katu)', 'Bitter (Tikta)', 'Astringent (Kashaya)'] },
      { id: 'q_ah_discomfort_foods', text: 'Are there foods that cause you discomfort or bloating?', type: 'text', placeholder: 'e.g. Milk/curd, lentils, raw salads, oily food, wheat' }
    ]
  },

  // ── 17. VIHARA — LIFESTYLE QUESTIONS ───────────────────────────────
  {
    id: 'sec_17_vihara',
    number: 17,
    title: 'Vihara — Lifestyle & Routine Assessment',
    stage: 'ayush_mode',
    category: 'Ahara-Vihara',
    ayurvedicConcept: 'Vihara',
    description: 'Dinacharya (daily regimen), circadian rhythm, physical exertion and occupational stress',
    questions: [
      { id: 'q_vih_wake_time', text: 'What time do you normally wake up?', type: 'text', placeholder: 'e.g. 5:30 AM (Brahma Muhurta), 7:00 AM, 9:00 AM' },
      { id: 'q_vih_sleep_time', text: 'What time do you normally sleep?', type: 'text', placeholder: 'e.g. 10:00 PM, 12:30 AM' },
      { id: 'q_vih_sleep_hours', text: 'How many hours do you sleep?', type: 'choice', options: ['Under 5 hours', '6 to 7 hours', '7 to 8 hours', 'More than 8 hours'] },
      { id: 'q_vih_exercise_flag', text: 'Do you exercise?', type: 'choice', options: ['Yes, active workout/yoga', 'Only light walking', 'No exercise'] },
      { id: 'q_vih_exercise_freq', text: 'How often do you exercise?', type: 'choice', options: ['5-7 days/week', '2-4 days/week', 'Rarely'] },
      { id: 'q_vih_sit_hours', text: 'How many hours do you sit each day?', type: 'choice', options: ['More than 8 hours', '5-8 hours', 'Less than 4 hours'] },
      { id: 'q_vih_screen_time', text: 'How much screen time do you have daily?', type: 'choice', options: ['Over 8 hours (heavy digital work)', '4 to 8 hours', 'Under 4 hours'] },
      { id: 'q_vih_irregular_routine', text: 'Do you have an irregular daily routine (Aniyata Dinacharya)?', type: 'choice', options: ['Yes, unpredictable sleeping & eating times', 'Somewhat irregular', 'Fixed, disciplined schedule'] },
      { id: 'q_vih_night_shifts', text: 'Do you work night shifts (Ratri Jagarana)?', type: 'choice', options: ['Frequent night shifts / rotational', 'Occasional late nights', 'Daytime work only'] },
      { id: 'q_vih_stress_level', text: 'How stressful is your daily routine?', type: 'choice', options: ['Severe continuous stress', 'Moderate manageable stress', 'Low stress / relaxed'] }
    ]
  },

  // ── 18. SATMYA QUESTIONS (Adaptation / Tolerance) ───────────────────
  {
    id: 'sec_18_satmya',
    number: 18,
    title: 'Satmya Assessment (Adaptation & Tolerance)',
    stage: 'ayush_mode',
    category: 'Dashavidha Pariksha',
    ayurvedicConcept: 'Satmya',
    description: 'Wholesomeness, adaptability, environmental resilience and food habituation (Oka-satmya)',
    questions: [
      { id: 'q_sat_regular_foods', text: 'Are there foods that you regularly consume and tolerate well?', type: 'text', placeholder: 'e.g. Ghee, rice, milk, specific regional foods' },
      { id: 'q_sat_dairy', text: 'Do you tolerate dairy well?', type: 'choice', options: ['Tolerate milk & dairy perfectly (Sarva-satmya)', 'Mild bloating with raw milk', 'Severe lactose intolerance / diarrhea'] },
      { id: 'q_sat_spicy', text: 'Do you tolerate spicy foods well?', type: 'choice', options: ['Tolerate spicy food comfortably', 'Causes acidity, burning or loose stools', 'Cannot tolerate any spice'] },
      { id: 'q_sat_diet_changes', text: 'Do changes in diet cause discomfort?', type: 'choice', options: ['Easily upset by any new food', 'Tolerates variety with no issues'] },
      { id: 'q_sat_weather', text: 'Do changes in weather (Ritu Parivartana) affect you?', type: 'choice', options: ['Immediately catch cold/cough/joint pain with weather shifts', 'Mild seasonal effects', 'Resilient in all seasons'] },
      { id: 'q_sat_routine_changes', text: 'Do you experience problems when your normal routine changes?', type: 'choice', options: ['Constipation / headaches quickly trigger when routine changes', 'Adapt smoothly to travel and changes'] }
    ]
  },

  // ── 19. SATTVA / MENTAL STATE ──────────────────────────────────────
  {
    id: 'sec_19_sattva',
    number: 19,
    title: 'Sattva / Mental State Assessment',
    stage: 'ayush_mode',
    category: 'Dashavidha Pariksha',
    ayurvedicConcept: 'Sattva',
    description: 'Psychological resilience & mental stamina (Pravara, Madhyama, Avara Sattva)',
    questions: [
      { id: 'q_sat_emotional', text: 'How have you been feeling emotionally?', type: 'choice', options: ['Calm and balanced', 'Anxious and restless (Vata/Rajas)', 'Irritable or short-tempered (Pitta/Rajas)', 'Depressed or unmotivated (Kapha/Tamas)'] },
      { id: 'q_sat_stress_increase', text: 'Have you been experiencing increased stress?', type: 'choice', options: ['Severe ongoing stress', 'Moderate stress', 'Minimal stress'] },
      { id: 'q_sat_worried', text: 'Do you frequently feel worried, fearful or overthinking (Chinta)?', type: 'choice', options: ['Frequently overthinking & worried', 'Occasional worry', 'Rarely worry'] },
      { id: 'q_sat_concentration', text: 'Are you having difficulty concentrating or brain fog?', type: 'choice', options: ['Significant difficulty focusing', 'Mild concentration lapses', 'Sharp focus & memory'] },
      { id: 'q_sat_mood_changed', text: 'Has your mood changed recently?', type: 'choice', options: ['Yes, noticeable mood swings / low mood', 'No change, emotionally steady'] },
      { id: 'q_sat_stress_physical', text: 'Does stress make your physical symptoms worse?', type: 'choice', options: ['Yes, symptoms flare directly with stress (Psychosomatic)', 'Mild connection', 'No relation'] },
      { id: 'q_sat_coping', text: 'How well do you cope with stressful situations?', type: 'choice', options: ['Strong resilience, stay composed (Pravara Sattva)', 'Moderate coping with effort (Madhyama Sattva)', 'Easily overwhelmed or panicked (Avara Sattva)'] }
    ]
  },

  // ── 20. SARA, SAMHANANA AND PRAMANA ────────────────────────────────
  {
    id: 'sec_20_sara_samhanana_pramana',
    number: 20,
    title: 'Sara, Samhanana & Pramana (Tissue Quality & Frame)',
    stage: 'ayush_mode',
    category: 'Dashavidha Pariksha',
    ayurvedicConcept: 'Sara & Samhanana & Pramana',
    description: 'Tissue vitality (Dhatu Sara), skeletal compactness (Samhanana) and anthropometric measurement (Pramana)',
    questions: [
      // Sara
      { id: 'q_sara_phys_strength', text: 'How would you describe your physical strength?', type: 'choice', options: ['High physical vigor & stamina (Pravara Sara)', 'Moderate average strength (Madhyama Sara)', 'Low strength, easily tired (Avara Sara)'] },
      { id: 'q_sara_tired_easily', text: 'Do you get tired easily (Shrama)?', type: 'choice', options: ['Tired after minimal physical effort', 'Tired only after heavy exertion', 'High stamina throughout day'] },
      { id: 'q_sara_freq_weakness', text: 'Do you experience frequent weakness (Klama)?', type: 'choice', options: ['Frequent unprovoked weakness', 'Occasional fatigue', 'Rarely feel weak'] },
      { id: 'q_sara_recovery_time', text: 'How quickly do you recover after physical activity?', type: 'choice', options: ['Recovers rapidly with short rest', 'Takes hours to recover', 'Takes days to recover'] },
      // Samhanana
      { id: 'q_sam_body_structure', text: 'How would you describe your overall body structure / compactness?', type: 'choice', options: ['Compact, well-knit joints & symmetrical frame (Susamhita)', 'Moderate bone and joint structure', 'Loose joints, asymmetrical, visible veins/tendons (Heena Samhanana)'] },
      { id: 'q_sam_muscle_loss', text: 'Have you experienced significant muscle loss or wasting (Mamsa Kshaya)?', type: 'choice', options: ['Yes, noticeable muscle loss', 'No muscle loss', 'Stable muscle tone'] },
      { id: 'q_sam_structure_change', text: 'Have you noticed a recent change in your body structure?', type: 'choice', options: ['Yes, noticeable recent structural change', 'No change'] },
      // Pramana
      { id: 'q_pra_height', text: 'Height (in cm or ft/inches)', type: 'text', placeholder: 'e.g. 172 cm or 5 ft 8 in' },
      { id: 'q_pra_weight', text: 'Weight (in kg)', type: 'text', placeholder: 'e.g. 68 kg' },
      { id: 'q_pra_bmi_calc', text: 'Calculated BMI / Body Mass Index', type: 'text', placeholder: 'Auto-calculated or known BMI' }
    ]
  },

  // ── 21. VYAYAMA SHAKTI (Physical Capacity) ─────────────────────────
  {
    id: 'sec_21_vyayama_shakti',
    number: 21,
    title: 'Vyayama Shakti (Physical Exercise Capacity)',
    stage: 'ayush_mode',
    category: 'Dashavidha Pariksha',
    ayurvedicConcept: 'Vyayama Shakti',
    description: 'Capacity for physical work, exercise tolerance and cardiac/muscular endurance',
    questions: [
      { id: 'q_vya_activity_level', text: 'How much physical activity can you comfortably perform?', type: 'choice', options: ['Vigorous activity (running, gym, heavy manual work) (Pravara)', 'Moderate activity (brisk walking, domestic chores) (Madhyama)', 'Only very light movement (Avara Vyayama Shakti)'] },
      { id: 'q_vya_tired_quickly', text: 'Do you get tired quickly during exercise?', type: 'choice', options: ['Exhausted within 5-10 minutes', 'Tired after 30-45 minutes', 'Can exercise for an hour with comfort'] },
      { id: 'q_vya_duration', text: 'How long can you exercise comfortably?', type: 'choice', options: ['Less than 15 minutes', '15 to 30 minutes', '30 to 60 minutes', 'More than 60 minutes'] },
      { id: 'q_vya_feel_after', text: 'How do you feel after physical activity?', type: 'choice', options: ['Energized, light and refreshed (ideal Ardha-Shakti)', 'Exhausted, breathless or aching for days', 'Heavy and sluggish'] },
      { id: 'q_vya_capacity_changed', text: 'Has your exercise capacity changed recently?', type: 'choice', options: ['Significantly reduced recently', 'Unchanged', 'Improved'] }
    ]
  },

  // ── 22. VAYA (Age-Related Assessment) ──────────────────────────────
  {
    id: 'sec_22_vaya',
    number: 22,
    title: 'Vaya Assessment (Age & Biological Phase)',
    stage: 'ayush_mode',
    category: 'Dashavidha Pariksha',
    ayurvedicConcept: 'Vaya',
    description: 'Balya (Kapha era), Madhyama (Pitta era), or Vardhakya (Vata era) physiological transitions',
    questions: [
      { id: 'q_vaya_strength_change', text: 'Has your physical strength changed recently with age?', type: 'choice', options: ['Noticeable decrease in strength', 'Strength remains steady', 'Not applicable / young age'] },
      { id: 'q_vaya_digestion_age', text: 'Has your digestion changed with age?', type: 'choice', options: ['Digestion has become significantly slower and sensitive', 'Digestion unchanged'] },
      { id: 'q_vaya_sleep_age', text: 'Has your sleep pattern changed as you got older?', type: 'choice', options: ['Sleep has become lighter and shorter', 'Sleep pattern unchanged'] },
      { id: 'q_vaya_activity_age', text: 'Have your activity levels changed?', type: 'choice', options: ['Slowed down considerably', 'Maintaining active lifestyle'] }
    ]
  },

  // ── 23. NIDANA / CAUSATIVE-FACTOR QUESTIONS ────────────────────────
  {
    id: 'sec_23_nidana',
    number: 23,
    title: 'Nidana (Causative & Trigger Factors)',
    stage: 'ayush_mode',
    category: 'Nidana Pariksha',
    ayurvedicConcept: 'Nidana',
    description: 'Etiological triggers: "Before your symptoms started, did anything change in your food, lifestyle, sleep or routine?"',
    mainTriggerQuestion: 'Before your symptoms started, did anything change in your food, lifestyle, sleep or routine?',
    questions: [
      { id: 'q_nid_trigger_main', text: 'Before your symptoms started, did anything change in your food, lifestyle, sleep or routine?', type: 'choice', options: ['Yes, clear change preceded symptoms', 'No, symptoms appeared out of the blue'] },
      { id: 'q_nid_diet_change', text: 'Did you change your diet recently?', type: 'choice', options: ['Yes, new foods or erratic meals', 'No diet change'] },
      { id: 'q_nid_spicy_oily', text: 'Did you start eating more spicy/oily/fermented food?', type: 'choice', options: ['Yes, consumed heavy/oily/spicy feasts', 'No'] },
      { id: 'q_nid_skipped_meals', text: 'Did you start skipping meals or fasting (Langhana)?', type: 'choice', options: ['Yes, skipped meals or irregular fasting', 'No'] },
      { id: 'q_nid_sleep_change', text: 'Did your sleep schedule change (e.g. night vigilance / daytime sleeping)?', type: 'choice', options: ['Yes, night waking (Ratri Jagarana) or day sleeping (Diva Swapna)', 'No sleep schedule change'] },
      { id: 'q_nid_activity_change', text: 'Did your physical activity change (overexertion or sudden inactivity)?', type: 'choice', options: ['Sudden excessive physical exertion (Ativyayama)', 'Sudden prolonged inactivity', 'No change'] },
      { id: 'q_nid_stress_event', text: 'Did you experience increased emotional stress, grief or anger (Shoka / Krodha)?', type: 'choice', options: ['Major stressful life event or anxiety surge', 'No major stress change'] },
      { id: 'q_nid_travel', text: 'Did you travel recently (Desha Parivartana)?', type: 'choice', options: ['Yes, recent travel / environmental shift', 'No recent travel'] },
      { id: 'q_nid_weather_change', text: 'Did the weather/environment change around the time your symptoms began?', type: 'choice', options: ['Yes, seasonal shift / cold wave / monsoon rain', 'No weather change'] }
    ]
  },

  // ── 25. THE FINAL QUESTION & CLINICAL REVIEW ───────────────────────
  {
    id: 'sec_25_final_review',
    number: 25,
    title: 'Final Physician Review & Patient Confirmation',
    stage: 'ayush_mode',
    category: 'Verification & Handoff',
    description: 'Editable/verifiable structured summary for physician consultation rather than autonomous AI diagnosis',
    questions: [
      {
        id: 'q_fin_anything_else',
        text: 'Is there anything else about your health that you would like the doctor to know?',
        type: 'text',
        multiline: true,
        placeholder: 'Enter any additional details, previous prescriptions, or specific requests for the doctor...'
      },
      {
        id: 'q_fin_confirm_review',
        text: 'Would you like to review the generated clinical history before submitting it to the doctor?',
        type: 'choice',
        options: ['Yes, I want to review and confirm', 'Ready to submit directly to Doctor Portal']
      }
    ]
  }
];

// ── Helper Accessor Functions ──────────────────────────────────────────

/**
 * Returns all 25 sections in sequence.
 */
export function getAllSections() {
  return AYUSETU_SECTIONS;
}

/**
 * Retrieves a specific section by its section ID.
 */
export function getSectionById(sectionId) {
  return AYUSETU_SECTIONS.find((sec) => sec.id === sectionId);
}

/**
 * Returns the list of mandatory red-flag emergency screening questions.
 */
export function getRedFlagQuestions() {
  const rfSec = AYUSETU_SECTIONS.find((sec) => sec.id === 'sec_24_red_flag');
  return rfSec ? rfSec.questions : [];
}

/**
 * Returns the adaptive questions branch for a given chief complaint keyword.
 */
export function getAdaptiveBranch(complaintText = '') {
  const adaptiveSec = AYUSETU_SECTIONS.find((sec) => sec.id === 'sec_05_adaptive');
  if (!adaptiveSec || !adaptiveSec.branches) return null;

  const lower = complaintText.toLowerCase();
  for (const branch of adaptiveSec.branches) {
    if (branch.triggerKeywords.some((kw) => lower.includes(kw))) {
      return branch;
    }
  }
  return null;
}

/**
 * Returns all Ayurvedic / Dashavidha Pariksha sections.
 */
export function getAyurvedicSections() {
  return AYUSETU_SECTIONS.filter((sec) =>
    sec.category === 'Dashavidha Pariksha' ||
    sec.category === 'Ahara-Vihara' ||
    sec.category === 'Nidana Pariksha' ||
    sec.ayurvedicConcept
  );
}

/**
 * Calculates dataset statistics for examiner or doctor dashboard.
 */
export function getDatasetStats() {
  let totalQuestions = 0;
  let ayurvedicQuestions = 0;
  let redFlagQuestions = 0;

  AYUSETU_SECTIONS.forEach((sec) => {
    if (sec.questions) {
      totalQuestions += sec.questions.length;
      if (sec.stage === 'ayush_mode' || sec.ayurvedicConcept) {
        ayurvedicQuestions += sec.questions.length;
      }
      if (sec.id === 'sec_24_red_flag') {
        redFlagQuestions += sec.questions.length;
      }
    }
    if (sec.branches) {
      sec.branches.forEach((branch) => {
        totalQuestions += branch.questions.length;
      });
    }
  });

  return {
    totalSections: AYUSETU_SECTIONS.length,
    totalPrimaryStages: PRIMARY_STAGES.length,
    totalQuestions,
    ayurvedicQuestions,
    redFlagQuestions,
    dashavidhaComponents: [
      'Prakriti',
      'Vikriti',
      'Sara',
      'Samhanana',
      'Pramana',
      'Satmya',
      'Sattva',
      'Ahara Shakti',
      'Vyayama Shakti',
      'Vaya'
    ]
  };
}
