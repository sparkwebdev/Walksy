import { IonApp } from "@ionic/react";
import React from "react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route, Switch } from "react-router";

import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
import WalkEntryPage from "./pages/WalkEntryPage";
import EntryPage from "./components/EntryPage";
import NewsPage from "./pages/NewsPage";
import AboutPage from "./pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import CopyrightPage from "./pages/CopyrightPage";

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/walk/:id">
            <WalkEntryPage />
          </Route>
          <Route exact path="/entries/:id">
            <EntryPage />
          </Route>
          <Route exact path="/latest-news">
            <NewsPage />
          </Route>
          <Route exact path="/about">
            <AboutPage />
          </Route>
          <Route exact path="/privacy">
            <PrivacyPage />
          </Route>
          <Route exact path="/copyright">
            <CopyrightPage />
          </Route>
          <Redirect exact path="/" to="/" />
          <Route>
            <NotFoundPage />
          </Route>
        </Switch>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
