import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😠', label: 'Angry' },
  { emoji: '🤩', label: 'Excited' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '😰', label: 'Anxious' }
];

const Home = ({ darkMode }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const navigate = useNavigate();

  const handleCheckMyVibe = () => {
    navigate('/checkmyvibe');
  };

  return (
    <div className={`home ${darkMode ? 'dark' : ''}`}>
      <div className="home-content">

        {/* Mood Tracker */}
        <div className="mood-tracker">
          <h1 className="mood-heading">How are you feeling today?</h1>
          <div className="mood-options">
            {moods.map((mood, index) => (
              <button
                key={index}
                className={`mood-option ${selectedMood?.label === mood.label ? 'selected' : ''}`}
                onClick={() => setSelectedMood(mood)}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <span className="mood-label">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Call-to-Action Section */}
        <h1>Your mental health matters.</h1>
        <p className="subtitle">Take a quick vibe check to see how you're really doing</p>
        <div className="cta-buttons">
          <button className="cta-primary" onClick={handleCheckMyVibe}>
            Check My Vibe 🎤
          </button>
          <button className="cta-secondary">Learn More</button>
        </div>

      </div>
    </div>
  );
};

export default Home;
