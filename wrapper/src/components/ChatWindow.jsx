import React, { useEffect, useRef, useState } from 'react';
import MessageBubble, { TypingIndicator } from './MessageBubble';
import './ChatWindow.css';

function ChatWindow({ messages, loading, onSend, onReject }) {
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleTextSend = () => {
    if (!text.trim() || loading) return;
    onSend(text.trim());
    setText('');
  };

  // Only the last unanswered agent message renders its widget
  const lastActiveIdx = messages.findLastIndex(m => m.role === 'agent' && !m.uiAnswered);

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            role={msg.role}
            text={msg.text}
            ui={msg.ui}
            carouselData={msg.carouselData}
            raw={msg.raw}
            uiAnswered={i !== lastActiveIdx || msg.uiAnswered}
            onUIConfirm={(value) => {
              // carousel sends answers object — convert to message + db_update string
              if (typeof value === 'object' && !Array.isArray(value)) {
                const text = Object.entries(value)
                  .map(([id, ans]) => `${id}: ${ans ? 'כן' : 'לא'}`)
                  .join(', ');
                onSend(text, { medical: value });
              } else {
                onSend(value);
              }
            }}
            onReject={onReject}
          />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
      <div className="input-area">
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
    </div>
  );
}

export default ChatWindow;
