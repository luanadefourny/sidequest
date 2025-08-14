import {
  RiBookmarkLine,
  RiBookmarkFill,
} from "react-icons/ri";
import { useState } from "react";
import { useUser } from "../Context/userContext";
import type { FavQuest } from "../../types";
import { toggleFavoriteQuest } from "../../services/userService";

interface FavouriteButtonProps {
  questId: string;
  fav: string[];
  setFav: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function FavouriteButton({ questId, fav, setFav }: FavouriteButtonProps) {
  const { user } = useUser();
  const isInFav = fav.includes(questId);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleQuest = async () => {
    if (!user?.id) {
      console.warn("No user logged in");
      return;
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    setFav(prev =>
      isInFav ? prev.filter(id => id !== questId) : [...prev, questId]
    );

    try {
      const updated = await toggleFavoriteQuest(user.id, questId);
      setFav(updated?.map((q: FavQuest) => q.quest.toString()) || []);
    } catch (error) {
      console.error("Error updating quest:", error);
    }
  };

  return (
    <button
      onClick={toggleQuest}
      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 
        hover:border-yellow-400 transition text-yellow-400 hover:text-yellow-500 shadow-md 
        ${isAnimating ? "scale-110 transition-transform duration-200" : ""}`}
      aria-label={isInFav ? "Remove from Favorites" : "Add to Favorites"}
      title={isInFav ? "Remove from Favorites" : "Add to Favorites"}
    >
      {isInFav ? (
        <RiBookmarkFill className="text-2xl" />
      ) : (
        <RiBookmarkLine className="text-2xl" />
      )}
    </button>
  );
}
