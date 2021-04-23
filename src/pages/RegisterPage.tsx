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
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { Plugins } from "@capacitor/core";
import { useAuth } from "../auth";
import { auth, createUserProfile } from "../firebase";
import { eye as eyeIcon, eyeOff as eyeOffIcon } from "ionicons/icons";
import PageHeader from "../components/PageHeader";
import CompleteProfile from "../components/CompleteProfile";
import TermsAndConditions from "../components/TermsAndConditions";
import { UserPreferences } from "../data/models";

const { Storage } = Plugins;

const RegisterPage: React.FC = () => {
  const { loggedIn } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [generatedUserId, setGeneratedUserId] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordIcon, setPasswordIcon] = useState(eyeIcon);
  const [userHasProfile, setUserHasProfile] = useState(false);
  const [userHasProfileComplete, setUserHasProfileComplete] = useState<boolean>(
    false
  );
  const [status, setStatus] = useState({
    loading: false,
    error: false,
    errorMessage: "",
  });
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    Storage.get({
      key: "userProfile",
    })
      .then((data) => {
        if (data.value) {
          const userProfile = JSON.parse(data.value);
          setUserHasProfileComplete(!!userProfile.displayName);
        }
      })
      .catch((e) => {
        console.log("Couldn't get user profile", e);
      });
  }, []);

  const registerHandler = async () => {
    if (!firstName || !lastName) {
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
      await auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          if (userCredential.user) {
            setGeneratedUserId(userCredential.user!.uid);
            setUserDefaultPreferences();
            setUserHasProfile(true);
          }
        })
        .catch((e) => {
          console.log("Couldn't create user", e);
        });
      setStatus({ loading: false, error: false, errorMessage: "" });
    } catch (error) {
      setStatus({ loading: false, error: true, errorMessage: error.message });
    }
  };

  const setUserDefaultPreferences = () => {
    const defaultPreferences: UserPreferences = {
      metric: true,
      darkMode: false,
    };
    Storage.set({
      key: "userPreferences",
      value: JSON.stringify(defaultPreferences),
    });
  };

  const completeProfileHandler = async (
    displayName: string,
    age: string,
    location: string
  ) => {
    setStatus({
      ...status,
      loading: true,
    });
    await createUserProfile({
      userId: generatedUserId,
      firstName,
      lastName,
      displayName,
      location,
      age,
    })
      .then(() => {
        setStatus({
          loading: false,
          error: false,
          errorMessage: "",
        });
        setUserHasProfileComplete(true);
      })
      .catch(() => {
        setStatus({
          loading: false,
          error: true,
          errorMessage: "Error creating user profile",
        });
        console.log("Error creating user profile");
      });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    showPassword ? setPasswordIcon(eyeIcon) : setPasswordIcon(eyeOffIcon);
  };

  if (loggedIn && userHasProfileComplete !== false) {
    return <Redirect to="/app/home" />;
  }
  return (
    <IonPage>
      <PageHeader title="Register" />
      <IonContent>
        <div className="centered-content centered-content--no-tabs">
          <div className="constrain constrain--medium">
            {!userHasProfile && (
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
                        <small>First Name</small>
                      </IonLabel>
                      <IonInput
                        type="text"
                        value={firstName}
                        autocapitalize="on"
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
                    <IonItem>
                      <IonLabel position="stacked">
                        <small>Last Name</small>
                      </IonLabel>
                      <IonInput
                        type="text"
                        autocapitalize="on"
                        value={lastName}
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
                    <IonItem>
                      <IonLabel position="stacked">
                        <small>Email</small>
                      </IonLabel>
                      <IonInput
                        type="email"
                        value={email}
                        onIonChange={(event) => setEmail(event.detail!.value!)}
                        onIonFocus={() =>
                          setStatus({
                            ...status,
                            error: false,
                            errorMessage: "",
                          })
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
                        onIonChange={(event) =>
                          setPassword(event.detail!.value!)
                        }
                        onIonFocus={() =>
                          setStatus({
                            ...status,
                            error: false,
                            errorMessage: "",
                          })
                        }
                      />
                      <IonIcon
                        slot="end"
                        icon={showPasswordIcon}
                        onClick={toggleShowPassword}
                        style={{
                          marginTop: "1.2em",
                        }}
                      />
                    </IonItem>
                    <IonText>
                      <small className="ion-padding-start">
                        &nbsp;6 characters or more
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
                            <IonBadge color="warning">Please Note</IonBadge>
                            &nbsp;
                            <small>
                              By registering for an account, you agree to our{" "}
                              <IonText
                                color="primary"
                                onClick={() => setShowTermsModal(true)}
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
                </IonCardContent>
                <IonCardHeader
                  className="ion-no-padding ion-margin-top"
                  color="light"
                >
                  <IonGrid>
                    <IonRow>
                      <IonCol>
                        <IonButton expand="block" onClick={registerHandler}>
                          Create Account
                        </IonButton>
                        <IonButton
                          expand="block"
                          fill="clear"
                          routerLink="/login"
                          className="ion-margin-top"
                        >
                          Already have an account?
                        </IonButton>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardHeader>
              </IonCard>
            )}
            {/* Additional User fields */}
            {userHasProfile && (
              <CompleteProfile
                firstName={firstName}
                lastName={lastName}
                userId={generatedUserId}
                onSubmit={(
                  displayName: string,
                  age: string,
                  location: string
                ) => {
                  completeProfileHandler(displayName, age, location);
                }}
              />
            )}
          </div>
        </div>
      </IonContent>

      {/* Terms and conditons */}
      <IonModal isOpen={showTermsModal}>
        <TermsAndConditions onDismiss={() => setShowTermsModal(false)} />
      </IonModal>

      <IonLoading isOpen={status.loading} />
    </IonPage>
  );
};

export default RegisterPage;
