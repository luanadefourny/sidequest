import React from 'react';

import type { Quest } from '../../types';
import type { MyQuest } from '../../types';
import MyQuestsButton from '../MyQuestsButton/MyQuestsButton';

interface QuestModalProps {
  isVisible: boolean;
  onClose: () => void;
  quest: Quest | null;
  myQuests: MyQuest[];
  setMyQuests: React.Dispatch<React.SetStateAction<MyQuest[]>>;
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

export default function QuestModal({
  isVisible,
  onClose,
  quest,
  myQuests,
  setMyQuests,
}: QuestModalProps) {
  if (!isVisible || !quest) return null;

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === 'wrapper') {
      onClose();
    }
  };

  const badge = detectBadge(quest);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-opacity-25 backdrop-blur-sm"
      id="wrapper"
      onClick={handleClose}
    >
      <div className="relative w-[600px]">
        <button className="absolute -top-9 right-1 text-white text-3xl" onClick={onClose}>
          ×
        </button>
        <div className="bg-white p-8 rounded-lg shadow-lg relative">
          {badge && (
            <div className={`${badge.className} text-white px-3 py-1 rounded-md text-sm font-semibold absolute top-4 right-4`}>
              {badge.label}
            </div>
          )}
          <h2 className="text-2xl font-bold mb-4">{quest.name}</h2>
          <h3 className="text-xl font-semibold mb-4">{quest.type}</h3>
          <p className="mb-2">{quest.description}</p>
          <p className="mb-2">
            Price: {quest.currency} {quest.price}
          </p>
          <MyQuestsButton quest={quest} myQuests={myQuests} setMyQuests={setMyQuests} />
        </div>
      </div>
    </div>
  );
}
