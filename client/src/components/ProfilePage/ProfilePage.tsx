import React from 'react';

import type { User, GeoPoint } from '../../types';

interface ProfileProps {
  user: User | null;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading user data...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
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
            <p className="text-sm text-gray-700"><strong>Age:</strong> {user.age}</p>
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