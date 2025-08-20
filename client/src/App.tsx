import './App.css';

import { useEffect, useLayoutEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { useUser } from './components/Context/userContext';
import FavQuestList from './components/FavQuestList/FavQuestList';
import HomePage from './components/HomePage/HomePage';
import Layout from './components/Layout/Layout';
import LoginPage from './components/LoginPage/LoginPage';
import MapComponent from './components/MapComponent/MapComponent';
import MyQuestsPage from './components/MyQuests/MyQuests';
import ProfilePage from './components/ProfilePage/ProfilePage';
import QuestsPage from './components/QuestsPage/QuestsPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import { getQuests } from './services/questService';
import { getMyQuests } from './services/userService';
import type { Location, MyQuest, Quest, QuestFilters } from './types';

export default function App() {
  const { user, loggedIn } = useUser();
  const { pathname } = useLocation();
  const needsMyQuests = pathname === '/myquests' || pathname === '/favquestlist';
  const [radius, setRadius] = useState<number>(1000);

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
    let cancelled = false;
    async function fetchQuests() {
      try {
        if (!location) return;

        const filters: QuestFilters = { near: `${location.longitude},${location.latitude}`, radius };

        const data = await getQuests(filters);
        if (!cancelled && data) setQuests(data);
      } catch (error) {
        if (!cancelled) console.log('Failed to fetch quests: ', error);
      }
    }
    fetchQuests();
    return () => { cancelled = true; };
  }, [location?.longitude, location?.latitude, radius]);

  useEffect(() => {
    if (!loggedIn) {
      setMyQuests([]);
      setMyQuestsLoading(false);
      return;
    }

    // const needsMyQuests = pathname === '/myquests' || pathname === '/favquestlist';
    if (!needsMyQuests) {
      setMyQuestsLoading(false);
      return;
    }

    let cancelled = false;
    async function fetchMyQuests() {
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
    return () => {
      cancelled = true;
    };
  }, [loggedIn, user?._id, pathname]);

  return (
    // <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/homepage"
        element={
          <Layout>
            <HomePage
              location={location}
              setLocation={setLocation}
              radius={radius}
              setRadius={setRadius}
            />
          </Layout>
        }
      />
      <Route
        path="/profile"
        element={
          <Layout>
            <ProfilePage />
          </Layout>
        }
      />
      <Route
        path="/myquests"
        element={
          <Layout>
            <MyQuestsPage
              myQuests={myQuests}
              setMyQuests={setMyQuests}
              myQuestsLoading={myQuestsLoading}
            />
          </Layout>
        }
      />
      <Route
        path="/favquestlist"
        element={
          <Layout>
            <FavQuestList
              myQuests={myQuests}
              setMyQuests={setMyQuests}
              myQuestsLoading={myQuestsLoading}
            />
          </Layout>
        }
      />
      <Route
        path="/quests"
        element={
          <Layout>
            <QuestsPage quests={quests} myQuests={myQuests} setMyQuests={setMyQuests} />
          </Layout>
        }
      />
      <Route
        path="/map"
        element={
          <Layout>
            <MapComponent setLocation={setLocation} radius={radius}/>
          </Layout>
        }
      />
    </Routes>
    //  </BrowserRouter>
  );
}
