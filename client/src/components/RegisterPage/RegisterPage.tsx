import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export default function RegisterPage() {
 const navigate = useNavigate();

 const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');


 const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
   e.preventDefault();
   if (password !== confirmPassword) {
    setError('Passwords do not match');
    return;
  }
  setError('');

   navigate("/homepage");
 };


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
         placeholder="Choose a username"
         className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
       />

       <label htmlFor="password" className="block mb-2 font-semibold text-gray-700">
         Password
       </label>
       <input
         type="password"
         id="password"
         name="password"
         placeholder="Create a password"
         value={password}
        onChange={(e) => setPassword(e.target.value)}
         className="w-full mb-6 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
       />
        <label htmlFor="confirmPassword" className="block mb-2 font-semibold text-gray-700">
          Confirm Password
        </label>
       <input
         type="password"
         id="confirmPassword"
         name="confirmPassword"
         placeholder="Confirm your password"
         value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
         className="w-full mb-6 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
       />
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
}
