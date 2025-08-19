import React from "react";

interface QuestStatsProps {
  myQuests: any[];
}

export default function QuestStats({ myQuests }: QuestStatsProps) {
  const questsAdded = myQuests?.length ?? 0;
  const favorites = myQuests?.filter((mq: any) => mq.isFavorite).length ?? 0;

  return (
    <div className="mt-6 grid grid-cols-2 gap-4">
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm">
        <p className="text-gray-500">Quests added</p>
        <p className="text-lg font-semibold text-gray-800">{questsAdded}</p>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm">
        <p className="text-gray-500">Favorites</p>
        <p className="text-lg font-semibold text-gray-800">{favorites}</p>
      </div>
    </div>
  );
}
