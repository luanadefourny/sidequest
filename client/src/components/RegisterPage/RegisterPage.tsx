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

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const meetsPasswordRequirements =
    /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && password.length >= 8;

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setError('');

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }
    if (!meetsPasswordRequirements) {
      setError('Password does not meet requirements');
      return;
    }

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
        setError('Login failed: No user data returned');
        return;
      }

      setUser(user);
      localStorage.setItem('auth-token', token);

      // Reset form
      setFirstName('');
      setLastName('');
      setBirthday('');
      setEmail('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');

      alert('Registered successfully!');
      navigate('/homepage', { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Registration failed');
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

        {/* First Name */}
        <label className="block mb-2 font-semibold text-gray-700">First Name <span aria-hidden="true" className="text-red-600">*</span></label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter your first name"
          required
          className={`w-full mb-4 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
            submitted && !firstName.trim() ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {submitted && !firstName.trim() && (
          <p className="text-red-500 text-sm mb-3" role="alert">
            Required
          </p>
        )}

        {/* Last Name */}
        <label className="block mb-2 font-semibold text-gray-700">Last Name <span aria-hidden="true" className="text-red-600">*</span></label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Enter your last name"
          required
          className={`w-full mb-4 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
            submitted && !lastName.trim() ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {submitted && !lastName.trim() && (
          <p className="text-red-500 text-sm mb-3" role="alert">
            Required
          </p>
        )}

        {/* Birthday */}
        <label className="block mb-2 font-semibold text-gray-700">Birthday <span aria-hidden="true" className="text-red-600">*</span></label>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          required
          className={`w-full mb-4 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
            submitted && !birthday ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {submitted && !birthday && (
          <p className="text-red-500 text-sm mb-3" role="alert">
            Required
          </p>
        )}

        {/* Email */}
        <label className="block mb-2 font-semibold text-gray-700">Email <span aria-hidden="true" className="text-red-600">*</span></label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className={`w-full mb-4 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
            submitted && (!email.trim() || !emailValid) ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {submitted && !email.trim() && (
          <p className="text-red-500 text-sm mb-3" role="alert">
            Required
          </p>
        )}
        {submitted && email.trim() && !emailValid && (
          <p className="text-red-500 text-sm mb-3" role="alert">
            Invalid email
          </p>
        )}

        {/* Username */}
        <label className="block mb-2 font-semibold text-gray-700">Username <span aria-hidden="true" className="text-red-600">*</span></label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
          required
          className={`w-full mb-4 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
            submitted && !username.trim() ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {submitted && !username.trim() && (
          <p className="text-red-500 text-sm mb-3" role="alert">
            Required
          </p>
        )}

        {/* Password */}
        <label className="block mb-2 font-semibold text-gray-700">Password <span aria-hidden="true" className="text-red-600">*</span></label>
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
          className={`w-full mb-4 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
            submitted && (!password || !meetsPasswordRequirements)
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
        />
        {submitted && !password && (
          <p className="text-red-500 text-sm mb-3" role="alert">
            Required
          </p>
        )}
        {submitted && password && !meetsPasswordRequirements && (
          <p className="text-red-500 text-sm mb-3" role="alert">
            Password does not meet requirements
          </p>
        )}

        {/* Confirm Password */}
        <label className="block mb-2 font-semibold text-gray-700">Confirm Password <span aria-hidden="true" className="text-red-600">*</span></label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          required
          className={`w-full mb-6 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
            confirmPassword && !passwordsMatch ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {submitted && !confirmPassword && (
          <p className="text-red-500 text-sm mb-3" role="alert">
            Required
          </p>
        )}
        {confirmPassword && !passwordsMatch && (
          <p className="text-red-500 text-sm mb-4" role="alert">
            Passwords do not match
          </p>
        )}
        {error && <p className="text-red-500 mb-4">{error}</p>}


        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow hover:scale-[1.02] transition-transform"
        >
          Begin Your Adventure
        </button>

        {/* Link */}
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
