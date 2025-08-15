import { Link } from "react-router-dom";
import MapComponent from "../MapComponent/MapComponent";
import type { HomePageProps } from "../../types";

export default function HomePage({ location, setLocation }: HomePageProps) {
  console.log(location); //TODO remove (and change homepage props)

  return (
    <div className="home-page">
      <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 p-4 pt-10">

      <div className="flex flex-col items-center justify-center  p-8 mt-8 mx-auto max-w-xl">
        <img
          src="/sidequest-logo.png"
          alt="SideQuest Logo"
          className="h-20 w-auto mb-6 drop-shadow-lg"
        />
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 text-center tracking-wide">
          Welcome to SideQuest!
        </h1>
        <p className="text-lg text-gray-700 text-center mb-2">
          Find local quests and adventures in your area.
        </p>
        <p className="text-base text-gray-500 text-center">
          Enter your location to discover quests near you.
        </p>
      </div>

        {/* Map container */}
        <div className="w-full sm:w-[600px] h-[300px] sm:h-[480px] bg-white rounded-lg shadow-lg overflow-hidden mt-6">
          <MapComponent setLocation={setLocation} />
        </div>
        <div className="mt-6">
          <Link to="/quests">
            <button className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-700 transition">
              Find Quests
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}