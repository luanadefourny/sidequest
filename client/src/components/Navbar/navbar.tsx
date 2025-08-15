import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { useUser } from "../Context/userContext";
import { logoutUser } from "../../services/userService";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  
  const handleLogout = async () => {
    setMenuOpen(false);
    if (user?._id) {
      await logoutUser(user._id);
      setUser(null);
      navigate('/');
    }
  };

 return (
   <nav className="navbar">
     <ul className="flex items-center space-x-6 bg-white p-4 rounded-lg shadow-md justify-between w-full">
       <li>
        <Link to="/homepage" className="text-blue-600 hover:text-blue-800 font-semibold">
          <img src="/home.png" alt="Home" className="inline-block mr-2 h-7" />
        </Link>
       </li>
       <li className="relative ml-auto">
         <button
           className="p-2 rounded focus:outline-none"
           onClick={() => setMenuOpen(!menuOpen)}
           aria-label="Open menu"
         >
           <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1">
             <line x1="3" y1="5" x2="20" y2="5" />
             <line x1="3" y1="12" x2="20" y2="12" />
             <line x1="3" y1="19" x2="20" y2="19" />
           </svg>
         </button>
         {menuOpen && (
           <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg z-10">
              <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setMenuOpen(false)} >Profile</Link>
              {/* <Link to="/quests" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Available Quests</Link> */}
              <Link to="/myquests" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setMenuOpen(false)} >My Quests</Link>
              <Link to="/favquestlist" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setMenuOpen(false)} >Favourite Quests</Link>
              <div
                className="content-center flex justify-center px-2 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                <IoIosLogOut className="inline-block mr-2 text-2xl" />
                <span className="font-semibold">Logout</span>
              </div>
           </div>
           
         )}
       </li>
     </ul>
   </nav>
 );
}
