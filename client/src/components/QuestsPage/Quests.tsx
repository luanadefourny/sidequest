import { Link } from "react-router-dom";
import NavBar from "../Navbar/navbar";
import {
  RiBookmarkLine,
  RiBookmarkFill,
  RiAddLine,
  RiCheckboxCircleFill,
} from "react-icons/ri";
import { useEffect, useState } from "react";

interface Quest {
  id: number;
  title: string;
  description: string;
}

const quests: Quest[] = [
  { id: 1, title: "Finding Nemo", description: "Don't get eaten by sharks." },
  { id: 2, title: "Find the One Piece", description: "Defeat sea emperors" },
  { id: 3, title: "Find the Dragonballs", description: "Defeat Goku" },
];

export default function QuestsPage() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [myQuests, setMyQuests] = useState<number[]>([]);

  // Load favorites & myQuests from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    const savedMyQuests = localStorage.getItem("myQuests");
    if (savedMyQuests) setMyQuests(JSON.parse(savedMyQuests));
  }, []);

  // Save favorites & myQuests on changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("myQuests", JSON.stringify(myQuests));
  }, [myQuests]);

  // Toggle favorites
  const toggleFavorite = (questId: number) => {
    setFavorites((prev) =>
      prev.includes(questId)
        ? prev.filter((id) => id !== questId)
        : [...prev, questId]
    );
  };

  // Toggle myQuests
  const toggleMyQuest = (questId: number) => {
    setMyQuests((prev) =>
      prev.includes(questId)
        ? prev.filter((id) => id !== questId)
        : [...prev, questId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <NavBar />

      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center tracking-wide">
        Available Quests
      </h1>
      <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10 text-lg leading-relaxed">
        Choose your next adventure and start your journey!
      </p>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {quest.title}
              </h2>
              <p className="text-gray-700 text-base leading-relaxed">
                {quest.description}
              </p>
            </div>

            <div className="flex items-center justify-between mt-auto space-x-4">
              <Link
                to={`/quests/${quest.id}`}
                className="flex-grow text-center px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
              >
                View Quest
              </Link>

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(quest.id)}
                className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 hover:border-yellow-400 transition text-yellow-400 hover:text-yellow-500 shadow-md"
                aria-label={
                  favorites.includes(quest.id)
                    ? "Remove from Favorites"
                    : "Add to Favorites"
                }
                title={
                  favorites.includes(quest.id)
                    ? "Remove from Favorites"
                    : "Add to Favorites"
                }
              >
                {favorites.includes(quest.id) ? (
                  <RiBookmarkFill className="text-2xl" />
                ) : (
                  <RiBookmarkLine className="text-2xl" />
                )}
              </button>

              {/* MyQuests Button */}
              <button
                onClick={() => toggleMyQuest(quest.id)}
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition shadow-md
                  ${
                    myQuests.includes(quest.id)
                      ? "border-green-500 text-green-600 bg-green-100 hover:bg-green-200"
                      : "border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-100"
                  }
                `}
                aria-label={
                  myQuests.includes(quest.id)
                    ? "Remove from My Quests"
                    : "Add to My Quests"
                }
                title={
                  myQuests.includes(quest.id)
                    ? "Remove from My Quests"
                    : "Add to My Quests"
                }
              >
                {myQuests.includes(quest.id) ? (
                  <RiCheckboxCircleFill className="text-2xl" />
                ) : (
                  <RiAddLine className="text-2xl" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/homepage"
          className="inline-block px-8 py-3 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition font-semibold"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
