import { useEffect, useState } from "react";
import { RiHeartFill, RiHeartLine } from "react-icons/ri";
import { useUser } from "../Context/userContext";
import { getMyQuests, addToMyQuests, toggleFavoriteQuest } from "../../services/userService";

type MyQuestLite = { quest: any; isFavorite: boolean };

function getId(x: any): string {
  if (typeof x === "string") return x;
  if (x && typeof x === "object") {
    if (typeof x._id === "string") return x._id;
    if (typeof x.toString === "function") return x.toString();
  }
  return "";
}

export default function FavouriteButton({ questId }: { questId: string }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [hasQuest, setHasQuest] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!user?.id) return;
      // populate=0 so mq.quest is an ObjectId (or string) — easy to compare
      const list = (await getMyQuests(user.id, 0)) as MyQuestLite[] | undefined;
      if (!alive || !list) return;
      const item = list.find((mq) => getId(mq.quest) === questId);
      setHasQuest(!!item);
      setIsFavorite(!!item?.isFavorite);
    })();
    return () => {
      alive = false;
    };
  }, [user?.id, questId]);

  const handleClick = async () => {
    if (!user?.id || loading) return;
    setLoading(true);

    // optimistic UI
    const prev = isFavorite;
    setIsFavorite(!isFavorite);

    try {
      if (!hasQuest) {
        const afterAdd = (await addToMyQuests(user.id, questId, 0)) as MyQuestLite[] | undefined;
        const added = afterAdd?.find((mq) => getId(mq.quest) === questId);
        setHasQuest(!!added);
      }
      const afterToggle = (await toggleFavoriteQuest(user.id, questId, 0)) as MyQuestLite[] | undefined;
      const updated = afterToggle?.find((mq) => getId(mq.quest) === questId);
      if (updated) setIsFavorite(!!updated.isFavorite);
    } catch (err) {
      // revert on failure
      setIsFavorite(prev);
      console.error("Favorite toggle failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!user?.id || loading}
      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition shadow-md ${
        isFavorite
          ? "border-red-500 text-red-600 bg-red-100 hover:bg-red-200"
          : "border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-100"
      }`}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "Unfavorite quest" : "Favorite quest"}
      title={isFavorite ? "Unfavorite quest" : "Favorite quest"}
    >
      {isFavorite ? <RiHeartFill className="text-2xl" /> : <RiHeartLine className="text-2xl" />}
    </button>
  );
}
