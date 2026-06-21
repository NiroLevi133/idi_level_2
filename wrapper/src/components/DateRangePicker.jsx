import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateRangePicker.css';

function DateRangePicker({ onConfirm }) {
  const [departure, setDeparture] = useState(null);
  const [returnDate, setReturnDate] = useState(null);

  const dayCount = departure && returnDate
    ? Math.round((returnDate - departure) / (1000 * 60 * 60 * 24))
    : null;

  const handleConfirm = () => {
    if (!departure || !returnDate) return;
    const fmt = (d) => d.toLocaleDateString('he-IL');
    onConfirm(`יציאה: ${fmt(departure)}, חזרה: ${fmt(returnDate)} (${dayCount} ימים)`);
  };

  return (
    <div className="date-range-picker">
      <div className="date-row">
        <div className="date-field">
          <label>תאריך יציאה</label>
          <ReactDatePicker
            selected={departure}
            onChange={setDeparture}
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
            placeholderText="בחר תאריך"
          />
        </div>
        <div className="date-field">
          <label>תאריך חזרה</label>
          <ReactDatePicker
            selected={returnDate}
            onChange={setReturnDate}
            minDate={departure || new Date()}
            dateFormat="dd/MM/yyyy"
            placeholderText="בחר תאריך"
          />
        </div>
      </div>
      {dayCount !== null && (
        <p className="day-count">משך הנסיעה: <strong>{dayCount} ימים</strong></p>
      )}
      <button className="confirm-btn" onClick={handleConfirm} disabled={!departure || !returnDate}>
        אשר תאריכים
      </button>
    </div>
  );
}

export default DateRangePicker;
