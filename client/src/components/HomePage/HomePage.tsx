import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
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
              to="/"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Register
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
    </div>
  );
}
