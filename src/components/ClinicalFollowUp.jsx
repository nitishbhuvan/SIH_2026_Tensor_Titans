import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronRight, Mic, MicOff, Volume2 } from 'lucide-react';
import './ClinicalFollowUp.css';

const QUESTIONS = [
  { id: 'onset', title: 'When did this problem begin?', prompt: 'When did this problem begin, and did it start suddenly or gradually?', options: ['Today', 'Within the last week', 'More than a week ago', 'It started gradually'] },
  { id: 'severity', title: 'How severe is it?', prompt: 'On a scale from zero to ten, how severe is the problem right now?', options: ['Mild: 1 to 3', 'Moderate: 4 to 6', 'Severe: 7 to 10'] },
  { id: 'progression', title: 'Is it changing?', prompt: 'Is the problem getting better, getting worse, or staying the same?', options: ['Getting better', 'Getting worse', 'Staying the same', 'It comes and goes'] },
  { id: 'history', title: 'Tell us about your medical history', prompt: 'Have you had any major illnesses, operations, or hospital visits before?', options: ['No previous medical history', 'Yes, I have previous conditions', 'I am not sure'] },
  { id: 'medications', title: 'Current medicines and allergies', prompt: 'What medicines or Ayurvedic formulations are you taking, and do you have any medicine allergies?', options: ['No regular medicines or known allergies', 'I take regular medicines', 'I have a medicine allergy'] },
];

const SPEECH_LANGUAGES = { en: 'en-IN', hi: 'hi-IN', kn: 'kn-IN', ta: 'ta-IN', te: 'te-IN', ml: 'ml-IN' };

export default function ClinicalFollowUp({ clinicalData, userLanguage = 'en', onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const question = QUESTIONS[step];

  const speakQuestion = () => {
    if (!question || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(question.prompt);
    utterance.lang = SPEECH_LANGUAGES[userLanguage] || 'en-IN';
    utterance.rate = 0.92;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    speakQuestion();
    return () => window.speechSynthesis?.cancel();
  }, [step]);

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
        history_of_present_illness: { onset: nextAnswers.onset || '', severity: nextAnswers.severity || '', progression: nextAnswers.progression || '' },
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
        <h4>{question.title}</h4><p className="follow-up-prompt">{question.prompt}</p>
        <div className="follow-up-options">{question.options.map((option) => <button type="button" key={option} onClick={() => submitAnswer(option)}><Check size={15} /> {option}</button>)}</div>
        <div className="follow-up-free-answer"><input value={typedAnswer} onChange={(event) => setTypedAnswer(event.target.value)} placeholder="Or type / speak your own answer…" /><button type="button" className={`follow-up-mic ${isListening ? 'is-listening' : ''}`} onClick={startListening} aria-label={isListening ? 'Stop speaking' : 'Speak answer'}>{isListening ? <MicOff size={18} /> : <Mic size={18} />}</button><button type="button" className="follow-up-next" onClick={() => submitAnswer(typedAnswer)} disabled={!typedAnswer.trim()}><ChevronRight size={18} /></button></div>
      </div>
      <p className="follow-up-note">You can answer by voice or touch. This is an intake assistant, not a diagnosis.</p>
    </section>
  );
}
