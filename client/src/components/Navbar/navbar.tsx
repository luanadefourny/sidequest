import { useEffect, useRef, useState } from 'react';
import { IoIosLogOut } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/userService';
import { useUser } from '../Context/userContext';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const handleLogout = async () => {
    setMenuOpen(false);
    if (!user) return;
    try {
      await logoutUser(user._id);
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setUser(null);
      localStorage.removeItem('auth-token');
      navigate('/');
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
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const initials = user?.username
    ? user.username
        .split(' ')
        .map((s: string) => s[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <nav className="sticky top-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo / Home */}
          <div className="flex items-center space-x-3">
            <Link to="/homepage" className="flex items-center gap-3 group">
              <img
                src="/home.png"
                alt="Home"
                className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <span className="hidden sm:inline-block text-xl font-extrabold text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                Home
              </span>
            </Link>
          </div>

          {/* Right: Avatar / menu */}
          <div className="flex items-center gap-4">
            {/* show username on md+ */}
            {user?.username && (
              <div className="hidden md:block text-sm text-gray-800 font-medium">
                {user.username}
              </div>
            )}

            {/* Avatar button */}
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={() => setMenuOpen((s) => !s)}
                aria-expanded={menuOpen}
                aria-controls="nav-menu"
                className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-white/60 hover:bg-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
                title={user?.username ? `Account (${user.username})` : 'Account'}
              >
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-green-500 via-green-500 to-green-500 flex items-center justify-center text-white font-bold shadow-md">
                  {initials}
                </div>

                <svg
                  className={`w-4 h-4 text-gray-600 hidden sm:inline transition-transform duration-200 ${
                    menuOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {menuOpen && (
                <div
                  ref={menuRef}
                  id="nav-menu"
                  role="menu"
                  aria-orientation="vertical"
                  className="absolute right-0 mt-3 w-52 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-md shadow-xl overflow-hidden animate-fade-in"
                >
                  <Link
                    to="/profile"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="block px-5 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors font-extrabold"
                  >
                    Profile
                  </Link>

                  <Link
                    to="/myquests"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="block px-5 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors font-extrabold"
                  >
                    My Quests
                  </Link>
                  <Link
                    to="/find-users"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="block px-5 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors font-extrabold"
                  >
                    Find Users
                  </Link>

                  <Link
                    to="/favquestlist"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="block px-5 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors font-extrabold"
                  >
                    Favourite Quests
                  </Link>

                  <div
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors"
                  >
                    <IoIosLogOut className="text-lg" />
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
