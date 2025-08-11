import React from 'react';
import './ProfilePage.css';

interface User {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
}

interface ProfileProps {
  user: User | null;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className="profile-container">
      <img
        src="/creep.jpg"
        alt={`${user.firstName}'s profile`}
        className="profile-pic"
      />
      <div className="profile-details">
        <h2>{user.username}</h2>
        <p><strong>First Name:</strong> {user.firstName}</p>
        <p><strong>Last Name:</strong> {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Age:</strong> {user.age}</p>
      </div>
    </div>
  );
};

export default Profile;