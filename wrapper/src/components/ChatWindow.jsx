import React, { useEffect, useRef, useState } from 'react';
import MessageBubble, { TypingIndicator } from './MessageBubble';
import './ChatWindow.css';

function ChatWindow({ messages, loading, onSend, onReject }) {
  const [text, setText] = useState('');
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  // Touch devices (mobile) have no convenient Shift key — Enter should add a line there
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Grow the textarea with its content, up to the CSS max-height
  const autoGrow = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleTextSend = () => {
    if (!text.trim() || loading) return;
    onSend(text.trim());
    setText('');
    requestAnimationFrame(autoGrow);
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
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={e => { setText(e.target.value); autoGrow(); }}
          onKeyDown={e => {
            // Web: Enter sends, Shift+Enter = new line. Mobile: Enter = new line (send via button)
            if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
              e.preventDefault();
              handleTextSend();
            }
          }}
          placeholder="כתוב הודעה..."
        />
        <button onClick={handleTextSend} disabled={loading || !text.trim()}>שלח</button>
      </div>
    </div>
  );
}

export default ChatWindow;
