const DRAVIDIAN_LANGS = new Set(['kn', 'ta', 'te', 'ml']);
const MISC_LANGS = new Set(['en', 'ur']);

function getTtsServiceId(lang) {
  const code = (lang || 'en').toLowerCase();
  if (DRAVIDIAN_LANGS.has(code)) {
    return 'ai4bharat/indic-tts-coqui-dravidian-gpu--t4';
  }
  if (MISC_LANGS.has(code)) {
    return 'ai4bharat/indic-tts-coqui-misc-gpu--t4';
  }
  return 'ai4bharat/indic-tts-coqui-indo_aryan-gpu--t4';
}

function normalizeBhashiniLang(lang) {
  const code = (lang || 'en').toLowerCase().trim();
  // Sanskrit is synthesized via Indo-Aryan Hindi Devanagari model
  if (code === 'sa' || code === 'sanskrit') {
    return 'hi';
  }
  return code;
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const text = String(body.text || '').trim();
    const rawLang = body.language || 'en';
    const gender = body.gender === 'male' ? 'male' : 'female';
    const bhashiniLang = normalizeBhashiniLang(rawLang);
    const serviceId = getTtsServiceId(bhashiniLang);

    const env = context.env || {};
    const apiKey = env.BHASHINI_API_KEY || (typeof process !== 'undefined' && process.env && process.env.BHASHINI_API_KEY) || '';
    const userId = env.BHASHINI_USER_ID || (typeof process !== 'undefined' && process.env && process.env.BHASHINI_USER_ID) || '';
    const inferenceKey = env.BHASHINI_INFERENCE_KEY || (typeof process !== 'undefined' && process.env && process.env.BHASHINI_INFERENCE_KEY) || '';

    if (!text) {
      return new Response(JSON.stringify({ success: false, error: 'Text parameter is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!apiKey || !userId) {
      return new Response(JSON.stringify({ success: false, error: 'Bhashini TTS credentials missing in environment.' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const response = await fetch('https://dhruva-api.bhashini.gov.in/services/inference/pipeline', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': inferenceKey || apiKey,
        'InferenceApiKey': inferenceKey || apiKey,
        'ulcaApiKey': apiKey,
        'userID': userId
      },
      body: JSON.stringify({
        pipelineTasks: [
          {
            taskType: 'tts',
            config: {
              language: { sourceLanguage: bhashiniLang },
              serviceId: serviceId,
              gender: gender,
              samplingRate: 8000
            }
          }
        ],
        inputData: { input: [{ source: text }] }
      })
    });

    const data = await response.json();
    const audio = data?.pipelineResponse?.[0]?.audio?.[0];

    if (!response.ok || !audio?.audioContent) {
      throw new Error(data?.message || data?.detail?.message || 'Bhashini returned no audio stream.');
    }

    return new Response(
      JSON.stringify({
        success: true,
        audioContent: audio.audioContent,
        audioFormat: audio.audioFormat || 'wav',
        language: rawLang,
        gender: gender
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Bhashini TTS synthesis failed.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
