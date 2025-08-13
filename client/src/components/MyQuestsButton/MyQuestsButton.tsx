import {
  RiAddLine,
  RiCheckboxCircleFill,
} from "react-icons/ri";
import { useEffect, useState } from "react";

interface MyQuestButtonProps {
  questId: number;
}


export default function MyQuestsButton({ questId }: MyQuestButtonProps) {
  const [myQuests, setMyQuests] = useState<number[]>([]);

  useEffect(() => {
    localStorage.setItem("myQuests", JSON.stringify(myQuests));
  }, [myQuests]);

  const toggleMyQuest = (questId: number) => {
    setMyQuests((prev) =>
      prev.includes(questId)
        ? prev.filter((id) => id !== questId)
        : [...prev, questId]
    );
  };

  return (
  <button
    onClick={() => toggleMyQuest(questId)}
    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition shadow-md
      ${
        myQuests.includes(questId)
          ? "border-green-500 text-green-600 bg-green-100 hover:bg-green-200"
          : "border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-100"
      }
    `}
    aria-label={
      myQuests.includes(questId)
        ? "Remove from My Quests"
        : "Add to My Quests"
    }
    title={
      myQuests.includes(questId)
        ? "Remove from My Quests"
        : "Add to My Quests"
    }
  >
    {myQuests.includes(questId) ? (
      <RiCheckboxCircleFill className="text-2xl" />
    ) : (
      <RiAddLine className="text-2xl" />
    )}
  </button>
  );
}