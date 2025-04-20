import React from 'react';
import './Counselor.css';

const Counselor = ({ darkMode }) => {
  const counselors = [
    {
      name: "Dr. Sarah Lee",
      specialty: "Anxiety & Stress",
      bio: "Helping you find calm in the chaos with CBT techniques.",
      emoji: "🧘‍♀️"
    },
    {
      name: "Alex Johnson",
      specialty: "Relationships",
      bio: "Specializing in communication and healthy boundaries.",
      emoji: "💞"
    },
    {
      name: "Jamie Taylor",
      specialty: "Self-Esteem",
      bio: "Empowering you to see your worth and potential.",
      emoji: "✨"
    }
  ];

  return (
    <div className={`counselor-page ${darkMode ? 'dark' : ''}`}>
      <h2>Find Your Perfect Counselor</h2>
      <p className="page-description">Connect with mental health professionals who get you</p>
      
      <div className="counselor-grid">
        {counselors.map((counselor, index) => (
          <div key={index} className="counselor-card">
            <div className="emoji-bg">{counselor.emoji}</div>
            <h3>{counselor.name}</h3>
            <p className="specialty">{counselor.specialty}</p>
            <p className="bio">{counselor.bio}</p>
            <button className="book-btn">Book Session</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Counselor;