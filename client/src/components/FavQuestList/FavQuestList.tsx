import { useUser } from "../Context/userContext";
import type { MyQuestsPageProps } from "../../types";
import FavouriteButton from "../FavouriteButton/favouriteButton";
import FavQuestModal from "../FavQuestModal/FavQuestModal";
import MyQuestsButton from "../MyQuestsButton/MyQuestsButton";
import { useState } from "react";

export default function FavQuestList({ myQuests, setMyQuests, myQuestsLoading }: MyQuestsPageProps) {
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const { loggedIn } = useUser();

  // derive only favorite quests
  const favQuests = myQuests.filter((mq) => mq.isFavorite);

  if (!loggedIn) {
    return (
      <p className="text-center mt-10">
        Please log in to view your favorite quests.
      </p>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-gray-100 p-6 sm:p-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center tracking-wide">
          My Favorite Quests
        </h1>

        {myQuestsLoading ? (
          <p className="text-center text-gray-600">Loading favorites...</p>
        ) : favQuests.length === 0 ? (
          <p className="text-center text-gray-600">No favorite quests yet.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {favQuests.map((myQuest) => {
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

                  <div className="flex flex-col sm:flex-row items-center justify-between mt-auto gap-3">
                    {/* Keep the same sizes you used originally */}
                    <MyQuestsButton
                      questId={myQuest.quest._id}
                      myQuests={myQuests}
                      setMyQuests={setMyQuests}
                    />

                    <button
                      className="flex-grow text-center px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow hover:opacity-95 hover:scale-105 transition-transform duration-200"
                      onClick={() => {
                        setSelectedQuest(myQuest.quest);
                        setShowQuestModal(true);
                      }}
                    >
                      🔍 View Quest
                    </button>

                    <div className="flex items-center justify-end mt-auto">
                      <FavouriteButton
                        questId={myQuest.quest._id}
                        myQuests={myQuests}
                        setMyQuests={setMyQuests}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <FavQuestModal
        isVisible={showQuestModal}
        onClose={() => setShowQuestModal(false)}
        quest={selectedQuest}
        myQuests={myQuests}
        setMyQuests={setMyQuests}
      />
    </>
  );
}
