import React, { useState } from 'react';

export default function FavouritesPage() {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="favourites-page">
      <nav className="navbar">
        <ul className="flex items-center space-x-6 bg-white p-4 rounded-lg shadow-md justify-between w-full">
          <li>
          <a
            href="/homepage"
            className="text-blue-600 hover:text-blue-800 font-semibold h-10px w-10px"
            >
            <img src="/home.png" alt="Home" className="inline-block mr-2 h-7" />
          </a>
          </li>
          <li className="relative">
            <button
              className="p-2 rounded focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Open menu"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1">
                <line x1="3" y1="5" x2="20" y2="5" />
                <line x1="3" y1="12" x2="20" y2="12" />
                <line x1="3" y1="19" x2="20" y2="19" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg z-10">
                <a href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</a>
                <a href="/favourites" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Favourites</a>
                <a href="/third list" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Third list</a>
              </div>
            )}
          </li>
        </ul>
      </nav>
    <h1>Favourites Page</h1>
    <p>Welcome to the favourites page!</p>
  </div>
  );
}