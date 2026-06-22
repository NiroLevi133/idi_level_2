import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import SummaryBar from './components/SummaryBar';
import { sendToAgent } from './api/langflowClient';
import logo from '../LOGO.jpg';
import './App.css';

const INITIAL_STATE = {
  destinations: [],
  departure_date: null,
  return_date: null,
  travelers_count: null,
  traveler_ages: [],
  eligibility: null,
  medical: {
    q1_travel_for_treatment: null,
    q2_doctor_advised_no_fly: null,
    q3_hospitalized_last_6m: null,
    q4_chronic_condition: null,
  },
  selected_package: null,
  price: null,
  status: 'collecting',
};

// Format an ISO date (YYYY-MM-DD) to DD/MM/YYYY for display
function formatDate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d}/${m}/${y}` : iso;
}

// Map the agent's fullModel into the summary-bar shape
function modelToSummary(model) {
  const destinations = Array.isArray(model.travelDestinations)
    ? model.travelDestinations.map(d => d.countryDsc).filter(Boolean)
    : [];

  const contacts = [];
  if (model.primaryInsuredContact?.client) contacts.push(model.primaryInsuredContact.client);
  if (Array.isArray(model.insuredContacts)) {
    contacts.push(...model.insuredContacts.map(c => c.client || c));
  }
  const travelers = contacts.map(c => ({
    name: [c.fName, c.lName].filter(Boolean).join(' '),
    birth_date: c.dob,
    gender: c.sexCode,
  }));

  return {
    destinations,
    departure_date: formatDate(model.policyStartDate),
    return_date: formatDate(model.policyEndDate),
    travelers,
    travelers_count: null,
    selected_package: model.packageNr,
    price: null,
  };
}

// Deep merge — handles nested objects like medical{}
function deepMerge(base, delta) {
  const result = { ...base };
  for (const key of Object.keys(delta)) {
    const isNestedObject =
      delta[key] !== null &&
      typeof delta[key] === 'object' &&
      !Array.isArray(delta[key]);
    result[key] = isNestedObject
      ? deepMerge(base[key] || {}, delta[key])
      : delta[key];
  }
  return result;
}

function App() {
  const [sessionId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState([
    { role: 'agent', text: 'היי, איזה כיף שטסים לחו"ל!\nאני שיר, הבוטית החדשה לביטוח נסיעות של ביטוח ישיר.\nאשמח לעזור לך לרכוש את הביטוח שמתאים לך ולענות על כל שאלה בדרך ✈️\nאז לאן נוסעים ומתי?', ui: 'text', uiAnswered: true }
  ]);
  const [sessionState, setSessionState] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (userInput, directDelta = null) => {
    // Mark last unanswered UI as answered, add user message, then call agent
    setMessages(prev => {
      const updated = [...prev];
      const lastIdx = updated.findLastIndex(m => m.role === 'agent' && !m.uiAnswered);
      if (lastIdx !== -1) updated[lastIdx] = { ...updated[lastIdx], uiAnswered: true };
      return [...updated, { role: 'user', text: userInput }];
    });
    setLoading(true);

    try {
      if (directDelta) setSessionState(prev => deepMerge(prev, directDelta));
      const { answers, fullModel, raw } = await sendToAgent(userInput, sessionId);
      // Each answer becomes its own bubble; the full JSON is attached to the last one
      setMessages(prev => [
        ...prev,
        ...answers.map((text, i) => ({
          role: 'agent',
          text,
          ui: 'text',
          uiAnswered: true,
          raw: i === answers.length - 1 ? raw : null,
        })),
      ]);
      if (fullModel) setSessionState(modelToSummary(fullModel));
    } catch (err) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail || err?.message || 'שגיאה לא ידועה';
      console.error('[Agent error]', status, detail, err?.response?.data);
      setMessages(prev => [...prev, {
        role: 'agent',
        text: `שגיאה ${status ? `(${status})` : ''}: ${detail}`,
        ui: 'text', uiAnswered: false
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <img src={logo} alt="SHIR" className="header-logo-img" />
          <span className="header-logo-text">SHIR</span>
        </div>
        <div className="header-tagline">עוזרת AI לרכישת<br />ביטוח נסיעות לחו"ל</div>
      </header>

      <SummaryBar summary={sessionState} />

      <main className="app-main">
        <ChatWindow
          messages={messages}
          loading={loading}
          onSend={sendMessage}
          onReject={(rejectionText) => {
            setMessages(prev => {
              const updated = [...prev];
              const lastIdx = updated.findLastIndex(m => m.role === 'agent' && !m.uiAnswered);
              if (lastIdx !== -1) updated[lastIdx] = { ...updated[lastIdx], uiAnswered: true };
              return [...updated, { role: 'agent', text: rejectionText, ui: 'done', uiAnswered: true }];
            });
          }}
        />
      </main>
    </div>
  );
}

export default App;
