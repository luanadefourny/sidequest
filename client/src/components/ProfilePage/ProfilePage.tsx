import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../Context/userContext";

export default function ProfilePage() {
  const { user } = useUser();

  //! this fixed the rendering
  const birthDate =
    user &&
    (typeof user.birthday === "string" ? new Date(user.birthday) : user.birthday);

  const getAge = (d?: Date | null) => {
    if (!d) return null;
    const diff = Date.now() - d.getTime();
    const ageDt = new Date(diff);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  const initials = (() => {
    const name = (user?.firstName ?? user?.username ?? "U").toString().trim();
    if (!name) return "U";
    return name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  })();

  console.log(user?.profilePicture);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-gray-100 p-6 sm:p-10">
        <div className="flex justify-center items-center h-[70vh] text-gray-500">
          Loading user data...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-gray-100 p-6 sm:p-10">
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={`${user.firstName ?? user.username}'s profile`}
              className="w-32 h-32 rounded-full object-cover border border-gray-300 shadow-sm"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-semibold border border-gray-200 shadow-sm">
              {initials}
            </div>
          )}

          {/* Basic info */}
          <div className="text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-4">
              <h2 className="text-2xl font-semibold text-gray-800">{user.username}</h2>
              <Link
                to="/editprofile"
                className="ml-2 inline-block px-3 py-1 text-sm bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition"
                title="Edit profile"
              >
                Edit
              </Link>
            </div>

            <p className="text-gray-600">{user.email ?? "No email provided"}</p>

            <div className="mt-3">
              <p className="text-sm text-gray-700">
                <strong>Name:</strong> {user.firstName ?? "-"} {user.lastName ?? ""}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Birthdate:</strong>{" "}
                {birthDate ? birthDate.toLocaleDateString() : "Not provided"}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Age:</strong> {getAge(birthDate) ?? "—"}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Followers:</strong> {Array.isArray(user.followers) ? user.followers.length : 0}{" "}
                | <strong>Following:</strong>{" "}
                {Array.isArray(user.following) ? user.following.length : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm">
            <p className="text-gray-500">Quests added</p>
            <p className="text-lg font-semibold text-gray-800">{user.myQuests?.length ?? 0}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm">
            <p className="text-gray-500">Favorites</p>
            <p className="text-lg font-semibold text-gray-800">
              {user.myQuests ? user.myQuests.filter((mq: any) => mq.isFavorite).length : 0}
            </p>
          </div>
        </div>

        {/* commented out small fav preview kept from original */}
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
    </div>
  );
}
