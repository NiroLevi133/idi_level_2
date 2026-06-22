// Serverless proxy: forwards chat requests to Langflow with the API key kept server-side
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input_value, session_id } = req.body || {};

  try {
    const response = await fetch(process.env.LANGFLOW_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.LANGFLOW_API_KEY,
      },
      body: JSON.stringify({
        input_value,
        session_id,
        output_type: 'chat',
        input_type: 'chat',
      }),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Proxy error', detail: err.message });
  }
}
