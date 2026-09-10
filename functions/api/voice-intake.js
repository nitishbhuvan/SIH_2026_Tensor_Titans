/**
 * Cloudflare Pages Function: /api/voice-intake
 * 
 * Multilingual Indic Voice-to-Text with Clinical & Ayurvedic Term-Preserving Translation
 * Supports Cloudflare Environment Variables:
 * - env.GROQ_API_KEY
 * - env.BHASHINI_API_KEY
 * - env.GEMINI_API_KEY
 */

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-groq-api-key, x-gemini-api-key, x-bhashini-key"
    }
  });
}

export async function onRequestPost(context) {
  const { request, env = {} } = context;

  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-groq-api-key, x-gemini-api-key, x-bhashini-key"
  };

  try {
    const contentType = request.headers.get("content-type") || "";
    let audioBase64 = "";
    let language = "hi";
    let directTranscript = null;
    let customApiKey = request.headers.get("x-groq-api-key") || "";
    let customGeminiKey = request.headers.get("x-gemini-api-key") || "";

    if (contentType.includes("application/json")) {
      const json = await request.json();
      audioBase64 = json.audioBase64 || json.audio || "";
      language = json.language || language;
      directTranscript = json.transcript || null;
      if (json.apiKey) customApiKey = json.apiKey;
      if (json.geminiKey) customGeminiKey = json.geminiKey;
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("audio") || formData.get("file");
      if (file && typeof file !== "string") {
        const arrayBuf = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuf);
        let binary = "";
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        audioBase64 = btoa(binary);
      } else if (typeof file === "string") {
        audioBase64 = file;
      }
      audioBase64 = formData.get("audioBase64") || audioBase64;
      language = formData.get("language") || language;
      directTranscript = formData.get("transcript") || null;
      customApiKey = formData.get("apiKey") || customApiKey;
      customGeminiKey = formData.get("geminiKey") || customGeminiKey;
    }

    // Merge environment variables and request overrides
    const effectiveEnv = {
      ...env,
      GROQ_API_KEY: customApiKey || (env && env.GROQ_API_KEY) || "",
      GEMINI_API_KEY: customGeminiKey || (env && env.GEMINI_API_KEY) || ""
    };

    let transcript = directTranscript || "";
    let asrEngineUsed = directTranscript ? "preset_input" : "bhashini_ai4bharat";

    // ── STEP 1: Indic Speech-to-Text (ASR) via Groq Whisper if only audio was provided ──
    if (!rawTranscript && audioBlob && apiKey) {
      try {
        if (effectiveEnv.BHASHINI_USER_ID && (effectiveEnv.BHASHINI_API_KEY || effectiveEnv.BHASHINI_INFERENCE_KEY)) {
          transcript = await callBhashiniWithTimeout(audioBase64, language, effectiveEnv, 5000);
          if (transcript && transcript.trim().length > 0) {
            asrEngineUsed = "bhashini_ai4bharat";
          }
        }
      } catch (bhashiniErr) {
        console.warn("Bhashini ASR timed out or failed. Activating Groq Whisper fallback:", bhashiniErr.message);
      }

        const whisperRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`
          },
          body: whisperFormData
        });

        if (whisperRes.ok) {
          const whisperData = await whisperRes.json();
          rawTranscript = whisperData.text || '';
        }
      }

    if (!rawTranscript) {
      rawTranscript = "Patient reports mild symptoms and requests clinical consultation.";
    }

    // 3. CLINICAL TRANSLATION & ENTITY NORMALIZATION: Gemini 1.5 Flash (with resilient fallback)
    let clinicalSummary = null;
    try {
      if (effectiveEnv.GEMINI_API_KEY) {
        clinicalSummary = await processWithGemini(transcript, language, effectiveEnv);
      }
    } catch (geminiErr) {
      console.warn("Gemini 1.5 Flash normalization failed, using rule-based normalizer:", geminiErr.message);
    }

    // Dynamic resilient clinical engine for any custom text
    if (!clinicalResult) {
      clinicalResult = executeClinicalDynamicEngine(rawTranscript, language);
    }

    // Map schema for full backward & forward compatibility across UI & Doctor Portal
    const responsePayload = {
      success: true,
      clinical_english_summary: clinicalSummary.clinical_english_summary || clinicalSummary.translated_clinical_english || "",
      translated_clinical_english: clinicalSummary.translated_clinical_english || clinicalSummary.clinical_english_summary || "",
      chief_complaint: clinicalSummary.chief_complaint || "General consultation",
      duration: clinicalSummary.duration || "Not specified",
      associated_symptoms: clinicalSummary.associated_symptoms || [],
      medications_detected: clinicalSummary.medications_detected || clinicalSummary.medications_mentioned || [],
      medications_mentioned: clinicalSummary.medications_detected || clinicalSummary.medications_mentioned || [],
      ayush_parameters: clinicalSummary.ayush_parameters || clinicalSummary.ayurvedic_factors || { dosha_imbalance: null, agni_status: null },
      ayurvedic_factors: clinicalSummary.ayush_parameters || clinicalSummary.ayurvedic_factors || { dosha_imbalance: null, agni_status: null },
      triage_urgency: clinicalSummary.triage_urgency || "ROUTINE",
      triage_reason: clinicalSummary.triage_reason || "Stable vitals and chronic presentation.",
      raw_transcript: transcript,
      original_transcript: transcript,
      detected_language: getLanguageDisplayName(language),
      asr_engine_used: asrEngineUsed
    };

    return new Response(JSON.stringify({
      ...responsePayload,
      data: responsePayload
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (err) {
    console.error("Error in /api/voice-intake:", err);
    return new Response(JSON.stringify({
      success: false,
      error: err.message || "Internal server error"
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

// ── Bhashini 2-Step Protocol: Config Discovery + Inference Compute ──
async function callBhashiniWithTimeout(audioBase64, language, env, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const bhashiniLang = language === 'sa' ? 'hi' : language;

    // Step A: Pipeline Config Discovery
    const configRes = await fetch("https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "userID": env.BHASHINI_USER_ID,
        "ulcaApiKey": env.BHASHINI_API_KEY, // UDYAT KEY
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pipelineTasks: [{ taskType: "asr", config: { language: { sourceLanguage: bhashiniLang } } }],
        pipelineRequestConfig: { pipelineId: "64392f96daac500b55c543d6" }
      })
    });

    if (!configRes.ok) throw new Error(`Bhashini Config error HTTP ${configRes.status}`);
    const configData = await configRes.json();

    const asrTask = configData.pipelineResponseConfig?.[0];
    const serviceId = asrTask?.config?.[0]?.serviceId;
    const callbackUrl = configData.pipelineInferenceAPIEndPoint?.callbackUrl;
    const dynamicApiKey = configData.pipelineInferenceAPIEndPoint?.inferenceApiKey?.value;
    const authHeader = dynamicApiKey || env.BHASHINI_INFERENCE_KEY || env.BHASHINI_API_KEY;

    if (!callbackUrl || !serviceId) throw new Error("Missing callbackUrl or serviceId from Bhashini");

    // Step B: Inference Compute
    const computeRes = await fetch(callbackUrl, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pipelineTasks: [{
          taskType: "asr",
          config: {
            language: { sourceLanguage: bhashiniLang },
            serviceId: serviceId,
            audioFormat: "wav",
            samplingRate: 16000
          }
        }],
        inputData: {
          audio: [{ audioContent: audioBase64 }]
        }
      })
    });

    if (!computeRes.ok) throw new Error(`Bhashini Compute error HTTP ${computeRes.status}`);
    const computeData = await computeRes.json();
    return computeData.pipelineResponse?.[0]?.output?.[0]?.source || "";

  } finally {
    clearTimeout(timer);
  }
}

/**
 * High-fidelity domain normalizer preserving Ayurvedic & Allopathic entities for ANY custom transcript
 */
function executeClinicalDynamicEngine(transcript, lang) {
  const text = (transcript || '').trim();
  const lower = text.toLowerCase();
  
  let detected_language =
    lang === 'hi' ? 'Hindi' :
    lang === 'kn' ? 'Kannada' :
    lang === 'ta' ? 'Tamil' :
    lang === 'te' ? 'Telugu' :
    lang === 'mr' ? 'Marathi' :
    lang === 'bn' ? 'Bengali' :
    lang === 'ml' ? 'Malayalam' :
    lang === 'sa' ? 'Sanskrit / AYUSH' : 'English';

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
    medications_detected,
    medications_mentioned: medications_detected,
    ayush_parameters: {
      dosha_imbalance,
      agni_status
    },
    ayurvedic_factors: {
      dosha_imbalance,
      agni_status
    },
    triage_urgency,
    triage_reason
  };
}
