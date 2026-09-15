/**
 * PreConsult AYUSETU — Clinical HPI (History of Present Illness) Intelligence Service
 * 
 * Implements the standard medical OLD CARTS / OPQRST clinical history model
 * combined with Ayurvedic Upashaya (relieving) / Anupashaya (aggravating) parameters.
 * 
 * Features:
 * 1. Multilingual parsing & gap detection from patient narrative
 * 2. Dynamic adaptive follow-up question & quick-chip generator
 * 3. HPI Completeness Scoring (0-100%)
 * 4. Structured Chronological HPI Narrative Synthesizer for Doctor SOAP Notes
 */

// ── OLD CARTS & OPQRST Parameter Definitions ──────────────────────────────
export const HPI_FIELDS = [
  { id: 'onset', label: 'Onset (When & How)', weight: 15, key: 'onset' },
  { id: 'location', label: 'Location & Radiation', weight: 15, key: 'location' },
  { id: 'duration', label: 'Duration & Frequency', weight: 15, key: 'duration' },
  { id: 'character', label: 'Character / Quality of Pain', weight: 15, key: 'character' },
  { id: 'aggravating', label: 'Aggravating Factors (Anupashaya)', weight: 10, key: 'aggravating_factors' },
  { id: 'relieving', label: 'Relieving Factors (Upashaya)', weight: 10, key: 'relieving_factors' },
  { id: 'timing', label: 'Timing & Diurnal Pattern', weight: 10, key: 'timing' },
  { id: 'severity', label: 'Severity Scale (1-10)', weight: 10, key: 'severity_score' }
];

// ── Symptom Category Presets for Adaptive Branching ─────────────────────────
export const SYMPTOM_CATEGORY_PROMPTS = {
  cardiac_chest: {
    category: 'Chest Pain / Cardiac / Respiratory',
    keywords: ['chest', 'chhati', 'jalan', 'heavy', 'dhadkan', 'heart', 'छाती', 'भारीपन', 'நெஞ்சு', 'ಎದೆ', 'గుండె'],
    characterOptions: [
      { id: 'burning', en: 'Burning / Acid Reflux', hi: 'जलन / एसिडिटी', kn: 'ಉರಿ / ಎದೆಯುರಿ', ta: 'எரிச்சல்' },
      { id: 'heavy_pressure', en: 'Heavy Crushing Pressure', hi: 'भारी दबाव / कसाव', kn: 'ಭಾರವಾದ ಒತ್ತಡ', ta: 'அழுத்தம்' },
      { id: 'sharp_stabbing', en: 'Sharp Stabbing Pain', hi: 'तेज़ चुभने वाला दर्द', kn: 'ತೀಕ್ಷ್ಣವಾದ ಚುಚ್ಚುವ ನೋವು', ta: 'குத்தும் வலி' },
      { id: 'dull_ache', en: 'Dull Aching', hi: 'हल्का धीमा दर्द', kn: 'ಮಂದ ನೋವು', ta: 'மந்தமான வலி' }
    ],
    radiationOptions: [
      { id: 'left_arm', en: 'Radiates to Left Arm / Shoulder', hi: 'बाएं हाथ / कंधे में जाता है', kn: 'ಎಡಗೈ / ಭುಜಕ್ಕೆ ಹರಡುತ್ತದೆ' },
      { id: 'jaw_neck', en: 'Radiates to Jaw / Neck', hi: 'जबड़े / गर्दन तक फैलता है', kn: 'ದವಡೆ / ಕತ್ತಿಗೆ ಹರಡುತ್ತದೆ' },
      { id: 'back_scapula', en: 'Radiates to Upper Back', hi: 'पीठ के ऊपरी हिस्से में', kn: 'ಬೆನ್ನಿನ ಮೇಲ್ಭಾಗಕ್ಕೆ' },
      { id: 'localized', en: 'Localized / No Radiation', hi: 'एक ही जगह रहता है', kn: 'ಒಂದೇ ಜಾಗದಲ್ಲಿ ಇರುತ್ತದೆ' }
    ],
    aggravatingOptions: [
      { id: 'exertion', en: 'Physical Exertion / Walking', hi: 'चलने / मेहनत करने पर', kn: 'ನಡೆಯುವಾಗ / ಕೆಲಸ ಮಾಡುವಾಗ' },
      { id: 'spicy_food', en: 'Spicy / Oily Food (Vidahi Ahara)', hi: 'मसालेदार / तला खाना', kn: 'ಖಾರದ / ಎಣ್ಣೆಯುಕ್ತ ಊಟ' },
      { id: 'lying_flat', en: 'Lying Down Flat', hi: 'सीधे लेटने पर', kn: 'ಮಲಗಿದಾಗ' },
      { id: 'emotional_stress', en: 'Emotional Stress / Anger', hi: 'मानसिक तनाव / क्रोध', kn: 'ಮಾನಸಿಕ ಒತ್ತಡ' }
    ],
    relievingOptions: [
      { id: 'rest', en: 'Complete Rest', hi: 'आराम करने पर', kn: 'ವಿಶ್ರಾಂತಿಯಿಂದ' },
      { id: 'antacids', en: 'Antacids / Cold Milk (Shita Ahara)', hi: 'एंटासिड / ठंडा दूध', kn: 'ತಂಪು ಹಾಲು / ಔಷಧಿ' },
      { id: 'sitting_up', en: 'Sitting Up / Leaning Forward', hi: 'आगे झुककर बैठने पर', kn: 'ಮುಂದೆ ಬಾಗಿ ಕುಳಿತಾಗ' },
      { id: 'burping', en: 'Belching / Burping', hi: 'डकार आने के बाद', kn: 'ತೇಗು ಬಂದ ಮೇಲೆ' }
    ]
  },
  gi_acidity: {
    category: 'Gastrointestinal & Acidity (Amlapitta/Agni)',
    keywords: ['pet', 'stomach', 'gas', 'acid', 'constipat', 'loose', 'motion', 'pot', 'पोट', 'पेट', 'हೊಟ್ಟೆ', 'വയറ്'],
    characterOptions: [
      { id: 'sour_belch', en: 'Sour Eructations / Heartburn', hi: 'खट्टी डकारें / छाती में जलन', kn: 'ಹುಳಿ ತೇಗು / ಎದೆಯುರಿ' },
      { id: 'cramping', en: 'Cramping / Colicky Pain', hi: 'पेट में मरोड़ / ऐंठन', kn: 'ಹೊಟ್ಟೆ ತಿರುಚುವ ನೋವು' },
      { id: 'bloating', en: 'Severe Bloating / Heaviness (Anaha)', hi: 'पेट फूलना / भारीपन', kn: 'ಹೊಟ್ಟೆ ಉಬ್ಬರ' },
      { id: 'burning_epigastric', en: 'Epigastric Burning', hi: 'पेट के ऊपरी भाग में जलन', kn: 'ಹೊಟ್ಟೆಯ ಮೇಲ್ಭಾಗದಲ್ಲಿ ಉರಿ' }
    ],
    radiationOptions: [
      { id: 'epigastric_throat', en: 'Throat & Retrosternal area', hi: 'गले और छाती तक', kn: 'ಗಂಟಲು ಮತ್ತು ಎದೆಯವರೆಗೆ' },
      { id: 'lower_abdomen', en: 'Lower Abdomen / Groin', hi: 'निचले पेट की ओर', kn: 'ಕೆಳಹೊಟ್ಟೆಗೆ' },
      { id: 'diffuse', en: 'All Over Abdomen', hi: 'पूरे पेट में', kn: 'ಇಡೀ ಹೊಟ್ಟೆಯಲ್ಲಿ' },
      { id: 'none', en: 'Centered in Epigastrium', hi: 'नाभि के ऊपर ही', kn: 'ಹೊಕ್ಕುಳಿನ ಮೇಲ್ಭಾಗದಲ್ಲಿ' }
    ],
    aggravatingOptions: [
      { id: 'empty_stomach', en: 'Empty Stomach / Delayed Meals', hi: 'खाली पेट रहने पर', kn: 'ಖಾಲಿ ಹೊಟ್ಟೆಯಲ್ಲಿ' },
      { id: 'heavy_meals', en: 'Heavy / Late Night Dinner', hi: 'देर रात या भारी भोजन', kn: 'ರಾತ್ರಿ ತಡವಾಗಿ ಊಟ' },
      { id: 'sour_fermented', en: 'Sour / Fermented Foods', hi: 'खट्टा / किण्वित भोजन', kn: 'ಹುಳಿ / ಹಿಟ್ಟಿನ ಪದಾರ್ಥ' },
      { id: 'tea_coffee', en: 'Excess Tea / Coffee', hi: 'अधिक चाय / कॉफ़ी', kn: 'ಹೆಚ್ಚು ಚಹಾ / ಕಾಫಿ' }
    ],
    relievingOptions: [
      { id: 'warm_water', en: 'Warm Water / Herbal Decoction', hi: 'गुनगुना पानी / क्वाथ', kn: 'ಬಿಸಿ ನೀರು / ಕಷಾಯ' },
      { id: 'passing_gas', en: 'Passing Gas / Flatus', hi: 'गैस निकलने पर', kn: 'ಅಪಾನವಾಯು ವಿಸರ್ಜನೆ' },
      { id: 'bland_diet', en: 'Light Bland Food (Peya/Khichdi)', hi: 'हल्की मूंग दाल खिचड़ी', kn: 'ತೆಳು ಗಂಜಿ / ಲಘು ಆಹಾರ' },
      { id: 'antacids', en: 'Digestive Formulations / Triphala', hi: 'त्रिफला / अविपत्तिकर चूर्ण', kn: 'ತ್ರಿಫಲಾ ಚೂರ್ಣ' }
    ]
  },
  musculoskeletal_joint: {
    category: 'Joint & Musculoskeletal (Sandhivata)',
    keywords: ['joint', 'knee', 'pain', 'back', 'neck', 'swelling', 'dard', 'ghutna', 'दर्द', 'घुटने', 'ಸಂಧಿ', 'ಮೂಳೆ', 'வலி'],
    characterOptions: [
      { id: 'throbbing_ache', en: 'Deep Throbbing Ache', hi: 'भीतरी सुलगता दर्द', kn: 'ಒಳಭಾಗದ ಬಡಿತದ ನೋವು' },
      { id: 'stiffness', en: 'Morning Stiffness (>30 mins)', hi: 'सुबह उठने पर जकड़न', kn: 'ಬೆಳಗಿನ ಜಡತ್ವ / ಬಿಗಿತ' },
      { id: 'grating_crepitus', en: 'Grating / Clicking Sound (Sandhisphutana)', hi: 'जोड़ों में कड़कड़ाहट', kn: 'ಕೀಲುಗಳಲ್ಲಿ ಶಬ್ದ' },
      { id: 'swelling_burning', en: 'Hot Swollen Joint (Vatarakta)', hi: 'जोड़ों में सूजन व गर्माहट', kn: 'ಕೀಲು ಊತ ಮತ್ತು ಬಿಸಿ' }
    ],
    radiationOptions: [
      { id: 'down_leg', en: 'Radiates Down Leg / Sciatica (Gridhrasi)', hi: 'कूल्हे से पैर के नीचे तक', kn: 'ಸೊಂಟದಿಂದ ಕಾಲಿನವರೆಗೆ' },
      { id: 'both_knees', en: 'Bilateral Knees / Symmetrical', hi: 'दोनों घुटनों में बराबर', kn: 'ಎರಡೂ ಮೊಣಕಾಲುಗಳಲ್ಲಿ' },
      { id: 'neck_to_arm', en: 'Neck Radiating to Arm / Fingers', hi: 'गर्दन से हाथ की उंगलियों तक', kn: 'ಕತ್ತಿನಿಂದ ಬೆರಳುಗಳವರೆಗೆ' },
      { id: 'single_joint', en: 'Confined to Single Joint', hi: 'सिर्फ एक ही जोड़ में', kn: 'ಒಂದೇ ಕೀಲಿನಲ್ಲಿ' }
    ],
    aggravatingOptions: [
      { id: 'climbing_stairs', en: 'Climbing Stairs / Squatting', hi: 'सीढ़ियां चढ़ना / उकड़ू बैठना', kn: 'ಮೆಟ್ಟಿಲು ಹತ್ತುವಾಗ' },
      { id: 'cold_weather', en: 'Cold & Rainy Weather (Sheetakala)', hi: 'ठंड और नमी का मौसम', kn: 'ಚಳಿಗಾಲ / ತಂಪು ಹವೆ' },
      { id: 'prolonged_standing', en: 'Prolonged Standing / Walking', hi: 'लंबे समय तक खड़े रहना', kn: 'ಹೆಚ್ಚು ಹೊತ್ತು ನಿಲ್ಲುವುದರಿಂದ' },
      { id: 'morning_wake', en: 'First Movements in Morning', hi: 'सुबह के पहले कदम', kn: 'ಬೆಳಗ್ಗೆ ಎದ್ದಾಗ' }
    ],
    relievingOptions: [
      { id: 'warm_fomentation', en: 'Warm Fomentation / Oil Massage (Snehana/Swedana)', hi: 'गर्म सेंक / तिल तेल मालिश', kn: 'ಬಿಸಿ ಶಾಖ / ಎಣ್ಣೆ ಮಸಾಜ್' },
      { id: 'rest_elevation', en: 'Resting with Leg Elevated', hi: 'पैर उठाकर आराम करना', kn: 'ಕಾಲು ಮೇಲೆತ್ತಿ ವಿಶ್ರಾಂತಿ' },
      { id: 'gentle_movement', en: 'Gentle Warm-Up Movements', hi: 'हल्की चहलकदमी के बाद', kn: 'ಮೆಲ್ಲನೆಯ ನಡಿಗೆಯಿಂದ' },
      { id: 'analgesics', en: 'Ayurvedic Lepa / Pain Balms', hi: 'दर्द निवारक लेप / बाम', kn: 'ನೋವು ನಿವಾರಕ ಲೇಪನ' }
    ]
  },
  general_fever: {
    category: 'Fever, Headache & General (Jwara/Shiroruk)',
    keywords: ['fever', 'headache', 'cold', 'cough', 'bukhar', 'thakawat', 'बुखार', 'सिरदर्द', 'ಜ್ವರ', 'തലവേദന', 'காய்ச்சல்'],
    characterOptions: [
      { id: 'pulsating_headache', en: 'Throbbing Pulsating Headache', hi: 'धड़कता हुआ सिरदर्द', kn: 'ಬಡಿಯುವ ತಲೆನೋವು' },
      { id: 'high_fever_chills', en: 'High Grade Fever with Chills (Shita Jwara)', hi: 'कम्पकपी के साथ तेज़ बुखार', kn: 'ಚಳಿಯೊಂದಿಗೆ ತೀವ್ರ ಜ್ವರ' },
      { id: 'generalized_myalgia', en: 'Severe Body Aches (Angamarda)', hi: 'अंगमर्द / पूरे शरीर में दर्द', kn: 'ಮೈ-ಕೈ ಕಡಿಯುವ ನೋವು' },
      { id: 'heaviness_lethargy', en: 'Head Heaviness & Lethargy (Gaurava)', hi: 'सिर में भारीपन और आलस्य', kn: 'ತಲೆ ಭಾರ ಮತ್ತು ನಿಶ್ಯಕ್ತಿ' }
    ],
    radiationOptions: [
      { id: 'forehead_temples', en: 'Forehead and Temples (Bilateral)', hi: 'माथे और दोनों कनपटी में', kn: 'ಹಣೆ ಮತ್ತು ಕಪೋಲಗಳಲ್ಲಿ' },
      { id: 'neck_back', en: 'Occipital Neck to Shoulders', hi: 'गर्दन के पीछे से कंधों तक', kn: 'ಕತ್ತಿನ ಹಿಂದಿನಿಂದ ಭುಜದವರೆಗೆ' },
      { id: 'retro_orbital', en: 'Behind the Eyes (Retro-orbital)', hi: 'आंखों के पीछे दर्द', kn: 'ಕಣ್ಣಿನ ಹಿಂಭಾಗದಲ್ಲಿ' },
      { id: 'generalized', en: 'All Over Body', hi: 'पूरे शरीर में', kn: 'ಸರ್ವಾಂಗದಲ್ಲಿ' }
    ],
    aggravatingOptions: [
      { id: 'bright_light_sound', en: 'Bright Light & Loud Noise', hi: 'तेज़ रोशनी और आवाज़', kn: 'ತೀಕ್ಷ್ಣ ಬೆಳಕು ಮತ್ತು ಶಬ್ದ' },
      { id: 'evening_time', en: 'Evening / Sunset Time', hi: 'शाम या रात के समय', kn: 'ಸಂಜೆ ಅಥವಾ ರಾತ್ರಿ ವೇಳೆ' },
      { id: 'coughing_bending', en: 'Coughing or Bending Forward', hi: 'खांसने या झुकने पर', kn: 'ಕೆಮ್ಮಿದಾಗ ಅಥವಾ ಬಾಗಿದಾಗ' },
      { id: 'cold_exposure', en: 'Exposure to Cold Wind / AC', hi: 'ठंडी हवा या एसी में', kn: 'ತಂಪು ಗಾಳಿ / ಎಸಿ' }
    ],
    relievingOptions: [
      { id: 'dark_quiet_room', en: 'Sleeping in Dark Quiet Room', hi: 'अंधेरे शांत कमरे में सोना', kn: 'ಕತ್ತಲೆ ಕೋಣೆಯಲ್ಲಿ ನಿದ್ರೆ' },
      { id: 'warm_herbal_tea', en: 'Ginger Tulsi Tea (Kwatha)', hi: 'अदरक-तुलसी का गरम काढ़ा', kn: 'ಶುಂಠಿ-ತುಳಸಿ ಕಷಾಯ' },
      { id: 'cold_forehead_cloth', en: 'Cool Cloth on Forehead', hi: 'माथे पर ठंडी पट्टी', kn: 'ಹಣೆ ಮೇಲೆ ತಣ್ಣನೆಯ ಪಟ್ಟಿ' },
      { id: 'paracetamol', en: 'Paracetamol / Antipyretic', hi: 'पैरासिटामोल की गोली', kn: 'ಪ್ಯಾರಸಿಟಮಾಲ್ ಮಾತ್ರೆ' }
    ]
  }
};

// ── Fallback General Category ───────────────────────────────────────────────
const GENERAL_CATEGORY = SYMPTOM_CATEGORY_PROMPTS.general_fever;

/**
 * Categorize chief complaint or transcript to adapt the HPI choices
 */
export function identifySymptomCategory(text = '') {
  const lower = (text || '').toLowerCase();
  for (const [catKey, catObj] of Object.entries(SYMPTOM_CATEGORY_PROMPTS)) {
    for (const kw of catObj.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        return { key: catKey, ...catObj };
      }
    }
  }
  return { key: 'general_fever', ...GENERAL_CATEGORY };
}

/**
 * Intelligent HPI Extraction & Gap Analysis from User Transcript/Inputs
 */
export function analyzeHpiCompleteness(transcript = '', existingHpi = {}, language = 'en') {
  const text = (transcript || '').trim();
  const lower = text.toLowerCase();
  const result = {
    onset: existingHpi.onset || '',
    location: existingHpi.location || '',
    duration: existingHpi.duration || '',
    character: existingHpi.character || '',
    aggravating_factors: existingHpi.aggravating_factors || '',
    relieving_factors: existingHpi.relieving_factors || '',
    timing: existingHpi.timing || '',
    severity_score: existingHpi.severity_score || null,
    functional_impact: existingHpi.functional_impact || '',
    missing_fields: [],
    detected_fields: [],
    completeness_score: 0,
    symptom_category: identifySymptomCategory(text)
  };

  // 1. Detect Duration & Onset
  if (!result.duration) {
    const durMatch = text.match(/(\d+)\s*(din|day|days|hafte|hafta|week|weeks|mahina|month|months|ghante|hour|hours|वार|ದಿನ|ವಾರ|ತಿಂಗಳು|நாட்கள்|வாரம்|రోజులు)/i);
    if (durMatch) {
      result.duration = durMatch[0];
      result.onset = `Started ${durMatch[0]} ago`;
    } else if (/aaj|today|subah|morning|kal|yesterday|ഇന്ന്|ಇಂದು|இன்று/i.test(lower)) {
      result.duration = 'Acute onset (<24 hours)';
      result.onset = 'Sudden onset today/yesterday';
    }
  }

  // 2. Detect Character
  if (!result.character) {
    if (/jalan|burning|acid|उरोदाह|जळजळ|ಉರಿ|எரிச்சல்|మంట/i.test(lower)) {
      result.character = 'Burning (Pyrosis / Vidahi)';
    } else if (/bhaar|heavy|pressure|वजन|भारीपन|ಭಾರ|அழுத்தம்/i.test(lower)) {
      result.character = 'Heaviness / Dull Pressure';
    } else if (/sharp|chubh|stabbing|तीखा|ಚುಚ್ಚುವ|குத்தும்/i.test(lower)) {
      result.character = 'Sharp / Stabbing';
    } else if (/dhadkan|throbbing|palpitation|ಬಡಿತ/i.test(lower)) {
      result.character = 'Pulsating / Throbbing';
    } else if (/stiff|jakdan|કડકાઈ|ಜಡತ್ವ|பிகਿਤ/i.test(lower)) {
      result.character = 'Stiffness & Restricted Motion';
    }
  }

  // 3. Detect Location
  if (!result.location) {
    if (/chhati|chest|hridaya|छाती|हृदय|ಎದೆ|மார்பு|గుండె/i.test(lower)) {
      result.location = 'Retrosternal Chest / Cardiac region';
    } else if (/pet|stomach|abdomen|udar|पोट|ಹೊಟ್ಟೆ|വയറ്|வயிறு|కడుపు/i.test(lower)) {
      result.location = 'Epigastric / Abdominal region';
    } else if (/ghutna|knee|joint|sandhi|घुटने|ಕೀಲು|ಮೊಣಕಾಲು|மூட்டு|కీಲು/i.test(lower)) {
      result.location = 'Bilateral Knee / Peripheral Joints';
    } else if (/sar|head|shiras|सिर|ತಲೆ|தலை|తల/i.test(lower)) {
      result.location = 'Bilateral Frontal / Temporal region';
    } else if (/kamar|back|spine|पीठ|ಸೊಂಟ|முதுகு|నడుము/i.test(lower)) {
      result.location = 'Lumbar / Lower Back Spine';
    }
  }

  // 4. Detect Aggravating Factors (Anupashaya)
  if (!result.aggravating_factors) {
    if (/khane ke baad|after food|spicy|tikha|मसाले|ಖಾರ|உணவுக்கு பின்/i.test(lower)) {
      result.aggravating_factors = 'Worse post-prandially with spicy/sour food';
    } else if (/chalne|walking|exertion|sidhi|सीढ़ियां|ನಡೆಯುವಾಗ|நடக்கும் போது/i.test(lower)) {
      result.aggravating_factors = 'Worse with physical exertion & walking';
    } else if (/thand|cold|sheet|ठंड|ಚಳಿ|குளிர்/i.test(lower)) {
      result.aggravating_factors = 'Worse with cold exposure / winter';
    }
  }

  // 5. Detect Relieving Factors (Upashaya)
  if (!result.relieving_factors) {
    if (/aram|rest|letne|विश्राम|ಆರಾಮ|ஓய்வு/i.test(lower)) {
      result.relieving_factors = 'Relieved by complete rest and lying down';
    } else if (/garm|warm|hot|दवा|दवाई|औषध|ಬಿಸಿ|மருந்து/i.test(lower)) {
      result.relieving_factors = 'Relieved by warm intake / prior medication';
    }
  }

  // 6. Calculate Completeness & Missing Fields
  let totalScore = 0;
  HPI_FIELDS.forEach((f) => {
    const val = result[f.key];
    if (val !== undefined && val !== null && String(val).trim().length > 0) {
      totalScore += f.weight;
      result.detected_fields.push(f.id);
    } else {
      result.missing_fields.push(f.id);
    }
  });

  result.completeness_score = Math.min(100, totalScore);

  return result;
}

/**
 * Generate localized interactive adaptive prompts for missing HPI fields
 */
export function generateAdaptiveHpiPrompts(missingFieldIds = [], symptomCatKey = 'general_fever', lang = 'en') {
  const cat = SYMPTOM_CATEGORY_PROMPTS[symptomCatKey] || GENERAL_CATEGORY;
  const prompts = [];

  const labels = {
    onset: {
      question: {
        en: 'When and how did this symptom start?',
        hi: 'यह समस्या कब और कैसे शुरू हुई?',
        kn: 'ಈ ಸಮಸ್ಯೆ ಯಾವಾಗ ಮತ್ತು ಹೇಗೆ ಪ್ರಾರಂಭವಾಯಿತು?',
        ta: 'இந்த பிரச்சனை எப்போது எப்படி தொடங்கியது?'
      },
      chips: [
        { id: 'acute_sudden', label: 'Suddenly today', hi: 'आज अचानक', kn: 'ಇಂದು ಇದ್ದಕ್ಕಿದ್ದಂತೆ' },
        { id: '2_3_days', label: '2-3 days ago', hi: '2-3 दिन पहले', kn: '2-3 ದಿನಗಳ ಹಿಂದೆ' },
        { id: 'weeks_gradual', label: '1-2 weeks gradually', hi: '1-2 हफ्ते से धीरे-धीरे', kn: '1-2 ವಾರಗಳಿಂದ ನಿಧಾನವಾಗಿ' },
        { id: 'chronic_months', label: 'Months ago', hi: 'काफी महीनों से', kn: 'ಹಲವು ತಿಂಗಳುಗಳಿಂದ' }
      ]
    },
    character: {
      question: {
        en: 'How would you describe the feeling or pain?',
        hi: 'दर्द या असहजता किस प्रकार की महसूस होती है?',
        kn: 'ನೋವು ಅಥವಾ ಅನುಭವ ಯಾವ ರೀತಿ ಇದೆ?',
        ta: 'வலி அல்லது உணர்வு எப்படி இருக்கிறது?'
      },
      chips: (cat.characterOptions || []).map(opt => ({
        id: opt.id,
        label: opt[lang] || opt.en,
        hi: opt.hi,
        kn: opt.kn
      }))
    },
    location: {
      question: {
        en: 'Does the discomfort spread or radiate anywhere else?',
        hi: 'क्या यह दर्द या भारीपन कहीं और फैलता है?',
        kn: 'ಈ ನೋವು ಬೇರೆಲ್ಲಿಯಾದರೂ ಹರಡುತ್ತದೆಯೇ?',
        ta: 'இந்த வலி வேறு எங்காவது பரவுகிறதா?'
      },
      chips: (cat.radiationOptions || []).map(opt => ({
        id: opt.id,
        label: opt[lang] || opt.en,
        hi: opt.hi,
        kn: opt.kn
      }))
    },
    aggravating: {
      question: {
        en: 'What makes the condition worse? (Anupashaya)',
        hi: 'किस चीज़ से समस्या बढ़ जाती है? (अनुपशय)',
        kn: 'ಯಾವ ಕಾರಣದಿಂದ ಸಮಸ್ಯೆ ಉಲ್ಬಣಿಸುತ್ತದೆ?',
        ta: 'எதனால் பிரச்சனை அதிகமாகிறது?'
      },
      chips: (cat.aggravatingOptions || []).map(opt => ({
        id: opt.id,
        label: opt[lang] || opt.en,
        hi: opt.hi,
        kn: opt.kn
      }))
    },
    relieving: {
      question: {
        en: 'What makes you feel better or gives relief? (Upashaya)',
        hi: 'किस चीज़ से आपको आराम या राहत मिलती है? (उपशय)',
        kn: 'ಯಾವುದರಿಂದ ನಿಮಗೆ ಆರಾಮ ಅಥವಾ ಶಮನ ಸಿಗುತ್ತದೆ?',
        ta: 'எதனால் உங்களுக்கு நிவாரணம் கிடைக்கிறது?'
      },
      chips: (cat.relievingOptions || []).map(opt => ({
        id: opt.id,
        label: opt[lang] || opt.en,
        hi: opt.hi,
        kn: opt.kn
      }))
    },
    severity: {
      question: {
        en: 'Rate symptom severity from 1 (Mild) to 10 (Excruciating):',
        hi: 'तकलीफ की गंभीरता 1 (हल्की) से 10 (अत्यधिक) में चुनें:',
        kn: 'ತೀವ್ರತೆಯನ್ನು 1 (ಲಘು) ರಿಂದ 10 (ಅತೀವ) ವರೆಗೆ ಆರಿಸಿ:',
        ta: 'தீவிரத்தை 1 முதல் 10 வரை தேர்வு செய்யவும்:'
      },
      chips: [
        { id: 'sev_mild', score: 3, label: 'Mild (1-3)', hi: 'हल्की (1-3)', kn: 'ಲಘು (1-3)' },
        { id: 'sev_mod', score: 5, label: 'Moderate (4-6)', hi: 'मध्यम (4-6)', kn: 'ಮಧ್ಯಮ (4-6)' },
        { id: 'sev_severe', score: 8, label: 'Severe (7-8)', hi: 'गंभीर (7-8)', kn: 'ತೀವ್ರ (7-8)' },
        { id: 'sev_critical', score: 10, label: 'Excruciating (9-10)', hi: 'असहनीय (9-10)', kn: 'ಅಸಹನೀಯ (9-10)' }
      ]
    },
    timing: {
      question: {
        en: 'When during the day is it most troublesome?',
        hi: 'दिन के किस समय यह सबसे ज़्यादा परेशान करता है?',
        kn: 'ದಿನದ ಯಾವ ಸಮಯದಲ್ಲಿ ಹೆಚ್ಚು ತೊಂದರೆಯಾಗುತ್ತದೆ?',
        ta: 'நாளின் எந்த நேரத்தில் அதிகம் தொந்தರவு செய்கிறது?'
      },
      chips: [
        { id: 'morning_wake', label: 'Early Morning (Pratahkala)', hi: 'सुबह उठते ही', kn: 'ಮುಂಜಾನೆ ಎದ್ದಾಗ' },
        { id: 'post_meal', label: 'After Meals (Aharottara)', hi: 'खाना खाने के बाद', kn: 'ಊಟವಾದ ನಂತರ' },
        { id: 'night_sleep', label: 'Night / In Bed (Ratrikala)', hi: 'रात को सोते समय', kn: 'ರಾತ್ರಿ ಮಲಗುವಾಗ' },
        { id: 'constant', label: 'Continuous all day', hi: 'दिनभर लगातार', kn: 'ದಿನವಿಡೀ ಸತತವಾಗಿ' }
      ]
    }
  };

  missingFieldIds.forEach((fieldId) => {
    if (labels[fieldId]) {
      const fieldMeta = HPI_FIELDS.find(f => f.id === fieldId);
      prompts.push({
        id: fieldId,
        title: fieldMeta ? fieldMeta.label : fieldId,
        question: labels[fieldId].question[lang] || labels[fieldId].question.en,
        chips: labels[fieldId].chips
      });
    }
  });

  return prompts;
}

/**
 * Synthesizes a formal chronological HPI paragraph for the Doctor's SOAP note
 */
export function synthesizeHpiNarrative(hpiData = {}, patientInfo = {}) {
  const parts = [];

  const name = patientInfo?.name || 'Patient';
  const age = patientInfo?.age ? `${patientInfo.age}-year-old` : 'Adult';
  const gender = patientInfo?.gender ? patientInfo.gender.toLowerCase() : 'patient';

  // 1. Opening Statement with Onset & Duration
  let onsetClause = 'presents with complaints';
  if (hpiData.duration) {
    onsetClause = `presents with a ${hpiData.duration} history of complaints`;
  }
  if (hpiData.onset && !hpiData.duration) {
    onsetClause = `presents with symptoms that ${hpiData.onset.toLowerCase()}`;
  }

  // 2. Character & Location
  let charLoc = '';
  if (hpiData.character && hpiData.location) {
    charLoc = `characterized by ${hpiData.character} localized in the ${hpiData.location}`;
  } else if (hpiData.character) {
    charLoc = `characterized by ${hpiData.character}`;
  } else if (hpiData.location) {
    charLoc = `located in the ${hpiData.location}`;
  }

  parts.push(`${name}, a ${age} ${gender}, ${onsetClause}${charLoc ? ` ${charLoc}` : ''}.`);

  // 3. Radiation & Timing
  if (hpiData.location && hpiData.location.includes('Radiates')) {
    parts.push(`Symptoms demonstrate radiation: ${hpiData.location}.`);
  }
  if (hpiData.timing) {
    parts.push(`Diurnal pattern: ${hpiData.timing}.`);
  }

  // 4. Aggravating & Relieving Factors (Upashaya / Anupashaya)
  const factors = [];
  if (hpiData.aggravating_factors) {
    factors.push(`aggravated by ${hpiData.aggravating_factors} (Anupashaya)`);
  }
  if (hpiData.relieving_factors) {
    factors.push(`alleviated by ${hpiData.relieving_factors} (Upashaya)`);
  }
  if (factors.length > 0) {
    parts.push(`Symptoms are noted to be ${factors.join(' and ')}.`);
  }

  // 5. Severity & Functional Impact
  if (hpiData.severity_score) {
    const sevText = typeof hpiData.severity_score === 'number'
      ? `${hpiData.severity_score}/10 on VAS pain scale`
      : `${hpiData.severity_score}`;
    parts.push(`Severity is rated as ${sevText}${hpiData.functional_impact ? ` causing ${hpiData.functional_impact}` : ''}.`);
  }

  return parts.join(' ');
}
