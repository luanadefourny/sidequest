import { Link } from "react-router-dom";
import background from "../../assets/background.jpg";
import type { HomePageProps } from "../../types";
import MapComponent from "../MapComponent/MapComponent";
import DistanceSlider from "../Slider/Slider";

export default function HomePage({ location, setLocation, radius, setRadius }: HomePageProps) {
  return (
    <div className="home-page">
      {/* Background with overlay */}
      <div
  className="relative min-h-screen flex flex-col items-center justify-start bg-cover bg-center bg-no-repeat px-6 pt-12"
  style={{ backgroundImage: `url(${background})`}}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/20 to-white/60 backdrop-blur-[2px]" />

  {/* Content above overlay */}
  <div className="relative z-10 flex flex-col items-center justify-center p-8 mt-8 mx-auto max-w-2xl text-center animate-fadeIn">
    <img
      src="/sidequest-logo.png"
      alt="SideQuest Logo"
      className="h-28 w-auto mb-1 drop-shadow-2xl hover:scale-110 transition-transform duration-500"
    />

    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 drop-shadow-sm mb-2">
      Welcome to <span className="text-green-600">SideQuest</span>
    </h1>

    <p className="text-lg text-gray-700 mb-1 leading-relaxed font-medium">
      Discover{" "}
      <span className="font-semibold text-green-600 hover:underline transition-colors">
        <Link to="/quests">local quests</Link>
      </span>{" "}
      and adventures in your area.
    </p>
    <p className="text-base text-gray-600 mb-0 font-medium">
      Enter your location below to get started.
    </p>
  </div>


        {/* Distance Slider */}
        <div className="relative z-10 mt-4">
          <DistanceSlider radius={radius} setRadius={setRadius} />
        </div>

        {/* Map container */}
        <div className="relative z-10 w-full sm:w-[750px] h-[320px] sm:h-[700px] bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-gray-200 mt-8 transform transition-all hover:scale-[1.02] hover:shadow-3xl duration-500">
          <MapComponent setLocation={setLocation} radius={radius} />
        </div>

        {/* Button */}
        <div className="relative z-10 mt-12 animate-slideUp">
          <Link to="/quests">
            <button className="mb-30 px-12 py-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:from-green-700 hover:to-teal-700 transition-all duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-[1.03]">
              🚀 Begin Your Adventure
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
