// components/Layout/Layout.jsx
import React from 'react';
import Header from './Header';



const Layout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-0">
        {children}
      </main>
    </div>
  );
};

export default Layout;

