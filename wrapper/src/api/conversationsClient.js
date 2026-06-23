import axios from 'axios';

const DIRECT_RUN_URL = import.meta.env.VITE_LANGFLOW_API_URL;
const API_KEY = import.meta.env.VITE_LANGFLOW_API_KEY;
// In production go through the serverless proxy (key stays server-side); locally call Langflow directly
const USE_PROXY = import.meta.env.PROD;

// Build the monitor/messages URL from the configured run URL (same origin + flow id)
function buildMessagesUrl() {
  const runUrl = new URL(DIRECT_RUN_URL);
  const flowId = runUrl.pathname.split('/run/')[1];
  return `${runUrl.origin}/api/v1/monitor/messages?flow_id=${flowId}`;
}

// Parse a Langflow timestamp ("2026-06-10 13:50:58 UTC") into a Date
function parseTime(ts) {
  return new Date(ts.replace(' UTC', 'Z').replace(' ', 'T'));
}

// Extract readable text — the agent stores JSON, so pull out its "answer" array
function readText(msg) {
  if (msg.sender === 'User') return msg.text;
  try {
    const parsed = JSON.parse(msg.text);
    if (Array.isArray(parsed.answer)) return parsed.answer.filter(Boolean).join('\n');
  } catch {
    // Not JSON — fall through to raw text
  }
  return msg.text;
}

// Group raw messages into conversations keyed by session_id, sorted newest first
function groupBySession(raw) {
  const sessions = {};
  for (const m of raw) {
    const id = m.session_id;
    if (!sessions[id]) sessions[id] = [];
    sessions[id].push({
      role: m.sender === 'User' ? 'user' : 'agent',
      text: readText(m),
      time: parseTime(m.timestamp),
    });
  }

  return Object.entries(sessions)
    .map(([sessionId, messages]) => {
      messages.sort((a, b) => a.time - b.time);
      const firstUser = messages.find(x => x.role === 'user');
      return {
        sessionId,
        messages,
        count: messages.length,
        start: messages[0]?.time,
        last: messages[messages.length - 1]?.time,
        preview: (firstUser?.text || messages[0]?.text || '').slice(0, 60),
      };
    })
    .sort((a, b) => b.last - a.last);
}

// Fetch all logged messages and return them grouped into conversations
export async function fetchConversations() {
  let messages;
  if (USE_PROXY) {
    const { data } = await axios.get('/api/messages');
    messages = data;
  } else {
    const headers = {};
    if (API_KEY && API_KEY !== 'your-api-key-here') headers['x-api-key'] = API_KEY;
    const { data } = await axios.get(buildMessagesUrl(), { headers });
    messages = data;
  }
  return groupBySession(messages);
}
