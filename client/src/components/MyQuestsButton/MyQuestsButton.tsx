import { RiAddLine, RiCheckboxCircleFill } from "react-icons/ri";
import axios from "axios";
import { useUser } from "../Context/userContext";

interface MyQuestsButtonProps {
  questId: number;
  myQuests: number[];
  setMyQuests: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function MyQuestsButton({ questId, myQuests, setMyQuests }: MyQuestsButtonProps) {
  const { user } = useUser();
  const isInMyQuests = myQuests.includes(questId);

  const toggleMyQuest = async () => {
    if (!user?.id) {
      console.warn("No user logged in");
      return;
    }

    console.log("Sending request:", {
      method: isInMyQuests ? "DELETE" : "POST",
      url: `http://localhost:3000/users/${user.id}/my-quests/${questId}`,
    });

    try {
      if (isInMyQuests) {
        await axios.delete(`http://localhost:3000/users/${user.id}/my-quests/${questId}`);
        setMyQuests((prev) => prev.filter((id) => id !== questId));
      } else {
        await axios.post(`http://localhost:3000/users/${user.id}/my-quests/${questId}`);
        setMyQuests((prev) => [...prev, questId]);
      }
    } catch (error) {
      console.error("Error updating quest:", error);
    }
  };

  return (
    <button
      onClick={toggleMyQuest}
      disabled={!user?.id}
      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition shadow-md ${
        isInMyQuests
          ? "border-green-500 text-green-600 bg-green-100 hover:bg-green-200"
          : "border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-100"
      }`}
      aria-label={isInMyQuests ? "Remove from My Quests" : "Add to My Quests"}
      title={isInMyQuests ? "Remove from My Quests" : "Add to My Quests"}
    >
      {isInMyQuests ? <RiCheckboxCircleFill className="text-2xl" /> : <RiAddLine className="text-2xl" />}
    </button>
  );
}
