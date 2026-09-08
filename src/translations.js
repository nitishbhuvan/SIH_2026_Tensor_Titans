/**
 * PreConsult Localization & Translation Dictionary
 * Languages: English (en), Hindi (hi), Kannada (kn), Tamil (ta), Telugu (te), Malayalam (ml)
 * + Voice intake language dictionary (hi, kn, ta, te, mr, bn, en, sa)
 */

export const SUPPORTED_LANGUAGES = [
  {
    id: 'en',
    label: 'English',
    nativeLabel: 'English',
    glyph: 'En',
    subtitle: 'Default'
  },
  {
    id: 'hi',
    label: 'Hindi',
    nativeLabel: 'हिन्दी',
    glyph: 'अ',
    subtitle: 'Hindi'
  },
  {
    id: 'kn',
    label: 'Kannada',
    nativeLabel: 'ಕನ್ನಡ',
    glyph: 'ಅ',
    subtitle: 'Kannada'
  },
  {
    id: 'ta',
    label: 'Tamil',
    nativeLabel: 'தமிழ்',
    glyph: 'அ',
    subtitle: 'Tamil'
  },
  {
    id: 'te',
    label: 'Telugu',
    nativeLabel: 'తెలుగు',
    glyph: 'ಅ',
    subtitle: 'Telugu'
  },
  {
    id: 'ml',
    label: 'Malayalam',
    nativeLabel: 'മലയാളം',
    glyph: 'അ',
    subtitle: 'Malayalam'
  }
];

export const VOICE_LANGUAGES = [
  { id: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', glyph: 'अ' },
  { id: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', glyph: 'ಅ' },
  { id: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', glyph: 'அ' },
  { id: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', glyph: 'అ' },
  { id: 'mr', label: 'Marathi', nativeLabel: 'मराठी', glyph: 'म' },
  { id: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', glyph: 'ব' },
  { id: 'sa', label: 'Sanskrit / AYUSH', nativeLabel: 'संस्कृतम्', glyph: 'ॐ' },
  { id: 'en', label: 'English', nativeLabel: 'English', glyph: 'En' }
];

export const translations = {
  en: {
    // Step 1: Language modal
    langModalTitle: 'Choose Your Language',
    langModalSubtitle: 'Select your preferred language for consultations',
    step1Pill: '1. Language',
    step2Pill: '2. Mode',

    // Step 2: Mode modal
    modeModalTitle: 'Welcome to PreConsult',
    modeModalSubtitle: 'Please select your preferred viewing mode',
    elderlyLabel: 'Elderly',
    elderlyTagline: 'Senior & High Contrast',
    modernLabel: 'Modern',
    modernTagline: 'Standard Interactive',
    backBtn: '← Back',
    continueBtn: 'Continue',

    // Navbar
    switchMode: 'Switch Mode',
    switchLang: 'Language',
    elderlyModeTag: 'Elderly Mode',
    modernModeTag: 'Modern Mode',

    // Hero
    heroTitleElderly: 'Welcome to PreConsult',
    heroSubElderly: 'Doctor consultations made simple, comfortable, and easy to understand for everyone.',
    heroTitleModern: 'Smart Healthcare Pre-Consultation',
    heroSubModern: 'Empowering seamless pre-consultation diagnostics, scheduling, and patient history aggregation.',
    heroVoiceCta: 'Speak Symptoms (Voice Intake)',

    // Voice Intake Component
    voiceIntakeTitle: 'Multilingual Clinical Voice Intake',
    voiceIntakeSubtitle: 'Speak naturally in your native language. Our clinical pipeline preserves medical & Ayurvedic formulations for the physician.',
    voiceIntakeElderlyPrompt: 'Tap the big microphone and tell us what problems you are facing',
    voiceSelectLang: 'Patient Spoken Language:',
    voiceStatusIdle: 'Ready to Record',
    voiceStatusRecording: 'Listening… Speak your symptoms now',
    voiceStatusTranscribing: 'Indic ASR Transcribing (Whisper v3)…',
    voiceStatusAnalyzing: 'Clinical Entity & Ayurvedic Term Extraction (Llama 3.1)…',
    voiceStatusComplete: 'Clinical SOAP Note Ready',
    voiceStartRecording: 'Tap to Speak',
    voiceStopRecording: 'Tap to Stop',
    voicePresetLabel: 'Quick Clinical Test Scenarios:',
    voiceTabClinical: 'Physician Clinical Note (SOAP / English)',
    voiceTabOriginal: 'Original Patient Voice Transcript',
    voiceChiefComplaint: 'Chief Complaint',
    voiceDuration: 'Duration',
    voiceAssociatedSymptoms: 'Associated Symptoms',
    voiceMedications: 'Medications Mentioned',
    voiceAyurvedicFactors: 'Ayurvedic & AYUSH Factors',
    voiceDosha: 'Dosha Imbalance',
    voiceAgni: 'Agni (Digestive Fire) Status',
    voiceTriageLabel: 'Triage Classification',
    voiceCopySlip: 'Copy Note',
    voicePrintSlip: 'Print Intake Slip',
    voiceSpeakAloud: 'Read Aloud',
    voiceNewIntake: 'New Voice Intake',
    voiceApiKeyLabel: 'API Key Configuration',

    // Mic Permission Modal
    micPermModalTitle: 'Microphone Permission Needed',
    micPermModalSubtitle: 'PreConsult needs access to your microphone so you can speak your symptoms naturally.',
    micPermStep1: 'Click "Allow Microphone" below to request browser access.',
    micPermStep2: 'When your browser shows a popup at the top/address bar, click "Allow".',
    micPermStep3: 'Speak clearly into your microphone after permission is granted.',
    micPermAllowBtn: 'Allow Microphone & Speak',
    micPermCancelBtn: 'Cancel',
    micPermPresetBtn: 'Use Test Presets Instead',
    micPermBlockedTitle: 'Microphone Access Was Blocked',
    micPermBlockedHelp: 'Your browser is currently blocking microphone access. Click the lock/mic icon in the browser address bar, set Microphone to "Allow", and try again.',

    // Action Cards
    cardDoctorTitle: 'Find a Doctor',
    cardDoctorDescElderly: 'Connect with verified specialists near you with simple 1-click booking.',
    cardDoctorDescModern: 'Search by specialty, location, availability, and user reviews.',
    cardDoctorBtnElderly: 'Book Doctor',
    cardDoctorBtnModern: 'Find Specialists',

    cardRecordsTitle: 'Health Records',
    cardRecordsDescElderly: 'View your prescriptions, tests, and medical history in large, clear format.',
    cardRecordsDescModern: 'Encrypted storage for lab reports, previous vitals, and longitudinal insights.',
    cardRecordsBtnElderly: 'View Records',
    cardRecordsBtnModern: 'Manage Records',

    cardEmergencyTitle: 'Emergency Help',
    cardEmergencyDescElderly: 'Instant access to emergency helpline, ambulance, and hospital support.',
    cardEmergencyDescModern: 'Direct link to rapid emergency response teams and nearest trauma centers.',
    cardEmergencyBtnElderly: 'Call Helpline (108)',
    cardEmergencyBtnModern: 'Emergency Response',

    // Footer
    footerTagline: 'PreConsult • Tensor Titans. Accessibility First Design.'
  },

  hi: {
    // Step 1: Language modal
    langModalTitle: 'अपनी भाषा चुनें',
    langModalSubtitle: 'स्वास्थ्य परामर्श के लिए अपनी पसंदीदा भाषा चुनें',
    step1Pill: '1. भाषा',
    step2Pill: '2. मोड',

    // Step 2: Mode modal
    modeModalTitle: 'प्री-कंसल्ट में आपका स्वागत है',
    modeModalSubtitle: 'कृपया अपना पसंदीदा व्यू मोड चुनें',
    elderlyLabel: 'वरिष्ठ (Elderly)',
    elderlyTagline: 'बड़े अक्षर और आसान दृश्य',
    modernLabel: 'आधुनिक (Modern)',
    modernTagline: 'मानक इंटरैक्टिव लेआउट',
    backBtn: '← भाषा बदलें',
    continueBtn: 'आगे बढ़ें',

    // Navbar
    switchMode: 'मोड बदलें',
    switchLang: 'भाषा',
    elderlyModeTag: 'वरिष्ठ मोड',
    modernModeTag: 'आधुनिक मोड',

    // Hero
    heroTitleElderly: 'प्री-कंसल्ट में आपका स्वागत है',
    heroSubElderly: 'डॉक्टर परामर्श को सभी के लिए सरल, आरामदायक और समझने में आसान बनाया गया है।',
    heroTitleModern: 'स्मार्ट हेल्थकेयर प्री-कंसल्टेशन',
    heroSubModern: 'सहज प्री-कंसल्टेशन डायग्नोस्टिक्स, शेड्यूलिंग और स्वास्थ्य इतिहास एकत्रीकरण।',
    heroVoiceCta: 'आवाज से लक्षण बताएं (Voice Intake)',

    // Voice Intake Component
    voiceIntakeTitle: 'बहुभाषी क्लिनिकल वॉयस इनटेक (निदान AI)',
    voiceIntakeSubtitle: 'अपनी भाषा में खुलकर बोलें। हमारा सिस्टम आयुर्वेदिक व एलोपैथिक शब्दों को डॉक्टर के लिए सुरक्षित रखता है।',
    voiceIntakeElderlyPrompt: 'माइक का बटन दबाएं और बताएं आपको क्या तकलीफ है',
    voiceSelectLang: 'मरीज की बोलने की भाषा:',
    voiceStatusIdle: 'बोलने के लिए तैयार',
    voiceStatusRecording: 'सुन रहे हैं… कृपया अपने लक्षण बताएं',
    voiceStatusTranscribing: 'आवाज से टेक्स्ट बन रहा है (Whisper v3)…',
    voiceStatusAnalyzing: 'क्लिनिकल व आयुर्वेदिक जांच जारी (Llama 3.1)…',
    voiceStatusComplete: 'डॉक्टर के लिए क्लिनिकल रिपोर्ट तैयार है',
    voiceStartRecording: 'बोलने के लिए दबाएं',
    voiceStopRecording: 'रोकने के लिए दबाएं',
    voicePresetLabel: 'त्वरित क्लिनिकल टेस्ट नमूने:',
    voiceTabClinical: 'डॉक्टर की क्लिनिकल रिपोर्ट (English)',
    voiceTabOriginal: 'मरीज की मूल आवाज का ट्रांसक्रिप्ट',
    voiceChiefComplaint: 'मुख्य समस्या (Chief Complaint)',
    voiceDuration: 'अवधि (Duration)',
    voiceAssociatedSymptoms: 'संबंधित लक्षण',
    voiceMedications: 'दवाइयां (Medications)',
    voiceAyurvedicFactors: 'आयुर्वेदिक व आयुष कारक',
    voiceDosha: 'दोष स्थिति (Dosha Imbalance)',
    voiceAgni: 'अग्नि स्थिति (Digestive Fire)',
    voiceTriageLabel: 'ट्राइएज गंभीरता (Triage)',
    voiceCopySlip: 'कॉपी करें',
    voicePrintSlip: 'पर्ची प्रिंट करें',
    voiceSpeakAloud: 'सुनें (Read Aloud)',
    voiceNewIntake: 'नई वॉयस जांच',
    voiceApiKeyLabel: 'API कुंजी सेटिंग्स',

    // Mic Permission Modal
    micPermModalTitle: 'माइक्रोफ़ोन अनुमति आवश्यक है',
    micPermModalSubtitle: 'प्री-कंसल्ट को आपकी आवाज़ सुनने के लिए माइक्रोफ़ोन की अनुमति चाहिए।',
    micPermStep1: 'नीचे "अनुमति दें" बटन पर क्लिक करें।',
    micPermStep2: 'ब्राउज़र में ऊपर आने वाले पॉप-अप में "Allow" या "अनुमति दें" चुनें।',
    micPermStep3: 'माइक चालू होते ही अपने लक्षण साफ आवाज़ में बताएं।',
    micPermAllowBtn: 'अनुमति दें और बोलें',
    micPermCancelBtn: 'रद्द करें',
    micPermPresetBtn: 'टेस्ट नमूने इस्तेमाल करें',
    micPermBlockedTitle: 'माइक्रोफ़ोन अनुमति अवरुद्ध है',
    micPermBlockedHelp: 'ब्राउज़र ने माइक को ब्लॉक किया है। एड्रेस बार में लॉक (🔒) या माइक आइकन पर क्लिक करके अनुमति चालू करें।',

    // Action Cards
    cardDoctorTitle: 'डॉक्टर खोजें',
    cardDoctorDescElderly: 'आसान 1-क्लिक बुकिंग के साथ अपने नजदीकी विशेषज्ञ डॉक्टर से जुड़ें।',
    cardDoctorDescModern: 'विशेषज्ञता, स्थान, उपलब्धता और समीक्षाओं के आधार पर खोजें।',
    cardDoctorBtnElderly: 'डॉक्टर चुनें',
    cardDoctorBtnModern: 'विशेषज्ञ खोजें',

    cardRecordsTitle: 'स्वास्थ्य रिपोर्ट',
    cardRecordsDescElderly: 'अपने नुस्खे, टेस्ट और मेडिकल इतिहास को बड़े, स्पष्ट रूप में देखें।',
    cardRecordsDescModern: 'लैब रिपोर्ट और पिछले मेडिकल इतिहास के लिए सुरक्षित स्टोरेज।',
    cardRecordsBtnElderly: 'रिपोर्ट देखें',
    cardRecordsBtnModern: 'रिकॉर्ड प्रबंधित करें',

    cardEmergencyTitle: 'आपातकालीन सहायता',
    cardEmergencyDescElderly: 'आपातकालीन हेल्पलाइन, एम्बुलेंस और अस्पताल सहायता तक तुरंत पहुंच।',
    cardEmergencyDescModern: 'त्वरित आपातकालीन प्रतिक्रिया दल और नजदीकी ट्रॉमा सेंटर से संपर्क।',
    cardEmergencyBtnElderly: 'कॉल करें (108)',
    cardEmergencyBtnModern: 'आपातकालीन प्रतिक्रिया',

    // Footer
    footerTagline: 'प्री-कंसल्ट • टेन्सर टाइटन्स। सुगमता प्रथम डिज़ाइन।'
  },

  kn: {
    // Step 1: Language modal
    langModalTitle: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    langModalSubtitle: 'ಆರೋಗ್ಯ ಸಮಾಲೋಚನೆಗಾಗಿ ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆರಿಸಿ',
    step1Pill: '1. ಭಾಷೆ',
    step2Pill: '2. ಮೋಡ್',

    // Step 2: Mode modal
    modeModalTitle: 'ಪ್ರಿ-ಕನ್ಸಲ್ಟ್‌ಗೆ ಸ್ವಾಗತ',
    modeModalSubtitle: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ವೀಕ್ಷಣೆ ಮೋಡ್ ಆಯ್ಕೆಮಾಡಿ',
    elderlyLabel: 'ಹಿರಿಯರು (Elderly)',
    elderlyTagline: 'ದೊಡ್ಡ ಅಕ್ಷರಗಳು ಮತ್ತು ಸ್ಪಷ್ಟ ನೋಟ',
    modernLabel: 'ಆಧುನಿಕ (Modern)',
    modernTagline: 'ಪ್ರಮಾಣಿತ ಇಂಟರ್ಯಾಕ್ಟಿವ್ ವಿನ್ಯಾಸ',
    backBtn: '← ಭಾಷೆ ಬದಲಿಸಿ',
    continueBtn: 'ಮುಂದುವರಿಯಿರಿ',

    // Navbar
    switchMode: 'ಮೋಡ್ ಬದಲಿಸಿ',
    switchLang: 'ಭಾಷೆ',
    elderlyModeTag: 'ಹಿರಿಯರ ಮೋಡ್',
    modernModeTag: 'ಆಧುನಿಕ ಮೋಡ್',

    // Hero
    heroTitleElderly: 'ಪ್ರಿ-ಕನ್ಸಲ್ಟ್‌ಗೆ ಸುಸ್ವಾಗತ',
    heroSubElderly: 'ವೈದ್ಯರ ಸಮಾಲೋಚನೆಯನ್ನು ಪ್ರತಿಯೊಬ್ಬರಿಗೂ ಸರಳ, ಆರಾಮದಾಯಕ ಮತ್ತು ಸುಲಭವಾಗಿಸಲಾಗಿದೆ.',
    heroTitleModern: 'ಸ್ಮಾರ್ಟ್ ಆರೋಗ್ಯ ಸೇವೆ ಪ್ರಿ-ಕನ್ಸಲ್ಟೇಶನ್',
    heroSubModern: 'ತಡೆರಹಿತ ಪೂರ್ವ-ಸಮಾಲೋಚನೆ ತಪಾಸಣೆ, ವೇಳಾಪಟ್ಟಿ ಮತ್ತು ರೋಗಿಯ ಇತಿಹಾಸ ನಿರ್ವಹಣೆ.',
    heroVoiceCta: 'ಧ್ವನಿ ಮೂಲಕ ರೋಗಲಕ್ಷಣ ಹೇಳಿ (Voice Intake)',

    // Voice Intake
    voiceIntakeTitle: 'ಬಹುಭಾಷಾ ವೈದ್ಯಕೀಯ ಧ್ವನಿ ಇನ್‌ಟೇಕ್ (NidanAI)',
    voiceIntakeSubtitle: 'ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಧೈರ್ಯವಾಗಿ ಮಾತನಾಡಿ. ಆಯುರ್ವೇದ ಮತ್ತು ಆಧುನಿಕ ವೈದ್ಯಕೀಯ ಪದಗಳನ್ನು ವೈದ್ಯರಿಗಾಗಿ ಸ್ಪಷ್ಟವಾಗಿ ಸಂಸ್ಕರಿಸಲಾಗುತ್ತದೆ.',
    voiceIntakeElderlyPrompt: 'ಮೈಕ್ರೋಫೋನ್ ಬಟನ್ ಒತ್ತಿ ಮತ್ತು ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಧ್ವನಿಯಲ್ಲಿ ತಿಳಿಸಿ',
    voiceSelectLang: 'ರೋಗಿಯ ಭಾಷೆ:',
    voiceStatusIdle: 'ಮಾತನಾಡಲು ಸಿದ್ಧ',
    voiceStatusRecording: 'ಆಲಿಸಲಾಗುತ್ತಿದೆ… ನಿಮ್ಮ ಸಮಸ್ಯೆಗಳನ್ನು ಹೇಳಿ',
    voiceStatusTranscribing: 'ಧ್ವನಿಯನ್ನು ಪಠ್ಯವಾಗಿಸಲಾಗುತ್ತಿದೆ (Whisper v3)…',
    voiceStatusAnalyzing: 'ವೈದ್ಯಕೀಯ ಹಾಗೂ ಆಯುರ್ವೇದ ಅಂಶಗಳ ವಿಶ್ಲೇಷಣೆ (Llama 3.1)…',
    voiceStatusComplete: 'ವೈದ್ಯರಿಗಾಗಿ ಕ್ಲಿನಿಕಲ್ ಸಾರಾಂಶ ಸಿದ್ಧವಾಗಿದೆ',
    voiceStartRecording: 'ಮಾತನಾಡಲು ಒತ್ತಿ',
    voiceStopRecording: 'ನಿಲ್ಲಿಸಲು ಒತ್ತಿ',
    voicePresetLabel: 'ಪರೀಕ್ಷಾ ಮಾದರಿಗಳು:',
    voiceTabClinical: 'ವೈದ್ಯರ ಕ್ಲಿನಿಕಲ್ ವರದಿ (SOAP / English)',
    voiceTabOriginal: 'ರೋಗಿಯ ಮೂಲ ಧ್ವನಿ ಪ್ರತಿಲಿಪಿ (ಕನ್ನಡ)',
    voiceChiefComplaint: 'ಮುಖ್ಯ ಸಮಸ್ಯೆ (Chief Complaint)',
    voiceDuration: 'ಅವಧಿ (Duration)',
    voiceAssociatedSymptoms: 'ಸಂಬಂಧಿತ ಲಕ್ಷಣಗಳು',
    voiceMedications: 'ಔಷಧಿಗಳು',
    voiceAyurvedicFactors: 'ಆಯುರ್ವೇದ ಮತ್ತು ಆಯುಷ್ ಅಂಶಗಳು',
    voiceDosha: 'ದೋಷ ಸಮತೋಲನ (Dosha)',
    voiceAgni: 'ಜಠರಾಗ್ನಿ ಸ್ಥಿತಿ (Agni)',
    voiceTriageLabel: 'ತುರ್ತು ವರ್ಗೀಕರಣ (Triage)',
    voiceCopySlip: 'ಕಾಪಿ ಮಾಡಿ',
    voicePrintSlip: 'ಸ್ಲಿಪ್ ಮುದ್ರಿಸಿ',
    voiceSpeakAloud: 'ಧ್ವನಿಯಲ್ಲಿ ಕೇಳಿ',
    voiceNewIntake: 'ಹೊಸ ಧ್ವನಿ ತಪಾಸಣೆ',
    voiceApiKeyLabel: 'API ಸೆಟ್ಟಿಂಗ್ಸ್',

    // Mic Permission Modal
    micPermModalTitle: 'ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿ ಅಗತ್ಯವಿದೆ',
    micPermModalSubtitle: 'ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳನ್ನು ಆಲಿಸಲು ಪ್ರಿ-ಕನ್ಸಲ್ಟ್‌ಗೆ ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿ ಅಗತ್ಯವಿದೆ.',
    micPermStep1: 'ಕೆಳಗಿನ "ಅನುಮತಿಸಿ" ಬಟನ್ ಒತ್ತಿರಿ.',
    micPermStep2: 'ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಬರುವ ಪಾಪ್-ಅಪ್‌ನಲ್ಲಿ "Allow" ಆಯ್ಕೆಮಾಡಿ.',
    micPermStep3: 'ನಂತರ ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಧ್ವನಿಯಲ್ಲಿ ಹೇಳಿ.',
    micPermAllowBtn: 'ಅನುಮತಿಸಿ ಮತ್ತು ಮಾತನಾಡಿ',
    micPermCancelBtn: 'ರದ್ದುಮಾಡಿ',
    micPermPresetBtn: 'ಪರೀಕ್ಷಾ ಮಾದರಿ ಬಳಸಿ',
    micPermBlockedTitle: 'ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ',
    micPermBlockedHelp: 'ಬ್ರೌಸರ್ ಅಡ್ರೆಸ್ ಬಾರ್‌ನಲ್ಲಿ ಲಾಕ್ (🔒) ಐಕಾನ್ ಒತ್ತಿ ಮೈಕ್ರೋಫೋನ್‌ಗೆ ಅನುಮತಿ ನೀಡಿ.',

    // Action Cards
    cardDoctorTitle: 'ವೈದ್ಯರನ್ನು ಹುಡುಕಿ',
    cardDoctorDescElderly: 'ಸರಳ 1-ಕ್ಲಿಕ್ ಬುಕಿಂಗ್‌ನೊಂದಿಗೆ ನಿಮ್ಮ ಹತ್ತಿರದ ಪರಿಣಿತ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    cardDoctorDescModern: 'ವಿಶೇಷತೆ, ಸ್ಥಳ, ಲಭ್ಯತೆ ಮತ್ತು ವಿಮರ್ಶೆಗಳ ಆಧಾರದ ಮೇಲೆ ಹುಡುಕಿ.',
    cardDoctorBtnElderly: 'ವೈದ್ಯರನ್ನು ಕಾಯ್ದಿರಿಸಿ',
    cardDoctorBtnModern: 'ಪರಿಣಿತರನ್ನು ಹುಡುಕಿ',

    cardRecordsTitle: 'ಆರೋಗ್ಯ ದಾಖಲೆಗಳು',
    cardRecordsDescElderly: 'ನಿಮ್ಮ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ಗಳು, ಪರೀಕ್ಷೆಗಳು ಮತ್ತು ವೈದ್ಯಕೀಯ ಇತಿಹಾಸವನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ವೀಕ್ಷಿಸಿ.',
    cardRecordsDescModern: 'ಲ್ಯಾಬ್ ವರದಿಗಳು ಮತ್ತು ಹಿಂದಿನ ಆರೋಗ್ಯ ವಿವರಗಳ ಸುರಕ್ಷಿತ ಸಂಗ್ರಹಣೆ.',
    cardRecordsBtnElderly: 'ದಾಖಲೆ ನೋಡಿ',
    cardRecordsBtnModern: 'ದಾಖಲೆ ನಿರ್ವಹಿಸಿ',

    cardEmergencyTitle: 'ತುರ್ತು ಸಹಾಯ',
    cardEmergencyDescElderly: 'ತುರ್ತು ಸಹಾಯವಾಣಿ, ಆಂಬ್ಯುಲೆನ್ಸ್ ಮತ್ತು ಆಸ್ಪತ್ರೆಯ ನೆರವಿಗೆ ತಕ್ಷಣ ಸಂಪರ್ಕ ಪಡೆಯಿರಿ.',
    cardEmergencyDescModern: 'ತ್ವರಿತ ತುರ್ತು ಪ್ರತಿಕ್ರಿಯೆ ತಂಡಗಳು ಮತ್ತು ಸಮೀಪದ ಆಸ್ಪತ್ರೆಗಳಿಗೆ ನೇರ ಸಂಪರ್ಕ.',
    cardEmergencyBtnElderly: 'ಕರೆ ಮಾಡಿ (108)',
    cardEmergencyBtnModern: 'ತುರ್ತು ಪ್ರತಿಕ್ರಿಯೆ',

    // Footer
    footerTagline: 'ಪ್ರಿ-ಕನ್ಸಲ್ಟ್ • ಟೆನ್ಸರ್ ಟೈಟಾನ್ಸ್. ಎಲ್ಲರಿಗೂ ಸುಲಭವಾದ ವಿನ್ಯಾಸ.'
  },

  ta: {
    // Step 1: Language modal
    langModalTitle: 'உங்கள் மொழியைத் தேர்வுசெய்க',
    langModalSubtitle: 'சுகாதார ஆலோசனைக்காக உங்களுக்கு விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்',
    step1Pill: '1. மொழி',
    step2Pill: '2. பயன்முறை',

    // Step 2: Mode modal
    modeModalTitle: 'ப்ரீ-கன்சல்ட்டுக்கு வரவேற்கிறோம்',
    modeModalSubtitle: 'உங்களுக்கு விருப்பமான காட்சி பயன்முறையைத் தேர்ந்தெடுக்கவும்',
    elderlyLabel: 'முதியவர் (Elderly)',
    elderlyTagline: 'பெரிய எழுத்துக்கள் & தெளிவான பார்வை',
    modernLabel: 'நவீன (Modern)',
    modernTagline: 'நிலையான ஊடாடும் தளவமைப்பு',
    backBtn: '← மொழி மாற்று',
    continueBtn: 'தொடரவும்',

    // Navbar
    switchMode: 'பயன்முறை மாற்று',
    switchLang: 'மொழி',
    elderlyModeTag: 'முதியவர் பயன்முறை',
    modernModeTag: 'நவீன பயன்முறை',

    // Hero
    heroTitleElderly: 'ப்ரீ-கன்சல்ட்டுக்கு நல்வரவு',
    heroSubElderly: 'மருத்துவர் ஆலோசனைகள் அனைவருக்கும் எளிமையாகவும் வசதியாகவும் புரியும்படியும் செய்யப்பட்டுள்ளது.',
    heroTitleModern: 'ஸ்மார்ட் ஹெல்த்கேர் ப்ரீ-கன்சல்டேஷன்',
    heroSubModern: 'தடையற்ற முன் ஆலோசனை பரிசோதனைகள், முன்பதிவு மற்றும் நோயாளி வரலாற்று மேலாண்மை.',
    heroVoiceCta: 'குரல் மூலம் அறிகுறிகளைக் கூறவும் (Voice Intake)',

    // Voice Intake
    voiceIntakeTitle: 'பன்மொழி குரல் மருத்துவ பதிவு (NidanAI)',
    voiceIntakeSubtitle: 'உங்கள் தாய்மொழியில் பேசுங்கள். ஆயுர்வேத மற்றும் நவீன மருத்துவ சொற்கள் மருத்துவருக்காக துல்லியமாக மாற்றப்படும்.',
    voiceIntakeElderlyPrompt: 'மைக் பொத்தானை அழுத்தி உங்கள் உடல்நலப் பிரச்சனைகளைக் கூறவும்',
    voiceSelectLang: 'நோயாளி பேசும் மொழி:',
    voiceStatusIdle: 'பேசத் தயாராக உள்ளது',
    voiceStatusRecording: 'கேட்கிறது… அறிகுறிகளைப் பேசுங்கள்',
    voiceStatusTranscribing: 'குரல் உரை மாற்றப்படுகிறது (Whisper v3)…',
    voiceStatusAnalyzing: 'மருத்துவ ஆய்வு நடைபெறுகிறது (Llama 3.1)…',
    voiceStatusComplete: 'மருத்துவ அறிக்கை தயாராக உள்ளது',
    voiceStartRecording: 'பேச அழுத்தவும்',
    voiceStopRecording: 'நிறுத்த அழுத்தவும்',
    voicePresetLabel: 'மாதிரி சோதனைகள்:',
    voiceTabClinical: 'மருத்துவரின் அறிக்கை (SOAP / English)',
    voiceTabOriginal: 'நோயாளியின் அசல் குரல் உரை (தமிழ்)',
    voiceChiefComplaint: 'முக்கிய பிரச்சனை (Chief Complaint)',
    voiceDuration: 'கால அளவு (Duration)',
    voiceAssociatedSymptoms: 'தொடர்புடைய அறிகுறிகள்',
    voiceMedications: 'மருந்துகள்',
    voiceAyurvedicFactors: 'ஆயுர்வேத காரணிகள்',
    voiceDosha: 'தோஷ நிலை (Dosha)',
    voiceAgni: 'செரிமான அக்னி (Agni)',
    voiceTriageLabel: 'அவசர நிலை (Triage)',
    voiceCopySlip: 'நகலெடு',
    voicePrintSlip: 'அச்சிடுக',
    voiceSpeakAloud: 'கேட்கவும்',
    voiceNewIntake: 'புதிய குரல் பதிவு',
    voiceApiKeyLabel: 'API அமைப்புகள்',

    // Mic Permission Modal
    micPermModalTitle: 'மைக்ரோஃபோன் அனுமதி தேவை',
    micPermModalSubtitle: 'உங்கள் அறிகுறிகளைக் குரல் மூலம் தெரிவிக்க மைக்ரோஃபோன் அனுமதி தேவைப்படுகிறது.',
    micPermStep1: 'கீழே உள்ள "அனுமதிக்கவும்" பொத்தானை அழுத்தவும்.',
    micPermStep2: 'உலாவியில் தோன்றும் பாப்-அப்பில் "Allow" என்பதைத் தேர்ந்தெடுக்கவும்.',
    micPermStep3: 'பின்னர் தெளிவாகப் பேசவும்.',
    micPermAllowBtn: 'அனுமதிக்கவும் மற்றும் பேசவும்',
    micPermCancelBtn: 'ரத்துசெய்',
    micPermPresetBtn: 'மாதிரி பதிவைப் பயன்படுத்து',
    micPermBlockedTitle: 'மைக்ரோஃபோன் அனுமதி தடுக்கப்பட்டுள்ளது',
    micPermBlockedHelp: 'முகவரிப் பட்டியில் உள்ள பூட்டு (🔒) ஐகானைக் கிளிக் செய்து மைக்ரோஃபோனை அனுமதிக்கவும்.',

    // Action Cards
    cardDoctorTitle: 'மருத்துவரை கண்டறியவும்',
    cardDoctorDescElderly: 'எளிய 1-கிளிக் முன்பதிவு மூலம் உங்களுக்கு அருகிலுள்ள சிறந்த மருத்துவர்களைத் தொடர்பு கொள்ளுங்கள்.',
    cardDoctorDescModern: 'சிறப்பு பிரிவு, இருப்பிடம், கிடைக்கும் நேரம் மற்றும் மதிப்புரைகள் அடிப்படையில் தேடுங்கள்.',
    cardDoctorBtnElderly: 'மருத்துவரை பதிவு செய்க',
    cardDoctorBtnModern: 'நிபுணர்களை தேடுங்கள்',

    cardRecordsTitle: 'மருத்துவப் பதிவுகள்',
    cardRecordsDescElderly: 'உங்கள் மருந்துகள், பரிசோதனைகள் மற்றும் மருத்துவ வரலாற்றை தெளிவாகப் பாருங்கள்.',
    cardRecordsDescModern: 'ஆய்வக அறிக்கைகள் மற்றும் முந்தைய மருத்துவ பதிவுகளுக்கான பாதுகாப்பான சேமிப்பு.',
    cardRecordsBtnElderly: 'பதிவுகளை காண்க',
    cardRecordsBtnModern: 'பதிவுகளை நிர்வகிக்கவும்',

    cardEmergencyTitle: 'அவசர உதவி',
    cardEmergencyDescElderly: 'அவசர உதவி எண், ஆம்புலன்ஸ் மற்றும் மருத்துவமனை உதவிக்கு உடனடி தொடர்பு.',
    cardEmergencyDescModern: 'விரைவு அவசர சிகிச்சை குழுக்கள் மற்றும் அருகிலுள்ள மருத்துவமனைகளுடன் நேரடி இணைப்பு.',
    cardEmergencyBtnElderly: 'அழைக்கவும் (108)',
    cardEmergencyBtnModern: 'அவசர சிகிச்சை',

    // Footer
    footerTagline: 'ப்ரீ-கன்சல்ட் • டென்சர் டைட்டன்ஸ். எளிமையான அணுகல் வடிவமைப்பு.'
  },

  te: {
    // Step 1: Language modal
    langModalTitle: 'మీ భాషను ఎంచుకోండి',
    langModalSubtitle: 'ఆరోగ్య సంప్రదింపుల కోసం మీ ప్రాధాన్య భాషను ఎంచుకోండి',
    step1Pill: '1. భాష',
    step2Pill: '2. మోడ్',

    // Step 2: Mode modal
    modeModalTitle: 'ప్రీ-కన్సల్ట్‌కి స్వాగతం',
    modeModalSubtitle: 'దయచేసి మీ ప్రాధాన్య వీక్షణ మోడ్‌ను ఎంచుకోండి',
    elderlyLabel: 'వృద్ధులు (Elderly)',
    elderlyTagline: 'పెద్ద అక్షరాలు & స్పష్టమైన వీక్షణ',
    modernLabel: 'ఆధునిక (Modern)',
    modernTagline: 'ప్రామాణిక ఇంటరాక్టివ్ లేఅవుట్',
    backBtn: '← భాష మార్చండి',
    continueBtn: 'కొనసాగించండి',

    // Navbar
    switchMode: 'మోడ్ మార్చండి',
    switchLang: 'భాష',
    elderlyModeTag: 'సీనియర్ మోడ్',
    modernModeTag: 'ఆధునిక మోడ్',

    // Hero
    heroTitleElderly: 'ప్రీ-కన్సల్ట్‌కి స్వాగతం',
    heroSubElderly: 'వైద్యుల సంప్రదింపులను అందరికీ సరళంగా, సౌకర్యవంతంగా మరియు సులభంగా అర్థమయ్యేలా చేసాము.',
    heroTitleModern: 'స్మార్ట్ హెల్త్‌కేర్ ప్రీ-కన్సల్టేషన్',
    heroSubModern: 'అతుకులు లేని ప్రీ-కన్సల్టేషన్ రోగ నిర్ధారణ, షెడ్యూలింగ్ మరియు రోగి రికార్డుల సమీకరణ.',
    heroVoiceCta: 'వాయిస్ ద్వారా లక్షణాలు చెప్పండి (Voice Intake)',

    // Voice Intake
    voiceIntakeTitle: 'బహుభాషా క్లినికల్ వాయిస్ ఇన్‌టేక్ (NidanAI)',
    voiceIntakeSubtitle: 'మీ మాతృభాషలో మాట్లాడండి. ఆయుర్వేద మరియు వైద్య పదాలను వైద్యుల కోసం ఖచ్చితంగా నిలుపుతాము.',
    voiceIntakeElderlyPrompt: 'మైక్ బటన్ నొక్కి మీ ఆరోగ్య సమస్యలను చెప్పండి',
    voiceSelectLang: 'రోగి మాట్లాడే భాష:',
    voiceStatusIdle: 'మాట్లాడటానికి సిద్ధంగా ఉంది',
    voiceStatusRecording: 'వింటోంది… లక్షణాలు చెప్పండి',
    voiceStatusTranscribing: 'ధ్వని రాతగా మారుతోంది (Whisper v3)…',
    voiceStatusAnalyzing: 'క్లినికల్ విశ్లేషణ జరుగుతోంది (Llama 3.1)…',
    voiceStatusComplete: 'డాక్టర్ క్లినికల్ నివేదిక సిద్ధం',
    voiceStartRecording: 'మాట్లాడటానికి నొక్కండి',
    voiceStopRecording: 'ఆపడానికి నొక్కండి',
    voicePresetLabel: 'పరీక్షా నమూనాలు:',
    voiceTabClinical: 'డాక్టర్ క్లినికల్ నోట్ (SOAP / English)',
    voiceTabOriginal: 'రోగి అసలు వాయిస్ ట్రాన్స్‌క్రిప్ట్ (తెలుగు)',
    voiceChiefComplaint: 'ప్రధాన సమస్య (Chief Complaint)',
    voiceDuration: 'వ్యవధి (Duration)',
    voiceAssociatedSymptoms: 'అనుబంధ లక్షణాలు',
    voiceMedications: 'మందులు',
    voiceAyurvedicFactors: 'ఆయుర్వేద అంశాలు',
    voiceDosha: 'దోష స్థితి (Dosha)',
    voiceAgni: 'జీర్ణ అగ్ని స్థితి (Agni)',
    voiceTriageLabel: 'అత్యవసర విభజన (Triage)',
    voiceCopySlip: 'కాపీ చేయండి',
    voicePrintSlip: 'స్లిప్ ప్రింట్ చేయండి',
    voiceSpeakAloud: 'వినండి',
    voiceNewIntake: 'కొత్త వాయిస్ ఇన్‌టేక్',
    voiceApiKeyLabel: 'API సెట్టింగ్స్',

    // Mic Permission Modal
    micPermModalTitle: 'మైక్రోఫోన్ అనుమతి అవసరం',
    micPermModalSubtitle: 'మీరు లక్షణాలను మాట్లాడటానికి ప్రీ-కన్సల్ట్‌కి మైక్రోఫోన్ అనుమతి అవసరం.',
    micPermStep1: 'క్రింద ఉన్న "అనుమతించు" బటన్‌పై క్లిక్ చేయండి.',
    micPermStep2: 'బ్రౌజర్ పాప్-అప్‌లో "Allow" ఎంచుకోండి.',
    micPermStep3: 'తరువాత మీ సమస్యలను స్పష్టంగా మాట్లాడండి.',
    micPermAllowBtn: 'అనుమతించు & మాట్లాడండి',
    micPermCancelBtn: 'రద్దు చేయండి',
    micPermPresetBtn: 'నమూనాను ప్రయత్నించండి',
    micPermBlockedTitle: 'మైక్రోఫోన్ అనుమతి నిరోధించబడింది',
    micPermBlockedHelp: 'బ్రౌజర్ అడ్రస్ బార్‌లోని లాక్ (🔒) చిహ్నాన్ని క్లిక్ చేసి మైక్రోఫోన్‌ను అనుమతించండి.',

    // Action Cards
    cardDoctorTitle: 'వైద్యుడిని కనుగొనండి',
    cardDoctorDescElderly: 'సులభమైన 1-క్లిక్ బుకింగ్‌తో మీ సమీపంలోని నిపుణులను సంప్రదించండి.',
    cardDoctorDescModern: 'స్పెషలైజేషన్, లొకేషన్, లభ్యత మరియు సమీక్షల ఆధారంగా శోధించండి.',
    cardDoctorBtnElderly: 'వైద్యుడిని బుక్ చేయండి',
    cardDoctorBtnModern: 'నిపుణులను కనుగొనండి',

    cardRecordsTitle: 'ఆరోగ్య రికార్డులు',
    cardRecordsDescElderly: 'మీ ప్రిస్క్రిప్షన్లు, పరీక్షలు మరియు వైద్య చరిత్రను స్పష్టంగా చూడండి.',
    cardRecordsDescModern: 'ల్యాబ్ రిపోర్టులు మరియు మునుపటి ఆరోగ్య వివరాల సురక్షిత నిల్వ.',
    cardRecordsBtnElderly: 'రికార్డులు చూడండి',
    cardRecordsBtnModern: 'రికార్డులను నిర్వహించండి',

    cardEmergencyTitle: 'అత్యవసర సహాయం',
    cardEmergencyDescElderly: 'అత్యవసర హెల్ప్‌లైన్, ambulance మరియు ఆసుపత్రి సహాయానికి తక్షణ ప్రాప్యత.',
    cardEmergencyDescModern: 'వేగవంతమైన అత్యవసర స్పందన బృందాలు మరియు సమీప కేంద్రాలకు ప్రత్యక్ష లిಂక్.',
    cardEmergencyBtnElderly: 'కాల్ చేయండి (108)',
    cardEmergencyBtnModern: 'అత్యవసర స్పందన',

    // Footer
    footerTagline: 'ప్రీ-కన్సల్ట్ • టెన్సర్ టైటాన్స్. అందరికీ అనుకూలమైన డిజైన్.'
  },

  ml: {
    // Step 1: Language modal
    langModalTitle: 'നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക',
    langModalSubtitle: 'ആരോഗ്യ സംബന്ധമായ സേവനങ്ങൾക്കായി നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക',
    step1Pill: '1. ഭാഷ',
    step2Pill: '2. മോഡ്',

    // Step 2: Mode modal
    modeModalTitle: 'പ്രീ-കൺസൾട്ടിലേക്ക് സ്വാഗതം',
    modeModalSubtitle: 'നിങ്ങൾക്കിഷ്ടമുള്ള കാഴ്ച മോഡ് തിരഞ്ഞെടുക്കുക',
    elderlyLabel: 'മുതിർന്നവർ (Elderly)',
    elderlyTagline: 'വലിയ അക്ഷരങ്ങളും ഉയർന്ന ദൃശ്യതീവ്രതയും',
    modernLabel: 'ആധുനികം (Modern)',
    modernTagline: 'സാധാരണ ഇന്ററാക്ടീവ് ലേഔട്ട്',
    backBtn: '← ഭാഷ മാറ്റുക',
    continueBtn: 'തുടരുക',

    // Navbar
    switchMode: 'മോഡ് മാറ്റുക',
    switchLang: 'ഭാഷ',
    elderlyModeTag: 'മുതിർന്നവരുടെ മോഡ്',
    modernModeTag: 'ആധുനിക മോഡ്',

    // Hero
    heroTitleElderly: 'പ്രീ-കൺസൾട്ടിലേക്ക് സ്വാഗതം',
    heroSubElderly: 'ഡോക്ടർ കൺസൾട്ടേഷനുകൾ എല്ലാവർക്കും ലളിതവും സൗകര്യപ്രദവും മനസ്സിലാക്കാൻ എളുപ്പവുമാക്കിയിരിക്കുന്നു.',
    heroTitleModern: 'സ്മാർട്ട് ഹെൽത്ത്‌കെയർ പ്രീ-കൺസൾട്ടേഷൻ',
    heroSubModern: 'തടസ്സമില്ലാത്ത പ്രീ-കൺസൾട്ടേഷൻ രോഗനിർണയം, ഷെഡ്യൂളിംഗ്, രോഗിയുടെ ഹിസ്റ്ററി മാനേജ്മെന്റ്.',
    heroVoiceCta: 'ശബ്ദത്തിലൂടെ ലക്ഷണങ്ങൾ പറയുക (Voice Intake)',

    // Voice Intake
    voiceIntakeTitle: 'ബഹുഭാഷാ ക്ലിനിക്കൽ വോയ്‌സ് ഇൻടേക്ക് (NidanAI)',
    voiceIntakeSubtitle: 'നിങ്ങളുടെ മാതൃഭാഷയിൽ സംസാരിക്കുക. ആയുർവേദ, അലോപ്പതി പദങ്ങൾ ഡോക്ടർക്കായി കൃത്യമായി സംരക്ഷിക്കപ്പെടുന്നു.',
    voiceIntakeElderlyPrompt: 'മൈക്രോഫോൺ ബട്ടൺ അമർത്തി നിങ്ങളുടെ ബുദ്ധിമുട്ടുകൾ പറയുക',
    voiceSelectLang: 'സംസാരിക്കുന്ന ഭാഷ:',
    voiceStatusIdle: 'സംസാരിക്കാൻ തയ്യാറാണ്',
    voiceStatusRecording: 'കേൾക്കുന്നു… ലക്ഷണങ്ങൾ പറയുക',
    voiceStatusTranscribing: 'ശബ്ദം ടെക്സ്റ്റാക്കുന്നു (Whisper v3)…',
    voiceStatusAnalyzing: 'ക്ലിനിക്കൽ പരിശോധന നടക്കുന്നു (Llama 3.1)…',
    voiceStatusComplete: 'ഡോക്ടറുടെ ക്ലിനിക്കൽ റിപ്പോർട്ട് തയ്യാറാണ്',
    voiceStartRecording: 'സംസാരിക്കാൻ അമർത്തുക',
    voiceStopRecording: 'നിർത്താൻ അമർത്തുക',
    voicePresetLabel: 'ടെസ്റ്റ് സാമ്പിളുകൾ:',
    voiceTabClinical: 'ഡോക്ടറുടെ ക്ലിനിക്കൽ കുറിപ്പ് (SOAP / English)',
    voiceTabOriginal: 'യഥാർത്ഥ രോഗിയുടെ ശബ്ദ വിവരണം (മലയാളം)',
    voiceChiefComplaint: 'പ്രധാന ബുദ്ധിമുട്ട് (Chief Complaint)',
    voiceDuration: 'കാലയളവ് (Duration)',
    voiceAssociatedSymptoms: 'അനുബന്ധ ലക്ഷണങ്ങൾ',
    voiceMedications: 'മരുന്നുകൾ',
    voiceAyurvedicFactors: 'ആയുർവേദ ഘടകങ്ങൾ',
    voiceDosha: 'ദോഷ നില (Dosha)',
    voiceAgni: 'ദഹന അഗ്നി നില (Agni)',
    voiceTriageLabel: 'അടിയന്തിര പ്രാധാന്യം (Triage)',
    voiceCopySlip: 'പകർപ്പ് എടുക്കുക',
    voicePrintSlip: 'പ്രിന്റ് ചെയ്യുക',
    voiceSpeakAloud: 'കേൾക്കുക',
    voiceNewIntake: 'പുതിയ വോയ്‌സ് റെക്കോർഡിംഗ്',
    voiceApiKeyLabel: 'API ക്രമീകരണങ്ങൾ',

    // Mic Permission Modal
    micPermModalTitle: 'മൈക്രോഫോൺ അനുമതി ആവശ്യമാണ്',
    micPermModalSubtitle: 'നിങ്ങളുടെ ആരോഗ്യ പ്രശ്നങ്ങൾ പറയാൻ പ്രീ-കൺസൾട്ടിന് മൈക്രോഫോൺ അനുമതി ആവശ്യമാണ്.',
    micPermStep1: 'താഴെയുള്ള "അനുമതി നൽകുക" ബട്ടൺ ക്ലിക്ക് ചെയ്യുക.',
    micPermStep2: 'ബ്രൗസറിൽ വരുന്ന പോപ്പ്-അപ്പിൽ "Allow" തിരഞ്ഞെടുക്കുക.',
    micPermStep3: 'തുടർന്ന് നിങ്ങളുടെ ലക്ഷണങ്ങൾ വ്യക്തമായി പറയുക.',
    micPermAllowBtn: 'അനുമതി നൽകി സംസാരിക്കുക',
    micPermCancelBtn: 'റദ്ദാക്കുക',
    micPermPresetBtn: 'ടെസ്റ്റ് സാമ്പിൾ ഉപയോഗിക്കുക',
    micPermBlockedTitle: 'മൈക്രോഫോൺ അനുമതി തടഞ്ഞിരിക്കുന്നു',
    micPermBlockedHelp: 'ബ്രൗസർ അഡ്രസ് ബാറിലെ ലോക്ക് (🔒) ഐക്കൺ ക്ലിക്ക് ചെയ്ത് മൈക്രോഫോൺ അനുമതി നൽകുക.',

    // Action Cards
    cardDoctorTitle: 'ഡോക്ടറെ കണ്ടെത്തുക',
    cardDoctorDescElderly: 'ലളിതമായ 1-ക്ലിക്ക് ബുക്കിംഗിലൂടെ നിങ്ങളുടെ അടുത്തുള്ള വിദഗ്ദ്ധ ഡോക്ടർമാരുമായി ബന്ധപ്പെടുക.',
    cardDoctorDescModern: 'സ്പെഷ്യാലിറ്റി, സ്ഥലം, ലഭ്യത, അവലോകനങ്ങൾ എന്നിവ അടിസ്ഥാനമാക്കി തിരയുക.',
    cardDoctorBtnElderly: 'ഡോക്ടറെ ബുക്ക് ചെയ്യുക',
    cardDoctorBtnModern: 'വിദഗ്ദ്ധരെ കണ്ടെത്തുക',

    cardRecordsTitle: 'ആരോഗ്യ രേഖകൾ',
    cardRecordsDescElderly: 'നിങ്ങളുടെ കുറിപ്പടികൾ, ടെസ്റ്റുകൾ, മെഡിക്കൽ ചരിത്രം എന്നിവ വ്യക്തമായി കാണുക.',
    cardRecordsDescModern: 'ലാബ് റിപ്പോർട്ടുകൾക്കും മുൻകാല രേഖകൾക്കുമായി സുരക്ഷിത സംഭരണം.',
    cardRecordsBtnElderly: 'രേഖകൾ കാണുക',
    cardRecordsBtnModern: 'രേഖകൾ കൈകാര്യം ചെയ്യുക',

    cardEmergencyTitle: 'അടിയന്തര സഹായം',
    cardEmergencyDescElderly: 'എമർജൻസി ഹെൽപ്പ്‌ലൈൻ, ആംബുലൻസ്, ആശുപത്രി സേവനങ്ങളിലേക്ക് തൽക്ഷണ ആക്സസ്.',
    cardEmergencyDescModern: 'ദ്രുത എമർജൻസി റെസ്‌പോൺസ് ടീമുകളിലേക്കും അടുത്തുള്ള ആശുപത്രികളിലേക്കും നേരിട്ടുള്ള ലിങ്ക്.',
    cardEmergencyBtnElderly: 'വിളിക്കുക (108)',
    cardEmergencyBtnModern: 'എമർജൻസി റെസ്‌പോൺസ്',

    // Footer
    footerTagline: 'പ്രീ-കൺസൾട്ട് • ടെൻസർ ടൈറ്റാൻസ്. എല്ലാവർക്കും പ്രാപ്യമായ ഡിസൈൻ.'
  }
};
