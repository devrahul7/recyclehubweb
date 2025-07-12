import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../cssfolder/Navbar.css';

export default function EcoSajhaNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="ecosajha-navigation-wrapper">
      {/* Logo */}
      <div 
        className={`ecosajha-brand-logo-container ${
          location.pathname === '/' ? 'ecosajha-brand-logo-active' : ''
        }`}
        onClick={() => { navigate('/'); setMenuOpen(false); }}
      >
        EcoSajha Recycle
      </div>

      {/* Hamburger Icon for small screens */}
      <div className="ecosajha-hamburger-icon" onClick={toggleMenu}>
        <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
        <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
        <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
      </div>

      {/* Navigation Links */}
      <div className={`ecosajha-navigation-links-cluster ${menuOpen ? 'open' : ''}`}>
        <div
          className={`ecosajha-nav-link-item ${
            location.pathname === '/about' ? 'ecosajha-nav-link-active-state' : ''
          }`}
          onClick={() => { navigate('/about'); setMenuOpen(false); }}
        >
          About
        </div>
        <div 
          className={`ecosajha-nav-link-item ${
            location.pathname === '/contact' ? 'ecosajha-nav-link-active-state' : ''
          }`}
          onClick={() => { navigate('/contact'); setMenuOpen(false); }}
        >
          Contact
        </div>
        <div 
          className={`ecosajha-nav-link-item ${
            location.pathname === '/login' ? 'ecosajha-nav-link-active-state' : ''
          }`}
          onClick={() => { navigate('/login'); setMenuOpen(false); }}
        >
          Login
        </div>
        <div 
          className={`ecosajha-nav-link-item ${
            location.pathname === '/register' ? 'ecosajha-nav-link-active-state' : ''
          }`}
          onClick={() => { navigate('/register'); setMenuOpen(false); }}
        >
          Register
        </div>
      </div>
    </nav>
  );
}
  