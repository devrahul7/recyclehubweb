// components/Header/Header.jsx
import React, { useState } from 'react';

const Header = () => {
  const [activeItem, setActiveItem] = useState('Home');

  const navItems = ['Home', 'About', 'Contact', 'Register', 'Login'];

  return (
    <header className="bg-green-500 py-3">
      <nav className="max-w-6xl mx-auto px-4">
        <ul className="flex justify-center items-center space-x-8">
          {navItems.map((item) => (
            <li key={item}>
              <button
                className={`px-3 py-2 text-white font-medium transition-all duration-200 hover:bg-white/20 rounded ${
                  activeItem === item ? 'bg-white/20' : ''
                }`}
                onClick={() => setActiveItem(item)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
