import { Link } from "react-router-dom";
import MapComponent from "../MapComponent/MapComponent";
import type { HomePageProps } from "../../types";

export default function HomePage({ location, setLocation }: HomePageProps) {
  console.log(location); // TODO: remove later

  return (
    <div className="home-page">
      <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-indigo-100 via-white to-gray-100 p-6 pt-12">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center p-8 mt-6 mx-auto max-w-2xl text-center animate-fadeIn">
          <img
            src="/sidequest-logo.png"
            alt="SideQuest Logo"
            className="h-24 w-auto mb-6 drop-shadow-xl hover:scale-105 transition-transform duration-300"
          />
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight drop-shadow-sm">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              SideQuest
            </span>
            !
          </h1>
          <p className="text-lg text-gray-700 mb-2 leading-relaxed">
            Discover{" "}
            <span className="font-semibold text-indigo-600 hover:underline">
              <Link to="/quests">local quests</Link>
            </span>{" "}
            and adventures in your area.
          </p>
          <p className="text-base text-gray-500">
            Enter your location below to get started.
          </p>
        </div>

        {/* Map container */}
        <div className="w-full sm:w-[600px] h-[320px] sm:h-[480px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 mt-6 transition-transform hover:scale-[1.02] hover:shadow-3xl duration-300">
          <MapComponent setLocation={setLocation} />
        </div>

        {/* Button */}
        <div className="mt-10 animate-slideUp">
          <Link to="/quests">
            <button className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5">
              🚀 Begin Your Adventure
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
