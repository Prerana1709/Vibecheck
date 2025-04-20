import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ darkMode }) => {
  return (
    <nav className={`navbar ${darkMode ? 'dark' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Vibe<span>check</span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/counselor" className="nav-link">Counselor</Link>
          <Link to="/journaling" className="nav-link">Journaling</Link>
          <div className="nav-highlight"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
