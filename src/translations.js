/**
 * PreConsult Localization & Translation Dictionary
 * Languages: English (en), Hindi (hi), Kannada (kn), Tamil (ta), Telugu (te), Malayalam (ml)
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
    glyph: 'అ',
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

    // Banner
    bannerElderlyActive: 'Senior / Elderly Mode Active',
    bannerModernActive: 'Modern Mode Active',
    bannerElderlyDesc: 'Simplified view with large text & high contrast for easy reading',
    bannerModernDesc: 'Standard modern layout with full interactive features',
    bannerChangeBtn: 'Change Mode • Switch',

    // Hero
    heroTitleElderly: 'Welcome to PreConsult',
    heroSubElderly: 'Doctor consultations made simple, comfortable, and easy to understand for everyone.',
    heroTitleModern: 'Smart Healthcare Pre-Consultation',
    heroSubModern: 'Empowering seamless pre-consultation diagnostics, scheduling, and patient history aggregation.',

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

    // Banner
    bannerElderlyActive: 'वरिष्ठ मोड सक्रिय (Elderly Mode)',
    bannerModernActive: 'आधुनिक मोड सक्रिय (Modern Mode)',
    bannerElderlyDesc: 'बड़े अक्षर और उच्च कंट्रास्ट के साथ आसान और सरल दृश्य',
    bannerModernDesc: 'पूर्ण इंटरैक्टिव सुविधाओं के साथ मानक आधुनिक लेआउट',
    bannerChangeBtn: 'मोड बदलें • Switch',

    // Hero
    heroTitleElderly: 'प्री-कंसल्ट में आपका स्वागत है',
    heroSubElderly: 'डॉक्टर परामर्श को सभी के लिए सरल, आरामदायक और समझने में आसान बनाया गया है।',
    heroTitleModern: 'स्मार्ट हेल्थकेयर प्री-कंसल्टेशन',
    heroSubModern: 'सहज प्री-कंसल्टेशन डायग्नोस्टिक्स, शेड्यूलिंग और स्वास्थ्य इतिहास एकत्रीकरण।',

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

    // Banner
    bannerElderlyActive: 'ಹಿರಿಯರ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ (Senior Mode)',
    bannerModernActive: 'ಆಧುನಿಕ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ (Modern Mode)',
    bannerElderlyDesc: 'ಸುಲಭ ಓದುವಿಕೆಗಾಗಿ ದೊಡ್ಡ ಅಕ್ಷರಗಳು ಮತ್ತು ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್ ನೋಟ',
    bannerModernDesc: 'ಸಂಪೂರ್ಣ ಸಂವಾದಾತ್ಮಕ ವೈಶಿಷ್ಟ್ಯಗಳೊಂದಿಗೆ ಆಧುನಿಕ ವಿನ್ಯಾಸ',
    bannerChangeBtn: 'ಮೋಡ್ ಬದಲಿಸಿ • Switch',

    // Hero
    heroTitleElderly: 'ಪ್ರಿ-ಕನ್ಸಲ್ಟ್‌ಗೆ ಸುಸ್ವಾಗತ',
    heroSubElderly: 'ವೈದ್ಯರ ಸಮಾಲೋಚನೆಯನ್ನು ಪ್ರತಿಯೊಬ್ಬರಿಗೂ ಸರಳ, ಆರಾಮದಾಯಕ ಮತ್ತು ಸುಲಭವಾಗಿಸಲಾಗಿದೆ.',
    heroTitleModern: 'ಸ್ಮಾರ್ಟ್ ಆರೋಗ್ಯ ಸೇವೆ ಪ್ರಿ-ಕನ್ಸಲ್ಟೇಶನ್',
    heroSubModern: 'ತಡೆರಹಿತ ಪೂರ್ವ-ಸಮಾಲೋಚನೆ ತಪಾಸಣೆ, ವೇಳಾಪಟ್ಟಿ ಮತ್ತು ರೋಗಿಯ ಇತಿಹಾಸ ನಿರ್ವಹಣೆ.',

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

    // Banner
    bannerElderlyActive: 'முதியவர் பயன்முறை பயன்பாட்டில் உள்ளது',
    bannerModernActive: 'நவீன பயன்முறை பயன்பாட்டில் உள்ளது',
    bannerElderlyDesc: 'எளிதாக படிக்கக்கூடிய பெரிய எழுத்துக்கள் மற்றும் தெளிவான நிற அமைப்பு',
    bannerModernDesc: 'முழுமையான ஊடாடும் அம்சங்களுடன் நிலையான நவீன தளவமைப்பு',
    bannerChangeBtn: 'பயன்முறை மாற்று • Switch',

    // Hero
    heroTitleElderly: 'ப்ரீ-கன்சல்ட்டுக்கு நல்வரவு',
    heroSubElderly: 'மருத்துவர் ஆலோசனைகள் அனைவருக்கும் எளிமையாகவும் வசதியாகவும் புரியும்படியும் செய்யப்பட்டுள்ளது.',
    heroTitleModern: 'ஸ்மார்ட் ஹெல்த்கேர் ப்ரீ-கன்சல்டேஷன்',
    heroSubModern: 'தடையற்ற முன் ஆலோசனை பரிசோதனைகள், முன்பதிவு மற்றும் நோயாளி வரலாற்று மேலாண்மை.',

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

    // Banner
    bannerElderlyActive: 'సీనియర్ మోడ్ సక్రియంగా ఉంది (Elderly Mode)',
    bannerModernActive: 'ఆధునిక మోడ్ సక్రియంగా ఉంది (Modern Mode)',
    bannerElderlyDesc: 'సులభంగా చదవడానికి పెద్ద అక్షరాలు మరియు అధిక కాంట్రాస్ట్‌తో సరళమైన వీక్షణ',
    bannerModernDesc: 'పూర్తి ఇంటరాక్టివ్ ఫీచర్లతో కూడిన ప్రామాణిక ఆధునిక లేఅవుట్',
    bannerChangeBtn: 'మోడ్ మార్చండి • Switch',

    // Hero
    heroTitleElderly: 'ప్రీ-కన్సల్ట్‌కి స్వాగతం',
    heroSubElderly: 'వైద్యుల సంప్రదింపులను అందరికీ సరళంగా, సౌకర్యవంతంగా మరియు సులభంగా అర్థమయ్యేలా చేసాము.',
    heroTitleModern: 'స్మార్ట్ హెల్త్‌కేర్ ప్రీ-కన్సల్టేషన్',
    heroSubModern: 'అతుకులు లేని ప్రీ-కన్సల్టేషన్ రోగ నిర్ధారణ, షెడ్యూలింగ్ మరియు రోగి రికార్డుల సమీకరణ.',

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
    cardEmergencyDescElderly: 'అత్యవసర హెల్ప్‌లైన్, అంబులెన్స్ మరియు ఆసుపత్రి సహాయానికి తక్షణ ప్రాప్యత.',
    cardEmergencyDescModern: 'వేగవంతమైన అత్యవసర స్పందన బృందాలు మరియు సమీప కేంద్రాలకు ప్రత్యక్ష లింక్.',
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

    // Banner
    bannerElderlyActive: 'മുതിർന്നവർക്കുള്ള മോഡ് സജീവമാണ് (Elderly Mode)',
    bannerModernActive: 'ആധുനിക മോഡ് സജീവമാണ് (Modern Mode)',
    bannerElderlyDesc: 'എളുപ്പത്തിൽ വായിക്കാൻ വലിയ അക്ഷരങ്ങളും ഉയർന്ന വ്യക്തതയുമുള്ള ലളിതമായ കാഴ്ച',
    bannerModernDesc: 'എല്ലാ ഫീച്ചറുകളോടും കൂടിയ സാധാരണ ആധുനിക ലേഔട്ട്',
    bannerChangeBtn: 'മോഡ് മാറ്റുക • Switch',

    // Hero
    heroTitleElderly: 'പ്രീ-കൺസൾട്ടിലേക്ക് സ്വാഗതം',
    heroSubElderly: 'ഡോക്ടർ കൺസൾട്ടേഷനുകൾ എല്ലാവർക്കും ലളിതവും സൗകര്യപ്രദവും മനസ്സിലാക്കാൻ എളുപ്പവുമാക്കിയിരിക്കുന്നു.',
    heroTitleModern: 'സ്മാർട്ട് ഹെൽത്ത്‌കെയർ പ്രീ-കൺസൾട്ടേഷൻ',
    heroSubModern: 'തടസ്സമില്ലാത്ത പ്രീ-കൺസൾട്ടേഷൻ രോഗനിർണയം, ഷെഡ്യൂളിംഗ്, രോഗിയുടെ ഹിസ്റ്ററി മാനേജ്മെന്റ്.',

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
