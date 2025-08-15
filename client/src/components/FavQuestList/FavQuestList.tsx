import { useUser } from "../Context/userContext";
import type { MyQuestsPageProps } from "../../types";
import FavouriteButton from "../FavouriteButton/favouriteButton";

export default function FavQuestList({ myQuests, setMyQuests, myQuestsLoading }: MyQuestsPageProps) {
  const { loggedIn } = useUser();

  const favQuests = myQuests.filter((mq) => mq.isFavorite);

  if (!loggedIn) {
    return (
      <p className="text-center mt-10">
        Please log in to view your favorite quests.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
        My Favorite Quests
      </h1>

      {myQuestsLoading ? (
        <p className="text-center text-gray-600">Loading favorites...</p>
      ) : favQuests.length === 0 ? (
        <p className="text-center text-gray-600">No favorite quests yet.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {favQuests.map((myQuest) => {
            if (typeof myQuest.quest === 'string') return null;
            return (
              <div
                key={myQuest.quest._id}
                className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    {myQuest.quest.name}
                  </h2>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {myQuest.quest.description}
                  </p>
                </div>

                <div className="flex items-center justify-end mt-auto">
                  <FavouriteButton
                    questId={myQuest.quest._id}
                    myQuests={myQuests}
                    setMyQuests={setMyQuests}
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
