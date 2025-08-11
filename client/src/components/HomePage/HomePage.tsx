import { Link } from 'react-router-dom';

export default function HomePage() {

  return (
    <div className="home-page">
      <nav className="navbar">
      <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/favourites">Favourites</Link></li>
        </ul>
      </nav>
    <h1>Home Page</h1>
    <p>Welcome to the home page!</p>
  </div>
  );
}