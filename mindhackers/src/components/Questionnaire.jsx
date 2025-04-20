import React, { useState } from 'react';

const Questionnaire = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  
  const questions = [
    {
      question: "How often do you feel overwhelmed by daily stressors?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"]
    },
    {
      question: "How would you rate your sleep quality?",
      options: ["Excellent", "Good", "Fair", "Poor", "Very Poor"]
    },
    {
      question: "How often do you experience feelings of sadness or hopelessness?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"]
    },
    {
      question: "How comfortable are you talking about your emotions?",
      options: ["Very Comfortable", "Somewhat Comfortable", "Neutral", "Somewhat Uncomfortable", "Very Uncomfortable"]
    },
    {
      question: "How would you describe your social support system?",
      options: ["Very Strong", "Strong", "Moderate", "Weak", "Very Weak"]
    }
  ];

  const handleAnswer = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestion]: answer
    });
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="questionnaire">
      <h2>Mental Health Assessment</h2>
      <p>Question {currentQuestion + 1} of {questions.length}</p>
      <div className="question">
        <h3>{questions[currentQuestion].question}</h3>
        <div className="options">
          {questions[currentQuestion].options.map((option, index) => (
            <button 
              key={index} 
              onClick={() => handleAnswer(option)}
              className="option-btn"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="progress-bar">
        <div 
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} 
          className="progress"
        ></div>
      </div>
    </div>
  );
};

export default Questionnaire;