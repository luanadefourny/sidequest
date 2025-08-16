import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/userService";
import PasswordRequirements from "../PasswordPopup/passwordPopup";
import { pickRandomProfilePicture } from "../../helperFunctions";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPasswordReqs, setShowPasswordReqs] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      await registerUser({
        firstName,
        lastName,
        birthday: new Date(birthday),
        email,
        username,
        password,
        profilePicture: pickRandomProfilePicture(),
      });
      alert('Registered successfully!');
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-white to-purple-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100"
      >
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-900 tracking-wide drop-shadow-sm">
          Create Your Account
        </h1>

        {error && <p className="mb-4 text-red-600 text-center font-medium">{error}</p>}

        <label className="block mb-2 font-semibold text-gray-700">First Name</label>
        <input
          type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter your first name"
          className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />

        <label className="block mb-2 font-semibold text-gray-700">Last Name</label>
        <input
          type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
          placeholder="Enter your last name"
          className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />

        <label className="block mb-2 font-semibold text-gray-700">Birthday</label>
        <input
          type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />

        <label className="block mb-2 font-semibold text-gray-700">Email</label>
        <input
          type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />

        <label className="block mb-2 font-semibold text-gray-700">Username</label>
        <input
          type="text" value={username} onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
          className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />

        <label className="block mb-2 font-semibold text-gray-700">Password</label>
        <PasswordRequirements
          open={showPasswordReqs}
          onClose={() => setShowPasswordReqs(false)}
          password={password}
        />
        <input
          type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          className="w-full mb-6 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          onFocus={() => setShowPasswordReqs(true)}
          onBlur={() => setShowPasswordReqs(false)}
        />

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow hover:scale-[1.02] transition-transform"
        >
          Begin Your Adventure
        </button>

        <div className="mt-6 text-center">
          <span className="text-gray-600 mr-1">Already a traveler?</span>
          <Link to="/" className="text-indigo-600 font-semibold hover:underline">
            Log in here
          </Link>
        </div>
      </form>
    </div>
  );
}
