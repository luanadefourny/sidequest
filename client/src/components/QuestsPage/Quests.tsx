import { Link } from "react-router-dom";
import NavBar from "../Navbar/navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../Context/userContext";
import FavouriteButton from "../FavouriteButton/favouriteButton";
import MyQuestsButton from "../MyQuestsButton/MyQuestsButton";

interface Quest {
  id: number;
  title: string;
  description: string;
}

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [myQuests, setMyQuests] = useState<number[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const response = await axios.get<Quest[]>("http://localhost:3000/quests");
        setQuests(response.data);
      } catch (error) {
        console.error("Failed to fetch quests:", error);
      }
    };
    fetchQuests();
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    const fetchMyQuests = async () => {
      try {
        const response = await axios.get<number[]>(
          `http://localhost:3000/users/${user.id}/my-quests`
        );
        setMyQuests(response.data);
      } catch (error) {
        console.error("Failed to fetch user's quests:", error);
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
              <FavouriteButton questId={quest.id} />
              <MyQuestsButton
                questId={quest.id}
                myQuests={myQuests}
                setMyQuests={setMyQuests}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center space-x-4">
        <Link
          to="/favquestlist"
          className="inline-block px-8 py-3 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition font-semibold"
        >
          To Favourite Quests
        </Link>
        <Link
          to="/myquests"
          className="inline-block px-8 py-3 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition font-semibold"
        >
          To My Quests
        </Link>
      </div>
    </div>
  );
}
