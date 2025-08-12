import { Link } from "react-router-dom";
import { useState } from "react";

interface Quest {
  id: number;
  title: string;
  description: string;
}

const quests: Quest[] = [
  { id: 1, title: "Finding Nemo", description: "Dont ge eaten by sharks." },
  { id: 2, title: "Find the One piece", description: "Defeat sea emperors" },
];

export default function QuestsPage() {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-10">
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
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 text-center">
        Available Quests
      </h1>
      <p className="text-gray-700 text-center max-w-2xl mx-auto mb-8">
        Choose your next adventure and start your journey!
      </p>

      {/* Quest Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {quest.title}
              </h2>
              <p className="text-gray-600 mb-4">{quest.description}</p>
            </div>
            <Link
              to={`/quests/${quest.id}`}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
            >
              View Quest
            </Link>
          </div>
        ))}
      </div>

      {/* Back Button */}
      <div className="mt-8 text-center">
        <Link
          to="/homepage"
          className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
