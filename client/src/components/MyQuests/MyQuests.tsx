import { Link } from "react-router-dom";
import FavouriteButton from "../FavouriteButton/favouriteButton";
import MyQuestsButton from "../MyQuestsButton/MyQuestsButton";
import type { MyQuestsPageProps } from "../../types";

export default function MyQuestsPage({ myQuests, setMyQuests, myQuestsLoading }: MyQuestsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">

      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center tracking-wide">
        My Quests
      </h1>

      {myQuestsLoading ? (
        <p className="text-center text-gray-70 text-lg0">Loading your quests...</p>
      ) : myQuests.length === 0 ? (
        <p className="text-center text-gray-700 text-lg">
          You have no quests added yet.{" "}
          <Link to="/quests" className="text-blue-600 hover:underline">
            Browse quests
          </Link>
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {myQuests.map((myQuest) => {
            if (typeof myQuest.quest === 'string') return null;
            return (
              <div
                key={myQuest.quest._id}
                className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">{myQuest.quest.name}</h2>
                  <p className="text-gray-700 text-base leading-relaxed">{myQuest.quest.description}</p>
                </div>

                <div className="flex items-center justify-between mt-auto space-x-4">
                  <FavouriteButton
                    questId={myQuest.quest._id}
                    myQuests={myQuests}
                    setMyQuests={setMyQuests}
                  />
                  <MyQuestsButton
                    questId={myQuest.quest._id}
                    myQuests={myQuests}
                    setMyQuests={setMyQuests}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}
