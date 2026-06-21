import React, { useState } from 'react';
import CountrySelect from './CountrySelect';
import DateRangePicker from './DateRangePicker';
import './DynamicInput.css';

// Renders the correct input component based on currentUI from the agent
function DynamicInput({ currentUI, onSend, loading }) {
  const [text, setText] = useState('');

  const handleTextSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  if (currentUI === 'done') {
    return <p className="chat-done">✓ השיחה הסתיימה</p>;
  }

  if (currentUI === 'country_select') {
    return <CountrySelect onConfirm={onSend} />;
  }

  if (currentUI === 'date_picker') {
    return <DateRangePicker onConfirm={onSend} />;
  }

  return (
    <div className="text-input-row">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleTextSend()}
        placeholder="כתוב הודעה..."
        disabled={loading}
      />
      <button onClick={handleTextSend} disabled={loading || !text.trim()}>שלח</button>
    </div>
  );
}

export default DynamicInput;
