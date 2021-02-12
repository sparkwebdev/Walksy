import { IonApp, IonLoading } from "@ionic/react";
import React from "react";
import { IonReactRouter } from "@ionic/react-router";
import AppTabs from "./AppTabs";
import { Redirect, Route, Switch } from "react-router";
import { AuthContext, useAuthInit } from "./auth";

import IntroPage from "./pages/subpages/IntroPage";
import LoginPage from "./pages/subpages/LoginPage";
import RegisterPage from "./pages/subpages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

const App: React.FC = () => {
  const { loading, auth } = useAuthInit();
  if (loading) {
    return <IonLoading isOpen />;
  }
  console.log("Rendering app with auth: ", auth);

  return (
    <IonApp>
      <AuthContext.Provider value={auth!}>
        <IonReactRouter>
          <Switch>
            <Route exact path="/intro">
              <IntroPage />
            </Route>
            <Route exact path="/login">
              <LoginPage />
            </Route>
            <Route exact path="/register">
              <RegisterPage />
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
      </AuthContext.Provider>
    </IonApp>
  );
};

export default App;
