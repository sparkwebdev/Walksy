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
import { appData } from "../../data/appData";
import PageHeader from "../../components/PageHeader";
import { eye as eyeIcon, eyeOff as eyeOffIcon } from "ionicons/icons";
import { createUserProfileDocument } from "../../firebase";

import { Plugins } from "@capacitor/core";

const { Network } = Plugins;

const RegisterPage: React.FC = () => {
  const { loggedIn } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstname, setFirstName] = useState<string>("");
  const [lastname, setLastName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordIcon, setPasswordIcon] = useState(eyeIcon);
  const [userHasProfile, setUserHasProfile] = useState<boolean | undefined>(
    undefined
  );
  const [status, setStatus] = useState({
    loading: false,
    error: false,
    errorMessage: "",
  });
  const [showModal, setShowModal] = useState(false);

  const getNetworkStatus = async () => {
    let networkStatus = await Network.getStatus();
    return networkStatus;
  };

  const handleRegister = async () => {
    setUserHasProfile(false);
    if (!firstname || !lastname) {
      return setStatus({
        loading: false,
        error: true,
        errorMessage: "Please enter a first name and last name.",
      });
    } else if (!email || !password) {
      return setStatus({
        loading: false,
        error: true,
        errorMessage: "Please enter an email and password.",
      });
    } else if (password.length < 6) {
      return setStatus({
        loading: false,
        error: true,
        errorMessage: "Please enter a password with at least 6 characters.",
      });
    }
    try {
      setStatus({ loading: true, error: false, errorMessage: "" });
      console.log(getNetworkStatus());
      const credential = await auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          if (userCredential.user) {
            createUserProfileDocument(userCredential.user, {
              firstName: firstname,
              lastName: lastname,
              // location: location,
              age: age,
            });
          } else {
            console.log("error creating user");
          }
        })
        .then(() => {
          setUserHasProfile(true);
        });
      return credential;
    } catch (error) {
      setStatus({ loading: false, error: true, errorMessage: error.message });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    showPassword ? setPasswordIcon(eyeIcon) : setPasswordIcon(eyeOffIcon);
  };

  if (loggedIn && userHasProfile !== false) {
    return <Redirect to="/app/home" />;
  }
  return (
    <IonPage>
      <PageHeader title="Register" />
      <IonContent>
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
                  <IonGrid className="ion-no-padding">
                    <IonRow>
                      <IonCol>
                        <IonItem>
                          <IonLabel position="stacked">
                            <small>First Name</small>
                          </IonLabel>
                          <IonInput
                            type="text"
                            value={firstname}
                            onIonChange={(event) =>
                              setFirstName(event.detail!.value!)
                            }
                            onIonFocus={() =>
                              setStatus({
                                ...status,
                                error: false,
                                errorMessage: "",
                              })
                            }
                          />
                        </IonItem>
                      </IonCol>
                      <IonCol>
                        <IonItem>
                          <IonLabel position="stacked">
                            <small>Last Name</small>
                          </IonLabel>
                          <IonInput
                            type="text"
                            value={lastname}
                            onIonChange={(event) =>
                              setLastName(event.detail!.value!)
                            }
                            onIonFocus={() =>
                              setStatus({
                                ...status,
                                error: false,
                                errorMessage: "",
                              })
                            }
                          />
                        </IonItem>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol size="6">
                        <IonItem>
                          <IonLabel position="stacked">
                            <small>Age (optional)</small>
                          </IonLabel>
                          <IonInput
                            type="number"
                            min="1"
                            max="135"
                            value={age?.toString()}
                            onIonChange={(event) =>
                              setAge(event.detail!.value!)
                            }
                            onIonFocus={() =>
                              setStatus({
                                ...status,
                                error: false,
                                errorMessage: "",
                              })
                            }
                          />
                        </IonItem>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
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
                  <IonText>
                    <small className="ion-padding-start">
                      &nbsp;6 characters or more.
                    </small>
                  </IonText>
                </IonList>

                <IonList lines="none">
                  <IonItem>
                    <IonGrid className="ion-no-padding">
                      {status.error && (
                        <IonRow className="ion-margin-top ion-align-items-center">
                          <IonCol size="12">
                            <IonBadge color="danger">Error</IonBadge>&nbsp;
                            <IonText color="danger">
                              <small>{status.errorMessage}</small>
                            </IonText>
                          </IonCol>
                        </IonRow>
                      )}
                      <IonRow className="ion-margin-top ion-align-items-center">
                        <IonCol size="12">
                          <IonBadge color="warning">Please Note</IonBadge>&nbsp;
                          <small>
                            By registering for an account, you agree to our{" "}
                            <IonText
                              color="primary"
                              onClick={() => setShowModal(true)}
                              className="with-hover-cursor"
                            >
                              Terms&nbsp;and&nbsp;Conditions
                            </IonText>
                            .
                          </small>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonItem>
                </IonList>
                <IonButton
                  className="ion-margin"
                  expand="block"
                  onClick={handleRegister}
                >
                  Create Account
                </IonButton>
                <IonButton expand="block" fill="clear" routerLink="/login">
                  Already have an account?
                </IonButton>
              </IonCardContent>
            </IonCard>
          </div>
        </div>
      </IonContent>

      <IonModal isOpen={showModal}>
        <IonContent className="ion-padding">
          <div className="centered-content">
            <div className="constrain constrain--medium">
              <IonCard>
                <IonCardHeader className="ion-no-padding" color="dark">
                  <IonCardSubtitle className="ion-padding ion-no-margin ion-text-uppercase ion-text-center">
                    Terms and Conditions
                  </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent className="ion-margin-top small-print">
                  {appData.privacyPolicy}
                </IonCardContent>
                <IonCardHeader className="ion-no-padding" color="light">
                  <IonGrid>
                    <IonRow>
                      <IonCol size="8" offset="2">
                        <IonButton
                          expand="block"
                          onClick={() => setShowModal(false)}
                        >
                          Accept
                        </IonButton>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardHeader>
              </IonCard>
            </div>
          </div>
        </IonContent>
      </IonModal>

      <IonLoading isOpen={status.loading} />
    </IonPage>
  );
};

export default RegisterPage;
