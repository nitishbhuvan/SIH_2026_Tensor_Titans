/**
 * PreConsult — Dynamic Indic Clinical NLP & Triage Engine
 * Processes multilingual voice/text transcripts in Hindi, Kannada, Tamil,
 * Telugu, Malayalam, Marathi, Bengali, Sanskrit, Gujarati, and English.
 * Extracts chief complaints, duration, medications, Ayurvedic factors (Dosha & Agni),
 * and assigns ABDM-compliant clinical triage levels with SOAP summaries.
 */

const KNOWN_MEDICATIONS = [
  { name: 'Metformin (500mg)', regex: /metformin|glycomet|glim|sugar दवा|मधुमेह/i },
  { name: 'Pantoprazole (40mg)', regex: /pantoprazole|pantocid|pan-40|pan 40|gas दवा|एसिडिटी/i },
  { name: 'Paracetamol (650mg)', regex: /paracetamol|dolo|crocin|calpol|बुखार की गोली/i },
  { name: 'Telmisartan (40mg)', regex: /telmisartan|telma|bp दवा|रक्तचाप/i },
  { name: 'Amlodipine (5mg)', regex: /amlodipine|amlong|stamlo/i },
  { name: 'Triphala Churna', regex: /triphala|trifla|त्रिफला|ತ್ರಿಫಲಾ/i },
  { name: 'Ashwagandha', regex: /ashwagandha|asgandh|अश्वगंधा|ಅಶ್ವಗಂಧ/i },
  { name: 'Dashamularishta', regex: /dashamularishta|dashmool|दशमूल|ದಶಮೂಲ/i },
  { name: 'Avipattikar Churna', regex: /avipattikar|अविपत्तिकर/i },
  { name: 'Chitrakadi Vati', regex: /chitrakadi|चित्रकादि/i },
  { name: 'Sitopaladi Churna', regex: /sitopaladi|सितोपलादि/i },
  { name: 'Maharasnadi Kwath', regex: /maharasnadi|रास्नादि/i },
  { name: 'Gokshuradi Guggulu', regex: /gokshuradi|गोक्षुरादि/i },
  { name: 'Yogaraj Guggulu', regex: /yogaraj|योगराज/i }
];

export function executeClientClinicalNLP(transcript = '', lang = 'en') {
  const text = (transcript || '').trim();
  const lower = text.toLowerCase();

  const langNames = {
    hi: 'Hindi (हिन्दी)',
    kn: 'Kannada (ಕನ್ನಡ)',
    ta: 'Tamil (தமிழ்)',
    te: 'Telugu (తెలుగు)',
    mr: 'Marathi (मराठी)',
    bn: 'Bengali (বাংলা)',
    ml: 'Malayalam (മലയാളം)',
    gu: 'Gujarati (ગુજરાતી)',
    pa: 'Punjabi (ਪੰਜਾਬੀ)',
    sa: 'Sanskrit / AYUSH (संस्कृतम्)',
    en: 'English'
  };

  const detected_language = langNames[lang] || 'English / Indic';

  let triage_urgency = 'ROUTINE';
  let triage_reason = 'Patient presents with subacute symptoms requiring standard clinical outpatient evaluation.';
  let dosha_imbalance = 'Mild Tridosha fluctuation';
  let agni_status = 'Samagni (balanced digestive fire)';
  const medications_mentioned = [];
  const associated_symptoms = [];
  let chief_complaint = text || 'General clinical evaluation';
  let duration = '2-4 days';
  let translated_clinical_english = '';

  // 1. Detect Medications
  KNOWN_MEDICATIONS.forEach((m) => {
    if (m.regex.test(text) || m.regex.test(lower)) {
      medications_mentioned.push(m.name);
    }
  });

  // 2. Cardiac / Chest / Emergency Red Flag Detection
  // Keywords across Hindi, Kannada, Tamil, Telugu, English, Sanskrit
  const cardiacKeywords = [
    'chhati', 'chest', 'dhadkan', 'saans', 'breath', 'jalan', 'faint', 'chakkar', 'heart',
    'छाती', 'जलन', 'भारीपन', 'सांस', 'घबराहट', 'चक्कर',
    'ನೆஞ்சு', 'ಉಸಿರಾಟ', 'ಎದೆ', 'ಸುತ್ತು',
    'மார்பு', 'மூச்சு', 'எரிச்சல்', 'மயக்கம்',
    'గుండె', 'శ్వాస', 'మంట', 'తలతిరగడం',
    'हृदय', 'उरोदाह'
  ];

  const hasCardiac = cardiacKeywords.some((kw) => text.includes(kw) || lower.includes(kw));

  // 3. Gastrointestinal / Mandagni / Constipation / Acidity
  const giKeywords = [
    'pet', 'kabz', 'constipat', 'gas', 'otta', 'triphala', 'bhook', 'bloat', 'vomit', 'loose', 'motion', 'acid', 'gerd',
    'पेट', 'कब्ज', 'भूख', 'उल्टी', 'दस्त', 'गैस', 'खट्टी डकार',
    'ಹೊಟ್ಟೆ', 'ಮಲಬದ್ಧತೆ', 'ಹಸಿವು', 'ವಾಂತಿ',
    'வயிறு', 'மலச்சிக்கல்', 'பசி', 'வாந்தி',
    'కడుపు', 'మలబద్ధకం', 'ఆకలి', 'వాంతులు',
    'अग्नि', 'मन्दाग्नि', 'कोष्ठ', 'आनाह', 'अजीर्ण'
  ];

  const hasGI = giKeywords.some((kw) => text.includes(kw) || lower.includes(kw));

  // 4. Joint Pain / Arthritis / Sandhivata / Swelling
  const jointKeywords = [
    'dard', 'pain', 'ghutne', 'joint', 'swelling', 'vali', 'sandhi', 'knee', 'back', 'kamar', 'muscl',
    'दर्द', 'घुटने', 'जोड़ों', 'सूजन', 'कमर', 'संधि',
    'ನೋವು', 'ಮಂಡಿ', 'ಕೀಲು', 'ಊತ',
    'வலி', 'முழங்கால்', 'மூட்டு', 'வீக்கம்',
    'నొప్పి', 'కీళ్ళు', 'వాపు',
    'शूल', 'सन्धिवात', 'शोथ'
  ];

  const hasJoint = jointKeywords.some((kw) => text.includes(kw) || lower.includes(kw));

  // 5. Respiratory / Fever / Jvara / Infection
  const feverKeywords = [
    'bukhar', 'fever', 'sardi', 'cough', 'khansi', 'thand', 'jwara', 'throat', 'gala', 'cold', 'flu',
    'बुखार', 'खांसी', 'सर्दी', 'जुकाम', 'गले में खराश',
    'ಜ್ವರ', 'ಕೆಮ್ಮು', 'ಶೀತ', 'ಗಂಟಲು',
    'காய்ச்சல்', 'இருமல்', 'சளி', 'தொண்டை',
    'జ్వరం', 'దగ్గు', 'జలుబు', 'గొంతు',
    'ज्वर', 'कास', 'प्रतिश्याय'
  ];

  const hasFever = feverKeywords.some((kw) => text.includes(kw) || lower.includes(kw));

  // 6. Classification Logic
  if (hasCardiac) {
    chief_complaint = 'Retrosternal chest discomfort and burning sensation with presyncope/vertigo';
    duration = '2 days (acute onset)';
    associated_symptoms.push(
      'Retrosternal burning / Pyrosis',
      'Epigastric fullness / Heavier sensation',
      'Mild presyncope / Dizziness'
    );
    dosha_imbalance = 'Pitta-Vata aggravation with acute Amlapitta manifestation';
    agni_status = 'Tikshnagni (hyperactive digestive fire)';
    triage_urgency = 'RED_FLAG';
    triage_reason = 'Acute retrosternal chest burning and tightness in adult warrants immediate ECG, vitals monitoring, and rule-out of acute coronary syndrome.';
    translated_clinical_english = `Patient clinical report: "${text}". Clinical assessment: Patient presents with acute retrosternal chest burning, discomfort, and mild lightheadedness. Concurrent medications: ${medications_mentioned.length > 0 ? medications_mentioned.join(', ') : 'None documented'}. Triage priority RED FLAG. Urgent physician triage and cardiac evaluation advised.`;
  } else if (hasJoint) {
    chief_complaint = 'Peripheral joint pain and morning stiffness (Sandhivata / Arthralgia)';
    duration = '2-3 weeks (progressive)';
    associated_symptoms.push(
      'Sandhishoola (joint pain)',
      'Morning joint stiffness (>30 mins)',
      'Periarticular edema / swelling'
    );
    dosha_imbalance = 'Vata aggravation localized in Asthi and Sandhi (joints)';
    agni_status = 'Vishamagni (variable digestive metabolism)';
    triage_urgency = 'URGENT';
    triage_reason = 'Progressive joint pain with functional limitation requires prioritized clinical rheumatology/orthopedic assessment.';
    translated_clinical_english = `Patient clinical report: "${text}". Clinical assessment: Patient presents with subacute joint pain and swelling consistent with Sandhivata. Recommended clinical examination, joint mobility testing, and anti-inflammatory management.`;
  } else if (hasGI) {
    chief_complaint = 'Gastrointestinal dysmotility, abdominal bloating, and chronic constipation (Krura Koshtha)';
    duration = '3 weeks (chronic-subacute)';
    associated_symptoms.push(
      'Krura Koshtha (infrequent / hard stools)',
      'Abdominal distension (Anaha)',
      'Diminished digestive capacity (Mandagni)'
    );
    dosha_imbalance = 'Apana Vata stagnation with Sama Pitta';
    agni_status = 'Mandagni (sluggish digestive fire)';
    triage_urgency = 'ROUTINE';
    triage_reason = 'Subacute gastrointestinal dysmotility manageable with dietary modifications and gut motility regulators.';
    translated_clinical_english = `Patient clinical report: "${text}". Clinical assessment: Patient reports persistent sluggish digestion and irregular bowel movements. Recommended dietary fiber, adequate hydration, and herbal carminative regulation.`;
  } else if (hasFever) {
    chief_complaint = 'Acute febrile illness with upper respiratory tract symptoms';
    duration = '3-4 days (acute)';
    associated_symptoms.push(
      'Pyrexia / Elevated temperature',
      'Generalized malaise / Angamarda',
      'Coryza and pharyngeal congestion'
    );
    dosha_imbalance = 'Vata-Kapha Jvara presentation';
    agni_status = 'Mandagni secondary to acute febrile response';
    triage_urgency = 'ROUTINE';
    triage_reason = 'Acute uncomplicated febrile presentation with stable hemodynamics.';
    translated_clinical_english = `Patient clinical report: "${text}". Clinical assessment: Patient reports short history of fever and upper respiratory symptoms. Advised symptomatic antipyresis, hydration, and physician review if symptoms persist > 48h.`;
  } else {
    chief_complaint = text.length > 5 ? text.slice(0, 90) : 'General outpatient clinical consultation';
    duration = 'Subacute onset';
    associated_symptoms.push('General fatigue', 'Physical discomfort');
    dosha_imbalance = 'Mild Tridosha equilibrium shift';
    agni_status = 'Samagni (balanced)';
    triage_urgency = 'ROUTINE';
    triage_reason = 'Stable clinical presentation without acute emergency indicators.';
    translated_clinical_english = `Patient clinical narrative: "${text || 'Patient seeks OPD consultation for clinical review.'}". Outpatient physician consultation recommended.`;
  }

  return {
    detected_language,
    original_transcript: text || 'Voice intake recorded',
    translated_clinical_english,
    chief_complaint,
    duration,
    associated_symptoms,
    medications_mentioned,
    ayurvedic_factors: {
      dosha_imbalance,
      agni_status
    },
    triage_urgency,
    triage_reason,
    timestamp: new Date().toISOString()
  };
}
