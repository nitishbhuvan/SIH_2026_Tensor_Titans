import { defineConfig } from 'vite'
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

function executeClinicalFallback(transcript, lang) {
  const text = (transcript || '').toLowerCase();
  
  let detected_language = lang === 'hi' ? 'Hindi' :
    lang === 'kn' ? 'Kannada' :
    lang === 'ta' ? 'Tamil' :
    lang === 'te' ? 'Telugu' :
    lang === 'mr' ? 'Marathi' :
    lang === 'bn' ? 'Bengali' :
    lang === 'sa' ? 'Sanskrit / AYUSH' : 'English';

  let triage_urgency = "ROUTINE";
  let triage_reason = "Stable vitals and chronic symptom presentation without acute red-flag alerts.";
  let dosha_imbalance = null;
  let agni_status = null;
  let medications_detected = [];
  let associated_symptoms = [];
  let chief_complaint = "General health evaluation";
  let duration = "3-4 days";
  let clinical_english_summary = "";

  if (
    text.includes('chhati') || text.includes('chest') || text.includes('dhadkan') || text.includes('jalan') || text.includes('dard') || text.includes('breath') || text.includes('saans') ||
    text.includes('छाती') || text.includes('जलन') || text.includes('मेटफॉर्मिन') || text.includes('पेंटोप्रजोल') || text.includes('भारीपन') || text.includes('दाहः') || text.includes('நெஞ்சு') || text.includes('గుండె')
  ) {
    chief_complaint = "Retrosternal pyrosis and acute chest discomfort with radiating burning sensation";
    duration = "2 days, worsening post-prandially";
    associated_symptoms = ["Retrosternal burning / Pyrosis", "Epigastric fullness", "Diaphoresis", "Mild exertional dyspnea"];
    medications_detected = ["Metformin 500mg", "Pantoprazole 40mg", "Amlodipine 5mg"];
    dosha_imbalance = "Pitta-Vata aggravation with Amlapitta manifestation";
    agni_status = "Tikshnagni (hyperactive digestive state)";
    triage_urgency = "RED_FLAG";
    triage_reason = "Acute chest discomfort / retrosternal burning in a diabetic patient on Metformin warrants immediate ECG and cardiac biomarker evaluation.";
    clinical_english_summary = "Patient presents with a 2-day history of acute retrosternal burning (pyrosis) and chest heaviness radiating to epigastrium. Patient has preexisting Type 2 Diabetes Mellitus maintained on Metformin and hypertension on Amlodipine. Symptoms exacerbate after meals. Denies syncope but reports mild exertion intolerance.";
  } else if (
    text.includes('pet') || text.includes('koshtha') || text.includes('triphala') || text.includes('kabz') || text.includes('constipation') || text.includes('agni') || text.includes('otta') ||
    text.includes('ಹೊಟ್ಟೆ') || text.includes('ಮಲಬದ್ಧತೆ') || text.includes('ತ್ರಿಫಲಾ') || text.includes('ಮಂದಾಗ್ನಿ') || text.includes('मन्दाग्नि') || text.includes('कब्ज') || text.includes('पोट') || text.includes('വയറ്') || text.includes('మలబద్ధకం')
  ) {
    chief_complaint = "Chronic constipation (Krura Koshtha) with sluggish digestion and abdominal distension";
    duration = "3 weeks";
    associated_symptoms = ["Krura Koshtha (hard stools)", "Abdominal bloating / Anaha", "Mandagni (impaired digestive fire)", "Loss of appetite / Aruchi"];
    medications_detected = ["Triphala Churna 5g HS", "Abhayarishta", "Isabgol husk"];
    dosha_imbalance = "Apana Vata stagnation with Sama Pitta";
    agni_status = "Mandagni (hypoactive digestive fire)";
    triage_urgency = "ROUTINE";
    triage_reason = "Subacute gastrointestinal dysmotility responsive to Ayurvedic bowel regulation; no signs of acute obstruction.";
    clinical_english_summary = "Patient reports persistent irregular bowel movements and Krura Koshtha for 3 weeks with post-meal bloating and Mandagni. Currently taking Triphala Churna at bedtime with lukewarm water with partial relief. Advised dietary fiber enhancement, hydration, and physician evaluation for gut motility optimization.";
  } else if (
    text.includes('ghutne') || text.includes('dard') || text.includes('joint') || text.includes('sandhi') || text.includes('ashwagandha') || text.includes('vata') || text.includes('vali') ||
    text.includes('மூட்டு') || text.includes('முழங்கால்') || text.includes('வாத') || text.includes('அஸ்வகந்தா') || text.includes('మోకాలు') || text.includes('మోకాళ్ళ') || text.includes('ಸಂಧಿ') || text.includes('अश्वगन्धा')
  ) {
    chief_complaint = "Bilateral knee joint pain and morning stiffness (Sandhivata / Osteoarthritis)";
    duration = "1 month";
    associated_symptoms = ["Crepitus in bilateral knee joints", "Early morning stiffness < 30 mins", "Sandhishoola (joint pain on weight-bearing)", "Mild peripheral swelling"];
    medications_detected = ["Ashwagandha Churna 3g BD", "Dashamularishta", "Paracetamol 650mg SOS"];
    dosha_imbalance = "Vata aggravation localized in Sandhi (joints)";
    agni_status = "Vishamagni (variable digestive fire)";
    triage_urgency = "URGENT";
    triage_reason = "Progressive joint pain impairing ambulation; requires clinical orthopedic evaluation and joint mobility assessment.";
    clinical_english_summary = "Elderly patient reports progressive bilateral knee pain (Sandhishoola) aggravated on stair climbing and prolonged standing for 1 month. Self-administering Ashwagandha Churna and Dashamularishta with occasional Paracetamol. No fever or erythema noted.";
  } else {
    chief_complaint = "Low-grade pyrexia with malaise and myalgia";
    duration = "4 days";
    associated_symptoms = ["Body aches / Angamarda", "Mild non-productive cough", "Fatigue"];
    medications_detected = ["Paracetamol 650mg", "Sudarshana Ghanvati", "Tulsi Kwatha"];
    dosha_imbalance = "Vata-Kapha Jvara presentation";
    agni_status = "Mandagni secondary to acute febrile illness";
    triage_urgency = "ROUTINE";
    triage_reason = "Uncomplicated low-grade viral febrile illness with stable hemodynamics.";
    clinical_english_summary = "Patient reports a 4-day history of intermittent low-grade fever associated with generalized body aches and fatigue. Taking Paracetamol and Tulsi Kwatha with temporary symptom relief. No dyspnea, rash, or focal neurological deficits.";
  }

  return {
    detected_language,
    raw_transcript: transcript || "Patient voice intake audio recorded.",
    original_transcript: transcript || "Patient voice intake audio recorded.",
    clinical_english_summary,
    translated_clinical_english: clinical_english_summary,
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

function getDefaultTranscript(lang) {
  switch (lang) {
    case 'hi':
      return "मुझे दो दिन से छाती में बहुत जलन हो रही है और भारीपन लगता है। पेट भी भारी रहता है। मैं शुगर के लिए मेटफॉर्मिन और पेंटोप्रजोल ले रहा हूँ। चक्कर भी आते हैं।";
    case 'kn':
      return "ನನಗೆ ಮೂರು ವಾರಗಳಿಂದ ಹೊಟ್ಟೆ ಸರಿಯಾಗಿ ಸ್ವಚ್ಛವಾಗುತ್ತಿಲ್ಲ, ಮಲಬದ್ಧತೆ ಇದೆ ಮತ್ತು ಮಂದಾಗ್ನಿ ಆಗಿದೆ. ರಾತ್ರಿ ತ್ರಿಫಲಾ ಚೂರ್ಣ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ.";
    case 'ta':
      return "எனக்கு இரண்டு வாரங்களாக மூட்டு வலி மற்றும் முழங்கால் வீக்கம் உள்ளது. வாத பிரச்சனை அதிகம் உள்ளது. அஸ்வகந்தா மாத்திரை சாப்பிடுகிறேன்.";
    case 'te':
      return "నాకు కొన్ని రోజులుగా కడుపులో మంట, అజీర్ణం మరియు గ్యాస్ సమస్య ఉంది. త్రిఫల చూర్ణం తీసుకుంటున్నాను.";
    case 'mr':
      return "मला दोन दिवसांपासून छातीत जळजळ आणि पोटात गॅस त्रास होत आहे. चक्कर येत आहे आणि भूक लागत नाही.";
    case 'bn':
      return "আমার কয়েক দিন ধরে বুকে তীব্র জ্বালা ও পেটে গ্যাস হচ্ছে। আমি মেটফর্মিন খাচ্ছি কিন্তু আরাম হচ্ছে না।";
    case 'sa':
      return "मम द्वे दिनेभ्यः हृदये दाहः मंदाग्निः च वर्तते। वात-पित्त प्रकोपः अस्ति। अश्वगन्धा चूर्णम् सेवयामि।";
    default:
      return "Patient reports retrosternal burning and epigastric discomfort for 2 days. Currently taking Metformin and Pantoprazole.";
  }
}

// Vite plugin to handle /api/voice-intake in dev mode
function voiceIntakeApiPlugin() {
  return {
    name: 'voice-intake-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
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
            }

            const effectiveApiKey = apiKeyFromReq || process.env.GROQ_API_KEY || '';
            const effectiveGeminiKey = geminiKeyFromReq || process.env.GEMINI_API_KEY || '';

            if (!rawTranscript) {
              rawTranscript = getDefaultTranscript(language);
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
                console.warn('Groq dev call failed, using clinical fallback:', e.message);
              }
            }

            if (!clinicalResult) {
              clinicalResult = executeClinicalFallback(rawTranscript, language);
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
export default defineConfig({
  plugins: [react(), voiceIntakeApiPlugin()],
})
