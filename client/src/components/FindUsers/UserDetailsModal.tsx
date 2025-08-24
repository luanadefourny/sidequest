import React, { useEffect, useState } from "react";
import type { PublicUserData } from "../../types";
import { useUser } from "../Context/userContext";
import { followUser, unfollowUser } from "../../services/userService";

interface UserDetailsModalProps {
  isVisible: boolean;
  onClose: () => void;
  userData: PublicUserData | null;
  onFollowChange?: (targetId: string, isFollowing: boolean) => void;
}

export default function UserDetailsModal({
  isVisible,
  onClose,
  userData,
  onFollowChange,
}: UserDetailsModalProps) {
  const { user: currentUser, setUser } = useUser();
  const [processing, setProcessing] = useState(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const [followerCount, setFollowerCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);

  useEffect(() => {
    if (!userData) {
      setIsFollowing(false);
      setFollowerCount(0);
      setFollowingCount(0);
      return;
    }

    const followersArr = Array.isArray((userData as any).followers) ? (userData as any).followers : [];
    const followingArr = Array.isArray((userData as any).following) ? (userData as any).following : [];

    setFollowerCount(followersArr.length);
    setFollowingCount(followingArr.length);

    if (!currentUser || !Array.isArray(currentUser.following)) {
      setIsFollowing(false);
      return;
    }
    const isFollowingNow = currentUser.following.some((f: any) =>
      typeof f === "string" ? f === userData._id : f._id === userData._id,
    );
    setIsFollowing(isFollowingNow);
  }, [userData, currentUser]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isVisible) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isVisible, onClose]);

  if (!isVisible || !userData) return null;

  const handleFollowToggle = async () => {
    if (!currentUser) {
      alert("Please log in to follow users.");
      return;
    }

    setProcessing(true);
    try {
      if (isFollowing) {
        await unfollowUser(userData._id);
      } else {
        await followUser(userData._id);
      }

      const nextFollowing = !isFollowing;
      setIsFollowing(nextFollowing);

      setFollowerCount((c) => (nextFollowing ? c + 1 : Math.max(0, c - 1)));

      const prevFollowing = Array.isArray(currentUser.following) ? currentUser.following : [];
      let updatedFollowing: (string | PublicUserData)[];

      if (nextFollowing) {
        const already = prevFollowing.some((f: any) =>
          typeof f === "string" ? f === userData._id : f._id === userData._id,
        );
        updatedFollowing = already ? prevFollowing : [...prevFollowing, userData._id];
      } else {
        updatedFollowing = prevFollowing.filter((f: any) =>
          typeof f === "string" ? f !== userData._id : f._id !== userData._id,
        );
      }

      const updatedUser = { ...(currentUser as any), following: updatedFollowing };
      setUser(updatedUser);

      if (onFollowChange) onFollowChange(userData._id, nextFollowing);
    } catch (err) {
      console.error("Follow/unfollow failed:", err);
      alert("Action failed — try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "user-details-backdrop") onClose();
  };

  const formatCount = (n: number) => n.toLocaleString();

  return (
    <div
      id="user-details-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={userData.profilePicture || "/default-avatar.png"}
              alt={userData.username}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border"
            />

            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{userData.username}</h3>
                  <p className="text-sm text-gray-500">
                    {userData.firstName} {userData.lastName}
                  </p>
                     <div className="mt-4 text-sm text-gray-700">
                <p>
                  <strong>Birthday:</strong>{" "}
                  {userData.birthday ? new Date(userData.birthday).toLocaleDateString() : "—"}
                </p>
              </div>

                  <div className="mt-2 flex flex-wrap gap-3">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-gray-800">{formatCount(followerCount)}</span>{" "}
                      followers
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-gray-800">{formatCount(followingCount)}</span>{" "}
                      following
                    </div>
                  </div>
                </div>

                <div className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2 sm:mt-0">
                  <button
                    onClick={handleFollowToggle}
                    disabled={processing}
                    className={`w-full sm:w-auto px-4 py-2 rounded-full text-sm font-medium transition flex items-center justify-center ${
                      isFollowing
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                    aria-pressed={isFollowing}
                    aria-label={isFollowing ? `Unfollow ${userData.username}` : `Follow ${userData.username}`}
                  >
                    {processing ? "Saving..." : isFollowing ? "Following" : "Follow"}
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-4 py-2 rounded-full border text-sm text-gray-700 hover:bg-gray-50"
                    aria-label="Close"
                  >
                    Close
                  </button>
                </div>
              </div>

            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
