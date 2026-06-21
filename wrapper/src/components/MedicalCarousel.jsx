import React, { useState } from 'react';
import './MedicalCarousel.css';

const REJECTION_MESSAGE = 'מצטערים, לפי התשובות שסיפקת אין באפשרותנו להציע לך ביטוח נסיעות. אנו ממליצים לפנות לנציג שירות לקבלת סיוע.';

function MedicalCarousel({ questions, onComplete, onReject }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleAnswer = (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    if (answer === true) {
      onReject(REJECTION_MESSAGE);
      return;
    }

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      // All answered with לא — send to agent
      onComplete(newAnswers);
    }
  };

  const q = questions[current];

  return (
    <div className="medical-carousel">
      <div className="carousel-header">
        <span className="carousel-title">{q.title}</span>
        <div className="carousel-dots">
          {questions.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === current ? 'active' : ''} ${answers[questions[i].id] === false ? 'answered' : ''}`}
            />
          ))}
        </div>
      </div>

      <p className="carousel-question">{q.question}</p>

      <div className="carousel-buttons">
        <button className="btn-no" onClick={() => handleAnswer(q.id, false)}>לא</button>
        <button className="btn-yes" onClick={() => handleAnswer(q.id, true)}>כן</button>
      </div>
    </div>
  );
}

export default MedicalCarousel;
