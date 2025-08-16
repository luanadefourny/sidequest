import { useState } from "react";
// import { useUser } from "../Context/userContext";
// import FavouriteButton from "../FavouriteButton/favouriteButton";
import MyQuestsButton from "../MyQuestsButton/MyQuestsButton";
// import { getQuests, } from "../../services/questService";
// import { getMyQuests } from "../../services/userService";
import type { QuestsPageProps } from "../../types";
import QuestModal from "../QuestModal/QuestModal";

export default function QuestsPage({ quests, myQuests, setMyQuests }: QuestsPageProps) {
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  // const [quests, setQuests] = useState<Quest[]>([]);
  // const [myQuests, setMyQuests] = useState<string[]>([]);
  // const { user } = useUser();

  // Fetch all quests
  // useEffect(() => {
  //   const fetchQuests = async () => {
  //     const data = await getQuests();
  //     if (data) setQuests(data);
  //   };
  //   fetchQuests();
  // }, []);

  // Fetch user's quests
  // useEffect(() => {
  //   const fetchMyQuests = async () => {
  //     if (!user?.id) return;
  //     const data = await getMyQuests(user.id);
  //     if (data) {
  //       setMyQuests(data.map((q: MyQuest) => q.quest.toString()));
  //     }
  //   };
  //   fetchMyQuests();
  // }, [user]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-gray-100 p-6 sm:p-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center tracking-wide drop-shadow-md">
          Available Quests
        </h1>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10 text-lg leading-relaxed">
          Choose your next adventure and start your journey!
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {quests.map((quest) => (
            <div
              key={quest._id}
              className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3 drop-shadow-sm">{quest.name}</h2>
                <p className="text-gray-700 text-base leading-relaxed">{quest.description}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between mt-auto gap-3">
                <button
                  className="flex-grow text-center px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow hover:opacity-95 hover:scale-105 transition-transform duration-200"
                  onClick={() => {
                    setSelectedQuest(quest);
                    setShowQuestModal(true);
                  }}
                >
                  🔍 View Quest
                </button>

                {/* <FavouriteButton questId={quest._id} /> */}

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

      <QuestModal
        isVisible={showQuestModal}
        onClose={() => setShowQuestModal(false)}
        quest={selectedQuest}
        myQuests={myQuests}
        setMyQuests={setMyQuests}
      />
    </>
  );
}
