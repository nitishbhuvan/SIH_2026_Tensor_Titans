const LANGUAGE_LOCALES = {
  en: 'en-IN', hi: 'hi-IN', kn: 'kn-IN', ta: 'ta-IN', te: 'te-IN', mr: 'mr-IN',
  bn: 'bn-IN', gu: 'gu-IN', pa: 'pa-IN', ml: 'ml-IN', sa: 'sa-IN', ur: 'ur-IN',
};

const AUDIO_CACHE = new Map();
let currentAudio = null;
let currentLanguage = null;

function normalizeLanguage(language) {
  return LANGUAGE_LOCALES[language] ? language : 'en';
}

async function getAudioData(text, language) {
  const cacheKey = `${language}:${text}`;
  if (AUDIO_CACHE.has(cacheKey)) return AUDIO_CACHE.get(cacheKey);
  const response = await fetch('/api/bhashini-tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language }),
  });
  const data = await response.json();
  if (!response.ok || !data.success || !data.audioContent) throw new Error(data.error || 'Bhashini TTS unavailable.');
  const audioData = `data:audio/${data.audioFormat || 'wav'};base64,${data.audioContent}`;
  AUDIO_CACHE.set(cacheKey, audioData);
  return audioData;
}

export function stopCurrentSpeech() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
    currentLanguage = null;
  }
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

export function isSpeechPlaying() { return Boolean(currentAudio && !currentAudio.paused); }
export function getPlayingLang() { return currentLanguage; }

export async function speakTextWithBhashini(text, language = 'en', callbacks = {}) {
  if (!text?.trim()) return false;
  const normalizedLanguage = normalizeLanguage(language);
  stopCurrentSpeech();
  try {
    const audio = new Audio(await getAudioData(text.trim(), normalizedLanguage));
    currentAudio = audio;
    currentLanguage = normalizedLanguage;
    audio.onended = () => {
      currentAudio = null;
      currentLanguage = null;
      callbacks.onEnd?.();
    };
    await audio.play();
    return true;
  } catch {
    currentAudio = null;
    currentLanguage = null;
    return false;
  }
}

export async function playLanguageSample(language = 'en') {
  const samples = {
    en: 'Welcome to Ayusetu. Please tell us about your health concern.',
    hi: 'आयुसेतु में आपका स्वागत है। कृपया अपनी स्वास्थ्य समस्या बताएं।',
    kn: 'ಆಯುಸೇತುವಿಗೆ ಸ್ವಾಗತ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಮಸ್ಯೆಯನ್ನು ತಿಳಿಸಿ.',
    ta: 'ஆயுசேதுவிற்கு வரவேற்கிறோம். உங்கள் உடல்நலப் பிரச்சனையை கூறுங்கள்.',
    te: 'ఆయుసేతుకు స్వాగతం. దయచేసి మీ ఆరోగ్య సమస్యను చెప్పండి.',
    mr: 'आयुसेतुमध्ये आपले स्वागत आहे. कृपया आपल्या आरोग्याची समस्या सांगा.',
    bn: 'আয়ুসেতুতে স্বাগতম। অনুগ্রহ করে আপনার স্বাস্থ্য সমস্যার কথা বলুন।',
    gu: 'આયુસેતુમાં આપનું સ્વાગત છે. કૃપા કરીને તમારી સ્વાસ્થ્ય સમસ્યા જણાવો.',
    pa: 'ਆਯੂਸੇਤੂ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਸਿਹਤ ਸਮੱਸਿਆ ਦੱਸੋ।',
    ml: 'ആയുസേതുവിലേക്ക് സ്വാഗതം. നിങ്ങളുടെ ആരോഗ്യ പ്രശ്നം പറയുക.',
    sa: 'आयुसेतौ स्वागतम्। कृपया स्वस्य स्वास्थ्यसमस्यां वदतु।',
  };
  return speakTextWithBhashini(samples[language] || samples.en, language);
}

export { LANGUAGE_LOCALES };
