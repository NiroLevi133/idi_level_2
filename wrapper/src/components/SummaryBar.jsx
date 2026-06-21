import React from 'react';
import './SummaryBar.css';

function fmt(val) {
  if (val === null || val === undefined || val === '') return null;
  if (Array.isArray(val)) return val.length > 0 ? val.join(', ') : null;
  return String(val);
}

function Card({ icon, label, value }) {
  const display = fmt(value);
  return (
    <div className="sbar-card">
      <span className="sbar-icon">{icon}</span>
      <span className="sbar-label">{label}</span>
      <span className={`sbar-value ${!display ? 'empty' : ''}`}>{display || '—'}</span>
    </div>
  );
}

function buildTravelersText(state) {
  const travelers = state.travelers;
  if (Array.isArray(travelers) && travelers.length > 0) {
    return travelers.map(t => {
      const parts = [t.name, t.id, t.birth_date, t.gender].filter(Boolean);
      return parts.length > 0 ? parts.join(' · ') : null;
    }).filter(Boolean).join('\n');
  }
  if (state.travelers_count) return `${state.travelers_count} נוסעים`;
  return null;
}

function SummaryBar({ summary }) {
  const travelersText = buildTravelersText(summary);

  const dateText = summary.departure_date || summary.return_date
    ? [summary.departure_date, summary.return_date].filter(Boolean).join(' → ')
    : null;

  return (
    <div className="sbar-wrapper" dir="rtl">
      <div className="sbar-track">
        <Card icon="📍" label="יעד" value={summary.destinations} />
        <Card icon="📅" label="תאריכים" value={dateText} />
        <Card icon="👤" label="נוסעים" value={travelersText} />
        <Card icon="📦" label="חבילה" value={summary.selected_package} />
        <Card icon="💰" label="מחיר" value={summary.price ? `₪${summary.price}` : null} />
      </div>
    </div>
  );
}

export default SummaryBar;
