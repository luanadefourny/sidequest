import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState()
  const navigate = useNavigate()

 const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  // axios.post('http://localhost:3000/login', {email, password})
  // .then(result =>{console.log(result)
   navigate("/homepage")
//  }).catch(err=> console.log(err))
 }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form 
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">
          Email
        </label>
        <input
          type="text"
          id="email"
          name="email"
          placeholder="Enter your email"
          className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="password" className="block mb-2 font-semibold text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
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
