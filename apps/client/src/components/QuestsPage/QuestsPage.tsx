import { useState } from 'react';

import QuestPage from '../../assets/QuestsPage.jpg';
import type { Quest, QuestsPageProps } from '../../types';
import MyQuestsButton from '../MyQuestsButton/MyQuestsButton';
import QuestModal from '../QuestModal/QuestModal';

export default function QuestsPage({ quests, myQuests, setMyQuests }: QuestsPageProps) {
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  function pickRandomFrom(list: Quest[]) {
    if (!list || list.length === 0) return null;
    const idx = Math.floor(Math.random() * list.length);
    return list[idx] ?? null;
  }

  function handleRandomAny() {
    const q = pickRandomFrom(quests);
    if (!q) {
      alert('No quests available');
      return;
    }
    setSelectedQuest(q);
    setShowQuestModal(true);
  }

  function handleRandomNormal() {
    const normalList = quests.filter((t: any) => {
      const d = (t as any).difficulty ?? (t as any).level ?? '';
      return typeof d === 'string' ? d.toLowerCase() === 'normal' : false;
    });
    const q = pickRandomFrom(normalList);
    if (!q) {
      alert('No normal quests available');
      return;
    }
    setSelectedQuest(q);
    setShowQuestModal(true);
  }

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

  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat p-6 sm:p-10"
        style={{ backgroundImage: `url(${QuestPage})` }}
      >
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center tracking-wide drop-shadow-md">
          Available Quests
        </h1>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-6 text-lg leading-relaxed">
          Choose your next adventure and start your journey!
        </p>

        <div className="flex items-center justify-center gap-3 mb-8">
          <button
            onClick={handleRandomAny}
            className="px-4 py-2 bg-gradient-to-r from-black to-black text-white font-semibold rounded-lg shadow-md hover:from-gray-700 hover:to-gray-600 transition-transform duration-150 transform hover:-translate-y-0.5"
            aria-label="Pick a random quest"
          >
            🎲 Random Quest
          </button>
        
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          {quests.map((quest) => {
            const badge = detectBadge(quest);
            return (
              <article
                key={quest._id}
                className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1"
              >
                {badge && (
                  <div className={`absolute top-4 right-4 ${badge.className} text-white px-2 py-1 rounded-md text-xs font-semibold`}>
                    {badge.label}
                  </div>
                )}
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">{quest.name}</h2>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                    {quest.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <MyQuestsButton quest={quest} myQuests={myQuests} setMyQuests={setMyQuests} />

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
            );
          })}
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
