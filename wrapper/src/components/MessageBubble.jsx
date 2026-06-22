import React, { useMemo } from 'react';
import DateRangePicker from './DateRangePicker';
import MedicalCarousel from './MedicalCarousel';
import logo from '../../LOGO.jpg';
import './MessageBubble.css';

function MessageBubble({ role, text, ui, carouselData, uiAnswered, raw, onUIConfirm, onReject }) {
  const isUser = role === 'user';
  const showDatePicker = !isUser && ui === 'date_picker' && !uiAnswered;
  const showCarousel = !isUser && ui === 'carousel' && !uiAnswered && carouselData?.length > 0;
  const sessionClosed = !isUser && raw?.sessionStatus && raw.sessionStatus !== 'open';
  // Capture a stable send-time when the bubble first mounts
  const time = useMemo(() => new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }), []);

  return (
    <div className={`bubble-wrapper ${isUser ? 'user' : 'agent'}`}>
      {!isUser && (
        <div className="bubble-avatar agent-av"><img src={logo} alt="שיר" /></div>
      )}
      <div className={`bubble ${isUser ? 'user-bubble' : 'agent-bubble'}`}>
        <div className="bubble-text">{text}</div>
        {showDatePicker && (
          <div className="inline-widget">
            <DateRangePicker onConfirm={onUIConfirm} />
          </div>
        )}
        {showCarousel && (
          <div className="inline-widget">
            <MedicalCarousel
              questions={carouselData}
              onComplete={onUIConfirm}
              onReject={onReject}
            />
          </div>
        )}
        {!isUser && raw?.useTool && (
          <div className="msg-badge tool">🔧 הופעל כלי: {raw.useTool}</div>
        )}
        {sessionClosed && (
          <div className="msg-badge closed">
            🔒 הסשן נסגר{raw.reasonForCloseSession ? `: ${raw.reasonForCloseSession}` : ''}
          </div>
        )}
        <span className="bubble-time">{time}</span>
      </div>
      {isUser && (
        <div className="bubble-avatar user-av">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      )}
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="bubble-wrapper agent">
      <div className="bubble-avatar agent-av"><img src={logo} alt="שיר" /></div>
      <div className="bubble agent-bubble typing">
        <span /><span /><span />
      </div>
    </div>
  );
}

export default MessageBubble;
