import { IonApp, IonLoading } from "@ionic/react";
import React from "react";
import { IonReactRouter } from "@ionic/react-router";
import AppTabs from "./AppTabs";
import { Redirect, Route, Switch } from "react-router";
import { AuthContext, useAuthInit } from "./auth";
import WalksContextProvider from "./data/WalksContextProvider";

import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import Walking from "./pages/Walking";

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
              <Route exact path="/login">
                <LoginPage />
              </Route>
              <Route path="/walking">
                <Walking />
              </Route>
              <Route path="/app">
                <AppTabs />
              </Route>
              <Redirect exact path="/" to="/app/home" />
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
