import React, { useState } from 'react';
import countries from '../data/countries.json';
import './CountrySelect.css';

function CountrySelect({ onConfirm }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);

  const filtered = query.length > 0
    ? countries.filter(c => c.name.includes(query) && !selected.find(s => s.code === c.code))
    : [];

  const addCountry = (country) => {
    setSelected(prev => [...prev, country]);
    setQuery('');
    setOpen(false);
  };

  const removeCountry = (code) => {
    setSelected(prev => prev.filter(c => c.code !== code));
  };

  const handleConfirm = () => {
    if (selected.length === 0) return;
    onConfirm(selected.map(c => c.name).join(', '));
  };

  return (
    <div className="country-select">
      <div className="chips">
        {selected.map(c => (
          <span key={c.code} className="chip">
            {c.name}
            <button onClick={() => removeCountry(c.code)}>×</button>
          </span>
        ))}
      </div>
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="חפש מדינה..."
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
        {open && filtered.length > 0 && (
          <ul className="dropdown">
            {filtered.slice(0, 8).map(c => (
              <li key={c.code} onClick={() => addCountry(c)}>{c.name}</li>
            ))}
          </ul>
        )}
      </div>
      <button className="confirm-btn" onClick={handleConfirm} disabled={selected.length === 0}>
        אשר יעדים
      </button>
    </div>
  );
}

export default CountrySelect;
