import { useEffect, useState } from "react";
import { useUser } from "../Context/userContext";
import { getMyQuests } from "../../services/userService";
import type { MyQuest, Quest } from "../../types";
import NavBar from "../Navbar/Navbar";
import FavouriteButton from "../FavouriteButton/favouriteButton";

export default function FavQuestList() {
  const { user } = useUser();
  const [favQuests, setFavQuests] = useState<MyQuest[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchFavorites = async () => {
      try {
        // Populate quests from backend by adding `1` for populate query param
        const data = await getMyQuests(user.id, 1);
        if (data) {
          setFavQuests(data.filter((mq: MyQuest) => mq.isFavorite));
        }
      } catch (error) {
        console.error("Failed to fetch favorite quests:", error);
      }
    };

    fetchFavorites();
  }, [user]);

  if (!user?.id) {
    return (
      <p className="text-center mt-10">
        Please log in to view your favorite quests.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <NavBar />
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
        My Favorite Quests
      </h1>

      {favQuests.length === 0 ? (
        <p className="text-center text-gray-600">No favorite quests yet.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {favQuests.map(({ quest, isFavorite }) => {
            // Ensure quest is populated
            if (typeof quest === "string") {
              // If backend didn't populate quest details, skip rendering
              return null;
            }

            const questObj = quest as Quest;

            return (
              <div
                key={questObj._id}
                className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    {questObj.name}
                  </h2>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {questObj.description}
                  </p>
                </div>

                <div className="flex items-center justify-end mt-auto">
                  <FavouriteButton
                    questId={questObj._id}
                    initialIsFavorite={isFavorite}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
