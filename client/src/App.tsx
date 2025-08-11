import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import FavouritesPage from './components/FavouritesPage/FavouritesPage';
import type { User } from './types';
import './App.css';
import MapComponent from './components/MapComponent/MapComponent';

export default function App() {
  const user: User | null = null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage user={user} />} />
        <Route path="/favourites" element={<FavouritesPage />} />
        <Route path="/map" element={<MapComponent />} />
      </Routes>
    </BrowserRouter>
  );
}