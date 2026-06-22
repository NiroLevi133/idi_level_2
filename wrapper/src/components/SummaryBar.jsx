import React from 'react';
import './SummaryBar.css';

// Inline line-icons for each summary category
const ICONS = {
  travelers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  destination: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  dates: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  coverage: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  offer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
};

const CATEGORIES = [
  { key: 'travelers', label: 'נוסעים' },
  { key: 'destination', label: 'מדינת יעד' },
  { key: 'dates', label: 'תאריכים' },
  { key: 'coverage', label: 'כיסויים' },
  { key: 'offer', label: 'ההצעה שלך' },
];

// Highlights a category once its data exists in the session state
function hasData(summary, key) {
  if (key === 'travelers') return Array.isArray(summary.travelers) && summary.travelers.some(t => t.name || t.birth_date);
  if (key === 'destination') return summary.destinations?.length > 0;
  if (key === 'dates') return !!(summary.departure_date || summary.return_date);
  if (key === 'offer') return !!summary.selected_package;
  return false;
}

function SummaryBar({ summary }) {
  return (
    <div className="sbar-wrapper" dir="rtl">
      <div className="sbar-track">
        {CATEGORIES.map(cat => (
          <div key={cat.key} className={`sbar-item ${hasData(summary, cat.key) ? 'active' : ''}`}>
            <div className="sbar-icon">{ICONS[cat.key]}</div>
            <span className="sbar-label">{cat.label}</span>
          </div>
        ))}
      </div>
      <button className="sbar-chevron" aria-label="קיפול הסיכום">
        <svg viewBox="0 0 24 24" fill="none" stroke="#6B3DE7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  );
}

export default SummaryBar;
