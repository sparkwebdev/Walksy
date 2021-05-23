import {
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonIcon,
} from "@ionic/react";
import React from "react";
import { Redirect, Route } from "react-router";
import { useAuth } from "./auth";
import HomePage from "./pages/HomePage";
import EditWalksPage from "./pages/EditWalksPage";
import EditNewsPage from "./pages/EditNewsPage";
import EditWellbeingPage from "./pages/EditWellbeingPage";
import { auth } from "./firebase";

import {
  home as homeIcon,
  newspaperOutline as newsIcon,
  chatbubbles as wellbeingIcon,
  footsteps as walkIcon,
} from "ionicons/icons";
import { appData } from "./data/appData";
import NewWalk from "./pages/NewWalk";

const AppTabs: React.FC = () => {
  const { loggedIn, userEmail } = useAuth();

  if (userEmail !== appData.adminEmail) {
    auth.signOut();
  }

  if (!loggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <IonTabs>
        <IonRouterOutlet id="main">
          {/* Primary Tabs */}
          <Route exact path="/app/home">
            <HomePage />
          </Route>
          <Route exact path="/app/edit-walks">
            <EditWalksPage />
          </Route>
          <Route exact path="/app/edit-news">
            <EditNewsPage />
          </Route>
          <Route exact path="/app/edit-wellbeing">
            <EditWellbeingPage />
          </Route>
          <Route path="/app/new-walk">
            <NewWalk />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/app/home">
            <IonIcon icon={homeIcon} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="walks" href="/app/edit-walks">
            <IonIcon icon={walkIcon} />
            <IonLabel>Edit Walks</IonLabel>
          </IonTabButton>
          <IonTabButton tab="wellbeing" href="/app/edit-wellbeing">
            <IonIcon icon={wellbeingIcon} />
            <IonLabel>Edit Wellbeing</IonLabel>
          </IonTabButton>
          <IonTabButton tab="news" href="/app/edit-news">
            <IonIcon icon={newsIcon} />
            <IonLabel>Edit News</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </>
  );
};

export default AppTabs;
