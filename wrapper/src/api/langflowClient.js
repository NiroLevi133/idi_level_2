import axios from 'axios';

const DIRECT_URL = import.meta.env.VITE_LANGFLOW_API_URL;
const API_KEY = import.meta.env.VITE_LANGFLOW_API_KEY;
// In production go through the serverless proxy (key stays server-side); locally call Langflow directly
const USE_PROXY = import.meta.env.PROD;

// Sends a message to the Langflow agent and returns { answers, fullModel, raw }
export async function sendToAgent(userMessage, sessionId) {
  let response;
  if (USE_PROXY) {
    response = await axios.post('/api/chat', {
      input_value: userMessage,
      session_id: sessionId,
    });
  } else {
    const headers = { 'Content-Type': 'application/json' };
    if (API_KEY && API_KEY !== 'your-api-key-here') {
      headers['x-api-key'] = API_KEY;
    }
    response = await axios.post(DIRECT_URL, {
      input_value: userMessage,
      output_type: 'chat',
      input_type: 'chat',
      session_id: sessionId,
    }, { headers });
  }

  const rawText =
    response.data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text || '';

  if (!rawText) {
    console.warn('[Langflow] empty response. Full data:', response.data);
    return { answers: ['לא התקבלה תשובה מהסוכן'], fullModel: null, raw: null };
  }

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    // Not JSON — return the plain text as a single message
    return { answers: [rawText], fullModel: null, raw: null };
  }

  // Expected format: { answer: [...], fullModel: {...}, sessionStatus, ... }
  const answers = Array.isArray(parsed.answer)
    ? parsed.answer.filter(Boolean)
    : parsed.answer
      ? [parsed.answer]
      : ['אין תשובה מהסוכן'];

  return {
    answers,
    fullModel: parsed.fullModel || null,
    raw: parsed,
  };
}
