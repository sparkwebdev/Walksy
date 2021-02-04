import React, { useContext, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
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
import UserWalks from "./pages/UserWalks";
import GuidedWalks from "./pages/GuidedWalks";
import NotFoundPage from "./pages/NotFoundPage";

import WalksContext from "./data/walks-context";

import {
  home as homeIcon,
  walk as walkIcon,
  person as personIcon,
  images as imagesIcon,
  information as informationIcon,
  settings as settingsIcon,
} from "ionicons/icons";

const NewWalk = React.lazy(() => import("./pages/NewWalk"));

const App: React.FC = () => {
  const walksCtx = useContext(WalksContext);

  const { initContext } = walksCtx;

  useEffect(() => {
    initContext();
  }, [initContext]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Switch>
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

              <React.Suspense fallback={<IonSpinner />}>
                <Route path="/user-walks">
                  <UserWalks />
                </Route>
                <Route path="/guided-walks">
                  <GuidedWalks />
                </Route>
                <Route path="/new-walk">
                  <NewWalk />
                </Route>
              </React.Suspense>

              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
              <Route>
                <NotFoundPage />
              </Route>
            </Switch>
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
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
