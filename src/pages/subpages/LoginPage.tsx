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
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import React, { useState } from "react";
import { eye as eyeIcon, eyeOff as eyeOffIcon } from "ionicons/icons";
import PageHeader from "../../components/PageHeader";

const LoginPage: React.FC = () => {
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
      console.log("Authenticate here");
    } catch (error) {
      console.log("error: ", error);
      setStatus({ loading: false, error: true, errorMessage: error.message });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    showPassword ? sePasswordIcon(eyeIcon) : sePasswordIcon(eyeOffIcon);
  };

  return (
    <IonPage>
      <PageHeader title="Login" />
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol offsetSm="2" sizeSm="8" offsetMd="3" sizeMd="6">
              <IonCard>
                <IonCardHeader className="ion-text-center">
                  <IonCardTitle>Your details</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonList>
                    <IonItem>
                      <IonLabel>Email</IonLabel>
                      <IonInput
                        type="email"
                        value={email}
                        onIonChange={(event) => setEmail(event.detail!.value!)}
                      />
                    </IonItem>
                    <IonItem class="ion-margin-top">
                      <IonLabel>Password</IonLabel>
                      <IonInput
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onIonChange={(event) =>
                          setPassword(event.detail!.value!)
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
                  <IonList lines="none">
                    {status.error && (
                      <IonItem>
                        <IonBadge slot="start" color="danger">
                          Error
                        </IonBadge>
                        <IonLabel color="danger">
                          {status.errorMessage}
                        </IonLabel>
                      </IonItem>
                    )}
                  </IonList>
                  <IonButton
                    class="ion-margin-top"
                    expand="block"
                    onClick={handleLogin}
                  >
                    Login
                  </IonButton>
                  <IonButton
                    class="ion-margin-top"
                    expand="block"
                    fill="clear"
                    routerLink="/register"
                  >
                    Don't have an account?
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <IonLoading isOpen={status.loading} />
    </IonPage>
  );
};

export default LoginPage;
