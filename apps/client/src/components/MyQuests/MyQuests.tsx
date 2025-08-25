import { useState } from 'react';
import { Link } from 'react-router-dom';

import MyQuests from "../../assets/MyQuests.jpg"
import type { MyQuestsPageProps } from '../../types';
import type { Quest } from '../../types';
import FavouriteButton from '../FavouriteButton/favouriteButton';
import MyQuestModal from '../MyQuestModal/MyQuestModal';
import MyQuestsButton from '../MyQuestsButton/MyQuestsButton';

function detectBadge(q: Quest) {
  const asAny = q as any;
  const typeVal = (asAny.type ?? asAny.category ?? asAny.kind) || '';
  if (typeof typeVal === 'string') {
    const t = typeVal.toLowerCase();
    if (t.includes('event')) return { label: 'Event', className: 'bg-orange-500' };
    if (t.includes('place')) return { label: 'Place', className: 'bg-emerald-600' };
  }
  if (Array.isArray(asAny.tags)) {
    const tags = asAny.tags.map((x: any) => String(x).toLowerCase());
    if (tags.some((x: string) => x.includes('event'))) return { label: 'Event', className: 'bg-orange-500' };
    if (tags.some((x: string) => x.includes('place'))) return { label: 'Place', className: 'bg-emerald-600' };
  }
  if (asAny.isEvent) return { label: 'Event', className: 'bg-orange-500' };
  if (asAny.isPlace) return { label: 'Place', className: 'bg-emerald-600' };
  if (asAny.location && typeof asAny.location === 'string') return { label: 'Place', className: 'bg-emerald-600' };
  return null;
}

export default function MyQuestsPage({
  myQuests,
  setMyQuests,
  myQuestsLoading,
}: MyQuestsPageProps) {
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  return (
    <>
      <div className="min-h-screen bg-cover bg-center bg-no-repeat p-6 sm:p-10"
      style={{ backgroundImage: `url(${MyQuests})` }}>
        <header className="max-w-7xl mx-auto mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight drop-shadow-sm">
            My Quests
          </h1>
          <p className="text-sm text-gray-600">
            All quests you've saved or added — manage them here.
          </p>
        </header>

        <main className="max-w-7xl mx-auto">
          {myQuestsLoading ? (
            <div className="py-24 text-center">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-full shadow">
                <svg className="w-5 h-5 animate-spin text-green-600" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                  <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
                <span className="text-gray-700 font-medium">Loading your quests…</span>
              </div>
            </div>
          ) : myQuests.length === 0 ? (
            <div className="py-24 text-center">
              <div className="inline-block bg-white/80 backdrop-blur-sm px-8 py-6 rounded-2xl shadow">
                <p className="text-lg text-gray-700 mb-4">
                  You have no quests added yet.
                </p>
                <Link to="/quests" className="inline-block px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold shadow hover:from-green-700 hover:to-emerald-700 transition">
                  Browse quests
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-6">
              {myQuests.map((myQuest) => {
                if (typeof myQuest.quest === 'string') return null;
                const quest = myQuest.quest;
                const badge = detectBadge(quest);
                return (
                  <article
                    key={quest._id}
                    className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1"
                  >
                    {badge && (
                      <div className={`${badge.className} text-white px-2 py-1 rounded-md text-xs font-semibold absolute top-4 right-4`}>
                        {badge.label}
                      </div>
                    )}
                    <div className="mb-4">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        {quest.name}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                        {quest.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-6">
                      <MyQuestsButton
                        quest={quest}
                        myQuests={myQuests}
                        setMyQuests={setMyQuests}
                      />

                      <button
                        className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:from-green-700 hover:to-emerald-700 transition-transform duration-150 transform hover:-translate-y-0.5"
                        onClick={() => {
                          setSelectedQuest(quest);
                          setShowQuestModal(true);
                        }}
                      >
                        🔍 View Quest
                      </button>

                      <FavouriteButton
                        quest={quest}
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
