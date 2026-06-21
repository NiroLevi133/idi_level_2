import React from 'react';
import './SummaryPanel.css';

const LABELS = {
  destinations: 'יעדים',
  departure_date: 'תאריך יציאה',
  return_date: 'תאריך חזרה',
  travelers_count: 'מספר נוסעים',
  eligibility: 'זכאות',
  selected_package: 'חבילה נבחרת',
  price: 'מחיר משוער',
  status: 'סטטוס',
};

function SummaryPanel({ summary, open, onClose }) {
  return (
    <div className={`summary-panel ${open ? 'open' : ''}`}>
      <div className="summary-header">
        <h3>סיכום שיחה</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      <div className="summary-content">
        {Object.entries(LABELS).map(([key, label]) => {
          const value = summary?.[key];
          const display = Array.isArray(value) ? value.join(', ') : value;
          return (
            <div key={key} className="summary-row">
              <span className="summary-label">{label}</span>
              <span className={`summary-value ${!display ? 'empty' : ''}`}>
                {display || '—'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SummaryPanel;
