import {
  IonPage,
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonLoading,
  IonIcon,
  IonBadge,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonCardSubtitle,
} from "@ionic/react";
import React, { useRef, useState } from "react";
import { Redirect } from "react-router";
import { useAuth } from "../auth";
import { auth, syncUserProfileToLocal } from "../firebase";
import PageHeader from "../components/PageHeader";
import { eye as eyeIcon, eyeOff as eyeOffIcon } from "ionicons/icons";

const LoginPage: React.FC = () => {
  const { loggedIn } = useAuth();
  const emailInputRef = useRef<HTMLIonInputElement>(null);
  const passwordInputRef = useRef<HTMLIonInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordIcon, sePasswordIcon] = useState(eyeIcon);
  const [status, setStatus] = useState({
    loading: false,
    error: false,
    errorMessage: "",
  });

  const loginHandler = async () => {
    const email = emailInputRef.current!.value;
    const password = passwordInputRef.current!.value;
    if (!email || !password) {
      return;
    }
    try {
      setStatus({ loading: true, error: false, errorMessage: "" });
      const credential = await auth.signInWithEmailAndPassword(
        email.toString(),
        password.toString()
      );
      if (credential.user?.uid) {
        syncUserProfileToLocal(credential.user.uid);
      }
      return credential;
    } catch (error) {
      setStatus({ loading: false, error: true, errorMessage: error.message });
    }
  };

  const toggleShowPasswordHandler = () => {
    setShowPassword(!showPassword);
    showPassword ? sePasswordIcon(eyeIcon) : sePasswordIcon(eyeOffIcon);
  };

  if (loggedIn) {
    return <Redirect to="/app/home" />;
  }
  return (
    <IonPage>
      <PageHeader title="Login" />
      <IonContent className="">
        <div className="centered-content centered-content--no-tabs">
          <div className="constrain constrain--medium">
            <IonCard>
              <IonCardHeader className="ion-no-padding" color="dark">
                <IonCardSubtitle className="ion-padding ion-no-margin ion-text-uppercase ion-text-center">
                  Your details
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent className="ion-no-padding">
                <IonList>
                  <IonItem>
                    <IonLabel position="stacked">
                      <small>Email</small>
                    </IonLabel>
                    <IonInput
                      type="email"
                      ref={emailInputRef}
                      onIonFocus={() =>
                        setStatus({ ...status, error: false, errorMessage: "" })
                      }
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">
                      <small>Password</small>
                    </IonLabel>
                    <IonInput
                      type={showPassword ? "text" : "password"}
                      ref={passwordInputRef}
                      onIonFocus={() =>
                        setStatus({ ...status, error: false, errorMessage: "" })
                      }
                    />
                    <IonIcon
                      slot="end"
                      icon={showPasswordIcon}
                      onClick={toggleShowPasswordHandler}
                      style={{
                        marginTop: "1.2em",
                      }}
                    />
                  </IonItem>
                </IonList>

                {status.error && (
                  <IonList lines="none">
                    <IonItem>
                      <IonGrid className="ion-no-padding">
                        <IonRow className="ion-margin-top ">
                          <IonCol size="12">
                            <IonBadge color="danger">Error</IonBadge>
                          </IonCol>
                          <IonCol size="12">
                            <IonText color="danger">
                              <small>{status.errorMessage}</small>
                            </IonText>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonItem>
                  </IonList>
                )}
              </IonCardContent>
              <IonCardHeader
                className="ion-no-padding ion-margin-top"
                color="light"
              >
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonButton expand="block" onClick={loginHandler}>
                        Login
                      </IonButton>
                      <IonButton
                        expand="block"
                        fill="clear"
                        routerLink="/register"
                        className="ion-margin-top"
                      >
                        Don't have an account?
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardHeader>
            </IonCard>
          </div>
        </div>
      </IonContent>
      <IonLoading isOpen={status.loading} />
    </IonPage>
  );
};

export default LoginPage;
