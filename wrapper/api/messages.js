// Serverless proxy: fetches Langflow chat logs (monitor/messages) with the API key kept server-side
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Derive the Langflow origin and flow id from the existing run URL — no extra env needed
    const runUrl = new URL(process.env.LANGFLOW_API_URL);
    const flowId = runUrl.pathname.split('/run/')[1] || req.query.flow_id;
    const url = `${runUrl.origin}/api/v1/monitor/messages?flow_id=${flowId}`;

    const response = await fetch(url, {
      headers: { 'x-api-key': process.env.LANGFLOW_API_KEY },
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Proxy error', detail: err.message });
  }
}
