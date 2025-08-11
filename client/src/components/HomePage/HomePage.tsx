import { Link } from "react-router-dom";
import Map from "../MapComponent/MapComponent";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 p-6 pt-10">
      {/* Page title */}
      <h1 className="text-4xl font-bold mb-4 text-gray-900">Home Page</h1>
      <p className="mb-8 text-gray-700 text-center max-w-md">
        Welcome to the home page!
      </p>

      {/* Navigation */}
      <nav className="navbar">
        <ul className="flex space-x-6 bg-white p-4 rounded-lg shadow-md">
          <li>
            <Link
              to="/homepage"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Login
            </Link>
          </li>

          <li>
            <Link
              to="/profile"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/favourites"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Favourites
            </Link>
          </li>
        </ul>
      </nav>
      <div className="w-[600px] h-[480px] bg-white rounded-lg shadow-lg overflow-hidden mr-auto">
        <Map />
      </div>
    </div>
  );
}

