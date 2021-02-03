import {
  IonPage,
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonBadge,
  IonIcon,
  IonLoading,
  IonModal,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from "@ionic/react";
import React, { useState } from "react";
import { eye as eyeIcon, eyeOff as eyeOffIcon } from "ionicons/icons";
import { appData } from "../../data/appData";
import PageHeader from "../../components/PageHeader";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [age, setAge] = useState<Number>(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordIcon, sePasswordIcon] = useState(eyeIcon);
  const [status, setStatus] = useState({
    loading: false,
    error: false,
    errorMessage: "",
  });
  const [showModal, setShowModal] = useState(false);

  const handleRegister = async () => {
    if (!firstname || !lastname) {
      return setStatus({
        loading: false,
        error: true,
        errorMessage: "Please enter a first name and last name",
      });
    }
    try {
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
      <PageHeader title="Register" />
      <IonContent className="ion-padding">
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
                    <IonItem class="ion-margin-top">
                      <IonLabel>First Name</IonLabel>
                      <IonInput
                        type="text"
                        value={firstname}
                        onIonChange={(event) =>
                          setFirstName(event.detail!.value!)
                        }
                      />
                    </IonItem>
                    <IonItem class="ion-margin-top">
                      <IonLabel>Last Name</IonLabel>
                      <IonInput
                        type="text"
                        value={lastname}
                        onIonChange={(event) =>
                          setLastName(event.detail!.value!)
                        }
                      />
                    </IonItem>
                    <IonItem class="ion-margin-top">
                      <IonLabel>Age?</IonLabel>
                      <IonInput
                        type="number"
                        value={age.toString()}
                        onIonChange={(event) =>
                          setAge(parseInt(event.detail!.value!))
                        }
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
                    <IonItem class="ion-margin-top">
                      <IonBadge slot="start" color="light">
                        Please Note
                      </IonBadge>
                      <small>
                        By registering for an account, you agree to our{" "}
                        <IonText
                          color="primary"
                          onClick={() => setShowModal(true)}
                        >
                          Terms and Conditions
                        </IonText>
                      </small>
                    </IonItem>
                  </IonList>
                  <IonButton
                    class="ion-margin-top"
                    expand="block"
                    onClick={handleRegister}
                  >
                    Create Account
                  </IonButton>
                  <IonButton
                    class="ion-margin-top"
                    expand="block"
                    fill="clear"
                    routerLink="/login"
                  >
                    Already have an account?
                  </IonButton>
                  <IonCardContent></IonCardContent>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonModal isOpen={showModal}>
          <IonContent class="ion-padding">
            {appData.privacyPolicy}
            <IonButton
              expand="block"
              class="ion-margin-top"
              onClick={() => setShowModal(false)}
            >
              Close
            </IonButton>
          </IonContent>
        </IonModal>

        <IonLoading isOpen={status.loading} />
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
