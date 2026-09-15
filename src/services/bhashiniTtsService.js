/**
 * AYUSETU — Bhashini Multilingual Text-To-Speech (TTS) Service
 * High-fidelity Indic studio audio via MeitY Bhashini Dhruva AI with seamless Web Speech fallback.
 * Supports: Kannada, Hindi, Tamil, Telugu, Marathi, Bengali, Malayalam, Gujarati, Punjabi, Sanskrit, English.
 */

export const SPEECH_LANG_LOCALES = {
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
  or: 'or-IN',
  as: 'as-IN',
  ur: 'ur-IN',
  en: 'en-IN'
};

export const SAMPLE_GREETINGS = {
  kn: 'ನಮಸ್ಕಾರ, ಆಯುಸೇತು ಧ್ವನಿ ಸಹಾಯಕಕ್ಕೆ ಸ್ವಾಗತ. ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಮಸ್ಯೆಗಳನ್ನು ಮುಕ್ತವಾಗಿ ತಿಳಿಸಿ.',
  hi: 'नमस्ते, आयुसेतु डिजिटल स्वास्थ्य सहायक में आपका स्वागत है। आप अपनी स्वास्थ्य समस्याएँ विस्तार से बता सकते हैं।',
  ta: 'வணக்கம், ஆயுசேது டிஜிட்டல் சுகாதார உதவியாளருக்கு உங்களை வரவேற்கிறோம். உங்கள் உடல்நலப் பிரச்சனைகளை எங்களிடம் கூறுங்கள்.',
  te: 'నమస్కారం, ఆయుసేతు డిజిటల్ ఆరోగ్య సహాయకుడికి స్వాగతం. మీ ఆరోగ్య సమస్యలను నిరభ్యంతరంగా చెప్పండి.',
  mr: 'नमस्कार, आयुसेतू डिजिटल आरोग्य सहाय्यकामध्ये आपले स्वागत आहे. आपल्या आरोग्यविषयक समस्या सांगा.',
  bn: 'নমস্কার, আয়ুসেতু ডিজিটাল স্বাস্থ্য সহায়কে আপনাকে স্বাগতম। আপনার স্বাস্থ্য समस्या জানান।',
  ml: 'നമസ്കാരം, ആയുസേതു ഡിജിറ്റൽ ആരോഗ്യ സഹായിയിലേക്ക് സ്വാഗതം. നിങ്ങളുടെ ആരോഗ്യ പ്രശ്നങ്ങൾ പങ്കുവെക്കുക.',
  gu: 'નમસ્તે, આયુસેતુ ડિજિટલ આરોગ્ય સહાયકમાં આપનું સ્વાગત છે. તમારી સ્વાસ્થ્ય સમસ્યા જણાવો.',
  pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਆਯੂਸੇਤੂ ਡਿਜੀਟਲ ਸਿਹਤ ਸਹਾਇਕ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ।',
  sa: 'नमस्ते, आयुसेतु आरोग्य सेवासु भवतां स्वागतम्। भवन्तः स्वस्वास्थ्यसमस्यां सूचयन्तु।',
  en: 'Hello, welcome to Ayusetu Clinical Assistant. Please describe your symptoms naturally in your preferred language.'
};

// In-memory cache for Bhashini synthesized audio (Text + Lang + Gender -> Base64 Audio URL)
const audioCache = new Map();
const MAX_CACHE_ITEMS = 60;

let currentAudio = null;
let currentPlayingLanguage = null;
let activeUtterance = null;
let currentSpeechRequestId = 0;
let activeAbortController = null;

/**
 * Check if speech is currently playing
 * @returns {boolean}
 */
export function isSpeechPlaying() {
  if (currentAudio && !currentAudio.paused && !currentAudio.ended) {
    return true;
  }
  if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) {
    return true;
  }
  return false;
}

/**
 * Get the language code of the currently playing speech
 * @returns {string|null}
 */
export function getCurrentPlayingLanguage() {
  return isSpeechPlaying() ? currentPlayingLanguage : null;
}

/**
 * Immediately stop any current audio playback or speech synthesis and cancel any inflight fetch
 */
export function stopCurrentSpeech() {
  currentSpeechRequestId++;
  if (activeAbortController) {
    try {
      activeAbortController.abort();
    } catch (_) {}
    activeAbortController = null;
  }
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.src = '';
    } catch (_) {}
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
    activeUtterance = null;
  }
  currentPlayingLanguage = null;
}

/**
 * Speak text in the target language using Bhashini Indic TTS
 * Supports both object argument `{ text, language, ... }` and positional arguments `(text, language, callbacks)`
 */
export async function speakTextWithBhashini(optionsOrText, languageParam = 'en', callbacksParam = {}) {
  let text = '';
  let language = 'en';
  let gender = 'female';
  let onLoading = null;
  let onStart = null;
  let onEnd = null;
  let onError = null;

  if (typeof optionsOrText === 'string') {
    text = optionsOrText;
    language = languageParam || 'en';
    gender = 'female';
    onLoading = callbacksParam.onLoading;
    onStart = callbacksParam.onStart;
    onEnd = callbacksParam.onEnd;
    onError = callbacksParam.onError;
  } else if (optionsOrText && typeof optionsOrText === 'object') {
    text = optionsOrText.text || '';
    language = optionsOrText.language || 'en';
    gender = optionsOrText.gender || 'female';
    onLoading = optionsOrText.onLoading;
    onStart = optionsOrText.onStart;
    onEnd = optionsOrText.onEnd;
    onError = optionsOrText.onError;
  }

  const cleanText = (text || '').trim();
  if (!cleanText) {
    if (onEnd) onEnd();
    return false;
  }

  // Cancel any existing playing speech or in-flight requests to eliminate echoing
  stopCurrentSpeech();
  const thisRequestId = currentSpeechRequestId;

  const langCode = (language || 'en').toLowerCase().trim();
  const cacheKey = `${langCode}_${gender}_${cleanText}`;

  if (onLoading) onLoading();

  // 1. Check in-memory audio cache for instant playback
  if (audioCache.has(cacheKey)) {
    const cachedData = audioCache.get(cacheKey);
    playBase64Audio(cachedData.audioContent, cachedData.audioFormat, langCode, onStart, onEnd, onError, cleanText, thisRequestId);
    return true;
  }

  // 2. Fetch from Bhashini TTS Backend Proxy (/api/bhashini-tts)
  try {
    const controller = new AbortController();
    activeAbortController = controller;
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const response = await fetch('/api/bhashini-tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: cleanText,
        language: langCode,
        gender: gender
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Stale check: if another speech request was initiated while awaiting, discard this one
    if (thisRequestId !== currentSpeechRequestId) {
      return false;
    }

    if (response.ok) {
      const data = await response.json();
      if (thisRequestId !== currentSpeechRequestId) {
        return false;
      }
      if (data.success && data.audioContent) {
        // Save into cache
        if (audioCache.size >= MAX_CACHE_ITEMS) {
          const firstKey = audioCache.keys().next().value;
          audioCache.delete(firstKey);
        }
        audioCache.set(cacheKey, {
          audioContent: data.audioContent,
          audioFormat: data.audioFormat || 'wav'
        });

        playBase64Audio(data.audioContent, data.audioFormat, langCode, onStart, onEnd, onError, cleanText, thisRequestId);
        return true;
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      return false;
    }
    console.warn('[Bhashini TTS] Service query failed or timed out, falling back to Web Speech:', err.message);
  }

  if (thisRequestId !== currentSpeechRequestId) {
    return false;
  }

  // 3. Fallback to Browser Native SpeechSynthesis
  fallbackToWebSpeech(cleanText, langCode, onStart, onEnd, onError, thisRequestId);
  return true;
}

/**
 * Internal helper to play base64-encoded audio
 */
function playBase64Audio(base64Content, format, langCode, onStart, onEnd, onError, fallbackText, requestId) {
  if (requestId !== undefined && requestId !== currentSpeechRequestId) {
    return;
  }
  try {
    // If an audio is already playing, stop it first
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.src = '';
      } catch (_) {}
      currentAudio = null;
    }

    const mimeType = format === 'mp3' ? 'audio/mp3' : 'audio/wav';
    const audio = new Audio(`data:${mimeType};base64,${base64Content}`);
    currentAudio = audio;
    currentPlayingLanguage = langCode;

    audio.onplay = () => {
      if (requestId !== undefined && requestId !== currentSpeechRequestId) {
        audio.pause();
        return;
      }
      if (onStart) onStart();
    };

    audio.onended = () => {
      if (currentAudio === audio) {
        currentAudio = null;
        currentPlayingLanguage = null;
      }
      if (onEnd) onEnd();
    };

    audio.onerror = (e) => {
      console.warn('[Bhashini TTS] Audio element playback failed, invoking Web Speech fallback:', e);
      if (currentAudio === audio) {
        currentAudio = null;
        currentPlayingLanguage = null;
      }
      fallbackToWebSpeech(fallbackText, langCode, onStart, onEnd, onError, requestId);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((playErr) => {
        if (requestId !== undefined && requestId !== currentSpeechRequestId) {
          return;
        }
        console.warn('[Bhashini TTS] Autoplay blocked or interrupted:', playErr);
        if (currentAudio === audio) {
          currentAudio = null;
          currentPlayingLanguage = null;
        }
        fallbackToWebSpeech(fallbackText, langCode, onStart, onEnd, onError, requestId);
      });
    }
  } catch (err) {
    console.error('[Bhashini TTS] Error constructing audio playback:', err);
    fallbackToWebSpeech(fallbackText, langCode, onStart, onEnd, onError, requestId);
  }
}

/**
 * Fallback to browser's native Web Speech API (speechSynthesis)
 */
function fallbackToWebSpeech(text, langCode, onStart, onEnd, onError, requestId) {
  if (requestId !== undefined && requestId !== currentSpeechRequestId) {
    return;
  }
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onError) onError('Speech synthesis is not supported on this device/browser.');
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    activeUtterance = utterance;
    currentPlayingLanguage = langCode;

    const targetLocale = SPEECH_LANG_LOCALES[langCode] || 'en-IN';
    utterance.lang = targetLocale;
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const targetPrefix = targetLocale.split('-')[0].toLowerCase();
    const matchVoice = voices.find((v) => v.lang.toLowerCase().startsWith(targetPrefix));
    if (matchVoice) {
      utterance.voice = matchVoice;
    }

    utterance.onstart = () => {
      if (requestId !== undefined && requestId !== currentSpeechRequestId) {
        window.speechSynthesis.cancel();
        return;
      }
      if (onStart) onStart();
    };

    utterance.onend = () => {
      activeUtterance = null;
      currentPlayingLanguage = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('[Web Speech Fallback] SpeechSynthesis error:', e);
      activeUtterance = null;
      currentPlayingLanguage = null;
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error('[Web Speech Fallback] Fatal synthesis error:', e);
    activeUtterance = null;
    currentPlayingLanguage = null;
    if (onError) onError(e.message);
    if (onEnd) onEnd();
  }
}

/**
 * Play a quick sample voice greeting for the chosen language
 * @param {string} langCode - e.g. 'kn', 'hi', 'ta', 'te', etc.
 * @param {Object} [callbacks]
 */
export async function playLanguageSample(langCode, callbacks = {}) {
  const greeting = SAMPLE_GREETINGS[langCode] || SAMPLE_GREETINGS.en;
  return speakTextWithBhashini({
    text: greeting,
    language: langCode,
    gender: 'female',
    ...callbacks
  });
}
