// src/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-orange-500 text-white py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">OneStopShot</h1>
        <nav>
          <Link to="/" className="text-lg font-medium hover:underline px-4">
            Home
          </Link>
          <Link to="/prediction" className="text-lg font-medium hover:underline px-4">
            Prediction
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
