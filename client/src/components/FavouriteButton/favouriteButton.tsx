import { RiBookmarkLine, RiBookmarkFill } from "react-icons/ri";
import { useState, useEffect } from "react";
import { useUser } from "../Context/userContext";
import type { MyQuest } from "../../types";
import { getMyQuests, addToMyQuests, toggleFavoriteQuest } from "../../services/userService";

interface FavouriteButtonProps {
  questId: string;
}

export default function FavouriteButton({ questId }: FavouriteButtonProps) {
  const { user } = useUser();
  const [myQuests, setMyQuests] = useState<MyQuest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const fetchMyQuests = async () => {
      try {
        const quests = await getMyQuests(user.id, 1);
        setMyQuests(quests);
      } catch (err) {
        console.error("Error fetching my quests:", err);
      }
    };

    fetchMyQuests();
  }, [user?.id]);

  const handleToggle = async () => {
    if (!user?.id) return;

    setIsLoading(true);

    try {
      const questInMyQuests = myQuests.find(
        (q) => (typeof q.quest === "string" ? q.quest : q.quest._id) === questId
      );

      if (!questInMyQuests) {
        await addToMyQuests(user.id, questId, 1);
      }

      const updated = await toggleFavoriteQuest(user.id, questId, 1);
      setMyQuests(updated);
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const isFav = myQuests.some(
    (q) => (typeof q.quest === "string" ? q.quest : q.quest._id) === questId && q.isFavorite
  );

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 hover:border-yellow-400 transition text-yellow-400 hover:text-yellow-500 shadow-md"
      aria-label={isFav ? "Remove from Favorites" : "Add to Favorites"}
      title={isFav ? "Remove from Favorites" : "Add to Favorites"}
    >
      {isFav ? <RiBookmarkFill className="text-2xl" /> : <RiBookmarkLine className="text-2xl" />}
    </button>
  );
}
