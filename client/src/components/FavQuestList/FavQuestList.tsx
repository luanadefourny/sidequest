import { useState } from 'react';
import { Link } from 'react-router-dom';

import type { MyQuestsPageProps } from '../../types';
import { useUser } from '../Context/userContext';
import FavouriteButton from '../FavouriteButton/favouriteButton';
import FavQuestModal from '../FavQuestModal/FavQuestModal';
import MyQuestsButton from '../MyQuestsButton/MyQuestsButton';
import MyQuests from '../../assets/MyQuests.jpg';

export default function FavQuestList({
  myQuests,
  setMyQuests,
  myQuestsLoading,
}: MyQuestsPageProps) {
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const { loggedIn } = useUser();

  const favQuests = myQuests.filter((mq) => mq.isFavorite);

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <p className="text-lg font-medium text-gray-700 mb-4">
            Please{' '}
            <Link to="/login" className="text-green-600 font-semibold hover:underline">
              log in
            </Link>{' '}
            to view your favorite quests.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat p-6 sm:p-10"
        style={{ backgroundImage: `url(${MyQuests})` }}
      >
        <header className="max-w-7xl mx-auto mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
            My Favorite Quests
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Your curated list of quests — quick access to what you love.
          </p>
        </header>

        <main className="max-w-7xl mx-auto">
          {myQuestsLoading ? (
            <div className="py-24 text-center">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-full shadow">
                <svg
                  className="w-5 h-5 animate-spin text-green-600"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeOpacity="0.25"
                  />
                  <path
                    d="M22 12a10 10 0 00-10-10"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-gray-700 font-medium">Loading favorites…</span>
              </div>
            </div>
          ) : favQuests.length === 0 ? (
            <div className="py-24 text-center">
              <div className="inline-block bg-white/80 backdrop-blur-sm px-8 py-6 rounded-2xl shadow">
                <p className="text-lg text-gray-700 mb-4">No favorite quests yet.</p>
                <Link
                  to="/quests"
                  className="inline-block px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold shadow hover:from-green-700 transition"
                >
                  Browse Quests
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {favQuests.map((myQuest) => {
                if (typeof myQuest.quest === 'string') return null;

                return (
                  <article
                    key={myQuest.quest._id}
                    className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="mb-4">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        {myQuest.quest.name}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                        {myQuest.quest.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-6">
                      <MyQuestsButton
                        questId={myQuest.quest._id}
                        myQuests={myQuests}
                        setMyQuests={setMyQuests}
                      />

                      <button
                        className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:from-green-700 hover:to-emerald-700 transition-transform duration-150 transform hover:-translate-y-0.5"
                        onClick={() => {
                          setSelectedQuest(myQuest.quest);
                          setShowQuestModal(true);
                        }}
                      >
                        🔍 View Quest
                      </button>

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
        </main>
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
