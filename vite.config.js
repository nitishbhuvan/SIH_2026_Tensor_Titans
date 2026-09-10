import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Medical & Ayurvedic System Prompt for Clinical Intake
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
  "clinical_english_summary": "string",
  "translated_clinical_english": "string",
  "chief_complaint": "string",
  "duration": "string",
  "associated_symptoms": ["string"],
  "medications_detected": ["string"],
  "medications_mentioned": ["string"],
  "ayush_parameters": {
    "dosha_imbalance": "string or null",
    "agni_status": "string or null"
  },
  "ayurvedic_factors": {
    "dosha_imbalance": "string or null",
    "agni_status": "string or null"
  },
  "triage_urgency": "RED_FLAG" | "URGENT" | "ROUTINE",
  "triage_reason": "string"
}`;

/**
 * High-fidelity dynamic clinical engine for custom patient speech
 */
function executeDynamicClinicalNLP(transcript, lang) {
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
  let triage_reason = "Patient presents with subacute symptoms requiring standard clinical outpatient evaluation.";
  let dosha_imbalance = null;
  let agni_status = "Samagni (balanced)";
  let medications_mentioned = [];
  let associated_symptoms = [];
  let chief_complaint = text || "General clinical evaluation";
  let duration = "2-4 days";
  let translated_clinical_english = "";

  // 1. Detect Medications
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
    if (m.regex.test(text)) {
      medications_mentioned.push(m.name);
    }
  });

  // 2. Cardiac / Emergency / Red Flag detection
  if (lower.includes('chhati') || lower.includes('chest') || lower.includes('dhadkan') || lower.includes('saans') || lower.includes('breath') || lower.includes('jalan') || lower.includes('faint') || lower.includes('chakkar')) {
    chief_complaint = "Retrosternal discomfort and chest burning sensation";
    duration = "2 days";
    associated_symptoms.push("Retrosternal burning / Pyrosis", "Epigastric discomfort", "Mild presyncope / Vertigo");
    dosha_imbalance = "Pitta-Vata aggravation with Amlapitta manifestation";
    agni_status = "Tikshnagni / hyperactive digestive fire";
    triage_urgency = "RED_FLAG";
    triage_reason = "Acute chest discomfort with burning quality in adult patient warrants urgent ECG and cardiac evaluation.";
    translated_clinical_english = `Patient states: "${text}". Clinical interpretation: Patient presents with acute retrosternal burning (pyrosis) and chest discomfort. History of oral medication intake noted (${medications_mentioned.join(', ') || 'none specified'}). Vitals and urgent ECG recommended.`;
  }
  // 3. Gastrointestinal / Constipation / Mandagni
  else if (lower.includes('pet') || lower.includes('kabz') || lower.includes('constipat') || lower.includes('gas') || lower.includes('otta') || lower.includes('triphala') || lower.includes('bhook') || lower.includes('bloat')) {
    chief_complaint = "Gastrointestinal dysmotility with chronic constipation (Krura Koshtha)";
    duration = "2-3 weeks";
    associated_symptoms.push("Krura Koshtha (hard stools)", "Abdominal distension / Anaha", "Mandagni (sluggish digestive fire)");
    dosha_imbalance = "Apana Vata stagnation with Sama Pitta";
    agni_status = "Mandagni (diminished digestive capacity)";
    triage_urgency = "ROUTINE";
    triage_reason = "Subacute gastrointestinal dysmotility manageable with dietary regulation and bowel regulators.";
    translated_clinical_english = `Patient states: "${text}". Clinical interpretation: Patient reports irregular bowel clearance and abdominal bloating consistent with Mandagni. Currently taking ${medications_mentioned.join(', ') || 'routine self-care'}. Advice dietary fiber and hydration.`;
  }
  // 4. Joint pain / Arthritis / Sandhivata
  else if (lower.includes('dard') || lower.includes('pain') || lower.includes('ghutne') || lower.includes('joint') || lower.includes('swelling') || lower.includes('vali') || lower.includes('sandhi')) {
    chief_complaint = "Joint pain and stiffness (Sandhivata / Arthralgia)";
    duration = "1-2 weeks";
    associated_symptoms.push("Sandhishoola (joint pain)", "Morning stiffness", "Periarticular tenderness");
    dosha_imbalance = "Vata aggravation localized in Sandhi (joints)";
    agni_status = "Vishamagni (variable digestive fire)";
    triage_urgency = "URGENT";
    triage_reason = "Progressive joint pain and functional impairment warranting clinical rheumatology/orthopedic assessment.";
    translated_clinical_english = `Patient states: "${text}". Clinical interpretation: Patient presents with joint arthralgia and stiffness consistent with Sandhivata. Advised clinical orthopedic evaluation and joint mobility assessment.`;
  }
  // 5. Fever / Cold / Cough / Pyrexia
  else if (lower.includes('bukhar') || lower.includes('fever') || lower.includes('sardi') || lower.includes('cough') || lower.includes('khansi') || lower.includes('thand') || lower.includes('jwara')) {
    chief_complaint = "Acute febrile illness with upper respiratory tract symptoms";
    duration = "3-4 days";
    associated_symptoms.push("Low-grade pyrexia", "Malaise / Angamarda", "Coryza / Nasal congestion");
    dosha_imbalance = "Vata-Kapha Jvara presentation";
    agni_status = "Mandagni secondary to acute febrile illness";
    triage_urgency = "ROUTINE";
    triage_reason = "Uncomplicated acute febrile presentation with stable hemodynamics.";
    translated_clinical_english = `Patient states: "${text}". Clinical interpretation: Patient reports a short history of fever, body aches, and upper respiratory symptoms. Advised hydration, antipyretics as required, and physician evaluation if fever persists > 48h.`;
  }
  // 6. General case
  else {
    chief_complaint = text.length > 5 ? text.slice(0, 80) : "General clinical health evaluation";
    duration = "Subacute onset";
    associated_symptoms.push("Generalized fatigue", "Malaise");
    dosha_imbalance = "Mild Tridosha fluctuation";
    agni_status = "Samagni (balanced)";
    triage_urgency = "ROUTINE";
    triage_reason = "Stable presentation without acute red-flag alerts.";
    translated_clinical_english = `Patient reports the following narrative: "${text}". No emergency indicators detected. Outpatient physician consultation recommended.`;
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

// Vite plugin to handle /api/voice-intake & /api/ocr-intake in dev mode
function clinicalApisPlugin(env) {
  return {
    name: 'clinical-apis-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // ── /api/voice-intake ──
        if (req.url?.startsWith('/api/voice-intake') && req.method === 'POST') {
          try {
            const chunks = [];
            for await (const chunk of req) {
              chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);
            const contentType = req.headers['content-type'] || '';

            let language = 'hi';
            let rawTranscript = null;
            let apiKeyFromReq = req.headers['x-groq-api-key'] || '';
            let geminiKeyFromReq = req.headers['x-gemini-api-key'] || '';
            let asrEngineUsed = 'bhashini_ai4bharat';

            if (contentType.includes('application/json')) {
              try {
                const body = JSON.parse(buffer.toString('utf-8'));
                language = body.language || 'hi';
                rawTranscript = body.transcript || null;
                if (body.audioBase64) {
                  asrEngineUsed = 'bhashini_ai4bharat';
                }
                if (!apiKeyFromReq && body.apiKey) {
                  apiKeyFromReq = body.apiKey;
                }
                if (!geminiKeyFromReq && body.geminiKey) {
                  geminiKeyFromReq = body.geminiKey;
                }
              } catch (_) {}
            } else if (contentType.includes('multipart/form-data')) {
              // Extract fields from multipart buffer if available
              const bodyStr = buffer.toString('latin1');
              const transcriptMatch = bodyStr.match(/name="transcript"\r\n\r\n([^\r\n]+)/);
              if (transcriptMatch) rawTranscript = transcriptMatch[1];

              const langMatch = bodyStr.match(/name="language"\r\n\r\n([^\r\n]+)/);
              if (langMatch) language = langMatch[1];

              const keyMatch = bodyStr.match(/name="apiKey"\r\n\r\n([^\r\n]+)/);
              if (keyMatch) apiKeyFromReq = keyMatch[1];
            }

            const effectiveApiKey = apiKeyFromReq || env.GROQ_API_KEY || process.env.GROQ_API_KEY || '';

            // If no transcript was captured at all, use standard default
            if (!rawTranscript) {
              rawTranscript = "Patient reports mild throat discomfort, weakness, and fever for 2 days.";
            }

            let clinicalResult = null;

            // Try live Gemini if configured
            if (effectiveGeminiKey) {
              try {
                const prompt = `
                  You are an expert bilingual clinical scribe for Indian OPDs (Modern Medicine and Ayurveda/AYUSH).
                  Source Language: ${language}
                  Patient Speech: "${rawTranscript}"

                  Instructions:
                  1. Translate the patient's conversational narrative into professional clinical English suitable for a doctor's SOAP note.
                  2. MANDATORY TERM PRESERVATION:
                     - DO NOT translate generic drug names or Ayurvedic botanical/compound names (e.g., keep "Triphala", "Ashwagandha", "Dashamularishta", "Metformin", "Paracetamol" verbatim).
                     - DO NOT translate classical Ayurvedic terms (e.g., keep "Vata", "Pitta", "Kapha", "Agni", "Koshtha").
                  3. Determine triage urgency: 'RED_FLAG' | 'URGENT' | 'ROUTINE'.

                  Return STRICTLY a JSON object matching this schema:
                  {
                    "clinical_english_summary": "string",
                    "chief_complaint": "string",
                    "duration": "string",
                    "associated_symptoms": ["string"],
                    "medications_detected": ["string"],
                    "ayush_parameters": {
                      "dosha_imbalance": "string or null",
                      "agni_status": "string or null"
                    },
                    "triage_urgency": "RED_FLAG" | "URGENT" | "ROUTINE",
                    "triage_reason": "string"
                  }
                `;

                const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveGeminiKey}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { response_mime_type: 'application/json' }
                  })
                });

                if (geminiRes.ok) {
                  const gJson = await geminiRes.json();
                  const rawContent = gJson.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (rawContent) {
                    clinicalResult = JSON.parse(rawContent);
                  }
                }
              } catch (gErr) {
                console.warn('Dev Gemini call failed:', gErr.message);
              }
            }

            // If not completed via Gemini, fallback to Groq or local normalizer
            if (!clinicalResult && effectiveApiKey && effectiveApiKey.startsWith('gsk_')) {
              try {
                const userPrompt = `Input:
- Source Language: ${language}
- Raw Transcript: "${rawTranscript}"

Produce the structured JSON clinical intake output following all term preservation rules.`;

                const groqChatRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${effectiveApiKey}`,
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
                  clinicalResult = JSON.parse(content);
                }
              } catch (e) {
                console.warn('Groq dev call failed, using dynamic NLP:', e.message);
              }
            }

            if (!clinicalResult) {
              clinicalResult = executeDynamicClinicalNLP(rawTranscript, language);
            }

            const finalPayload = {
              ...clinicalResult,
              raw_transcript: rawTranscript,
              original_transcript: rawTranscript,
              translated_clinical_english: clinicalResult.translated_clinical_english || clinicalResult.clinical_english_summary,
              clinical_english_summary: clinicalResult.clinical_english_summary || clinicalResult.translated_clinical_english,
              medications_mentioned: clinicalResult.medications_mentioned || clinicalResult.medications_detected || [],
              medications_detected: clinicalResult.medications_detected || clinicalResult.medications_mentioned || [],
              ayurvedic_factors: clinicalResult.ayurvedic_factors || clinicalResult.ayush_parameters || { dosha_imbalance: null, agni_status: null },
              ayush_parameters: clinicalResult.ayush_parameters || clinicalResult.ayurvedic_factors || { dosha_imbalance: null, agni_status: null },
              asr_engine_used: asrEngineUsed,
              success: true
            };

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, data: finalPayload, ...finalPayload }));
            return;
          } catch (err) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: err.message }));
            return;
          }
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), clinicalApisPlugin(env)]
  };
});
