import React, { useEffect, useState } from 'react';
import { fetchConversations } from '../api/conversationsClient';
import './Conversations.css';

// Format a Date to a short "DD/MM HH:MM" label
function formatTime(d) {
  if (!d) return '';
  const p = n => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function Conversations() {
  const [conversations, setConversations] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all conversations from the logs
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setConversations(await fetchConversations());
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || 'שגיאה בטעינה');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Chat view of a single conversation
  if (selected) {
    return (
      <div className="convos">
        <div className="convos-bar">
          <button className="convos-back" onClick={() => setSelected(null)}>← חזרה לרשימה</button>
          <span className="convos-meta">{selected.count} הודעות · {formatTime(selected.start)}</span>
        </div>
        <div className="convos-chat">
          {selected.messages.map((m, i) => (
            <div key={i} className={`convos-bubble ${m.role}`}>
              <span className="convos-bubble-text">{m.text}</span>
              <span className="convos-bubble-time">{formatTime(m.time)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // List view of all conversations
  return (
    <div className="convos">
      <div className="convos-bar">
        <h2 className="convos-title">שיחות מהלוגים</h2>
        <button className="convos-reload" onClick={load} disabled={loading}>
          {loading ? 'טוען…' : 'רענן'}
        </button>
      </div>

      {error && <div className="convos-error">{error}</div>}
      {loading && !conversations && <div className="convos-empty">טוען שיחות…</div>}
      {conversations && conversations.length === 0 && <div className="convos-empty">אין שיחות</div>}

      <div className="convos-list">
        {conversations?.map(c => (
          <button key={c.sessionId} className="convos-item" onClick={() => setSelected(c)}>
            <div className="convos-item-top">
              <span className="convos-item-preview">{c.preview || '(ללא טקסט)'}</span>
              <span className="convos-item-time">{formatTime(c.last)}</span>
            </div>
            <div className="convos-item-sub">
              {c.count} הודעות · {c.sessionId.slice(0, 8)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Conversations;
