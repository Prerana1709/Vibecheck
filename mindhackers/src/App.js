import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Counselor from './components/Counselor';
import Journaling from './components/Journaling';
import DarkModeToggle from './components/DarkModeToggle';
import ChatbotIcon from './components/chatbotIcon';
import Questionnaire from './components/Questionnaire';
import CheckMyVibe from './components/CheckMyVibe'; // 👈 Import added
import './App.css';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div className={`app ${darkMode ? 'dark' : 'light'}`}>
        {isLoggedIn && (
          <>
            <Navbar darkMode={darkMode} />
            <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <ChatbotIcon darkMode={darkMode} />
          </>
        )}

        <div className="content">
          <Routes>
            <Route 
              path="/" 
              element={
                isLoggedIn ? 
                  <Navigate to="/home" /> : 
                  <Login setIsLoggedIn={setIsLoggedIn} />
              } 
            />
            <Route 
              path="/home" 
              element={
                isLoggedIn ? 
                  <Home darkMode={darkMode} /> : 
                  <Navigate to="/" />
              } 
            />
            <Route 
              path="/counselor" 
              element={
                isLoggedIn ? 
                  <Counselor darkMode={darkMode} /> : 
                  <Navigate to="/" />
              } 
            />
            <Route 
              path="/journaling" 
              element={
                isLoggedIn ? 
                  <Journaling darkMode={darkMode} /> : 
                  <Navigate to="/" />
              } 
            />
            <Route 
              path="/questionnaire" 
              element={
                isLoggedIn ? 
                  <Questionnaire darkMode={darkMode} /> : 
                  <Navigate to="/" />
              } 
            />
            <Route 
              path="/checkmyvibe" 
              element={
                isLoggedIn ? 
                  <CheckMyVibe /> : 
                  <Navigate to="/" />
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
