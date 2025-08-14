import { Link } from "react-router-dom";
import MapComponent from "../MapComponent/MapComponent";
import NavBar from '../Navbar/Navbar';

export default function HomePage() {


  return (
    <div className="home-page">
      <NavBar />
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 p-4 pt-10">

      {/* Page title */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">Home Page</h1>
      <p className="mb-8 text-gray-700 text-center max-w-md">
        Welcome to the home page!
      </p>

      {/* Map container */}
      <div className="w-full sm:w-[600px] h-[300px] sm:h-[480px] bg-white rounded-lg shadow-lg overflow-hidden mt-6">
        <MapComponent />
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