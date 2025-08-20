import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiUserPlus, FiUserCheck, FiSearch } from "react-icons/fi";
import type { User } from "../../types";

import { getUsers, getUserByUsername, followUser, unfollowUser } from "../../services/userService";
import { useUser } from "../Context/userContext";
import type { PublicUserData } from "../../types";

type LocalUser = PublicUserData & { isFollowing?: boolean };

export default function FindUsers() {
  const { user, setUser } = useUser();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<LocalUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [btnLoadingId, setBtnLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) setResults((r) => r.map((u) => ({ ...u, isFollowing: false })));
  }, [user]);

  const deriveIsFollowing = (candidateId: string) => {
    if (!user?.following) return false;
    return user.following.some((f: any) => (typeof f === "string" ? f === candidateId : f._id === candidateId));
  };

  async function handleSearch() {
    setError(null);
    setLoading(true);
    try {
      if (!search.trim()) {
        const all = await getUsers();
        const list = (all ?? []).map((u) => ({ ...u, isFollowing: deriveIsFollowing(u._id) }));
        setResults(list);
      } else {
        const single = await getUserByUsername(search.trim());
        if (!single) {
          setResults([]);
        } else {
          setResults([{ ...single, isFollowing: deriveIsFollowing(single._id) }]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Search failed — try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleFollowToggle(targetId: string, currentlyFollowing: boolean) {
  if (!user) {
    alert('Please log in to follow users.');
    return;
  }

  setBtnLoadingId(targetId);
  try {
    if (currentlyFollowing) {
      await unfollowUser(targetId);
    } else {
      await followUser(targetId);
    }

    setResults((prev) => prev.map((u) => (u._id === targetId ? { ...u, isFollowing: !currentlyFollowing } : u)));

    const currentFollowing = Array.isArray(user.following) ? user.following : [];

    const filteredFollowing = currentlyFollowing
      ? currentFollowing.filter((f: any) => (typeof f === 'string' ? f !== targetId : f._id !== targetId))
      : [...currentFollowing, targetId]; 

    const updatedUser = { ...(user as User), following: filteredFollowing } as User;
    setUser(updatedUser);
  } catch (err) {
    console.error('Follow/unfollow failed:', err);
    setError('Action failed — try again.');
  } finally {
    setBtnLoadingId(null);
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-gray-100 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Find Travelers</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Search for other users by username or browse all travelers. Follow people you want to keep track of.
          </p>
        </header>

        {/* Search */}
        <div className="flex items-center gap-3 mb-6 max-w-md mx-auto">
          <label htmlFor="find-user" className="sr-only">Search users</label>
          <div className="flex items-center flex-1 bg-white rounded-lg shadow px-3 py-2">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              id="find-user"
              type="text"
              placeholder="Search by username (leave empty to list all)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full outline-none text-sm text-gray-700"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            aria-label="Search users"
            disabled={loading}
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </div>

        {error && <p className="text-center text-red-600 mb-4">{error}</p>}

        {/* Results */}
        <div className="grid gap-4 sm:grid-cols-2">
          {results.length === 0 && !loading ? (
            <div className="col-span-full text-center text-gray-600 py-8">
              No users found. Try searching a different username or click <button onClick={handleSearch} className="text-green-600 font-semibold underline">list all</button>.
            </div>
          ) : (
            results.map((u) => {
              const isFollowing = !!u.isFollowing;
              const isSelf = user?._id === u._id;
              return (
                <div key={u._id} className="flex items-center justify-between gap-4 bg-white rounded-2xl p-4 shadow">
                  <div className="flex items-center gap-4">
                    <img
                      src={u.profilePicture || "/default-avatar.png"}
                      alt={u.username}
                      className="w-14 h-14 rounded-full object-cover border"
                    />
                    <div>
                      <Link to={`/users/${u._id}`} className="text-gray-900 font-semibold hover:underline">
                        {u.username}
                      </Link>
                      <div className="text-sm text-gray-500">
                        {u.firstName || u.lastName ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() : "Traveler"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isSelf ? (
                      <span className="text-sm text-gray-500">It's you</span>
                    ) : (
                      <button
                        onClick={() => handleFollowToggle(u._id, isFollowing)}
                        disabled={!!btnLoadingId}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
                          isFollowing
                            ? "bg-white border border-green-500 text-green-700 hover:bg-green-50"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                        aria-pressed={isFollowing}
                        aria-label={isFollowing ? `Unfollow ${u.username}` : `Follow ${u.username}`}
                      >
                        {btnLoadingId === u._id ? (
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                          </svg>
                        ) : isFollowing ? (
                          <FiUserCheck className="w-4 h-4" />
                        ) : (
                          <FiUserPlus className="w-4 h-4" />
                        )}
                        <span className="text-sm">
                          {isFollowing ? "Following" : "Follow"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
