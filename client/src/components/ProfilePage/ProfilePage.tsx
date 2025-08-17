/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo, useState } from 'react';
import { FiCamera, FiSettings } from 'react-icons/fi';
import { Navigate } from 'react-router-dom';

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

  // profile fields
  const [firstName, setFirstName] = useState(user.firstName ?? '');
  const [lastName, setLastName] = useState(user.lastName ?? '');
  const [birthday, setBirthday] = useState(toDateInputValue(user.birthday ?? null));

  // creds fields
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  // password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordReqs, setShowPasswordReqs] = useState(false);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;


  // profilePicture
  const [profilePicture, setProfilePicture] = useState(user.profilePicture ?? '');
  const [uploading, setUploading] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);

  const birthDate = useMemo(() => {
    if (!user?.birthday) return undefined;
    return typeof user.birthday === 'string' ? new Date(user.birthday) : user.birthday;
  }, [user]);

  const credsValid = username.trim().length >= 3 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const passwordValid = newPassword.trim().length >= 8 && newPassword === confirmPassword;

  function resetMessages() {
    setMsg(null);
  }

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
      const updated = (await editUserData(user!._id, payload)) as unknown as User;
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
      setUser(updated as unknown as User);
      setMode('view');
      setMsg('Credentials updated');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Credentials update failed';
      setMsg(message);
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
      })) as unknown as User;
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
      const message = err instanceof Error ? err.message : 'Profile picture upload failed';
      setMsg(message);
      console.error(err);
    } finally {
      URL.revokeObjectURL(preview);
      setProfilePicturePreview(null);
      setUploading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      {msg && (
        <div role="status" className="mb-4 rounded-md bg-green-50 text-green-800 px-4 py-2">
          {msg}
        </div>
      )}

      {mode === 'view' && (
        <div className="flex flex-col sm:flex-row items-center gap-6">
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

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-semibold text-gray-800">{user.username}</h2>
            <p className="text-gray-600">{user.email}</p>
            <div className="mt-2">
              <p className="text-sm text-gray-700">
                <strong>Name:</strong> {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Birthday:</strong> {birthDate ? birthDate.toLocaleDateString('en-GB') : ''}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Followers:</strong> {user.followers.length} | <strong>Following:</strong>{' '}
                {user.following.length}
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
        </div>
      )}

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
  );
}
