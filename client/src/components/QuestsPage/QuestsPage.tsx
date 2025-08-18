import { useState } from 'react';

import type { Quest, QuestsPageProps } from '../../types';
import MyQuestsButton from '../MyQuestsButton/MyQuestsButton';
import QuestModal from '../QuestModal/QuestModal';

export default function QuestsPage({ quests, myQuests, setMyQuests }: QuestsPageProps) {
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center tracking-wide">
          Available Quests
        </h1>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10 text-lg leading-relaxed">
          Choose your next adventure and start your journey!
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {quests.map((quest) => (
            <div
              key={quest._id}
              className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">{quest.name}</h2>
                <p className="text-gray-700 text-base leading-relaxed">{quest.description}</p>
              </div>

              <div className="flex items-center justify-between mt-auto space-x-4">
                <button
                  className="flex-grow text-center px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
                  onClick={() => {
                    setSelectedQuest(quest);
                    setShowQuestModal(true);
                  }}
                >
                  View Quest
                </button>

                {/* <FavouriteButton questId={quest._id}
               /> */}

                <MyQuestsButton questId={quest._id} myQuests={myQuests} setMyQuests={setMyQuests} />
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
