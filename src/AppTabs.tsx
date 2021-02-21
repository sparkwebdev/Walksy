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
import WalkPage from "./pages/WalkPage";
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import DiscoverPage from "./pages/DiscoverPage";
import SettingsPage from "./pages/SettingsPage";

import {
  eye as browseIcon,
  analytics as discoverIcon,
  footsteps as walkIcon,
  time as dashboardIcon,
  person as profileIcon,
} from "ionicons/icons";

import WalksContext from "./data/walks-context";

const NewWalk = React.lazy(() => import("./pages/NewWalk"));

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
        <Route exact path="/app/home">
          <HomePage />
        </Route>
        <React.Suspense fallback={<IonSpinner />}>
          <Route exact path="/app/walk/:id">
            <WalkPage />
          </Route>
        </React.Suspense>
        <Route exact path="/app/dashboard">
          <DashboardPage />
        </Route>
        <Route exact path="/app/discover">
          <DiscoverPage />
        </Route>
        <Route exact path="/app/about">
          <AboutPage />
        </Route>
        <Route exact path="/app/settings">
          <SettingsPage />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/app/home">
          <IonIcon icon={browseIcon} />
          <IonLabel>Browse</IonLabel>
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
