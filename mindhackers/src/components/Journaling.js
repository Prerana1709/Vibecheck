import React, { useState, useEffect } from 'react';
import './Journaling.css';

const Journaling = ({ darkMode }) => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [currentDate] = useState(new Date().toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  }));
  const [selectedMood, setSelectedMood] = useState('😊');

  const moods = ['😊', '😢', '🤬', '🤩', '😴', '🥰', '😎', '😮‍💨'];

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    setEntries(savedEntries);
  }, []);

  const saveEntry = () => {
    if (!newEntry.trim()) return;
    
    const entry = {
      id: Date.now(),
      date: currentDate,
      content: newEntry,
      mood: selectedMood,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const updatedEntries = [entry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    setNewEntry('');
  };

  const deleteEntry = (id) => {
    const filteredEntries = entries.filter(entry => entry.id !== id);
    setEntries(filteredEntries);
    localStorage.setItem('journalEntries', JSON.stringify(filteredEntries));
  };

  return (
    <div className={`journaling-container ${darkMode ? 'dark' : ''}`}>
      <header className="journal-header">
        <h1>Main Character Moments</h1>
        <p className="subtitle">Track your mood & thoughts</p>
      </header>

      <div className="journal-main">
        <div className="entry-editor">
          <div className="mood-picker">
            {moods.map(mood => (
              <button
                key={mood}
                className={`mood-btn ${selectedMood === mood ? 'active' : ''}`}
                onClick={() => setSelectedMood(mood)}
              >
                {mood}
              </button>
            ))}
          </div>
          
          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="What's on your mind today?..."
            className="entry-input"
          />
          
          <button 
            onClick={saveEntry}
            className="save-btn"
            disabled={!newEntry.trim()}
          >
            Save Entry ➔
          </button>
        </div>

        <div className="entries-list">
          <h3>Your Entries</h3>
          
          {entries.length === 0 ? (
            <div className="empty-state">
              <p>No entries yet</p>
              <span>✏️ Write something!</span>
            </div>
          ) : (
            entries.map(entry => (
              <div key={entry.id} className="entry-card">
                <div className="entry-header">
                  <span className="entry-mood">{entry.mood}</span>
                  <span className="entry-date">{entry.date} • {entry.time}</span>
                  <button 
                    onClick={() => deleteEntry(entry.id)}
                    className="delete-btn"
                  >
                    ×
                  </button>
                </div>
                <p className="entry-content">{entry.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Journaling;