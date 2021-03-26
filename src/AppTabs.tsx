import {
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonIcon,
} from "@ionic/react";
import React, { useContext, useEffect } from "react";
import { Redirect, Route } from "react-router";
import { useAuth } from "./auth";
import HomePage from "./pages/HomePage";
import WalkEntryPage from "./pages/WalkEntryPage";
import DashboardPage from "./pages/DashboardPage";
import DiscoverEntryPage from "./pages/DiscoverEntryPage";
import AboutPage from "./pages/AboutPage";
import DiscoverPage from "./pages/DiscoverPage";
import SettingsPage from "./pages/SettingsPage";
import EntryPage from "./components/EntryPage";

import {
  eye as browseIcon,
  analytics as discoverIcon,
  footsteps as walkIcon,
  time as dashboardIcon,
  person as profileIcon,
} from "ionicons/icons";
import NewWalk from "./pages/NewWalk";
import NewsPage from "./pages/NewsPage";

import Memories from "./pages/Memories";
import NewMemory from "./pages/NewMemory";
import MemoriesContext from "./data/memories-context";

import SideMenu from "./components/SideMenu";
import AudioRecord from "./pages/AudioRecord";
import AudioRecord2 from "./pages/AudioRecord2";

const AppTabs: React.FC = () => {
  const memoriesCtx = useContext(MemoriesContext);

  const { initContext } = memoriesCtx;

  useEffect(() => {
    initContext();
  }, [initContext]);

  const { loggedIn } = useAuth();
  if (!loggedIn) {
    return <Redirect to="/intro" />;
  }

  return (
    <>
      <IonTabs>
        <IonRouterOutlet id="main">
          <Route path="/app/memories">
            <Memories />
          </Route>
          <Route path="/app/new-memory">
            <NewMemory />
          </Route>
          <Route path="/app/audio-record">
            <AudioRecord />
          </Route>
          <Route path="/app/audio-record2">
            <AudioRecord2 />
          </Route>
          <Route exact path="/app/home">
            <HomePage />
          </Route>
          <Route path="/app/new-walk">
            <NewWalk />
          </Route>
          <Route exact path="/app/walk/:id">
            <WalkEntryPage />
          </Route>
          <Route exact path="/app/dashboard">
            <DashboardPage />
          </Route>
          <Route exact path="/app/discover">
            <DiscoverPage />
          </Route>
          <Route exact path="/app/discover/:id">
            <DiscoverEntryPage />
          </Route>
          <Route exact path="/app/about">
            <AboutPage />
          </Route>
          <Route exact path="/app/latest-news">
            <NewsPage />
          </Route>
          <Route exact path="/app/settings">
            <SettingsPage />
          </Route>
          <Route exact path="/app/entries/:id">
            <EntryPage />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/app/home">
            <IonIcon icon={browseIcon} />
            <IonLabel>Gallery</IonLabel>
          </IonTabButton>
          <IonTabButton tab="discover" href="/app/discover">
            <IonIcon icon={discoverIcon} />
            <IonLabel>Discover</IonLabel>
          </IonTabButton>
          <IonTabButton tab="walk" href="/app/new-walk">
            <IonIcon icon={walkIcon} />
            <IonLabel>Walk</IonLabel>
          </IonTabButton>
          <IonTabButton tab="dashboard" href="/app/dashboard">
            <IonIcon icon={dashboardIcon} />
            <IonLabel>My Walks</IonLabel>
          </IonTabButton>
          <IonTabButton tab="about" href="/app/settings">
            <IonIcon icon={profileIcon} />
            <IonLabel>Profile</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
      <SideMenu />
    </>
  );
};

export default AppTabs;
