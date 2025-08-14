import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../Navbar/navbar";
import FavouriteButton from "../FavouriteButton/favouriteButton";
import MyQuestsButton from "../MyQuestsButton/MyQuestsButton";
import { useUser } from "../Context/userContext";
import { getMyQuests } from "../../services/userService";
import type { MyQuest } from "../../types";

export default function FavouritesPage() {
  const { user } = useUser();
  const [myQuests, setMyQuests] = useState<MyQuest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyQuests = async () => {
      if (!user?.id) return;
      try {
        const quests = await getMyQuests(user.id, 1);
        setMyQuests(quests);
      } catch (error) {
        console.error("Error fetching quests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyQuests();
  }, [user?.id]);

  const favoriteQuests = myQuests.filter(q => q.isFavorite);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading favorite quests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <NavBar />
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center tracking-wide">
        My Favourite Quests
      </h1>

      {favoriteQuests.length === 0 ? (
        <p className="text-center text-gray-700 text-lg">
          You have no favourite quests added yet.{" "}
          <Link to="/quests" className="text-blue-600 hover:underline">
            Browse quests
          </Link>
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteQuests.map((quest) => {
            const questId = typeof quest.quest === "string" ? quest.quest : quest.quest._id;
            const title = typeof quest.quest === "string" ? "Unknown Quest" : quest.quest.name;
            const description = typeof quest.quest === "string" ? "" : quest.quest.description;

            return (
              <div
                key={questId}
                className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">{title}</h2>
                  <p className="text-gray-700 text-base leading-relaxed">{description}</p>
                </div>
                <div className="flex justify-between">
                  <FavouriteButton questId={questId} />
                  <MyQuestsButton questId={questId} myQuests={myQuests} setMyQuests={setMyQuests} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
