import React, { useState } from 'react';

import type { User } from '../../types';

interface ProfileProps {
  user: User | null;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {

  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading user data...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
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
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user.profilePicture}
          alt={`${user.firstName}'s profile`}
          className="w-32 h-32 rounded-full object-cover border border-gray-300"
        />
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-semibold text-gray-800">{user.username}</h2>
          <p className="text-gray-600">{user.email}</p>
          <div className="mt-2">
            <p className="text-sm text-gray-700"><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-700">
              <strong>Age:</strong> {user.birthday.toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Followers:</strong> {user.followers.length} | <strong>Following:</strong> {user.following.length}
            </p>
          </div>
        </div>
      </div>

      {/*small fav preview*
      {user.favoriteLocations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Favorite Locations</h3>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {user.favoriteLocations.map((loc, idx) => (
              <li key={idx}>
                {loc.label} — [Lng: {loc.location.coordinates[0]}, Lat: {loc.location.coordinates[1]}]
              </li>
            ))}
          </ul>
        </div>
      )}*/}
    </div>
  );
};

export default Profile;