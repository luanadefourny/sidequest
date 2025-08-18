import { useState } from "react";
import { Link } from "react-router-dom";

import type { MyQuestsPageProps } from "../../types";
import FavouriteButton from "../FavouriteButton/favouriteButton";
import MyQuestModal from "../MyQuestModal/MyQuestModal";
import MyQuestsButton from "../MyQuestsButton/MyQuestsButton";

export default function MyQuestsPage({
  myQuests,
  setMyQuests,
  myQuestsLoading,
}: MyQuestsPageProps) {
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-gray-100 p-6 sm:p-10">
        {/* Page Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center tracking-wide drop-shadow-md">
          My Quests
        </h1>

        {/* Loading / Empty States */}
        {myQuestsLoading ? (
          <p className="text-center text-gray-700 text-lg">Loading your quests...</p>
        ) : myQuests.length === 0 ? (
          <p className="text-center text-gray-700 text-lg">
            You have no quests added yet.{" "}
            <Link
              to="/quests"
              className="text-indigo-600 hover:underline font-semibold"
            >
              Browse quests
            </Link>
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            {myQuests.map((myQuest) => {
              if (typeof myQuest.quest === "string") return null;

              return (
                <article
                  key={myQuest.quest._id}
                  className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3 drop-shadow-sm">
                      {myQuest.quest.name}
                    </h2>
                    <p className="text-gray-700 text-base leading-relaxed">
                      {myQuest.quest.description}
                    </p>
                  </div>

                  {/* Action Buttons: Add + View + Favorite */}
                  <div className="flex items-center justify-between gap-3 mt-auto">
                    {/* Add to MyQuests */}
                    <MyQuestsButton
                      questId={myQuest.quest._id}
                      myQuests={myQuests}
                      setMyQuests={setMyQuests}
                    />

                    {/* View Quest */}
                    <button
                      className="flex-1 text-center px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow hover:opacity-95 hover:scale-105 transition-transform duration-200"
                      onClick={() => {
                        setSelectedQuest(myQuest.quest);
                        setShowQuestModal(true);
                      }}
                    >
                      🔍 View Quest
                    </button>

                    {/* Favourite */}
                    <FavouriteButton
                      questId={myQuest.quest._id}
                      myQuests={myQuests}
                      setMyQuests={setMyQuests}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <MyQuestModal
        isVisible={showQuestModal}
        onClose={() => setShowQuestModal(false)}
        quest={selectedQuest}
        myQuests={myQuests}
        setMyQuests={setMyQuests}
      />
    </>
  );
}
