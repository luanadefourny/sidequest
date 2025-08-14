import { Link } from "react-router-dom";
import NavBar from "../Navbar/Navbar";
import { useEffect, useState } from "react";
import { useUser } from "../Context/userContext";
import { getQuests } from "../../services/questService";
import { getMyQuests } from "../../services/userService";
import FavouriteButton from "../FavouriteButton/favouriteButton";
import MyQuestsButton from "../MyQuestsButton/MyQuestsButton";
import type { Quest, MyQuest } from "../../types";

export default function MyQuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [myQuests, setMyQuests] = useState<string[]>([]);
  const { user } = useUser();

  // Fetch all quests
  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const data = await getQuests();
        if (data) setQuests(data);
      } catch (error) {
        console.error("Failed to fetch quests:", error);
      }
    };
    fetchQuests();
  }, []);

  // Fetch user's current quests
  useEffect(() => {
    if (!user?.id) return;
    const fetchMyQuests = async () => {
      try {
        const data = await getMyQuests(user.id);
        if (data) setMyQuests(data.map((q: MyQuest) => q.quest.toString()));
      } catch (error) {
        console.error("Failed to fetch user's quests:", error);
      }
    };
    fetchMyQuests();
  }, [user]);

  // Filter quests to show only the user's quests
  const myQuestList = quests.filter(q => myQuests.includes(q._id));

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <NavBar />

      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center tracking-wide">
        My Quests
      </h1>

      {myQuestList.length === 0 ? (
        <p className="text-center text-gray-700 text-lg">
          You have no quests added yet.{" "}
          <Link to="/quests" className="text-blue-600 hover:underline">
            Browse quests
          </Link>
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {myQuestList.map((quest) => (
            <div
              key={quest._id}
              className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">{quest.name}</h2>
                <p className="text-gray-700 text-base leading-relaxed">{quest.description}</p>
              </div>

              <div className="flex items-center justify-between mt-auto space-x-4">
                <FavouriteButton
                questId={quest._id}
                />
                <MyQuestsButton
                  questId={quest._id}
                  myQuests={myQuests}
                  setMyQuests={setMyQuests}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
