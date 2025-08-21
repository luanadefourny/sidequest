import React from 'react';

import type { Quest } from '../../types';
import type { MyQuest } from '../../types';
import FavouriteButton from '../FavouriteButton/favouriteButton';
import MyQuestsButton from '../MyQuestsButton/MyQuestsButton';

interface QuestModalProps {
  isVisible: boolean;
  onClose: () => void;
  quest: Quest | null;
  myQuests: MyQuest[];
  setMyQuests: React.Dispatch<React.SetStateAction<MyQuest[]>>;
}

export default function MyQuestModal({
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

  // console.log(quest);

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
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">{quest.name}</h2>
          <h3 className="text-xl font-semibold mb-4">{quest.type}</h3>
          <p className="mb-2">{quest.description}</p>
          <p className="mb-2">
            Price: {quest.currency} {quest.price}
          </p>
          <MyQuestsButton quest={quest} myQuests={myQuests} setMyQuests={setMyQuests} />
          <FavouriteButton quest={quest} myQuests={myQuests} setMyQuests={setMyQuests} />
        </div>
      </div>
    </div>
  );
}
