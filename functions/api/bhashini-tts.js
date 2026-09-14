const LANGUAGE_CODES = new Set(['en', 'hi', 'kn', 'ta', 'te', 'ml']);

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const text = String(body.text || '').trim();
    const language = LANGUAGE_CODES.has(body.language) ? body.language : 'en';
    const env = context.env || {};
    const apiKey = env.BHASHINI_API_KEY || '';
    const userId = env.BHASHINI_USER_ID || '';
    const pipelineId = env.BHASHINI_PIPELINE_ID || '';
    const serviceId = env.BHASHINI_TTS_SERVICE_ID || '';

    if (!text || !apiKey || !userId || !pipelineId || !serviceId) {
      return new Response(JSON.stringify({ success: false, error: 'Bhashini TTS is not configured.' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
    }

    const response = await fetch('https://dhruva-api.bhashini.gov.in/services/inference/pipeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', userID: userId, ulcaApiKey: apiKey },
      body: JSON.stringify({
        pipelineId,
        pipelineTasks: [{ taskType: 'tts', config: { language: { sourceLanguage: language }, serviceId, gender: 'female', samplingRate: 8000 } }],
        inputData: { input: [{ source: text }] },
      }),
    });
    const data = await response.json();
    const audio = data?.pipelineResponse?.find((item) => item.taskType === 'tts')?.audio?.[0];
    if (!response.ok || !audio?.audioContent) throw new Error('Bhashini returned no audio.');
    return new Response(JSON.stringify({ success: true, audioContent: audio.audioContent, audioFormat: audio.audioFormat || 'wav' }), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message || 'Bhashini TTS failed.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
