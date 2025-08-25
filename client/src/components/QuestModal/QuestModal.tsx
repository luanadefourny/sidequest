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

function detectBadge(q: Quest | null) {
  if (!q) return null;
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
  if (asAny.location && typeof asAny.location === 'object') return { label: 'Place', className: 'bg-emerald-600' };
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
    if ((e.target as HTMLDivElement).id === 'wrapper') onClose();
  };

  const badge = detectBadge(quest);



  return (
    <div
      id="wrapper"
      onClick={handleClose}
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
    >
      <div className="relative w-full max-w-3xl mx-4">
        <button className="absolute -top-9 right-1 text-white text-3xl" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
          {quest.image && (
            <div className="w-full h-56 sm:h-72 overflow-hidden">
              <img src={quest.image} alt={quest.name} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-6 sm:p-8 relative">
            {badge && (
              <div className={`${badge.className} text-white px-3 py-1 rounded-md text-sm font-semibold absolute top-4 right-4`}>
                {badge.label}
              </div>
            )}

            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{quest.name}</h2>
                <div className="mt-1 text-sm text-gray-500">{quest.venueName ?? ''}</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="text-base font-medium">
                </div>

                <div className="mt-4">
                  <div className="text-sm text-gray-500">Price</div>
                  <div className="text-base font-medium">
                    {quest.price != null ? `${quest.currency ?? ''} ${quest.price}` : '—'}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm text-gray-500">Age restricted</div>
                  <div className="text-base font-medium">{quest.ageRestricted ? 'Yes' : 'No'}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Location</div>
                <div className="text-base font-medium mb-2">{quest.venueName ?? '—'}</div>


               
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm text-gray-500 mb-1">Description</div>
              <div className="text-gray-700 leading-relaxed">{quest.description ?? '—'}</div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <MyQuestsButton quest={quest} myQuests={myQuests} setMyQuests={setMyQuests} />
              <a
                href={quest.url ?? '#'}
                target={quest.url ? '_blank' : undefined}
                rel={quest.url ? 'noopener noreferrer' : undefined}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  quest.url ? 'bg-green-600 text-white hover:from-green-700 hover:to-emerald-700' : 'border text-gray-700 hover:bg-gray-50'
                }`}
              >
                {quest.url ? 'Open Link' : 'No link'}
              </a>
              <button onClick={onClose} className="px-4 py-2 rounded-lg border text-sm text-gray-700 hover:bg-gray-50">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
