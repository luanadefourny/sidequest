import {
  RiBookmarkLine,
  RiBookmarkFill,
} from "react-icons/ri";
import { useEffect, useState } from "react";

interface FavouriteButtonProps {
  questId: number;
}

export default function FavouriteButton({ questId }: FavouriteButtonProps) {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((qid) => qid !== id)
        : [...prev, id]
    );
  };

  return (
    <button
      onClick={() => toggleFavorite(questId)}
      className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 hover:border-yellow-400 transition text-yellow-400 hover:text-yellow-500 shadow-md"
      aria-label={
        favorites.includes(questId)
          ? "Remove from Favorites"
          : "Add to Favorites"
      }
      title={
        favorites.includes(questId)
          ? "Remove from Favorites"
          : "Add to Favorites"
      }
    >
      {favorites.includes(questId) ? (
        <RiBookmarkFill className="text-2xl" />
      ) : (
        <RiBookmarkLine className="text-2xl" />
      )}
    </button>
  );
}