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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {error && <p className="mb-4 text-red-600 text-center font-semibold">{error}</p>}

        <label htmlFor="username" className="block mb-2 font-semibold text-gray-700">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          required
          className="w-full mb-6 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Log In
        </button>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mt-4 text-center">
          <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
            Don't have an account? Register here
          </Link>
        </div>
      </form>
    </div>
  );
}
