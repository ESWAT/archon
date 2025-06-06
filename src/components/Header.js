import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCog, FaTrash, FaComment } from 'react-icons/fa'; 
import './Header.css';

const Header = ({ onClearChat }) => {
  const location = useLocation();
  
  return (
    <header className="header">
      <div className="logo">
        
        <span className="logo-icon-hangul">글</span>
        <h1>Archon</h1>
      </div>
      <nav className="nav-buttons">
        {location.pathname === '/settings' ? (
          <Link to="/" className="nav-link">
            
            <FaComment size={16} /> 
            <span>Chat</span>
          </Link>
        ) : (
          <>
            <button onClick={onClearChat} className="nav-button">
              <FaTrash size={16} />
              <span>Clear</span>
            </button>
            <Link to="/settings" className="nav-link">
              <FaCog size={16} />
              <span>Settings</span>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
