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
import Layout from './components/Layout/Layout';


export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/homepage" element={
          <Layout>
            <HomePage />
          </Layout>
        } />
        <Route path="/profile" element={
          <Layout>
            <ProfilePage />
          </Layout>
        } />
        <Route path="/myquests" element={
          <Layout>
            <MyQuests />
          </Layout>
        } />
        <Route path="/favquestlist" element={
          <Layout>
            <FavQuestList/>
          </Layout>
        } />
        <Route path="/quests" element={
          <Layout>
            <QuestsPage />
          </Layout>
        } />
        <Route path="/map" element={
          <Layout>
            <MapComponent />
          </Layout>
        } />
      </Routes>
   </BrowserRouter>
 );
}
