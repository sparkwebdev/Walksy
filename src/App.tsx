import React, { useContext, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonSpinner,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import HomePage from "./pages/HomePage";
import WalkPage from "./pages/WalkPage";
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import DiscoverPage from "./pages/DiscoverPage";
import SettingsPage from "./pages/SettingsPage";
import IntroPage from "./pages/subpages/IntroPage";
import LoginPage from "./pages/subpages/LoginPage";
import RegisterPage from "./pages/subpages/RegisterPage";
import GoodMemories from "./pages/GoodMemories";
import BadMemories from "./pages/BadMemories";

import MemoriesContext from "./data/memories-context";

import {
  home as homeIcon,
  walk as walkIcon,
  person as personIcon,
  images as imagesIcon,
  information as informationIcon,
  settings as settingsIcon,
} from "ionicons/icons";

const NewMemory = React.lazy(() => import("./pages/NewMemory"));

const App: React.FC = () => {
  const memoriesCtx = useContext(MemoriesContext);

  const { initContext } = memoriesCtx;

  useEffect(() => {
    initContext();
  }, [initContext]);

  return (
    <IonApp>
      <IonReactRouter>
        <React.Suspense fallback={<IonSpinner />}>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/home">
                <HomePage />
              </Route>
              <Route exact path="/walk">
                <WalkPage />
              </Route>
              <Route exact path="/dashboard">
                <DashboardPage />
              </Route>
              <Route exact path="/discover">
                <DiscoverPage />
              </Route>
              <Route exact path="/about">
                <AboutPage />
              </Route>
              <Route exact path="/settings">
                <SettingsPage />
              </Route>
              <Route exact path="/intro">
                <IntroPage />
              </Route>
              <Route exact path="/login">
                <LoginPage />
              </Route>
              <Route exact path="/register">
                <RegisterPage />
              </Route>

              <Route path="/good-memories">
                <GoodMemories />
              </Route>
              <Route path="/bad-memories">
                <BadMemories />
              </Route>
              <Route path="/new-memory">
                <NewMemory />
              </Route>

              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="home" href="/home">
                <IonIcon icon={homeIcon} />
                <IonLabel>Home</IonLabel>
              </IonTabButton>
              <IonTabButton tab="walk" href="/walk">
                <IonIcon icon={walkIcon} />
                <IonLabel>Walk</IonLabel>
              </IonTabButton>
              <IonTabButton tab="dashboard" href="/dashboard">
                <IonIcon icon={personIcon} />
                <IonLabel>Dashboard</IonLabel>
              </IonTabButton>
              <IonTabButton tab="discover" href="/discover">
                <IonIcon icon={imagesIcon} />
                <IonLabel>Discover</IonLabel>
              </IonTabButton>
              <IonTabButton tab="about" href="/about">
                <IonIcon icon={informationIcon} />
                <IonLabel>About</IonLabel>
              </IonTabButton>
              <IonTabButton tab="settings" href="/settings">
                <IonIcon icon={settingsIcon} />
                <IonLabel>Settings</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </React.Suspense>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
