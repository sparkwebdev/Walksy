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
import React, { useState } from "react";
import { Redirect } from "react-router";
import { useAuth } from "../../auth";
import { auth } from "../../firebase";
import PageHeader from "../../components/PageHeader";
import { eye as eyeIcon, eyeOff as eyeOffIcon } from "ionicons/icons";

const LoginPage: React.FC = () => {
  const { loggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordIcon, sePasswordIcon] = useState(eyeIcon);
  const [status, setStatus] = useState({
    loading: false,
    error: false,
    errorMessage: "",
  });

  const handleLogin = async () => {
    try {
      setStatus({ loading: true, error: false, errorMessage: "" });
      const credential = await auth.signInWithEmailAndPassword(email, password);
      return credential;
    } catch (error) {
      console.log("error: ", error);
      setStatus({ loading: false, error: true, errorMessage: error.message });
    }
  };

  const toggleShowPassword = () => {
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
        <div className="centered-content">
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
                      value={email}
                      onIonChange={(event) => setEmail(event.detail!.value!)}
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
                      value={password}
                      onIonChange={(event) => setPassword(event.detail!.value!)}
                      onIonFocus={() =>
                        setStatus({ ...status, error: false, errorMessage: "" })
                      }
                    />
                    <IonIcon
                      slot="end"
                      icon={showPasswordIcon}
                      onClick={() => {
                        toggleShowPassword();
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

                <IonButton
                  className="ion-margin"
                  expand="block"
                  onClick={handleLogin}
                >
                  Login
                </IonButton>
                <IonButton expand="block" fill="clear" routerLink="/register">
                  Don't have an account?
                </IonButton>
              </IonCardContent>
            </IonCard>
          </div>
        </div>
      </IonContent>
      <IonLoading isOpen={status.loading} />
    </IonPage>
  );
};

export default LoginPage;
