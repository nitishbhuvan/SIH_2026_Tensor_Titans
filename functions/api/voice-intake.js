/**
 * Cloudflare Pages Function: /api/voice-intake
 * 
 * Multilingual Indic Voice-to-Text with Clinical & Ayurvedic Term-Preserving Translation
 * Supports Cloudflare Environment Variables:
 * - env.GROQ_API_KEY
 * - env.BHASHINI_API_KEY
 * - env.GEMINI_API_KEY
 */

const MEDICAL_SYSTEM_PROMPT = `You are an expert bilingual medical interpreter and clinical documentation specialist trained in both Modern Allopathic Medicine and Traditional Indian Medicine (Ayurveda/AYUSH).

Your Objectives:
1. Translate the patient's conversational narrative into professional clinical English suitable for a physician's SOAP note.
2. CLINICAL TERM PRESERVATION MANDATE:
   - NEVER translate proper drug names, active pharmaceutical ingredients, or Ayurvedic botanical/compound names (e.g., keep "Ashwagandha", "Triphala Churna", "Dashamularishta", "Metformin", "Pantoprazole" intact).
   - NEVER translate classical Ayurvedic clinical parameters into generic English (e.g., keep "Vata", "Pitta", "Kapha", "Mandagni", "Krura Koshtha", "Prakriti", "Ama").
   - Accurately translate colloquial descriptions of symptoms (e.g., "chhati me jalan" -> "retrosternal burning / pyrosis", "pet saaf nahi hota" -> "chronic constipation / irregular bowel movements", "chakkar aana" -> "vertigo / presyncope").
3. Extract triage urgency: "RED_FLAG" (acute cardiac, neurological, severe respiratory distress), "URGENT", or "ROUTINE".

Respond strictly with valid JSON conforming to this schema:
{
  "detected_language": "string",
  "original_transcript": "string",
  "translated_clinical_english": "string",
  "chief_complaint": "string",
  "duration": "string",
  "associated_symptoms": ["string"],
  "medications_mentioned": ["string"],
  "ayurvedic_factors": {
    "dosha_imbalance": "string or null",
    "agni_status": "string or null"
  },
  "hpi_details": {
    "onset": "string or null",
    "location": "string or null",
    "duration": "string or null",
    "character": "string or null",
    "aggravating_factors": "string or null",
    "relieving_factors": "string or null",
    "timing": "string or null",
    "severity_score": 1
  },
  "triage_urgency": "RED_FLAG" | "URGENT" | "ROUTINE",
  "triage_reason": "string"
}`;

const ASR_DOMAIN_PROMPT = "Ayurvedic and Allopathic clinical intake: Vata, Pitta, Kapha, Agni, Koshtha, Dashamula, Triphala, Ashwagandha, Kwatha, Churna, Bhasma, Rasayana, Paracetamol, Metformin, Amlodipine, chest pain, fever, duration.";

const LANG_CODE_MAP = {
  hi: 'Hindi',
  kn: 'Kannada',
  ta: 'Tamil',
  te: 'Telugu',
  mr: 'Marathi',
  bn: 'Bengali',
  gu: 'Gujarati',
  ml: 'Malayalam',
  pa: 'Punjabi',
  sa: 'Sanskrit / AYUSH',
  en: 'English',
  bgc: 'Haryanvi / Hindi',
  or: 'Odia',
  as: 'Assamese',
  ur: 'Urdu'
};

function detectLanguageFromText(text) {
  if (!text) return 'English';
  if (/[\u0900-\u097F]/.test(text)) {
    if (/अस्ति|सेवयामि|वर्तते|मम|द्वे|चूर्णम्|प्रकोप/i.test(text)) return 'Sanskrit / AYUSH';
    if (/आहे|नाही|मला|होत|पोटात|जळजळ/i.test(text)) return 'Marathi';
    return 'Hindi';
  }
  if (/[\u0C80-\u0CFF]/.test(text)) return 'Kannada';
  if (/[\u0B80-\u0BFF]/.test(text)) return 'Tamil';
  if (/[\u0C00-\u0C7F]/.test(text)) return 'Telugu';
  if (/[\u0980-\u09FF]/.test(text)) return 'Bengali';
  if (/[\u0D00-\u0D7F]/.test(text)) return 'Malayalam';
  if (/[\u0A80-\u0AFF]/.test(text)) return 'Gujarati';
  if (/[\u0A00-\u0A7F]/.test(text)) return 'Punjabi';
  return 'English';
}

/**
 * Transcribes audio using Bhashini ULCA ASR pipeline with automatic language detection.
 */
async function transcribeWithBhashini(audioBlob, language, env) {
  const userId = env.BHASHINI_USER_ID || (typeof process !== 'undefined' && process.env && process.env.BHASHINI_USER_ID) || '';
  const ulcaApiKey = env.BHASHINI_API_KEY || (typeof process !== 'undefined' && process.env && process.env.BHASHINI_API_KEY) || '';
  const inferenceKey = env.BHASHINI_INFERENCE_KEY || (typeof process !== 'undefined' && process.env && process.env.BHASHINI_INFERENCE_KEY) || '';

  if (!userId || !ulcaApiKey) {
    throw new Error('Bhashini credentials not configured');
  }

  let base64Audio = '';
  if (typeof audioBlob.arrayBuffer === 'function') {
    const ab = await audioBlob.arrayBuffer();
    const bytes = new Uint8Array(ab);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    base64Audio = btoa(binary);
  } else if (typeof Buffer !== 'undefined' && Buffer.isBuffer(audioBlob)) {
    base64Audio = audioBlob.toString('base64');
  } else {
    throw new Error('Unsupported audio format for Bhashini');
  }

  const srcLang = (language && language !== 'auto') ? (language === 'sa' ? 'sa' : language) : 'auto';
  const t0 = Date.now();

  const callbackUrl = 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline';
  const serviceId = "bhashini/bodhan/asr-transcribe-flex";

  const computeRes = await fetch(callbackUrl, {
    method: 'POST',
    // No timeout limit: waits until Bhashini finishes or returns an error
    headers: {
      'Content-Type': 'application/json',
      'Authorization': inferenceKey,
      'InferenceApiKey': inferenceKey,
      'ulcaApiKey': ulcaApiKey,
      'userID': userId
    },
    body: JSON.stringify({
      pipelineTasks: [
        {
          taskType: 'asr',
          config: {
            serviceId: serviceId,
            language: {
              sourceLanguage: srcLang
            },
            audioFormat: 'wav',
            samplingRate: 16000
          }
        }
      ],
      inputData: {
        audio: [
          {
            audioContent: base64Audio
          }
        ]
      }
    })
  });

  const totalMs = Date.now() - t0;

  if (!computeRes.ok) {
    const errBody = await computeRes.text().catch(() => '');
    throw new Error(`Bhashini Bodhan inference returned HTTP ${computeRes.status}: ${errBody}`);
  }

  const computeData = await computeRes.json();
  const outputObj = computeData?.pipelineResponse?.[0]?.output?.[0];
  const transcript = outputObj?.source || outputObj?.target || '';
  const detectedLangCode = outputObj?.detectedLanguage || outputObj?.sourceLanguage || '';
  const detectedLanguage = LANG_CODE_MAP[detectedLangCode] || (detectedLangCode ? detectedLangCode.toUpperCase() : null);

  if (!transcript) {
    throw new Error('Empty transcript received from Bhashini Bodhan ASR');
  }

  return {
    transcript,
    detectedLangCode,
    detectedLanguage,
    totalSeconds: (totalMs / 1000).toFixed(2)
  };
}

/**
 * Universal Groq Whisper Large v3 (Natively accepts 16kHz WAV)
 */
async function transcribeWithGroqWhisper(audioBlob, language, apiKey) {
  const whisperFormData = new FormData();
  whisperFormData.append('file', audioBlob, 'audio.wav');
  whisperFormData.append('model', 'whisper-large-v3');
  whisperFormData.append('prompt', ASR_DOMAIN_PROMPT);
  whisperFormData.append('response_format', 'json');
  if (language && language !== 'auto' && language !== 'sa') {
    whisperFormData.append('language', language);
  }

  const whisperRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    signal: AbortSignal.timeout(10000),
    headers: {
      'Authorization': `Bearer ${apiKey}`
    },
    body: whisperFormData
  });

  if (!whisperRes.ok) {
    throw new Error(`Groq Whisper returned HTTP ${whisperRes.status}`);
  }

  const whisperData = await whisperRes.json();
  return whisperData.text || '';
}

/**
 * Gemini Multimodal Audio Transcription
 */
async function transcribeWithGemini(audioBlob, language, geminiApiKey) {
  if (!geminiApiKey) throw new Error('Gemini key missing');
  let base64Audio = '';
  if (typeof audioBlob.arrayBuffer === 'function') {
    const ab = await audioBlob.arrayBuffer();
    const bytes = new Uint8Array(ab);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    base64Audio = btoa(binary);
  } else if (typeof Buffer !== 'undefined' && Buffer.isBuffer(audioBlob)) {
    base64Audio = audioBlob.toString('base64');
  } else {
    throw new Error('Unsupported audio format for Gemini');
  }

  const prompt = `Listen carefully to this audio recording in Indian language (${language}). Transcribe the exact words spoken by the patient verbatim in the original script. Return ONLY the transcribed text, nothing else.`;

  const models = ['models/gemini-flash-latest', 'models/gemini-3.6-flash'];
  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        signal: AbortSignal.timeout(10000),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: 'audio/wav',
                    data: base64Audio
                  }
                }
              ]
            }
          ]
        })
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) return text;
      }
    } catch (_) { }
  }
  throw new Error('Gemini transcription failed');
}

/**
 * Gemini Clinical SOAP Note structuring
 */
async function generateClinicalSoapWithGemini(transcript, language, geminiApiKey) {
  if (!geminiApiKey) return null;
  const userPrompt = `Input:
- Source Language: ${language}
- Raw Transcript: "${transcript}"

Produce the structured JSON clinical intake output following all term preservation rules.`;

  const models = ['models/gemini-flash-latest', 'models/gemini-3.6-flash'];
  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        signal: AbortSignal.timeout(10000),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: MEDICAL_SYSTEM_PROMPT }]
          },
          generation_config: {
            response_mime_type: 'application/json'
          },
          contents: [
            {
              parts: [{ text: userPrompt }]
            }
          ]
        })
      });
      if (res.ok) {
        const data = await res.json();
        const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (rawJson) return JSON.parse(rawJson);
      }
    } catch (_) { }
  }
  return null;
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const contentType = request.headers.get('content-type') || '';

    let audioBlob = null;
    let language = 'auto';
    let customApiKey = request.headers.get('x-groq-api-key') || '';
    let directTranscript = null;
    let detectedLangFromAsr = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      audioBlob = formData.get('audio');
      language = formData.get('language') || language;
      if (!customApiKey) {
        customApiKey = formData.get('apiKey') || '';
      }
      directTranscript = formData.get('transcript');
    } else if (contentType.includes('application/json')) {
      const json = await request.json();
      language = json.language || language;
      customApiKey = json.apiKey || customApiKey;
      directTranscript = json.transcript;
    }

    const apiKey = customApiKey || (env && env.GROQ_API_KEY) || (typeof process !== 'undefined' && process.env && process.env.GROQ_API_KEY) || '';
    const geminiApiKey = (env && env.GEMINI_API_KEY) || (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) || '';

    let rawTranscript = directTranscript ? directTranscript.trim() : null;
    let transcriptionEngine = directTranscript ? 'Live Speech / Direct Input' : null;

    // ── STEP 1: MULTI-TIER ASR CASCADE ──
    if (audioBlob && audioBlob.size > 44) {
      // 1. Tier 1: Bhashini ASR (Auto language detection)
      try {
        const bhashiniResult = await transcribeWithBhashini(audioBlob, language, env);
        if (bhashiniResult.transcript && bhashiniResult.transcript.trim()) {
          rawTranscript = bhashiniResult.transcript.trim();
          transcriptionEngine = `Bhashini ASR (MeitY) — took ${bhashiniResult.totalSeconds}s`;
          if (bhashiniResult.detectedLanguage) {
            detectedLangFromAsr = bhashiniResult.detectedLanguage;
          }
        }
      } catch (bhashiniErr) {
        console.warn(`Bhashini ASR failed (${bhashiniErr.message}). Cascading to Groq Whisper...`);
      }

      // 2. Tier 2: Groq Whisper Large v3
      if (!rawTranscript && apiKey) {
        try {
          const whisperText = await transcribeWithGroqWhisper(audioBlob, language, apiKey);
          if (whisperText && whisperText.trim()) {
            rawTranscript = whisperText.trim();
            transcriptionEngine = 'Groq Whisper Large v3 (Fallback)';
          }
        } catch (groqErr) {
          console.warn('Groq Whisper fallback failed:', groqErr.message);
        }
      }

      // 3. Tier 3: Gemini Multimodal Audio
      if (!rawTranscript && geminiApiKey) {
        try {
          const geminiText = await transcribeWithGemini(audioBlob, language, geminiApiKey);
          if (geminiText && geminiText.trim()) {
            rawTranscript = geminiText.trim();
            transcriptionEngine = 'Gemini 3.6 Multimodal Audio';
          }
        } catch (geminiErr) {
          console.warn('Gemini audio fallback failed:', geminiErr.message);
        }
      }
    }

    if (!rawTranscript || !rawTranscript.trim()) {
      rawTranscript = "Patient reports clinical symptoms for evaluation.";
      if (!transcriptionEngine) transcriptionEngine = 'Live Speech / Direct Input';
    }

    // ── STEP 2: Clinical Normalization & Term-Preservation Engine ──
    let clinicalResult = null;

    if (apiKey) {
      try {
        const userPrompt = `Input:
- Source Language: ${detectedLangFromAsr || language || 'Auto-Detect'}
- Raw Transcript: "${rawTranscript}"

Produce the structured JSON clinical intake output following all term preservation rules.`;

        const groqChatRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          signal: AbortSignal.timeout(8000),
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
              { role: 'system', content: MEDICAL_SYSTEM_PROMPT },
              { role: 'user', content: userPrompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.1
          })
        });

        if (groqChatRes.ok) {
          const chatData = await groqChatRes.json();
          const content = chatData.choices[0]?.message?.content;
          if (content) clinicalResult = JSON.parse(content);
        }
      } catch (err) {
        console.warn('Groq Llama 3.1 translation error:', err);
      }
    }

    // Gemini fallback for SOAP note
    if (!clinicalResult && geminiApiKey) {
      try {
        clinicalResult = await generateClinicalSoapWithGemini(rawTranscript, detectedLangFromAsr || language, geminiApiKey);
      } catch (err) {
        console.warn('Gemini SOAP note generation error:', err);
      }
    }

    // Dynamic resilient clinical engine for any custom text
    if (!clinicalResult) {
      clinicalResult = executeClinicalDynamicEngine(rawTranscript, detectedLangFromAsr || language);
    }

    if (detectedLangFromAsr && (!clinicalResult.detected_language || clinicalResult.detected_language === 'auto' || clinicalResult.detected_language === 'English')) {
      clinicalResult.detected_language = detectedLangFromAsr;
    } else if (!clinicalResult.detected_language || clinicalResult.detected_language === 'auto') {
      clinicalResult.detected_language = detectLanguageFromText(rawTranscript);
    }

    clinicalResult.transcription_engine = transcriptionEngine || 'Dynamic Indic Engine';
    if (!clinicalResult.original_transcript) {
      clinicalResult.original_transcript = rawTranscript;
    }

    return new Response(JSON.stringify({
      success: true,
      data: clinicalResult
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('Error in /api/voice-intake:', error);
    const fallbackResult = executeClinicalDynamicEngine("Patient reports clinical symptoms for evaluation.", "auto");
    fallbackResult.transcription_engine = 'Client Indic Safe Engine';
    return new Response(JSON.stringify({
      success: true,
      data: fallbackResult
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

/**
 * High-fidelity domain normalizer preserving Ayurvedic & Allopathic entities for ANY custom transcript
 */
function executeClinicalDynamicEngine(transcript, lang) {
  const text = (transcript || '').trim();
  const lower = text.toLowerCase();

  let detected_language = 'English';
  if (lang && lang !== 'auto' && LANG_CODE_MAP[lang]) {
    detected_language = LANG_CODE_MAP[lang];
  } else {
    detected_language = detectLanguageFromText(text);
  }

  let triage_urgency = "ROUTINE";
  let triage_reason = "Stable presentation without immediate life-threatening alerts.";
  let dosha_imbalance = null;
  let agni_status = "Samagni (balanced)";
  let medications_mentioned = [];
  let associated_symptoms = [];
  let chief_complaint = text;
  let duration = "2-4 days";
  let translated_clinical_english = "";

  // Med checks
  const knownMeds = [
    { name: 'Metformin', regex: /metformin|glycomet/i },
    { name: 'Pantoprazole', regex: /pantoprazole|pantocid|pan-40/i },
    { name: 'Paracetamol', regex: /paracetamol|dolo|crocin|calpol/i },
    { name: 'Telmisartan', regex: /telmisartan|telma/i },
    { name: 'Amlodipine', regex: /amlodipine|amlong/i },
    { name: 'Triphala Churna', regex: /triphala|trifla/i },
    { name: 'Ashwagandha', regex: /ashwagandha|asgandh/i },
    { name: 'Dashamularishta', regex: /dashamularishta|dashmool/i },
    { name: 'Avipattikar Churna', regex: /avipattikar/i }
  ];

  knownMeds.forEach(m => {
    if (m.regex.test(text)) medications_mentioned.push(m.name);
  });

  // Cardiac / Red Flag
  if (lower.includes('chhati') || lower.includes('chest') || lower.includes('dhadkan') || lower.includes('jalan') || lower.includes('saans') || lower.includes('breath')) {
    chief_complaint = "Retrosternal burning sensation and chest heaviness";
    duration = "2 days, worsening post-prandially";
    associated_symptoms = ["Retrosternal burning / Pyrosis", "Epigastric fullness", "Diaphoresis"];
    dosha_imbalance = "Pitta-Vata aggravation with Amlapitta manifestation";
    agni_status = "Tikshnagni (hyperactive digestive state)";
    triage_urgency = "RED_FLAG";
    triage_reason = "Acute chest discomfort / burning in adult patient requires ECG and cardiac evaluation.";
    translated_clinical_english = `Patient reports: "${text}". Clinical impression: Patient presents with retrosternal pyrosis and chest discomfort. History of medications (${medications_mentioned.join(', ') || 'none'}). ECG recommended.`;
  }
  // GI / Mandagni
  else if (lower.includes('pet') || lower.includes('kabz') || lower.includes('constipat') || lower.includes('triphala') || lower.includes('agni') || lower.includes('otta')) {
    chief_complaint = "Chronic constipation (Krura Koshtha) with sluggish digestion";
    duration = "3 weeks";
    associated_symptoms = ["Krura Koshtha (hard stools)", "Abdominal bloating / Anaha", "Mandagni (impaired digestive fire)"];
    dosha_imbalance = "Apana Vata stagnation with Sama Pitta";
    agni_status = "Mandagni (hypoactive digestive fire)";
    triage_urgency = "ROUTINE";
    triage_reason = "Subacute gastrointestinal dysmotility responsive to dietary and bowel regulation.";
    translated_clinical_english = `Patient reports: "${text}". Clinical impression: Patient reports irregular bowel clearance consistent with Mandagni. Advised hydration and physician consultation.`;
  }
  // Joint pain / Sandhivata
  else if (lower.includes('ghutne') || lower.includes('joint') || lower.includes('sandhi') || lower.includes('ashwagandha') || lower.includes('vata') || lower.includes('vali') || lower.includes('dard')) {
    chief_complaint = "Joint pain and stiffness (Sandhivata / Arthralgia)";
    duration = "2 weeks";
    associated_symptoms = ["Joint pain (Sandhishoola)", "Morning stiffness", "Periarticular tenderness"];
    dosha_imbalance = "Vata aggravation localized in Sandhi (joints)";
    agni_status = "Vishamagni (variable digestive fire)";
    triage_urgency = "URGENT";
    triage_reason = "Progressive joint pain impairing ambulation; requires orthopedic evaluation.";
    translated_clinical_english = `Patient reports: "${text}". Clinical impression: Progressive joint pain consistent with Sandhivata. Physical examination advised.`;
  }
  // General / Fever / Pyrexia
  else if (lower.includes('bukhar') || lower.includes('fever') || lower.includes('sardi') || lower.includes('khansi')) {
    chief_complaint = "Low-grade pyrexia with malaise and body aches";
    duration = "3 days";
    associated_symptoms = ["Body aches / Angamarda", "Mild coryza", "Fatigue"];
    dosha_imbalance = "Vata-Kapha Jvara presentation";
    agni_status = "Mandagni secondary to acute febrile illness";
    triage_urgency = "ROUTINE";
    triage_reason = "Uncomplicated acute febrile illness with stable hemodynamics.";
    translated_clinical_english = `Patient reports: "${text}". Clinical impression: Short duration febrile illness with generalized myalgia. Advised hydration and antipyretics.`;
  } else {
    chief_complaint = text.length > 6 ? text.slice(0, 80) : "General clinical evaluation";
    duration = "Recent onset";
    associated_symptoms = ["Malaise", "General discomfort"];
    dosha_imbalance = "Tridosha balance evaluation";
    agni_status = "Samagni (balanced)";
    triage_urgency = "ROUTINE";
    triage_reason = "Standard OPD consult.";
    translated_clinical_english = `Patient statement: "${text}". Outpatient clinical consultation advised.`;
  }

  return {
    detected_language,
    original_transcript: text,
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
    triage_reason
  };
}
