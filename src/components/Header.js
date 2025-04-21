import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCog, FaLanguage } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="header">
      <div className="logo">
        <FaLanguage size={24} />
        <h1>Language Teacher</h1>
      </div>
      <nav>
        {location.pathname === '/settings' ? (
          <Link to="/" className="nav-link">
            <span>Chat</span>
          </Link>
        ) : (
          <Link to="/settings" className="nav-link">
            <FaCog size={20} />
            <span>Settings</span>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
