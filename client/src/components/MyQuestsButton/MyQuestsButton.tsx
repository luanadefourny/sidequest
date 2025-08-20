import { RiAddLine, RiCheckboxCircleFill } from 'react-icons/ri';

import { addToMyQuests, removeFromMyQuests } from '../../services/userService';
import type { MyQuestsButtonProps } from '../../types';
import { useUser } from '../Context/userContext';

export default function MyQuestsButton({ questId, myQuests, setMyQuests }: MyQuestsButtonProps) {
  const { user, setUser } = useUser();
  const isInMyQuests = myQuests.some(
    (quest) => (typeof quest.quest === 'string' ? quest.quest : quest.quest._id) === questId,
  );

  const toggleMyQuest = async () => {
    if (!user) {
      console.warn('No user logged in');
      return;
    }

    try {
      let updated;
      if (isInMyQuests) {
        updated = await removeFromMyQuests(user._id, questId, 1);
        setMyQuests(updated || []);
      } else {
        updated = await addToMyQuests(user._id, questId, 1);
        setMyQuests(updated || []);
      }
      
    setMyQuests(updated || []);
    setUser({ ...user, myQuests: updated || [] })
    } catch (error) {
      console.error('Error updating quest:', error);
    }
  };

  return (
    <button
      onClick={toggleMyQuest}
      disabled={!user?._id}
      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition shadow-md ${
        isInMyQuests
          ? 'border-green-500 text-green-600 bg-green-100 hover:bg-green-200'
          : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-100'
      }`}
      aria-label={isInMyQuests ? 'Remove from My Quests' : 'Add to My Quests'}
      title={isInMyQuests ? 'Remove from My Quests' : 'Add to My Quests'}
    >
      {isInMyQuests ? (
        <RiCheckboxCircleFill className="text-2xl" />
      ) : (
        <RiAddLine className="text-2xl" />
      )}
    </button>
  );
}
