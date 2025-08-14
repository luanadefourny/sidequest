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

export default function MyQuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [myQuests, setMyQuests] = useState<number[]>([]);
  const { user } = useUser();

  // Fetch all quests
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

  // Fetch user's current quests
  useEffect(() => {
    if (!user) return;
    const fetchMyQuests = async () => {
      try {
        const response = await axios.get<number[]>(`http://localhost:3000/users/${user.id}/my-quests`);
        setMyQuests(response.data);
      } catch (error) {
        console.error("Failed to fetch user's quests:", error);
      }
    };
    fetchMyQuests();
  }, [user]);

  // Filter quests to show only the user's quests
  const myQuestList = quests.filter(q => myQuests.includes(q.id));

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <NavBar />

      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center tracking-wide">
        My Quests
      </h1>

      {myQuestList.length === 0 ? (
        <p className="text-center text-gray-700 text-lg">
          You have no quests added yet.{" "}
          <Link to="/quests" className="text-blue-600 hover:underline">Browse quests</Link>
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {myQuestList.map((quest) => (
            <div
              key={quest.id}
              className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">{quest.title}</h2>
                <p className="text-gray-700 text-base leading-relaxed">{quest.description}</p>
              </div>

              <div className="flex items-center justify-between mt-auto space-x-4">
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
      )}

      <div className="mt-12 text-center space-x-4">
        <Link to="/quests" className="inline-block px-8 py-3 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition font-semibold">
          Back to Quests
        </Link>
        <Link to="/favquestlist" className="inline-block px-8 py-3 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition font-semibold">
          To Favourite Quests
        </Link>
      </div>
    </div>
  );
}
