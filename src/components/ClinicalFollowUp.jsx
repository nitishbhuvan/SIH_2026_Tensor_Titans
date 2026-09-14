import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronRight, Mic, MicOff, Volume2 } from 'lucide-react';
import './ClinicalFollowUp.css';

const QUESTIONS = [
  { id: 'onset', title: 'When did this problem begin?', prompt: { en: 'When exactly did this problem begin? Did it start suddenly or gradually?', hi: 'यह समस्या ठीक कब शुरू हुई? क्या यह अचानक शुरू हुई या धीरे-धीरे?', kn: 'ಈ ಸಮಸ್ಯೆ ನಿಖರವಾಗಿ ಯಾವಾಗ ಪ್ರಾರಂಭವಾಯಿತು? ಇದು ಹಠಾತ್ತಾಗಿ ಅಥವಾ ನಿಧಾನವಾಗಿ ಪ್ರಾರಂಭವಾಯಿತೇ?', ta: 'இந்தப் பிரச்சனை சரியாக எப்போது தொடங்கியது? திடீரெனவா அல்லது படிப்படியாகவா?', te: 'ఈ సమస్య సరిగ్గా ఎప్పుడు ప్రారంభమైంది? అకస్మాత్తుగా లేదా క్రమంగా ప్రారంభమైందా?', ml: 'ഈ പ്രശ്നം കൃത്യമായി എപ്പോൾ ആരംഭിച്ചു? പെട്ടെന്നാണോ ക്രമേണയാണോ?' }, options: ['Today', 'Within the last week', 'More than a week ago', 'It started gradually'] },
  { id: 'location', title: 'Where do you feel it?', prompt: { en: 'Where exactly do you feel the symptom? Does it spread to another part of the body?', hi: 'लक्षण आपको ठीक कहाँ महसूस होता है? क्या यह शरीर के किसी दूसरे हिस्से तक फैलता है?', kn: 'ಲಕ್ಷಣವು ನಿಮಗೆ ನಿಖರವಾಗಿ ಎಲ್ಲಿದೆ? ಅದು ದೇಹದ ಬೇರೆ ಭಾಗಕ್ಕೆ ಹರಡುತ್ತದೆಯೇ?', ta: 'அறிகுறி சரியாக எங்கே உணரப்படுகிறது? அது உடலின் வேறு பகுதிக்கு பரவுகிறதா?', te: 'లక్షణం మీకు సరిగ్గా ఎక్కడ అనిపిస్తుంది? ఇది శరీరంలోని మరొక భాగానికి వ్యాపిస్తుందా?', ml: 'ലക്ഷണം കൃത്യമായി എവിടെയാണ് അനുഭവപ്പെടുന്നത്? ഇത് ശരീരത്തിന്റെ മറ്റൊരു ഭാഗത്തേക്ക് പടരുന്നുണ്ടോ?' }, options: ['One specific area', 'More than one area', 'It moves or spreads'] },
  { id: 'character', title: 'What does it feel like?', prompt: { en: 'How would you describe the symptom: burning, pressure, sharp pain, dull pain, throbbing, itching, or something else?', hi: 'लक्षण कैसा महसूस होता है: जलन, दबाव, तेज दर्द, हल्का दर्द, धड़कन, खुजली या कुछ और?', kn: 'ಲಕ್ಷಣವು ಹೇಗೆ ಅನಿಸುತ್ತದೆ: ಉರಿ, ಒತ್ತಡ, ಚುಚ್ಚುವ ನೋವು, ಮಂದ ನೋವು, ಬಡಿತ, ತುರಿಕೆ ಅಥವಾ ಬೇರೆ ರೀತಿಯೇ?', ta: 'அறிகுறி எப்படி உணரப்படுகிறது: எரிச்சல், அழுத்தம், கூர்மையான வலி, மந்தமான வலி, துடிப்பு, அரிப்பு அல்லது வேறு ஏதாவது?', te: 'లక్షణం ఎలా అనిపిస్తుంది: మంట, ఒత్తిడి, తీవ్రమైన నొప్పి, మందమైన నొప్పి, దడ, దురద లేదా మరేదైనా?', ml: 'ലക്ഷണം എങ്ങനെ അനുഭവപ്പെടുന്നു: എരിച്ചിൽ, സമ്മർദ്ദം, കുത്തുന്ന വേദന, മന്ദമായ വേദന, മിടിപ്പ്, ചൊറിച്ചിൽ അല്ലെങ്കിൽ മറ്റെന്തെങ്കിലും?' }, options: ['Burning or pressure', 'Sharp or cramping', 'Dull or throbbing', 'Something else'] },
  { id: 'severity', title: 'How severe is it?', prompt: { en: 'On a scale from zero to ten, how severe is the symptom right now?', hi: 'शून्य से दस के पैमाने पर अभी लक्षण कितना गंभीर है?', kn: 'ಶೂನ್ಯದಿಂದ ಹತ್ತರವರೆಗೆ, ಈಗ ಲಕ್ಷಣ ಎಷ್ಟು ತೀವ್ರವಾಗಿದೆ?', ta: 'பூஜ்ஜியம் முதல் பத்து வரை, தற்போது அறிகுறி எவ்வளவு கடுமையாக உள்ளது?', te: 'సున్నా నుండి పది వరకు, ప్రస్తుతం లక్షణం ఎంత తీవ్రంగా ఉంది?', ml: 'പൂജ്യം മുതൽ പത്ത് വരെ, ഇപ്പോൾ ലക്ഷണം എത്രത്തോളം കഠിനമാണ്?' }, options: ['Mild: 1 to 3', 'Moderate: 4 to 6', 'Severe: 7 to 10'] },
  { id: 'triggers', title: 'What makes it better or worse?', prompt: { en: 'What makes the symptom worse or better? Does food, movement, position, weather, or rest affect it?', hi: 'लक्षण किससे बढ़ता या कम होता है? क्या खाना, हरकत, स्थिति, मौसम या आराम से फर्क पड़ता है?', kn: 'ಲಕ್ಷಣವು ಯಾವುದರಿಂದ ಹೆಚ್ಚಾಗುತ್ತದೆ ಅಥವಾ ಕಡಿಮೆಯಾಗುತ್ತದೆ? ಆಹಾರ, ಚಲನೆ, ಭಂಗಿ, ಹವಾಮಾನ ಅಥವಾ ವಿಶ್ರಾಂತಿಯಿಂದ ಬದಲಾವಣೆಯಾಗುತ್ತದೆಯೇ?', ta: 'அறிகுறி எதனால் அதிகமாகிறது அல்லது குறைகிறது? உணவு, இயக்கம், நிலை, வானிலை அல்லது ஓய்வு பாதிக்கிறதா?', te: 'లక్షణం దేనివల్ల పెరుగుతుంది లేదా తగ్గుతుంది? ఆహారం, కదలిక, స్థానం, వాతావరణం లేదా విశ్రాంతి ప్రభావం చూపుతుందా?', ml: 'ലക്ഷണം എന്തുകൊണ്ട് കൂടുകയോ കുറയുകയോ ചെയ്യുന്നു? ഭക്ഷണം, ചലനം, സ്ഥാനം, കാലാവസ്ഥ അല്ലെങ്കിൽ വിശ്രമം ബാധിക്കുന്നുണ്ടോ?' }, options: ['Worse with movement', 'Worse after food', 'Better with rest', 'No clear trigger'] },
  { id: 'associated', title: 'What other symptoms are present?', prompt: { en: 'Are you having any other symptoms such as fever, breathlessness, vomiting, dizziness, weakness, or swelling?', hi: 'बुखार, सांस फूलना, उल्टी, चक्कर, कमजोरी या सूजन जैसे कोई अन्य लक्षण हैं?', kn: 'ಜ್ವರ, ಉಸಿರಾಟದ ತೊಂದರೆ, ವಾಂತಿ, ತಲೆಸುತ್ತು, ದೌರ್ಬಲ್ಯ ಅಥವಾ ಊತದಂತಹ ಬೇರೆ ಲಕ್ಷಣಗಳಿವೆಯೇ?', ta: 'காய்ச்சல், மூச்சுத்திணறல், வாந்தி, தலைசுற்றல், பலவீனம் அல்லது வீக்கம் போன்ற வேறு அறிகுறிகள் உள்ளனவா?', te: 'జ్వరం, శ్వాస తీసుకోవడంలో ఇబ్బంది, వాంతులు, తల తిరగడం, బలహీనత లేదా వాపు వంటి ఇతర లక్షణాలు ఉన్నాయా?', ml: 'പനി, ശ്വാസംമുട്ടൽ, ഛർദ്ദി, തലകറക്കം, ബലഹീനത അല്ലെങ്കിൽ വീക്കം പോലുള്ള മറ്റ് ലക്ഷണങ്ങളുണ്ടോ?' }, options: ['No other symptoms', 'Fever or weakness', 'Breathing or chest symptoms', 'Stomach or bowel symptoms'] },
  { id: 'progression', title: 'How has it changed?', prompt: { en: 'Since it began, is the symptom getting better, getting worse, staying the same, or coming and going?', hi: 'തുടങ്ങിയതിന് ശേഷം ഇത് മെച്ചപ്പെടുകയാണോ, വഷളാകുകയാണോ, അതേപടി തുടരുകയാണോ, ഇടയ്ക്കിടെ വരികയാണോ?', kn: 'ಪ್ರಾರಂಭವಾದ ನಂತರ ಲಕ್ಷಣವು ಕಡಿಮೆಯಾಗುತ್ತಿದೆಯೇ, ಹೆಚ್ಚಾಗುತ್ತಿದೆಯೇ, ಹಾಗೆಯೇ ಇದೆಯೇ ಅಥವಾ ಆಗಾಗ್ಗೆ ಬರುತ್ತದೆಯೇ?', ta: 'தொடங்கியதிலிருந்து அறிகுறி குறைகிறதா, அதிகரிக்கிறதா, மாறாமல் உள்ளதா அல்லது இடையிடையே வருகிறதா?', te: 'ప్రారంభమైనప్పటి నుండి లక్షణం తగ్గుతోందా, పెరుగుతోందా, అలాగే ఉందా లేదా అప్పుడప్పుడు వస్తుందా?', ml: 'ആരംഭിച്ചതിനുശേഷം ലക്ഷണം മെച്ചപ്പെടുകയാണോ, വഷളാകുകയാണോ, അതേപടി തുടരുകയാണോ, ഇടയ്ക്കിടെ വരുകയാണോ?' }, options: ['Getting better', 'Getting worse', 'Staying the same', 'It comes and goes'] },
  { id: 'prior_episode', title: 'Has this happened before?', prompt: { en: 'Have you had the same problem before? If yes, what treatment or medicine helped?', hi: 'ഇതേ പ്രശ്നം മുമ്പ് ഉണ്ടായിട്ടുണ്ടോ? ഉണ്ടെങ്കിൽ ഏത് ചികിത്സയോ മരുന്നോ സഹായിച്ചു?', kn: 'ಇದೇ ಸಮಸ್ಯೆ ಹಿಂದೆ ಆಗಿತ್ತೇ? ಆಗಿದ್ದರೆ ಯಾವ ಚಿಕಿತ್ಸೆ ಅಥವಾ ಔಷಧಿ ಸಹಾಯ ಮಾಡಿತು?', ta: 'இதே பிரச்சனை முன்பு ஏற்பட்டதா? ஏற்பட்டிருந்தால் எந்த சிகிச்சை அல்லது மருந்து உதவியது?', te: 'ఇదే సమస్య ఇంతకు ముందు వచ్చిందా? అయితే ఏ చికిత్స లేదా మందు సహాయపడింది?', ml: 'ഇതേ പ്രശ്നം മുമ്പ് ഉണ്ടായിട്ടുണ്ടോ? ഉണ്ടായെങ്കിൽ ഏത് ചികിത്സയോ മരുന്നോ സഹായിച്ചു?' }, options: ['Never happened before', 'It happened before', 'I am not sure'] },
  { id: 'history', title: 'Tell us about your medical history', prompt: { en: 'Have you had any major illnesses, operations, hospital visits, diabetes, high blood pressure, or heart problems before?', hi: 'മുമ്പ് എന്തെങ്കിലും ഗുരുതര രോഗങ്ങൾ, ശസ്ത്രക്രിയകൾ, ആശുപത്രി സന്ദർശനങ്ങൾ, പ്രമേഹം, ഉയർന്ന രക്തസമ്മർദ്ദം അല്ലെങ്കിൽ ഹൃദയപ്രശ്നങ്ങൾ ഉണ്ടായിട്ടുണ്ടോ?', kn: 'ಹಿಂದೆ ಯಾವುದೇ ಪ್ರಮುಖ ಕಾಯಿಲೆಗಳು, ಶಸ್ತ್ರಚಿಕಿತ್ಸೆಗಳು, ಆಸ್ಪತ್ರೆ ಭೇಟಿ, ಮಧುಮೇಹ, ಅಧಿಕ ರಕ್ತದೊತ್ತಡ ಅಥವಾ ಹೃದಯ ಸಮಸ್ಯೆಗಳಿದ್ದವೆಯೇ?', ta: 'முன்பு பெரிய நோய்கள், அறுவை சிகிச்சைகள், மருத்துவமனைச் சந்திப்புகள், சர்க்கரை நோய், உயர் இரத்த அழுத்தம் அல்லது இதயப் பிரச்சனைகள் இருந்தனவா?', te: 'గతంలో పెద్ద అనారోగ్యాలు, శస్త్రచికిత్సలు, ఆసుపత్రి సందర్శనలు, మధుమేహం, అధిక రక్తపోటు లేదా గుండె సమస్యలు ఉన్నాయా?', ml: 'മുമ്പ് വലിയ രോഗങ്ങൾ, ശസ്ത്രക്രിയകൾ, ആശുപത്രി സന്ദർശനങ്ങൾ, പ്രമേഹം, ഉയർന്ന രക്തസമ്മർദ്ദം അല്ലെങ്കിൽ ഹൃദയപ്രശ്നങ്ങൾ ഉണ്ടായിട്ടുണ്ടോ?' }, options: ['No previous medical history', 'Yes, I have previous conditions', 'I am not sure'] },
  { id: 'medications', title: 'Current medicines and allergies', prompt: { en: 'What medicines or Ayurvedic formulations are you taking now, and do you have any medicine or food allergies?', hi: 'ഇപ്പോൾ നിങ്ങൾ ഏത് മരുന്നുകളോ ആയുർവേദ ഫോർമുലേഷനുകളോ കഴിക്കുന്നു? മരുന്നിനോ ഭക്ഷണത്തിനോ അലർജിയുണ്ടോ?', kn: 'ನೀವು ಈಗ ಯಾವ ಔಷಧಿಗಳು ಅಥವಾ ಆಯುರ್ವೇದ ಔಷಧಿಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಿ? ಔಷಧಿ ಅಥವಾ ಆಹಾರ ಅಲರ್ಜಿ ಇದೆಯೇ?', ta: 'நீங்கள் தற்போது எந்த மருந்துகள் அல்லது ஆயுர்வேத மருந்துகள் எடுத்துக்கொள்கிறீர்கள்? மருந்து அல்லது உணவு ஒவ்வாமை உள்ளதா?', te: 'మీరు ప్రస్తుతం ఏ మందులు లేదా ఆయుర్వేద మందులు తీసుకుంటున్నారు? మందులు లేదా ఆహారానికి అలర్జీ ఉందా?', ml: 'നിങ്ങൾ ഇപ്പോൾ ഏത് മരുന്നുകളോ ആയുർവേദ മരുന്നുകളോ കഴിക്കുന്നു? മരുന്നിനോ ഭക്ഷണത്തിനോ അലർജിയുണ്ടോ?' }, options: ['No regular medicines or known allergies', 'I take regular medicines', 'I have a medicine allergy'] },
];

const SPEECH_LANGUAGES = { en: 'en-IN', hi: 'hi-IN', kn: 'kn-IN', ta: 'ta-IN', te: 'te-IN', ml: 'ml-IN' };

const getLocalized = (copy, language) => copy[language] || copy.en;

export default function ClinicalFollowUp({ clinicalData, userLanguage = 'en', onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);
  const question = QUESTIONS[step];
  const questionTitle = question.title;
  const questionPrompt = getLocalized(question.prompt, userLanguage);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return undefined;
    const loadVoices = () => setAvailableVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  const speakQuestion = async () => {
    if (!question) return;
    setIsSpeaking(true);
    window.speechSynthesis?.cancel();
    try {
      const response = await fetch('/api/bhashini-tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: questionPrompt, language: userLanguage }) });
      const data = await response.json();
      if (response.ok && data.success && data.audioContent) {
        const audio = new Audio(`data:audio/${data.audioFormat || 'wav'};base64,${data.audioContent}`);
        audioRef.current = audio;
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => setIsSpeaking(false);
        await audio.play();
        return;
      }
    } catch (_) {
      // Use browser speech when Bhashini is unavailable.
    }
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(questionPrompt);
      utterance.lang = SPEECH_LANGUAGES[userLanguage] || 'en-IN';
      const languagePrefix = utterance.lang.toLowerCase().split('-')[0];
      const matchingVoice = availableVoices.find((voice) => voice.lang.toLowerCase().startsWith(languagePrefix));
      if (matchingVoice) utterance.voice = matchingVoice;
      utterance.rate = 0.92;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else setIsSpeaking(false);
  };

  useEffect(() => {
    if (hasStarted) speakQuestion();
    return () => window.speechSynthesis?.cancel();
  }, [step, userLanguage, availableVoices, hasStarted]);

  const startVoiceInterview = () => {
    setHasStarted(true);
    speakQuestion();
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = SPEECH_LANGUAGES[userLanguage] || 'en-IN';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      setTypedAnswer(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  };

  const submitAnswer = (answer) => {
    const value = answer.trim();
    if (!value) return;
    const nextAnswers = { ...answers, [question.id]: value };
    setAnswers(nextAnswers);
    setTypedAnswer('');
    if (step === QUESTIONS.length - 1) {
      onComplete({
        history_of_present_illness: { onset: nextAnswers.onset || '', location: nextAnswers.location || '', character: nextAnswers.character || '', severity: nextAnswers.severity || '', triggers: nextAnswers.triggers || '', associated_symptoms: nextAnswers.associated || '', progression: nextAnswers.progression || '', previous_episode: nextAnswers.prior_episode || '' },
        medical_history: { previous_illnesses_or_operations: nextAnswers.history || '', medications_and_allergies: nextAnswers.medications || '' },
        follow_up_answers: nextAnswers,
      });
    } else {
      setStep((current) => current + 1);
    }
  };

  return (
    <section className="clinical-follow-up" aria-labelledby="follow-up-title">
      <div className="clinical-follow-up-header">
        <div><span className="follow-up-kicker">NIDAN-AI / FOLLOW-UP INTERVIEW</span><h3 id="follow-up-title">Let us understand your complaint better</h3><p>The assistant will ask about your current illness and medical history.</p></div>
        <span className="follow-up-progress">{step + 1} / {QUESTIONS.length}</span>
      </div>
      <div className="follow-up-chief-complaint"><span>Chief complaint captured</span><strong>{clinicalData?.chief_complaint || 'Your reported symptoms'}</strong></div>
      <div className="follow-up-question-card">
        <div className="follow-up-question-top"><span>Question {step + 1}</span><button type="button" className="follow-up-speak-btn" onClick={speakQuestion}><Volume2 size={16} /> {isSpeaking ? 'Speaking…' : 'Read aloud'}</button></div>
        <h4>{questionTitle}</h4><p className="follow-up-prompt">{questionPrompt}</p>
        {!hasStarted && <button type="button" className="follow-up-start-voice" onClick={startVoiceInterview}><Volume2 size={18} /> Start Voice Interview</button>}
        <div className="follow-up-options">{question.options.map((option) => <button type="button" key={option} onClick={() => submitAnswer(option)}><Check size={15} /> {option}</button>)}</div>
        <div className="follow-up-free-answer"><input value={typedAnswer} onChange={(event) => setTypedAnswer(event.target.value)} placeholder="Or type / speak your own answer…" /><button type="button" className={`follow-up-mic ${isListening ? 'is-listening' : ''}`} onClick={startListening} aria-label={isListening ? 'Stop speaking' : 'Speak answer'}>{isListening ? <MicOff size={18} /> : <Mic size={18} />}</button><button type="button" className="follow-up-next" onClick={() => submitAnswer(typedAnswer)} disabled={!typedAnswer.trim()}><ChevronRight size={18} /></button></div>
      </div>
      <p className="follow-up-note">You can answer by voice or touch. This is an intake assistant, not a diagnosis.</p>
    </section>
  );
}
