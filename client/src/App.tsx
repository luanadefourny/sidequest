import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import FavouritesPage from './components/FavouritesPage/FavouritesPage';
import './App.css';
import MapComponent from './components/MapComponent/MapComponent';
import QuestsPage from './components/QuestsPage/Quests';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/favourites" element={<FavouritesPage />} />
        <Route path="/quests" element={<QuestsPage />} />
        <Route path="/map" element={<MapComponent />} />
      </Routes>
    </BrowserRouter>
  );
}