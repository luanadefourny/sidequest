import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { loginUser } from '../../services/userService';
import { useUser } from '../Context/userContext';

export default function LoginPage() {
  const { setUser } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { user, token } = await loginUser({
        username: username.trim(),
        password: password.trim(),
      });

      if (!user || !user._id) {
        setError('Login failed: No user data returned');
        return;
      }

      setUser(user);
      localStorage.setItem('auth-token', token);
      navigate('/homepage', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-white to-gray-100 p-6">
      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-sm border border-gray-100 p-8 rounded-3xl shadow-2xl"
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/sidequest-logo.png"
            alt="SideQuest"
            className="h-20 w-auto drop-shadow-xl transition-transform duration-300 hover:scale-105"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 text-center tracking-tight">
          Welcome back
        </h1>

        <p className="text-center text-sm text-gray-600 mb-6">
          Enter your credentials to continue your SideQuest journey.
        </p>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <label htmlFor="username" className="block mb-2 font-medium text-gray-700">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
          disabled={loading}
        />

        <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full mb-6 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
          disabled={loading}
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in…' : 'Enter the Quest'}
        </button>

        <div className="mt-6 text-center">
          <span className="text-gray-600 mr-1">New adventurer?</span>
          <Link to="/register" className="text-green-600 font-semibold hover:underline">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}
