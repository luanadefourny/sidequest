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
  const [error, setError] = useState('')
  
  // Form data state for the contact form
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      //TODO should we trim all these?
      await registerUser({
        firstName,
        lastName,
        birthday: new Date(birthday),
        email,
        username,
        password,
        profilePicture: pickRandomProfilePicture(),
      });
      setFirstName('');
      setLastName('');
      setBirthday('');
      setEmail('');
      setUsername('');
      setPassword('');
      alert('Registered successfully!');
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed");
      }
    };
  }
  
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
     <form
       onSubmit={handleSubmit}
       className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
       >
       <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

       <label htmlFor="firstName" className="block mb-2 font-semibold text-gray-700">
         First Name
       </label>
       <input
         type="text"
         id="firstName"
         name="firstName"
         value={firstName}
         onChange={(e) => setFirstName(e.target.value)}
         placeholder="Enter your first name"
         className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
         />

       <label htmlFor="lastName" className="block mb-2 font-semibold text-gray-700">
         Last Name
       </label>
       <input
         type="text"
         id="lastName"
         name="lastName"
         value={lastName}
         onChange={(e) => setLastName(e.target.value)}
         placeholder="Enter your last name"
         className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
         />

       <label htmlFor="birthday" className="block mb-2 font-semibold text-gray-700">
         Birthday
       </label>
       <input
         type="date"
         id="birthday"
         name="birthday"
         value={birthday}
         onChange={(e) => setBirthday(e.target.value)}
         placeholder="Enter your birthday"
         className="w-full mb-6 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
         />

       <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">
         Email
       </label>
       <input
         type="email"
         id="email"
         name="email"
          value={email}
        onChange={(e) => setEmail(e.target.value)}
         placeholder="Enter your email"
         className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
       />

       <label htmlFor="username" className="block mb-2 font-semibold text-gray-700">
         Username
       </label>
       <input
         type="text"
         id="username"
         name="username"
          value={username}
        onChange={(e) => setUsername(e.target.value)}
         placeholder="Choose a username"
         className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
       />

        <label htmlFor="password" className="block mb-2 font-semibold text-gray-700 flex items-center">
          Password
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
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-6 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onFocus={() => setShowPasswordReqs(true)}
          onBlur={() => setShowPasswordReqs(false)}
        />
        <label htmlFor="confirmPassword" className="block mb-2 font-semibold text-gray-700">
          Confirm Password
        </label>
        {error && <p className="text-red-500 mb-4">{error}</p>}
       <button
         type="submit"
         className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
       >
         Register
       </button>

       <div className="mt-4 text-center">
         <Link
           to="/"
           className="text-blue-600 hover:text-blue-800 font-semibold"
         >
           Already have an account? Log in
         </Link>
       </div>
     </form>
   </div>
 );
};
