import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/", {
        username: username.trim(),
        password: password.trim(),
      });

      console.log("Login successful:", response.data);

      // Redirect after successful login
      navigate("/homepage");
    } catch (err: any) {
      console.error("Login error:", err);

      if (err.response?.status === 401) {
        setError("Invalid username or password");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {error && (
          <p className="mb-4 text-red-600 text-center font-semibold">{error}</p>
        )}

        <label htmlFor="username" className="block mb-2 font-semibold text-gray-700">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="password" className="block mb-2 font-semibold text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full mb-6 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Log In
        </button>

        <div className="mt-4 text-center">
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Don't have an account? Register here
          </Link>
        </div>
      </form>
    </div>
  );
}
