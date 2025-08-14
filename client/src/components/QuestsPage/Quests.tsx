import { Link } from "react-router-dom";
import NavBar from "../Navbar/navbar";
import { useEffect, useState } from "react";
import { useUser } from "../Context/userContext";
import FavouriteButton from "../FavouriteButton/favouriteButton";
import MyQuestsButton from "../MyQuestsButton/MyQuestsButton";
import { getQuests } from "../../services/questService";
import { getMyQuests } from "../../services/userService";
import type { Quest, MyQuest } from "../../types";

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [myQuests, setMyQuests] = useState<string[]>([]);
  const { user } = useUser();

  // Fetch all quests
  useEffect(() => {
    const fetchQuests = async () => {
      const data = await getQuests();
      if (data) setQuests(data);
    };
    fetchQuests();
  }, []);

  // Fetch user's quests
  useEffect(() => {
    const fetchMyQuests = async () => {
      if (!user?.id) return;
      const data = await getMyQuests(user.id);
      if (data) {
        setMyQuests(data.map((q: MyQuest) => q.quest.toString()));
      }
    };
    fetchMyQuests();
  }, [user]);

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
            key={quest._id} // use string ID from backend
            className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">{quest.name}</h2>
              <p className="text-gray-700 text-base leading-relaxed">{quest.description}</p>
            </div>

            <div className="flex items-center justify-between mt-auto space-x-4">
              <Link
                to={`/quests/${quest._id}`}
                className="flex-grow text-center px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
              >
                View Quest
              </Link>

              {/* Favorite Button */}


              {/* MyQuests Button */}
              <MyQuestsButton
                questId={quest._id}
                myQuests={myQuests}
                setMyQuests={setMyQuests}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
