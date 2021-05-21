import { IonApp, IonLoading } from "@ionic/react";
import React from "react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route, Switch } from "react-router";
import WalksContextProvider from "./data/WalksContextProvider";

import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
import WalkEntryPage from "./pages/WalkEntryPage";
import EntryPage from "./components/EntryPage";
import NewsPage from "./pages/NewsPage";
import AboutPage from "./pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import { AuthContext, useAuthInit } from "./auth";

const App: React.FC = () => {
  const { loading, auth } = useAuthInit();
  if (loading) {
    return <IonLoading isOpen />;
  }

  return (
    <IonApp>
      <AuthContext.Provider value={auth!}>
        <WalksContextProvider>
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
              <Redirect exact path="/" to="/" />
              <Route>
                <NotFoundPage />
              </Route>
            </Switch>
          </IonReactRouter>
        </WalksContextProvider>
      </AuthContext.Provider>
    </IonApp>
  );
};

export default App;
