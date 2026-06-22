import React from 'react';
import DateRangePicker from './DateRangePicker';
import MedicalCarousel from './MedicalCarousel';
import './MessageBubble.css';

function MessageBubble({ role, text, ui, carouselData, uiAnswered, raw, onUIConfirm, onReject }) {
  const isUser = role === 'user';
  const showDatePicker = !isUser && ui === 'date_picker' && !uiAnswered;
  const showCarousel = !isUser && ui === 'carousel' && !uiAnswered && carouselData?.length > 0;
  const sessionClosed = !isUser && raw?.sessionStatus && raw.sessionStatus !== 'open';

  return (
    <div className={`bubble-wrapper ${isUser ? 'user' : 'agent'}`}>
      <div className={`bubble ${isUser ? 'user-bubble' : 'agent-bubble'}`}>
        <div className="bubble-text">{text}</div>
        {!isUser && raw?.useTool && (
          <div className="msg-badge tool">🔧 הופעל כלי: {raw.useTool}</div>
        )}
        {sessionClosed && (
          <div className="msg-badge closed">
            🔒 הסשן נסגר{raw.reasonForCloseSession ? `: ${raw.reasonForCloseSession}` : ''}
          </div>
        )}
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
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="bubble-wrapper agent">
      <div className="bubble agent-bubble typing">
        <span /><span /><span />
      </div>
    </div>
  );
}

export default MessageBubble;
