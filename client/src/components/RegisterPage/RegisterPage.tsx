import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { pickRandomProfilePicture } from '../../helperFunctions';
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
    /[A-Z]/.test(password) && // at least one uppercase
    /[a-z]/.test(password) && // at least one lowercase
    /\d/.test(password) &&    // at least one digit
    password.length >= 8;     // minimum length
  
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
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        birthday: new Date(birthday),
        email: email.trim(),
        username: username.trim(),
        password: password.trim(),
        profilePicture: pickRandomProfilePicture(),
      });

      //login user as well
      const user = await loginUser({
        username: username.trim(),
        password: password.trim(),
      })
      if (!user || !user._id) {
        setError('Login failed: No user data returned');
        return;
      }
      console.log('Login successful', user);
      setUser(user);
      
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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        <label htmlFor="firstName" className="block mb-2 font-semibold text-gray-700">
          First Name <span aria-hidden="true" className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter your first name"
          required
          aria-required="true"
          aria-invalid={submitted && !firstName.trim()}
          className={`w-full mb-4 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            submitted && !firstName.trim() ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {submitted && !firstName.trim() && (
          <p className="text-red-500 text-sm mb-3" role="alert">Required</p>
        )}

        <label htmlFor="lastName" className="block mb-2 font-semibold text-gray-700">
          Last Name <span aria-hidden="true" className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Enter your last name"
          required
          aria-required="true"
          aria-invalid={submitted && !lastName.trim()}
          className={`w-full mb-4 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            submitted && !lastName.trim() ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {submitted && !lastName.trim() && (
          <p className="text-red-500 text-sm mb-3" role="alert">Required</p>
        )}

        <label htmlFor="birthday" className="block mb-2 font-semibold text-gray-700">
          Birthday <span aria-hidden="true" className="text-red-600">*</span>
        </label>
        <input
          type="date"
          id="birthday"
          name="birthday"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          placeholder="Enter your birthday"
          required
          aria-required="true"
          aria-invalid={submitted && !birthday}
          className={`w-full mb-6 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            submitted && !birthday ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {submitted && !birthday && (
          <p className="text-red-500 text-sm mb-3" role="alert">Required</p>
        )}

        <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">
          Email <span aria-hidden="true" className="text-red-600">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          aria-required="true"
          aria-invalid={submitted && (!email.trim() || !emailValid)}
          className={`w-full mb-4 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            submitted && (!email.trim() || !emailValid) ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {submitted && !email.trim() && (
          <p className="text-red-500 text-sm mb-3" role="alert">Required</p>
        )}
        {submitted && email.trim() && !emailValid && (
          <p className="text-red-500 text-sm mb-3" role="alert">Invalid email</p>
        )}

        <label htmlFor="username" className="block mb-2 font-semibold text-gray-700">
          Username <span aria-hidden="true" className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
          required
          aria-required="true"
          aria-invalid={submitted && !username.trim()}
          className={`w-full mb-4 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            submitted && !username.trim() ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {submitted && !username.trim() && (
          <p className="text-red-500 text-sm mb-3" role="alert">Required</p>
        )}

        <label
          htmlFor="password"
          className="block mb-2 font-semibold text-gray-700"
        >
          Password <span aria-hidden="true" className="text-red-600">*</span>
        </label>
        <PasswordRequirements
          open={showPasswordReqs}
          onClose={() => setShowPasswordReqs(false)}
          password={password}
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full mb-2 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            submitted && (!password || !meetsPasswordRequirements) ? 'border-red-500' : 'border-gray-300'
          }`}
          onFocus={() => { setShowPasswordReqs(true); }}
          onBlur={() => { setShowPasswordReqs(false); }}
          required
          aria-required="true"
          aria-invalid={submitted && (!password || !meetsPasswordRequirements)}
        />
        {submitted && !password && (
          <p className="text-red-500 text-sm mb-3" role="alert">Required</p>
        )}
        {submitted && password && !meetsPasswordRequirements && (
          <p className="text-red-500 text-sm mb-3" role="alert">Password does not meet requirements</p>
        )}

        <label htmlFor="confirmPassword" className="block mb-2 font-semibold text-gray-700">
          Confirm Password <span aria-hidden="true" className="text-red-600">*</span>
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onFocus={() => { setShowPasswordReqs(false); }}
          onBlur={() => { setShowPasswordReqs(false); }}
          className={`w-full mb-2 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${confirmPassword && !passwordsMatch ? 'border-red-500' : 'border-gray-300'}`}
          aria-invalid={!!confirmPassword && !passwordsMatch}        
        />
        {submitted && !confirmPassword && (
          <p className="text-red-500 text-sm mb-3" role="alert">Required</p>
        )}

        {confirmPassword && !passwordsMatch && (
          <p className="text-red-500 text-sm mb-4" role="alert">
            Passwords do not match.
          </p>
        )}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Register
        </button>
        <div className="mt-4 text-center">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold">
            Already have an account? Log in
          </Link>
        </div>
      </form>
    </div>
  );
}
