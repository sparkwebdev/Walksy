import {
  IonAlert,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { auth, getRemoteUserData, updateUserProfile } from "../firebase";

import { create as editingIcon } from "ionicons/icons";
import { useAuth } from "../auth";
import PageHeader from "../components/PageHeader";
import { Storage } from "@capacitor/core";
import { formatDate } from "../helpers";
import WalksContext from "../data/walks-context";

const SettingsPage: React.FC = () => {
  const { userId, userCreatedAt } = useAuth();
  const walksCtx = useContext(WalksContext);

  const [displayName, setDisplayName] = useState("");

  const firstNameRef = useRef<HTMLIonInputElement>(null);
  const lastNameRef = useRef<HTMLIonInputElement>(null);
  const ageRef = useRef<HTMLIonSelectElement>(null);
  const locationRef = useRef<HTMLIonInputElement>(null);

  const [editing, setEditing] = useState<boolean>(false);
  const [storedDetails, setStoredDetails] = useState<any>();

  const [status, setStatus] = useState({
    loading: false,
    error: false,
    errorMessage: "",
  });

  useEffect(() => {
    if (userId) {
      getRemoteUserData(userId).then((userData) => {
        loadUserData(userData);
      });
    }
  }, [userId]);

  const loadUserData = (userData: any) => {
    setDisplayName(userData?.displayName);
    firstNameRef.current!.value = userData?.firstName;
    lastNameRef.current!.value = userData?.lastName;
    ageRef.current!.value = userData?.age;
    locationRef.current!.value = userData?.location;
  };

  const editDetailsHandler = () => {
    setEditing(true);
    const currentDetails = {
      firstName: firstNameRef.current!.value,
      lastName: lastNameRef.current!.value,
      age: ageRef.current!.value,
      location: locationRef.current!.value,
    };
    setStoredDetails(currentDetails);
  };

  const cancelEditDetailsHandler = () => {
    setEditing(false);
    firstNameRef.current!.value = storedDetails.firstName;
    lastNameRef.current!.value = storedDetails.lastName;
    ageRef.current!.value = storedDetails.age;
    locationRef.current!.value = storedDetails.location;
  };

  const saveDetailsHandler = async () => {
    setStatus({
      ...status,
      loading: true,
    });
    await updateUserProfile(userId!, {
      firstName: firstNameRef.current!.value!.toString(),
      lastName: lastNameRef.current!.value!.toString(),
      age: ageRef.current!.value,
      location: locationRef.current!.value!.toString(),
    })
      .then(() => {
        setEditing(false);
        setStatus({
          loading: false,
          error: false,
          errorMessage: "",
        });
      })
      .catch(() => {
        setEditing(false);
        setStatus({
          loading: false,
          error: true,
          errorMessage: "Error updating user profile",
        });
        console.log("Error updating user profile");
      });
  };

  const [logoutAlert, setLogoutAlert] = useState(false);

  const logoutHandler = () => {
    walksCtx.reset();
    Storage.remove({ key: "userProfile" }); // Legacy, no longer used
    auth.signOut();
  };

  return (
    <IonPage>
      <PageHeader title="Profile &amp; Settings" />
      <IonContent>
        <IonGrid className="constrain constrain--large">
          <IonRow className="ion-margin-top">
            <IonCol>
              <div className="ion-text-center">
                {displayName && <h3>{displayName}</h3>}
                {userCreatedAt && (
                  <IonCardSubtitle>
                    Joined {formatDate(userCreatedAt)}
                  </IonCardSubtitle>
                )}
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader className="ion-no-padding" color="dark">
                  <IonCardSubtitle className="ion-padding ion-no-margin ion-text-uppercase ion-text-center">
                    Your Details
                  </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent className="ion-no-padding">
                  <IonList>
                    {/* <IonItem>
                      <IonLabel position="fixed">
                        <small>Display Name</small>
                      </IonLabel>
                      <IonInput
                        type="text"
                        value={displayName}
                        readonly={!editing}
                      />
                    </IonItem> */}
                    <IonItem>
                      <IonLabel position="fixed">
                        <small>First Name</small>
                      </IonLabel>
                      <IonInput
                        type="text"
                        autocapitalize="on"
                        readonly={!editing}
                        ref={firstNameRef}
                      />
                      {editing && (
                        <IonIcon
                          slot="end"
                          icon={editingIcon}
                          style={{ color: "#bbb" }}
                        />
                      )}
                    </IonItem>
                    <IonItem>
                      <IonLabel position="fixed">
                        <small>Last Name</small>
                      </IonLabel>
                      <IonInput
                        type="text"
                        autocapitalize="on"
                        readonly={!editing}
                        ref={lastNameRef}
                      />
                      {editing && (
                        <IonIcon
                          slot="end"
                          icon={editingIcon}
                          style={{ color: "#bbb" }}
                        />
                      )}
                    </IonItem>
                    <IonItem className="age-select">
                      <IonLabel position="fixed">
                        <small>Age</small>
                      </IonLabel>
                      <IonSelect disabled={!editing} ref={ageRef}>
                        <IonSelectOption value="under-11">
                          Under 11
                        </IonSelectOption>
                        <IonSelectOption value="11-to-18">
                          11 to 18
                        </IonSelectOption>
                        <IonSelectOption value="19-to-29">
                          19 to 29
                        </IonSelectOption>
                        <IonSelectOption value="30-to-44">
                          30 to 44
                        </IonSelectOption>
                        <IonSelectOption value="45-to-60">
                          45 to 60
                        </IonSelectOption>
                        <IonSelectOption value="61-to-75">
                          61 to 75
                        </IonSelectOption>
                        <IonSelectOption value="76-plus">
                          76 plus
                        </IonSelectOption>
                      </IonSelect>
                      {editing && (
                        <IonIcon
                          slot="end"
                          icon={editingIcon}
                          style={{ color: "#bbb" }}
                        />
                      )}
                    </IonItem>
                    <IonItem>
                      <IonLabel position="fixed">
                        <small>Location</small>
                      </IonLabel>
                      <IonInput
                        type="text"
                        readonly={!editing}
                        autocapitalize="on"
                        ref={locationRef}
                      />
                      {editing && (
                        <IonIcon
                          slot="end"
                          icon={editingIcon}
                          style={{ color: "#bbb" }}
                        />
                      )}
                    </IonItem>
                  </IonList>
                </IonCardContent>
                <IonCardHeader
                  className="ion-no-padding ion-margin-top"
                  color="light"
                >
                  <IonGrid>
                    <IonRow>
                      <IonCol className="ion-text-center">
                        {editing ? (
                          <>
                            <IonButton
                              className="ion-margin-end"
                              color="danger"
                              onClick={cancelEditDetailsHandler}
                            >
                              Cancel
                            </IonButton>
                            <IonButton
                              className="ion-margin-end"
                              color="success"
                              onClick={saveDetailsHandler}
                            >
                              Save
                            </IonButton>
                          </>
                        ) : (
                          <IonButton
                            color={editing ? "success" : "primary"}
                            onClick={editDetailsHandler}
                          >
                            Edit Details
                          </IonButton>
                        )}
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardHeader>
              </IonCard>
            </IonCol>
          </IonRow>
          {/* <IonRow>
            <IonCol>
              <IonCard className="ion-padding-bottom constrain-medium">
                <IonCardHeader className="ion-no-padding" color="dark">
                  <IonCardSubtitle className="ion-padding ion-no-margin ion-text-uppercase ion-text-center">
                    Your Preferences
                  </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent className="ion-no-padding">
                  <IonList>
                    <IonItem className="ion-no-padding">
                      <IonLabel position="fixed" className="ion-padding-start">
                        <small>Distance units</small>
                      </IonLabel>
                      <IonBadge
                        slot="end"
                        color={metric ? "primary" : "secondary"}
                      >
                        {metric ? "km" : "miles"}
                      </IonBadge>
                      <IonToggle
                        slot="end"
                        checked={metric}
                        onIonChange={(e) => {
                          setMetric(e.detail.checked);
                          savePreferencesHandler("metric", e.detail.checked);
                        }}
                      />
                    </IonItem>
                    <IonItem className="ion-no-padding">
                      <IonLabel position="fixed" className="ion-padding-start">
                        <small>Dark mode</small>
                      </IonLabel>
                      <IonBadge
                        slot="end"
                        color={darkMode ? "primary" : "light"}
                      >
                        {darkMode ? "on" : "off"}
                      </IonBadge>
                      <IonToggle
                        slot="end"
                        checked={darkMode}
                        onIonChange={(e) => {
                          setDarkMode(e.detail.checked);
                          savePreferencesHandler("darkMode", e.detail.checked);
                        }}
                      />
                    </IonItem>
                  </IonList>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow> */}
          <IonRow>
            <IonCol>
              <IonCard>
                {/* <IonCardHeader className="ion-no-padding" color="dark">
                  <IonCardSubtitle className="ion-padding ion-no-margin ion-text-uppercase ion-text-center">
                    Your Account
                  </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent className="ion-no-padding">
                  <IonList>
                    <IonItem>
                      <IonLabel position="fixed">
                        <small>Email</small>
                      </IonLabel>
                      <IonInput type="text" value={userEmail} readonly={true} />
                      <IonButton
                        size="small"
                        slot="end"
                        onClick={() => {
                          updateEmailHandler();
                        }}
                      >
                        Edit
                      </IonButton>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="fixed">
                        <small>Password</small>
                      </IonLabel>
                      <IonInput type="password" value="****" readonly={true} />
                      <IonButton
                        size="small"
                        slot="end"
                        onClick={() => {
                          updatePasswordHandler();
                        }}
                      >
                        Edit
                      </IonButton>
                    </IonItem>
                  </IonList>
                </IonCardContent> */}
                <IonCardHeader
                  // className="ion-no-padding ion-margin-top"
                  className="ion-no-padding"
                  color="light"
                >
                  <IonGrid>
                    <IonRow>
                      <IonCol className="ion-text-center">
                        <IonButton
                          color="tertiary"
                          onClick={() => {
                            setLogoutAlert(true);
                          }}
                        >
                          Logout
                        </IonButton>
                        <IonAlert
                          isOpen={logoutAlert}
                          onDidDismiss={() => setLogoutAlert(false)}
                          header={"Logout"}
                          subHeader={"Are you sure?"}
                          buttons={[
                            {
                              text: "No",
                              role: "cancel",
                            },
                            {
                              text: "Yes",
                              cssClass: "secondary",
                              handler: logoutHandler,
                            },
                          ]}
                        />
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardHeader>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <IonLoading isOpen={status.loading} message={"Please wait..."} />
    </IonPage>
  );
};

export default SettingsPage;
