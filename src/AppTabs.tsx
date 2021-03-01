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

import WalksContext from "./data/walks-context";
import AddData from "./pages/AddData";

const AppTabs: React.FC = () => {
  const { loggedIn } = useAuth();
  const walksCtx = useContext(WalksContext);

  const { initContext } = walksCtx;
  useEffect(() => {
    initContext();
  }, [initContext]);

  if (!loggedIn) {
    return <Redirect to="/intro" />;
  }

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/app/add-data">
          <AddData />
        </Route>
        <Route exact path="/app/home">
          <HomePage />
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
  );
};

export default AppTabs;
