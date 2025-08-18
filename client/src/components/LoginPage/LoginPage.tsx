import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { loginUser } from '../../services/userService';
import { useUser } from '../Context/userContext';

export default function LoginPage() {
  const { setUser } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const user = await loginUser({
        username: username.trim(),
        password: password.trim(),
      });

      if (!user || !user._id) {
        setError('Login failed: No user data returned');
        return;
      }

      console.log('Login successful', user);
      setUser(user);
      navigate('/homepage', { replace: true });
    } catch (err: unknown) {
      console.error('Login error:', err);
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-white to-purple-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100"
      >
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center tracking-wide drop-shadow-sm">
          Login to Sidequest
        </h1>

        {error && <p className="mb-4 text-red-600 text-center font-medium">{error}</p>}

        <label htmlFor="username" className="block mb-2 font-semibold text-gray-700">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />

        <label htmlFor="password" className="block mb-2 font-semibold text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full mb-6 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow hover:scale-[1.02] transition-transform"
        >
          Enter the Quest
        </button>

        <div className="mt-6 text-center">
          <span className="text-gray-600 mr-1">New adventurer?</span>
          <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}
