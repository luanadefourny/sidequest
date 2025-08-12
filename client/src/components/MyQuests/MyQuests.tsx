import { Link } from "react-router-dom";
import NavBar from "../Navbar/navbar";
import { RiDeleteBinLine } from "react-icons/ri";
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

export default function MyQuestsPage() {
  const [myQuests, setMyQuests] = useState<number[]>([]);

  // Load saved quest IDs from localStorage on mount
  useEffect(() => {
    const savedMyQuests = localStorage.getItem("myQuests");
    if (savedMyQuests) {
      setMyQuests(JSON.parse(savedMyQuests));
    }
  }, []);

  // Remove quest from MyQuests
  const removeQuest = (id: number) => {
    const updated = myQuests.filter((qid) => qid !== id);
    setMyQuests(updated);
    localStorage.setItem("myQuests", JSON.stringify(updated));
  };

  // Filter quests that are in myQuests
  const myQuestList = quests.filter((quest) => myQuests.includes(quest.id));

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

              <button
                onClick={() => removeQuest(quest.id)}
                className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                aria-label={`Remove ${quest.title} from My Quests`}
              >
                <RiDeleteBinLine className="mr-2 text-xl" /> Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link
          to="/quests"
          className="inline-block px-8 py-3 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition font-semibold"
        >
          Back to Quests
        </Link>
      </div>
    </div>
  );
}
