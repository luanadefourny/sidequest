/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo, useState } from 'react';
import { FiCamera, FiSettings } from 'react-icons/fi';
import { Link, Navigate } from 'react-router-dom';

import { PROFILE_PICS } from '../../constants';
import {
  editUserCredentials,
  editUserData,
  editUserPassword,
  uploadProfilePicture,
} from '../../services/userService';
import type { EditUserData, User } from '../../types';
import { useUser } from '../Context/userContext';
import PasswordRequirements from '../PasswordPopup/passwordPopup';

function toDateInputValue(d?: Date | string | null): string {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

type Mode = 'view' | 'editProfile' | 'editCreds' | 'editPassword' | 'editProfilePicture';

export default function ProfilePage() {
  const { user, setUser } = useUser();
  if (!user) return <Navigate to="/" replace />;

  const [mode, setMode] = useState<Mode>('view');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Profile fields
  const [firstName, setFirstName] = useState(user.firstName ?? '');
  const [lastName, setLastName] = useState(user.lastName ?? '');
  const [birthday, setBirthday] = useState(toDateInputValue(user.birthday ?? null));

  // Creds
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  // Password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordReqs, setShowPasswordReqs] = useState(false);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  // Profile picture
  const [profilePicture, setProfilePicture] = useState(user.profilePicture ?? '');
  const [uploading, setUploading] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);

  const birthDate = useMemo(() => {
    if (!user?.birthday) return undefined;
    return typeof user.birthday === 'string' ? new Date(user.birthday) : user.birthday;
  }, [user]);

  const credsValid = username.trim().length >= 3 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = newPassword.trim().length >= 8 && newPassword === confirmPassword;

  function resetMessages() {
    setMsg(null);
  }

  const getAge = (d?: Date | null) => {
    if (!d) return null;
    const diff = Date.now() - d.getTime();
    const ageDt = new Date(diff);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  const initials = (() => {
    const name = (user?.firstName ?? user?.username ?? 'U').toString().trim();
    if (!name) return 'U';
    return name
      .split(' ')
      .map((s) => s[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  })();

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    resetMessages();
    if (!user!._id) return;
    setSaving(true);
    try {
      const payload: EditUserData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        birthday: birthday ? new Date(birthday) : undefined,
      };
      const updated = (await editUserData(user!._id, payload)) as User;
      setUser(updated);
      setMode('view');
      setMsg('Profile updated');
    } catch (err) {
      setMsg('Update failed');
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveCreds(e: React.FormEvent) {
    e.preventDefault();
    resetMessages();
    if (!user!._id) return;
    setSaving(true);
    try {
      const updated = await editUserCredentials(user!._id, {
        username: username.trim(),
        email: email.trim(),
      });
      setUser(updated as User);
      setMode('view');
      setMsg('Credentials updated');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Credentials update failed');
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleSavePassword(e: React.FormEvent) {
    e.preventDefault();
    resetMessages();
    if (!user!._id) return;
    if (newPassword.trim().length < 8 || newPassword !== confirmPassword) {
      setMsg('Passwords must match and be at least 8 chars');
      return;
    }
    setSaving(true);
    try {
      await editUserPassword(user!._id, newPassword.trim());
      setNewPassword('');
      setConfirmPassword('');
      setMode('view');
      setMsg('Password updated');
    } catch (err) {
      setMsg('Password update failed');
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveProfilePicture(e: React.FormEvent) {
    e.preventDefault();
    resetMessages();
    if (!user!._id) return;
    if (!profilePicture || profilePicture.startsWith('blob:')) {
      setMsg('Please choose an image and wait for upload to finish.');
      return;
    }
    setSaving(true);
    try {
      const updated = (await editUserData(user!._id, {
        profilePicture: profilePicture || undefined,
      })) as User;
      setUser(updated);
      setMode('view');
      setMsg('Profile picture updated');
    } catch (err) {
      setMsg('Profile picture update failed');
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handlePickProfilePicture(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) {
      setMsg('Max 2MB');
      return;
    }
    setUploading(true);
    const preview = URL.createObjectURL(f);
    setProfilePicturePreview(preview);
    try {
      const { url } = await uploadProfilePicture(f);
      setProfilePicture(url);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Profile picture upload failed');
      console.error(err);
    } finally {
      URL.revokeObjectURL(preview);
      setProfilePicturePreview(null);
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-gray-100 p-6 sm:p-10">
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        {msg && (
          <div role="status" className="mb-4 rounded-md bg-green-50 text-green-800 px-4 py-2">
            {msg}
          </div>
        )}

        {/* VIEW MODE */}
        {mode === 'view' && (
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            {user.profilePicture ? (
              <div className="relative">
                <img
                  src={user.profilePicture || '/default-avatar.png'}
                  alt={`${user.firstName}'s profile`}
                  className="w-32 h-32 rounded-full object-cover border border-gray-300"
                />
                <button
                  aria-label="Edit profile picture"
                  onClick={() => {
                    setProfilePicture(user.profilePicture ?? '');
                    setMode('editProfilePicture');
                  }}
                  className="absolute bottom-1 right-1 p-2 rounded-full bg-white shadow border hover:bg-gray-50"
                >
                  <FiCamera />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-semibold border border-gray-200 shadow-sm">
                {initials}
              </div>
            )}

            {/* Basic info */}
            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-4">
                <h2 className="text-2xl font-semibold text-gray-800">{user.username}</h2>
                <button
                  type="button"
                  onClick={() => setMode('editProfile')}
                  className="px-3 py-1 text-sm bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition"
                  title="Edit profile"
                >
                  Edit
                </button>
              </div>

              <p className="text-gray-600">{user.email ?? 'No email provided'}</p>

              <div className="mt-3">
                <p className="text-sm text-gray-700">
                  <strong>Name:</strong> {user.firstName ?? '-'} {user.lastName ?? ''}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Birthdate:</strong>{' '}
                  {birthDate ? birthDate.toLocaleDateString() : 'Not provided'}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Age:</strong> {getAge(birthDate) ?? '—'}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Followers:</strong>{' '}
                  {Array.isArray(user.followers) ? user.followers.length : 0} |{' '}
                  <strong>Following:</strong>{' '}
                  {Array.isArray(user.following) ? user.following.length : 0}
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFirstName(user.firstName ?? '');
                    setLastName(user.lastName ?? '');
                    setBirthday(toDateInputValue(user.birthday ?? null));
                    setMode('editProfile');
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
                >
                  Edit user profile
                </button>
                <button
                  aria-label="Edit settings"
                  title="Edit settings"
                  type="button"
                  onClick={() => setMode('editCreds')}
                  className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  <FiSettings className="inline" />
                </button>
              </div>
            </div>
            {/* QUESTS & FAVORITES STATS */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                <p className="text-gray-500">Quests added</p>
                <p className="text-lg font-semibold text-gray-800">{user.myQuests?.length ?? 0}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                <p className="text-gray-500">Favorites</p>
                <p className="text-lg font-semibold text-gray-800">
                  {user.myQuests ? user.myQuests.filter((mq: any) => mq.isFavorite).length : 0}
                </p>
              </div>
            </div>

          </div>
        )}

        {/* EDIT PROFILE */}
        {mode === 'editProfile' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <img
                src={user.profilePicture || '/profile-pics/profile-pic-1.jpg'}
                alt="Profile picture"
                className="w-32 h-32 rounded-full object-cover border"
              />
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700">First name</label>
                <input
                  className="mt-1 w-full rounded-md border p-2"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <label className="block text-sm font-medium text-gray-700 mt-4">Last name</label>
                <input
                  className="mt-1 w-full rounded-md border p-2"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <label className="block text-sm font-medium text-gray-700 mt-4">Birthday</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-md border p-2"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setMode('view')}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* EDIT CREDENTIALS */}
        {mode === 'editCreds' && (
          <form onSubmit={handleSaveCreds} className="space-y-6">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                className="mt-1 w-full rounded-md border p-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
              <label className="block text-sm font-medium text-gray-700 mt-4">Email</label>
              <input
                className="mt-1 w-full rounded-md border p-2"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving || !credsValid}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setMode('editPassword')}
                className="px-4 py-2 rounded-lg border"
              >
                Change password
              </button>
              <button
                type="button"
                onClick={() => setMode('view')}
                className="px-4 py-2 rounded-lg border"
              >
                Back
              </button>
            </div>
          </form>
        )}

        {/* EDIT PASSWORD */}
        {mode === 'editPassword' && (
          <form onSubmit={handleSavePassword} className="space-y-6">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700">New password</label>
              <PasswordRequirements
                open={showPasswordReqs}
                onClose={() => setShowPasswordReqs(false)}
                password={newPassword}
              />
              <input
                className="mt-1 w-full rounded-md border p-2"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={() => setShowPasswordReqs(true)}
                onBlur={() => setShowPasswordReqs(false)}
                autoComplete="new-password"
              />
              <label className="block text-sm font-medium text-gray-700 mt-4">
                Confirm new password
              </label>
              <input
                className="mt-1 w-full rounded-md border p-2"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              {confirmPassword && !passwordsMatch && (
                <p className="text-red-500 text-sm mb-4" role="alert">
                  Passwords do not match.
                </p>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving || !passwordValid}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setMode('view')}
                className="px-4 py-2 rounded-lg border"
              >
                Back
              </button>
            </div>
          </form>
        )}

        {/* EDIT PROFILE PICTURE */}
        {mode === 'editProfilePicture' && (
          <form onSubmit={handleSaveProfilePicture} className="space-y-4">
            <fieldset className="pt-2">
              <legend className="text-sm font-medium text-gray-700 mb-2">Upload your own</legend>
              <div className="flex items-center gap-4">
                <img
                  src={
                    profilePicturePreview ||
                    profilePicture ||
                    user.profilePicture ||
                    '/profile-pics/profile-pic-1.jpg'
                  }
                  alt="Profile picture preview"
                  className="w-20 h-20 rounded-full border object-cover"
                />
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handlePickProfilePicture}
                  />
                  Choose image
                </label>
                {uploading && (
                  <span className="text-sm text-gray-600" role="status">
                    Uploading…
                  </span>
                )}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-medium text-gray-700 mb-2">
                Preset profile pictures
              </legend>
              <div className="grid grid-cols-5 gap-3">
                {PROFILE_PICS.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setProfilePicture(src)}
                    className={`rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      (profilePicture || user.profilePicture) === src ? 'ring-2 ring-blue-500' : ''
                    }`}
                    aria-pressed={(profilePicture || user.profilePicture) === src}
                  >
                    <img
                      src={src}
                      alt="Preset profile picture option"
                      className="w-14 h-14 rounded-full object-cover border"
                    />
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={
                  saving || uploading || !profilePicture || profilePicture.startsWith('blob:')
                }
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Save…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setMode('view')}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
