
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15.232V21h-5.768L8.421 14.188 3 19.607V3h6.393l7.42 7.42L21 15.232zM19 16.768l-4.188-4.189L13.42 11.2 5 3.78V17.03l4.607-4.606L16.42 19H19v-2.232z"/>
          </svg>
          <h1 className="text-2xl font-bold text-gray-800">Flooring System Recommender</h1>
        </div>
        <p className="text-sm text-gray-500 hidden md:block">Powered by Gemini</p>
      </div>
    </header>
  );
};

export default Header;
