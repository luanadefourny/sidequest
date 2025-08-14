import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import FavQuestList from './components/FavQuestList/FavQuestList';
import './App.css';
import MapComponent from './components/MapComponent/MapComponent';
import QuestsPage from './components/QuestsPage/QuestsPage';
import MyQuests from './components/MyQuests/MyQuests'
import { UserProvider } from './components/Context/userContext';


export default function App() {

  return (
  <UserProvider>
   <BrowserRouter>
     <Routes>
       <Route path="/" element={<LoginPage />} />
       <Route path="/homepage" element={<HomePage />} />
       <Route path="/register" element={<RegisterPage />} />
       <Route path="/profile" element={<ProfilePage />} />
       <Route path="/myquests" element={<MyQuests />} />
       <Route path="/favquestlist" element={<FavQuestList/>} />
       <Route path="/quests" element={<QuestsPage />} />
       <Route path="/map" element={<MapComponent />} />
     </Routes>
   </BrowserRouter>
   </UserProvider>
 );
}
