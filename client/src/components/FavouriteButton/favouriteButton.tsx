import { RiHeartFill, RiHeartLine } from 'react-icons/ri';

import { toggleFavoriteQuest } from '../../services/userService';
import type { MyQuestsButtonProps } from '../../types';
import { useUser } from '../Context/userContext';

export default function FavouriteButton({ quest, myQuests, setMyQuests }: MyQuestsButtonProps) {
  const { user, setUser } = useUser();

  const item = myQuests.find((myQuest) => myQuest.quest._id === quest._id);

  const isFavorite = !!item?.isFavorite;

  async function handleClick() {
    if (!user) {
      console.warn('No user logged in');
      return;
    }

    try {
      const updated = await toggleFavoriteQuest(user._id, quest._id);
      if (updated) setMyQuests(updated);
      setMyQuests(updated || []);
      setUser({...user, myQuests: updated || []})

    } 
    catch (error) {
      console.error('Error favoriting quest: ', error);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={!user?._id}
      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition shadow-md ${
        isFavorite
          ? 'border-red-500 text-red-600 bg-red-100 hover:bg-red-200'
          : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-100'
      }`}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Unfavorite quest' : 'Favorite quest'}
      title={isFavorite ? 'Unfavorite quest' : 'Favorite quest'}
    >
      {isFavorite ? <RiHeartFill className="text-2xl" /> : <RiHeartLine className="text-2xl" />}
    </button>
  );
}
