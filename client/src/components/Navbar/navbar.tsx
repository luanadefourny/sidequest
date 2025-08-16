import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { useUser } from "../Context/userContext";
import { logoutUser } from "../../services/userService";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const userId = (user as any)?._id ?? (user as any)?.id ?? null;

  const handleLogout = async () => {
    setMenuOpen(false);
    if (!userId) return;
    try {
      await logoutUser(userId);
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
      navigate("/");
    }
  };

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const initials = user?.username
    ? user.username
        .split(" ")
        .map((s: string) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo / Home */}
          <div className="flex items-center space-x-3">
            <Link to="/homepage" className="flex items-center gap-3">
              <img src="/home.png" alt="Home" className="h-9 w-9 object-contain" />
              <span className="hidden sm:inline-block text-xl font-extrabold text-gray-900 tracking-tight">
                Home
              </span>
            </Link>
          </div>

        

          {/* Right: Avatar / menu */}
          <div className="flex items-center gap-3">
            {/* show username on md+ (optional) */}
            {user?.username && (
              <div className="hidden md:block text-sm text-gray-700 font-medium">{user.username}</div>
            )}

            {/* Avatar button */}
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={() => setMenuOpen((s) => !s)}
                aria-expanded={menuOpen}
                aria-controls="nav-menu"
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
                title={user?.username ? `Account (${user.username})` : "Account"}
              >
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
                  {initials}
                </div>

                <svg className="w-4 h-4 text-gray-600 hidden sm:inline" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                </svg>
              </button>

              {menuOpen && (
                <div
                  ref={menuRef}
                  id="nav-menu"
                  role="menu"
                  aria-orientation="vertical"
                  className="absolute right-0 mt-3 w-48 md:w-56 rounded-lg bg-white border border-gray-100 shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
                >
                  <Link
                    to="/profile"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Profile
                  </Link>

                  <Link
                    to="/myquests"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    My Quests
                  </Link>

                  <Link
                    to="/favquestlist"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Favourite Quests
                  </Link>
                  <Link
                    to="/editprofile"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Edit Profile
                  </Link>

                  <div
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    <IoIosLogOut className="text-xl text-gray-600" />
                    <span className="font-medium">Logout</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
