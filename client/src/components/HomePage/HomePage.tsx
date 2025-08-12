import { Link } from "react-router-dom";
import Map from "../MapComponent/MapComponent";
import { useState } from "react";

export default function HomePage() {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 p-4 pt-10">
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
      {/* Page title */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">Home Page</h1>
      <p className="mb-8 text-gray-700 text-center max-w-md">
        Welcome to the home page!
      </p>

      {/* Navigation */}
      <nav className="navbar w-full sm:w-auto">
        <ul className="flex flex-col sm:flex-row sm:space-x-6 bg-white p-4 rounded-lg shadow-md items-center gap-3 sm:gap-0">
          <li>
            <Link
              to="/homepage"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/favourites"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Favourites
            </Link>
          </li>
        </ul>
      </nav>

      {/* Map container */}
      <div className="w-full sm:w-[600px] h-[300px] sm:h-[480px] bg-white rounded-lg shadow-lg overflow-hidden mt-6">
        <Map />
      </div>
      <div className="mt-6">
        <Link to="/quests">
          <button className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-700 transition">
            Find Quests
          </button>
        </Link>
      </div>
    </div>
  );
}