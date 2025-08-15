import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import FavQuestList from './components/FavQuestList/FavQuestList';
import MapComponent from './components/MapComponent/MapComponent';
import QuestsPage from './components/QuestsPage/QuestsPage';
import MyQuestsPage from './components/MyQuests/MyQuests'
import Layout from './components/Layout/Layout';
import { useUser } from './components/Context/userContext';
import type { Quest, MyQuest, Location, QuestFilters } from './types';
import { useEffect, useState, useLayoutEffect } from 'react';
import { getQuests } from './services/questService';
import { getMyQuests } from './services/userService';


export default function App() {
  const { user, loggedIn } = useUser();
  const { pathname } = useLocation();
  const needsMyQuests = pathname === '/myquests' || pathname === '/favquestlist';

  useLayoutEffect(() => {
    if (!loggedIn) {
      setMyQuestsLoading(false);
      return;
    }
    setMyQuestsLoading(needsMyQuests);
  }, [loggedIn, needsMyQuests]);

  //TODO prop drill these
  const [quests, setQuests] = useState<Quest[]>([]);
  const [myQuests, setMyQuests] = useState<MyQuest[]>([]);
  const [myQuestsLoading, setMyQuestsLoading] = useState<boolean>(false);
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    async function fetchQuests () {
      try {
        const filters: QuestFilters | undefined = location
          ? { near: `${location.longitude},${location.latitude}`, radius: 2500 }
          : undefined;
        const data = await getQuests(filters);
        if (data) setQuests(data);
      } catch (error) {
        console.log('Failed to fetch quests: ', error);
      }
    }
    fetchQuests();
  }, [location]);

  useEffect(() => {
    if (!loggedIn) {
      setMyQuests([]);
      setMyQuestsLoading(false);
      return;
    }

    // const needsMyQuests = pathname === '/myquests' || pathname === '/favquestlist';
    if (!needsMyQuests) {
      setMyQuestsLoading(false)
      return;
    }

    let cancelled = false;
    async function fetchMyQuests () {
      try {
        const data = await getMyQuests(user!._id, 1);
        if (!cancelled) setMyQuests(data ?? []);
      } catch (error) {
       if (!cancelled) setMyQuests([]);
        console.log("Failed to fetch user's quests: ", error);
      } finally {
        if (!cancelled) setMyQuestsLoading(false);
      }
    }
    fetchMyQuests();
    return () => { cancelled = true; };
  }, [loggedIn, user?._id, pathname]);

  return (
    // <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/homepage" element={
          <Layout>
            <HomePage location={location} setLocation={setLocation} />
          </Layout>
        } />
        <Route path="/profile" element={
          <Layout>
            <ProfilePage />
          </Layout>
        } />
        <Route path="/myquests" element={
          <Layout>
            <MyQuestsPage myQuests={myQuests} setMyQuests={setMyQuests} myQuestsLoading={myQuestsLoading} />
          </Layout>
        } />
        <Route path="/favquestlist" element={
          <Layout>
            <FavQuestList myQuests={myQuests} setMyQuests={setMyQuests } myQuestsLoading={myQuestsLoading}/>
          </Layout>
        } />
        <Route path="/quests" element={
          <Layout>
            <QuestsPage quests={quests} myQuests={myQuests} setMyQuests={setMyQuests} />
          </Layout>
        } />
        <Route path="/map" element={
          <Layout>
            <MapComponent setLocation={setLocation} />
          </Layout>
        } />
      </Routes>
  //  </BrowserRouter>
 );
}
