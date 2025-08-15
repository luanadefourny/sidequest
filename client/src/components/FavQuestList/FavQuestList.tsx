import { useUser } from "../Context/userContext";
import type { MyQuestsPageProps } from "../../types";
import FavouriteButton from "../FavouriteButton/favouriteButton";
import FavQuestModal from "../FavQuestModal/FavQuestModal";
import { useState } from "react";

export default function FavQuestList({ myQuests, setMyQuests, myQuestsLoading }: MyQuestsPageProps) {
    const [showQuestModal, setShowQuestModal] = useState(false);
    const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const { loggedIn } = useUser();

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
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
        My Favorite Quests
      </h1>

      {myQuestsLoading ? (
        <p className="text-center text-gray-600">Loading favorites...</p>
      ) : favQuests.length === 0 ? (
        <p className="text-center text-gray-600">No favorite quests yet.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {favQuests.map((myQuest) => {
            if (typeof myQuest.quest === 'string') return null;
            return (
              <div
                key={myQuest.quest._id}
                className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    {myQuest.quest.name}
                  </h2>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {myQuest.quest.description}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-auto space-x-4">
                <button
                    className="flex-grow text-center px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
                    onClick={() => {
                      setSelectedQuest(myQuest.quest);
                      setShowQuestModal(true);
                    }}
                  >
                    View Quest
                  </button>

                <div className="flex items-center justify-end mt-auto">
                  <FavouriteButton
                    questId={myQuest.quest._id}
                    myQuests={myQuests}
                    setMyQuests={setMyQuests}
                  />
                </div>
                </div>
              </div>
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
