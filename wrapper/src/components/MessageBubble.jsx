import React, { useState } from 'react';
import DateRangePicker from './DateRangePicker';
import MedicalCarousel from './MedicalCarousel';
import './MessageBubble.css';

function MessageBubble({ role, text, ui, carouselData, uiAnswered, raw, onUIConfirm, onReject }) {
  const isUser = role === 'user';
  const showDatePicker = !isUser && ui === 'date_picker' && !uiAnswered;
  const showCarousel = !isUser && ui === 'carousel' && !uiAnswered && carouselData?.length > 0;
  const [showJson, setShowJson] = useState(false);

  return (
    <div className={`bubble-wrapper ${isUser ? 'user' : 'agent'}`}>
      <div className={`bubble ${isUser ? 'user-bubble' : 'agent-bubble'}`}>
        <div className="bubble-text">{text}</div>
        {!isUser && raw && (
          <div className="json-toggle">
            <button className="json-btn" onClick={() => setShowJson(v => !v)}>
              {showJson ? 'הסתר JSON' : '{ } הצג JSON'}
            </button>
            {showJson && (
              <pre className="json-view">{JSON.stringify(raw, null, 2)}</pre>
            )}
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
