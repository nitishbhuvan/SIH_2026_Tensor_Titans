import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Check, ChevronRight, Mic, MicOff, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { speakTextWithBhashini, stopCurrentSpeech, isSpeechPlaying } from '../services/bhashiniTtsService.js';
import './ClinicalFollowUp.css';

const QUESTIONS = [
  {
    id: 'onset',
    title: 'When did this problem begin?',
    prompt: {
      en: 'When exactly did this problem begin? Did it start suddenly or gradually?',
      hi: 'यह समस्या ठीक कब शुरू हुई? क्या यह अचानक शुरू हुई या धीरे-धीरे?',
      kn: 'ಈ ಸಮಸ್ಯೆ ನಿಖರವಾಗಿ ಯಾವಾಗ ಪ್ರಾರಂಭವಾಯಿತು? ಇದು ಹಠಾತ್ತಾಗಿ ಅಥವಾ ನಿಧಾನವಾಗಿ ಪ್ರಾರಂಭವಾಯಿತೇ?',
      ta: 'இந்தப் பிரச்சனை சரியாக எப்போது தொடங்கியது? திடீரெனவா அல்லது படிப்படியாகவா?',
      te: 'ఈ సమస్య సరిగ్గా ఎప్పుడు ప్రారంభమైంది? అకస్మాత్తుగా లేదా క్రమంగా ప్రారంభమైందా?',
      ml: 'ഈ പ്രശ്നം കൃത്യമായി എപ്പോൾ ആരംഭിച്ചു? പെട്ടെന്നാണോ ക്രമേണയാണോ?',
      mr: 'ही समस्या नक्की कधी सुरू झाली? ती अचानक सुरू झाली की हळूहळू?',
      bn: 'এই সমস্যাটি ঠিক কখন শুরু হয়েছিল? এটি কি হঠাৎ নাকি ধীরে ধীরে শুরু হয়েছিল?',
      gu: 'આ સમસ્યા ક્યારે શરૂ થઈ? અચાનક કે ધીમે ધીમે?',
      pa: 'ਇਹ ਸਮੱਸਿਆ ਕਦੋਂ ਸ਼ੁਰੂ ਹੋਈ ਸੀ? ਅਚਾਨਕ ਜਾਂ ਹੌਲੀ-ਹੌਲੀ?',
      sa: 'इयं समस्या कदा प्रारब्धा? अकस्मात् उत शनैः शनैः?'
    },
    options: ['Today', 'Within the last week', 'More than a week ago', 'It started gradually']
  },
  {
    id: 'severity',
    title: 'How severe is your discomfort?',
    prompt: {
      en: 'On a scale from 1 to 10, how severe is your discomfort or pain right now?',
      hi: '1 से 10 के पैमाने पर, अभी आपकी तकलीफ या दर्द कितना गंभीर है?',
      kn: '1 ರಿಂದ 10 ರ ಪ್ರಮಾಣದಲ್ಲಿ, ನಿಮ್ಮ ಅಸ್ವಸ್ಥತೆ ಅಥವಾ ನೋವು ಎಷ್ಟು ತೀವ್ರವಾಗಿದೆ?',
      ta: '1 முதல் 10 வரையிலான அளவில், உங்கள் வலி அல்லது அசௌகரியம் எவ்வளவு தீவிரமானது?',
      te: '1 నుండి 10 స్కేలులో, మీ అసౌకర్యం లేదా నొప్పి ఎంత తీవ్రంగా ఉంది?',
      ml: '1 മുതൽ 10 വരെയുള്ള സ്കെയിലിൽ, നിങ്ങളുടെ വേദന എത്രത്തോളം കഠിനമാണ്?',
      mr: '1 ते 10 च्या स्केलवर, तुमचा त्रास किंवा वेदना किती तीव्र आहे?',
      bn: '১ থেকে ১০ এর স্কেলে, আপনার কষ্ট বা ব্যথা কতটা তীব্র?',
      gu: '૧ થી ૧૦ ના સ્કેલ પર, તમારી તકલીફ કેટલી ગંભીર છે?',
      pa: '1 ਤੋਂ 10 ਦੇ ਪੈਮਾਨੇ ਤੇ, ਤੁਹਾਡੀ ਤਕਲੀਫ ਕਿੰਨੀ ਗੰਭੀਰ ਹੈ?',
      sa: 'एकतः दशपर्यन्तं परिमाणे भवतः पीडा कियान् तीव्रा अस्ति?'
    },
    options: ['Mild (1-3)', 'Moderate (4-6)', 'Severe (7-8)', 'Very Severe (9-10)']
  },
  {
    id: 'location',
    title: 'Where do you feel it?',
    prompt: {
      en: 'Where exactly do you feel the symptom? Does it spread to another part of the body?',
      hi: 'लक्षण आपको ठीक कहाँ महसूस होता है? क्या यह शरीर के किसी दूसरे हिस्से तक फैलता है?',
      kn: 'ಲಕ್ಷಣವು ನಿಮಗೆ ನಿಖರವಾಗಿ ಎಲ್ಲಿದೆ? ಅದು ದೇಹದ ಬೇರೆ ಭಾಗಕ್ಕೆ ಹರಡುತ್ತದೆಯೇ?',
      ta: 'அறிகுறி சரியாக எங்கே உணரப்படுகிறது? அது உடலின் வேறு பகுதிக்கு பரவுகிறதா?',
      te: 'లక్షణం మీకు సరిగ్గా ఎక్కడ అనిపిస్తుంది? ఇది శరీరంలోని మరొక భాగానికి వ్యాపిస్తుందా?',
      ml: 'ലക്ഷണം കൃത്യമായി എവിടെയാണ് അനുഭവപ്പെടുന്നത്? ഇത് ശരീരത്തിന്റെ മറ്റൊരു ഭാഗത്തേക്ക് പടരുന്നുണ്ടോ?',
      mr: 'लक्षण नक्की कुठे जाणवते? ते शरीराच्या इतर भागांत पसरते का?',
      bn: 'লক্ষণটি ঠিক কোথায় অনুভব করছেন? এটি কি শরীরের অন্য কোথাও ছড়িয়ে পড়ছে?',
      gu: 'લક્ષણ ક્યાં અનુભવાય છે? શું તે અન્ય ભાગોમાં ફેલાય છે?',
      pa: 'ਲੱਛਣ ਠੀਕ ਕਿੱਥੇ ਮਹਿਸੂਸ ਹੁੰਦਾ ਹੈ?',
      sa: 'लक्षणं कुत्र अनुभूयते? किं शरीरस्य अन्यभागे प्रसरति?'
    },
    options: ['Chest / Epigastric', 'Abdomen / Stomach', 'Joints / Back', 'Head / Neck', 'Generalized / Whole Body']
  },
  {
    id: 'history',
    title: 'Tell us about your medical history',
    prompt: {
      en: 'Have you had any major illnesses, operations, diabetes, high blood pressure, or heart problems before?',
      hi: 'क्या आपको पहले कोई गंभीर बीमारी, ऑपरेशन, मधुमेह, उच्च रक्तचाप या दिल की समस्या रही है?',
      kn: 'ಹಿಂದೆ ಯಾವುದೇ ಪ್ರಮುಖ ಕಾಯಿಲೆಗಳು, ಶಸ್ತ್ರಚಿಕಿತ್ಸೆಗಳು, ಮಧುಮೇಹ, ಅಧಿಕ ರಕ್ತದೊತ್ತಡ ಅಥವಾ ಹೃದಯ ಸಮಸ್ಯೆಗಳಿದ್ದವೆಯೇ?',
      ta: 'முன்பு பெரிய நோய்கள், அறுவை சிகிச்சைகள், சர்க்கரை நோய், உயர் இரத்த அழுத்தம் அல்லது இதயப் பிரச்சனைகள் இருந்தனவா?',
      te: 'గతంలో పెద్ద అనారోగ్యాలు, శస్త్రచికిత్సలు, మధుమేహం, అధిక రక్తపోటు లేదా గుండె సమస్యలు ఉన్నాయా?',
      ml: 'മുമ്പ് വലിയ രോഗങ്ങൾ, ശസ്ത്രക്രിയകൾ, പ്രമേഹം, ഉയർന്ന രക്തസമ്മർദ്ദം അല്ലെങ്കിൽ ഹൃദയപ്രശ്നങ്ങൾ ഉണ്ടായിട്ടുണ്ടോ?',
      mr: 'पूर्वी काही मोठे आजार, शस्त्रक्रिया, मधुमेह, उच्च रक्तदाब किंवा हृदयाचा त्रास होता का?',
      bn: 'আগে কি কোন বড় রোগ, অপারেশন, ডায়াবেটিস, উচ্চ রক্তচাপ বা হার্টের সমস্যা ছিল?',
      gu: 'પહેલા કોઈ મોટી બીમારી, ઓપરેશન, ડાયાબિટીસ કે બ્લડ પ્રેશર હતું?',
      pa: 'ਪਹਿਲਾਂ ਕੋਈ ਵੱਡੀ ਬਿਮਾਰੀ ਜਾਂ ਆਪ੍ਰੇਸ਼ਨ ਹੋਇਆ ਹੈ?',
      sa: 'पूर्वम् किमपि गंभीररोगः, शल्यक्रिया, प्रमेहः उत उच्चरक्तचापः आसीत् वा?'
    },
    options: ['No previous medical conditions', 'Hypertension / High BP', 'Diabetes Mellitus', 'Cardiac / Heart History', 'Thyroid / Other']
  },
  {
    id: 'medications',
    title: 'Current medicines and allergies',
    prompt: {
      en: 'What medicines or Ayurvedic formulations are you taking now, and do you have any medicine allergies?',
      hi: 'अभी आप कौन सी दवाएं या आयुर्वेदिक औषधियां ले रहे हैं, और क्या आपको किसी दवा से एलर्जी है?',
      kn: 'ನೀವು ಈಗ ಯಾವ ಔಷಧಿಗಳು ಅಥವಾ ಆಯುರ್ವೇದ ಔಷಧಿಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಿ? ಯಾವುದೇ ಔಷಧಿ ಅಲರ್ಜಿ ಇದೆಯೇ?',
      ta: 'நீங்கள் தற்போது எந்த மருந்துகள் அல்லது ஆயுர்வேத மருந்துகள் எடுத்துக்கொள்கிறீர்கள்? மருந்து ஒவ்வாமை உள்ளதா?',
      te: 'మీరు ప్రస్తుతం ఏ మందులు లేదా ఆಯುర్వేద మందులు తీసుకుంటున్నారు? మందుల అలర్జీ ఉందా?',
      ml: 'നിങ്ങൾ ഇപ്പോൾ ഏത് മരുന്നുകളോ ആയുർവേദ മരുന്നുകളോ കഴിക്കുന്നു? മരുന്നിനോട് അലർജിയുണ്ടോ?',
      mr: 'सध्या आपण कोणती औषधे किंवा आयुर्वेदिक औषधे घेत आहात? काही औषधांची ॲलर्जी आहे का?',
      bn: 'এখন কি ওষুধ বা আয়ুর্বেদিক ঔষধ নিচ্ছেন? কোনো অ্যালার্জি আছে কি?',
      gu: 'હાલમાં કઈ દવાઓ લઈ રહ્યા છો? કોઈ એલર્જી છે?',
      pa: 'ਕਿਹੜੀਆਂ ਦਵਾਈਆਂ ਲੈ ਰਹੇ ਹੋ? ਕੋਈ ਐਲਰਜੀ ਹੈ?',
      sa: 'सम्प्रति कानि औषधानि सेवन्ते? किमपि एलर्जी अस्ति वा?'
    },
    options: ['No regular medicines or known allergies', 'Metformin / Diabetes meds', 'Antihypertensives / BP meds', 'Triphala / Ayurvedic formulations', 'Known medicine allergy']
  }
];

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

const getLocalized = (copy, language) => {
  if (!copy) return '';
  const langKey = (language || 'en').toLowerCase();
  return copy[langKey] || copy.en || Object.values(copy)[0] || '';
};

export default function ClinicalFollowUp({ clinicalData, userLanguage = 'en', onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const recognitionRef = useRef(null);

  const question = QUESTIONS[step];
  const questionPrompt = question ? getLocalized(question.prompt, userLanguage) : '';

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCurrentSpeech();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
    };
  }, []);

  const speakQuestion = useCallback(() => {
    if (!questionPrompt) return;
    setIsSpeaking(true);
    speakTextWithBhashini({
      text: questionPrompt,
      language: userLanguage,
      gender: 'female',
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  }, [questionPrompt, userLanguage]);

  // Read aloud automatically when question step changes if user already started voice flow
  useEffect(() => {
    if (hasStarted && question) {
      speakQuestion();
    }
  }, [step, hasStarted, speakQuestion, question]);

  const startVoiceInterview = () => {
    setHasStarted(true);
    speakQuestion();
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported on this browser. Please type your answer.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    // Stop TTS if speaking
    stopCurrentSpeech();
    setIsSpeaking(false);

    const recognition = new SpeechRecognition();
    recognition.lang = SPEECH_LANG_MAP[userLanguage] || 'en-IN';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      if (transcript.trim()) {
        setTypedAnswer(transcript.trim());
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const submitAnswer = (answer) => {
    const value = (answer || '').trim();
    if (!value) return;

    stopCurrentSpeech();
    setIsSpeaking(false);

    const nextAnswers = { ...answers, [question.id]: value };
    setAnswers(nextAnswers);
    setTypedAnswer('');

    if (step < QUESTIONS.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      onComplete?.(nextAnswers);
    }
  };

  if (!question) {
    return null;
  }

  return (
    <div className="follow-up-card">
      <div className="follow-up-header">
        <div className="follow-up-badge">
          <Sparkles size={14} />
          <span>AI Clinical Follow-up Consultation</span>
        </div>
        <div className="follow-up-progress-text">
          Question {step + 1} of {QUESTIONS.length}
        </div>
      </div>

      <div className="follow-up-progress-bar">
        <div
          className="follow-up-progress-fill"
          style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      {!hasStarted ? (
        <div className="follow-up-start-pane">
          <p className="follow-up-start-desc">
            AYUSETU AI needs a few brief follow-up details to complete your clinical assessment.
            You can answer by speaking in your selected language ({userLanguage.toUpperCase()}) or clicking the options.
          </p>
          <button
            type="button"
            className="follow-up-start-btn"
            onClick={startVoiceInterview}
          >
            <Volume2 size={18} />
            <span>Start Spoken Follow-up Questions (Bhashini TTS)</span>
          </button>
        </div>
      ) : (
        <div className="follow-up-body">
          <div className="follow-up-question-top">
            <span className="question-step-label">Question {step + 1}</span>
            <button
              type="button"
              className={`follow-up-speak-btn ${isSpeaking ? 'is-speaking' : ''}`}
              onClick={() => {
                if (isSpeaking) {
                  stopCurrentSpeech();
                  setIsSpeaking(false);
                } else {
                  speakQuestion();
                }
              }}
              title="Read question aloud via Bhashini TTS"
            >
              <Volume2 size={16} />
              <span>{isSpeaking ? 'Speaking Bhashini TTS…' : 'Read Aloud'}</span>
            </button>
          </div>

          <h4 className="follow-up-question-title">{question.title}</h4>
          <p className="follow-up-question-prompt">{questionPrompt}</p>

          <div className="follow-up-options-grid">
            {question.options.map((option) => (
              <button
                type="button"
                key={option}
                className="follow-up-option-pill"
                onClick={() => submitAnswer(option)}
              >
                <Check size={14} />
                <span>{option}</span>
              </button>
            ))}
          </div>

          <div className="follow-up-free-answer">
            <input
              type="text"
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              placeholder="Or speak / type your own detailed answer…"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && typedAnswer.trim()) {
                  submitAnswer(typedAnswer);
                }
              }}
            />
            <button
              type="button"
              className={`follow-up-mic ${isListening ? 'is-listening' : ''}`}
              onClick={startListening}
              aria-label={isListening ? 'Stop microphone' : 'Speak answer with voice'}
              title={isListening ? 'Listening… Tap to stop' : 'Tap to speak your answer'}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button
              type="button"
              className="follow-up-next"
              onClick={() => submitAnswer(typedAnswer)}
              disabled={!typedAnswer.trim()}
              title="Submit answer and proceed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
