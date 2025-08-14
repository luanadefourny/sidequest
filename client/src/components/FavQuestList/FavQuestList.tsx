import { useEffect, useState } from "react";
import { getQuests } from "../../services/questService";
import { toggleFavoriteQuest } from "../../services/userService";
import NavBar from "../Navbar/Navbar";
import FavouriteButton from "../FavouriteButton/FavouriteButton";
import MyQuestsButton from "../MyQuestsButton/MyQuestsButton";

interface Quest {
  questId: string; // if your API returns it as string
  title: string;
  description: string;
}

export default function FavQuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const data = await getQuests(); // fetch from API
        setQuests(data);
      } catch (error) {
        console.error("Error fetching quests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuests();
  }, []);

  if (loading) {
    return <p>Loading quests...</p>;
  }

  return (
    <div>
      <NavBar />
      <h1>All Quests</h1>
      {quests.map((quest) => (
        <div key={quest.questId} className="quest-card">
          <h2>{quest.title}</h2>
          <p>{quest.description}</p>
          <FavouriteButton questId={quest.questId} />
          <MyQuestsButton questId={quest.questId} />
        </div>
      ))}
    </div>
  );
}
