const fs = require('fs');
const envText = fs.readFileSync('.env', 'utf-8');
const env = {};
envText.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim();
});

const sampleImg = fs.readFileSync('public/sample-prescriptions/rx_allopathic_sample.jpg').toString('base64');

const OCR_PROMPT = `You are an expert Clinical Vision OCR Specialist and Pharmacologist trained in Allopathic and AYUSH / Ayurvedic medical prescriptions, clinical slips, and laboratory reports.
Analyze this medical prescription or lab report image carefully:
1. Transcribe the raw text verbatim and accurately, recognizing doctor handwriting, medical abbreviations (OD, BD, TDS, HS, SOS), and drug brand names.
2. Extract structured clinical entities into strictly valid JSON conforming to this schema:
{
  "title": "string",
  "category": "Allopathic OPD Slip" | "Ayurvedic Botanical Rx" | "Lab Diagnostic Report",
  "hospital": "string",
  "doctor": "string",
  "regNo": "string",
  "date": "string",
  "patient": "string",
  "patientAgeSex": "string",
  "diagnosis": "string",
  "vitals": { "bp": "string", "pulse": "string", "spO2": "string" },
  "medications": [
    { "name": "string", "dosage": "string", "frequency": "string", "timing": "string", "duration": "string" }
  ],
  "ayurvedicFactors": null,
  "advice": ["string"],
  "followUp": "string",
  "badge": "string",
  "badgeClass": "routine" | "urgent" | "red-flag",
  "rawOcrText": "string"
}`;

async function run() {
  const models = ['models/gemini-3.5-flash-lite', 'models/gemini-3.5-flash', 'models/gemini-3.6-flash', 'models/gemini-3.7-flash'];
  for (const m of models) {
    try {
      console.log('Trying model:', m);
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/${m}:generateContent?key=${env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generation_config: { response_mime_type: 'application/json' },
          contents: [
            {
              parts: [
                { text: OCR_PROMPT },
                { inline_data: { mime_type: 'image/jpeg', data: sampleImg } }
              ]
            }
          ]
        })
      });
      console.log(m, 'HTTP status:', res.status);
      if (res.ok) {
        const d = await res.json();
        const jsonText = d.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log('SUCCESS JSON:\n', jsonText);
        return;
      } else {
        const err = await res.text();
        console.log(m, 'Error text:', err);
      }
    } catch (e) {
      console.log(m, 'Exception:', e.message);
    }
  }
}

run();
