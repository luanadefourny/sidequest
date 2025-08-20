import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { capitalizeFirstLetter, pickRandomProfilePicture } from '../../helperFunctions';
import { loginUser, registerUser } from '../../services/userService';
import { useUser } from '../Context/userContext';
import PasswordRequirements from '../PasswordPopup/passwordPopup';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [showPasswordReqs, setShowPasswordReqs] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const meetsPasswordRequirements =
    /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && password.length >= 8;

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setBirthday('');
    setEmail('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setSubmitted(false);
    setError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setError('');

    if (!firstName.trim() || !lastName.trim() || !birthday || !email.trim() || !username.trim()) {
      setError('Please fill out all required fields.');
      return;
    }

    if (!emailValid) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }
    if (!meetsPasswordRequirements) {
      setError('Password does not meet requirements (min 8 chars, upper/lowercase & a number).');
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        firstName: capitalizeFirstLetter(firstName.trim()),
        lastName: capitalizeFirstLetter(lastName.trim()),
        birthday: new Date(birthday),
        email: email.trim(),
        username: username.trim(),
        password: password.trim(),
        profilePicture: pickRandomProfilePicture(),
      });

      // Login user immediately after registering
      const { user, token } = await loginUser({
        username: username.trim(),
        password: password.trim(),
      });

      if (!user || !user._id) {
        setError('Login failed: No user data returned.');
        setLoading(false);
        return;
      }

      setUser(user);
      localStorage.setItem('auth-token', token);

      resetForm();
      navigate('/homepage', { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-white to-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-lg bg-white/95 backdrop-blur-sm border border-gray-100 p-8 rounded-3xl shadow-2xl"
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/sidequest-logo.png"
            alt="SideQuest"
            className="h-20 w-auto drop-shadow-xl transition-transform duration-300 hover:scale-105"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 text-center text-gray-900 tracking-tight">
          Create Your Account
        </h1>
        <p className="text-center text-sm text-gray-600 mb-6">
          Join SideQuest — discover local adventures and start exploring.
        </p>

        {error && (
          <div className="mb-4 text-center text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              required
              className={`w-full mt-1 p-3 rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                submitted && !firstName.trim() ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {submitted && !firstName.trim() && (
              <p className="text-red-500 text-xs mt-1">Required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              required
              className={`w-full mt-1 p-3 rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                submitted && !lastName.trim() ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {submitted && !lastName.trim() && (
              <p className="text-red-500 text-xs mt-1">Required</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Birthday <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
            className={`w-full mt-1 p-3 rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
              submitted && !birthday ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {submitted && !birthday && <p className="text-red-500 text-xs mt-1">Required</p>}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className={`w-full mt-1 p-3 rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
              submitted && (!email.trim() || !emailValid) ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {submitted && !email.trim() && <p className="text-red-500 text-xs mt-1">Required</p>}
          {submitted && email.trim() && !emailValid && (
            <p className="text-red-500 text-xs mt-1">Invalid email</p>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Username <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            required
            className={`w-full mt-1 p-3 rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
              submitted && !username.trim() ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {submitted && !username.trim() && <p className="text-red-500 text-xs mt-1">Required</p>}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Password <span className="text-red-600">*</span>
          </label>

          <PasswordRequirements
            open={showPasswordReqs}
            onClose={() => setShowPasswordReqs(false)}
            password={password}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
            onFocus={() => setShowPasswordReqs(true)}
            onBlur={() => setShowPasswordReqs(false)}
            className={`w-full mt-1 p-3 rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
              submitted && (!password || !meetsPasswordRequirements) ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {submitted && !password && <p className="text-red-500 text-xs mt-1">Required</p>}
          {submitted && password && !meetsPasswordRequirements && (
            <p className="text-red-500 text-xs mt-1">Password must contain upper/lowercase, number and be 8+ chars.</p>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password <span className="text-red-600">*</span>
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
            className={`w-full mt-1 p-3 rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
              confirmPassword && !passwordsMatch ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {submitted && !confirmPassword && <p className="text-red-500 text-xs mt-1">Required</p>}
          {confirmPassword && !passwordsMatch && (
            <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold shadow-lg hover:from-green-700 hover:to-emerald-700 transition transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Begin Your Adventure'}
        </button>

        <div className="mt-5 text-center">
          <span className="text-gray-600 mr-1">Already a traveler?</span>
          <Link to="/" className="text-green-600 font-semibold hover:underline">
            Log in here
          </Link>
        </div>
      </form>
    </div>
  );
}
