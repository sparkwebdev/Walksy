import {
  IonAlert,
  IonBadge,
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
  IonToggle,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import {
  auth,
  getRemoteUserData,
  syncUserProfileToLocal,
  updateUserProfile,
} from "../firebase";

import { create as editingIcon } from "ionicons/icons";
import { useAuth } from "../auth";
import PageHeader from "../components/PageHeader";
import { Storage } from "@capacitor/core";
import { formatDate } from "../helpers";
import { UserPreferences } from "../data/models";

const SettingsPage: React.FC = () => {
  const { userId, userCreatedAt, userEmail } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const [metric, setMetric] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const [editing, setEditing] = useState(false);

  const [status, setStatus] = useState({
    loading: false,
    error: false,
    errorMessage: "",
  });

  useEffect(() => {
    Storage.get({
      key: "userProfile",
    }).then((data) => {
      if (data.value) {
        const userData = JSON.parse(data.value);
        loadUserData(userData);
      } else if (userId) {
        getRemoteUserData(userId).then((userData) => {
          loadUserData(userData);
          syncUserProfileToLocal(userId);
        });
      }
    });
    Storage.get({
      key: "userPreferences",
    }).then((data) => {
      if (data.value) {
        const userPreferences = JSON.parse(data.value);
        setMetric(userPreferences.metric);
        setDarkMode(userPreferences.darkMode);
      }
    });
  }, [userId]);

  const loadUserData = (userData: any) => {
    setDisplayName(userData?.displayName);
    setFirstName(userData?.firstName);
    setLastName(userData?.lastName);
    setAge(userData?.age);
    setLocation(userData?.location);
    setProfilePic(userData?.profilePic);
  };

  const saveDetailsHandler = async () => {
    setStatus({
      ...status,
      loading: true,
    });
    await updateUserProfile({
      userId: userId!,
      displayName,
      firstName,
      lastName,
      age,
      location,
      profilePic,
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

  const savePreferencesHandler = async (name: string, value: boolean) => {
    Storage.get({
      key: "userPreferences",
    }).then((result) => {
      const updated: UserPreferences = {
        ...JSON.parse(result.value),
        [name]: value,
      };
      Storage.set({
        key: "userPreferences",
        value: JSON.stringify(updated),
      });
    });
  };

  const updateEmailHandler = async () => {};

  const updatePasswordHandler = async () => {};

  const [logoutAlert, setLogoutAlert] = useState(false);

  const logoutHandler = () => {
    Storage.remove({ key: "userProfile" });
    auth.signOut();
  };

  return (
    <IonPage>
      <PageHeader title="Settings" />
      <IonContent>
        <div className="centered-content">
          <div className="constrain constrain--medium">
            <div>
              <div className="profile-badge">
                {profilePic && (
                  <img
                    src={profilePic}
                    alt={`Profile image for ${firstName} ${lastName}`}
                    className="profile-badge__image"
                    width="100"
                    height="100"
                  />
                )}
                {profilePic &&
                  profilePic.startsWith("https://eu.ui-avatars.com") && (
                    <small className="text-body profile-badge__image-prompt">
                      Tap to change profile image
                    </small>
                  )}
                {displayName && <h3>{displayName}</h3>}
                {userCreatedAt && (
                  <IonCardSubtitle>
                    Joined {formatDate(userCreatedAt)}
                  </IonCardSubtitle>
                )}
              </div>
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
                        value={firstName}
                        readonly={!editing}
                        onIonChange={(event) =>
                          setFirstName(event.detail!.value!)
                        }
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
                        value={lastName}
                        readonly={!editing}
                        onIonChange={(event) =>
                          setLastName(event.detail!.value!)
                        }
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
                        <small>Age</small>
                      </IonLabel>
                      <IonInput
                        type="number"
                        value={age}
                        readonly={!editing}
                        onIonChange={(event) => setAge(event.detail!.value!)}
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
                        <small>Location</small>
                      </IonLabel>
                      <IonInput
                        type="text"
                        value={location}
                        readonly={!editing}
                        onIonChange={(event) =>
                          setLocation(event.detail!.value!)
                        }
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
                              size="small"
                              onClick={() => setEditing(false)}
                            >
                              Cancel
                            </IonButton>
                            <IonButton
                              className="ion-margin-end"
                              color="success"
                              size="small"
                              onClick={saveDetailsHandler}
                            >
                              Save
                            </IonButton>
                          </>
                        ) : (
                          <IonButton
                            color={editing ? "success" : "primary"}
                            size="small"
                            onClick={() => {
                              setEditing(!editing);
                            }}
                          >
                            Edit Details
                          </IonButton>
                        )}
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardHeader>
              </IonCard>
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

              <IonCard>
                <IonCardHeader className="ion-no-padding" color="dark">
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
                      {/* <IonButton
                        size="small"
                        slot="end"
                        onClick={() => {
                          updateEmailHandler();
                        }}
                      >
                        Edit
                      </IonButton> */}
                    </IonItem>
                    <IonItem>
                      <IonLabel position="fixed">
                        <small>Password</small>
                      </IonLabel>
                      <IonInput type="password" value="****" readonly={true} />
                      {/* <IonButton
                        size="small"
                        slot="end"
                        onClick={() => {
                          updatePasswordHandler();
                        }}
                      >
                        Edit
                      </IonButton> */}
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
                        <IonButton
                          size="small"
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
            </div>
          </div>
        </div>
      </IonContent>
      <IonLoading isOpen={status.loading} />
    </IonPage>
  );
};

export default SettingsPage;
