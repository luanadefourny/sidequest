import { useState } from 'react';

import QuestPage from '../../../public/QuestsPage.jpg';
import type { Quest, QuestsPageProps } from '../../types';
import MyQuestsButton from '../MyQuestsButton/MyQuestsButton';
import QuestModal from '../QuestModal/QuestModal';
import QuestPage from '../../assets/QuestsPage.jpg';


export default function QuestsPage({ quests, myQuests, setMyQuests }: QuestsPageProps) {
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat p-6 sm:p-10"
        style={{ backgroundImage: `url(${QuestPage})` }}
      >
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center tracking-wide drop-shadow-md">
          Available Quests
        </h1>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10 text-lg leading-relaxed">
          Choose your next adventure and start your journey!
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          {quests.map((quest) => (
            <article
              key={quest._id}
              className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">{quest.name}</h2>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                  {quest.description}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <MyQuestsButton questId={quest._id} myQuests={myQuests} setMyQuests={setMyQuests} />

                <button
                  className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:from-green-700 hover:to-emerald-700 transition-transform duration-150 transform hover:-translate-y-0.5"
                  onClick={() => {
                    setSelectedQuest(quest);
                    setShowQuestModal(true);
                  }}
                >
                  🔍 View Quest
                </button>
              </div>
            </article>
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
