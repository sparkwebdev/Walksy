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
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonToggle,
} from "@ionic/react";
import React, { useEffect, useState, useRef } from "react";
import { auth } from "../firebase";
import { useAuth } from "../auth";
import { firestore } from "../firebase";
import ProfileImagePicker from "../components/ProfileImagePicker";
import { Photo } from "../data/models";
import PageHeader from "../components/PageHeader";

const SettingsPage: React.FC = () => {
  const { userId } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  // const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [metric, setMetric] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const usersRef = firestore.collection("users").doc(userId);
    return usersRef.onSnapshot((user) => {
      const data = user.data();
      setFirstName(data?.firstName);
      setLastName(data?.lastName);
      setAge(data?.age);
      setMetric(data?.metric);
    });
  }, [userId]);

  // const [takenPhoto, setTakenPhoto] = useState<Photo>();

  const photoPickHandler = (photo: Photo) => {
    // setTakenPhoto(photo);
  };

  const filePickerChildRef = useRef();

  const [logoutAlert, setLogoutAlert] = useState(false);

  const logoutHandler = () => {
    auth.signOut();
  };

  return (
    <IonPage>
      <PageHeader title="Settings" />
      <IonContent>
        <div className="centered-content">
          <div className="constrain constrain--medium">
            <IonCard className="ion-padding-bottom constrain-medium">
              <IonCardHeader className="ion-no-padding" color="dark">
                <IonGrid className="ion-no-padding">
                  <IonRow className="ion-align-items-center">
                    <IonCol>
                      <IonCardSubtitle className="ion-padding ion-no-margin ion-text-uppercase ion-text-center">
                        Your Profile
                      </IonCardSubtitle>
                    </IonCol>
                    <IonCol className="ion-text-end">
                      {editing ? (
                        <div>
                          <IonButton
                            className="ion-margin-end"
                            color="dark"
                            size="small"
                            onClick={(event) => setEditing(false)}
                          >
                            Cancel
                          </IonButton>
                          <IonButton
                            className="ion-margin-end"
                            color="success"
                            size="small"
                            onClick={() => {}}
                          >
                            Save
                          </IonButton>
                        </div>
                      ) : (
                        <IonButton
                          className="ion-margin-end"
                          color={editing ? "success" : "primary"}
                          size="small"
                          onClick={() => {
                            setEditing(!editing);
                          }}
                        >
                          Edit
                        </IonButton>
                      )}
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardHeader>
              <IonCardContent className="ion-no-padding">
                <div className="ion-margin">
                  <ProfileImagePicker
                    onImagePick={photoPickHandler}
                    ref={filePickerChildRef}
                  />
                </div>
                <IonList>
                  <IonItem>
                    <IonLabel position="fixed">
                      <small>First Name</small>
                    </IonLabel>
                    <IonInput
                      type="text"
                      value={firstName}
                      readonly={!editing}
                      onIonChange={(event) => setFirstName(event.detail.value!)}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="fixed">
                      <small>Last Name</small>
                    </IonLabel>
                    <IonInput
                      type="text"
                      value={lastName}
                      readonly={!editing}
                      onIonChange={(event) => setLastName(event.detail.value!)}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="fixed">
                      <small>Age</small>
                    </IonLabel>
                    <IonInput
                      type="text"
                      value={age}
                      readonly={!editing}
                      onIonChange={(event) => setAge(event.detail.value!)}
                    />
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
            <IonCard className="ion-padding-bottom constrain-medium">
              <IonCardHeader className="ion-no-padding" color="dark">
                <IonCardSubtitle className="ion-padding ion-no-margin ion-text-uppercase ion-text-center">
                  Your Preferences
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent className="ion-no-padding">
                <IonList>
                  <IonItem>
                    <IonLabel position="fixed">
                      <small>Distance</small>
                    </IonLabel>
                    <IonInput
                      type="text"
                      value={distance}
                      readonly={!editing}
                      onIonChange={(event) => setDistance(event.detail.value!)}
                    />
                    <IonToggle
                      checked={metric}
                      onIonChange={(e) => setMetric(e.detail.checked)}
                    />
                    <IonBadge
                      slot="end"
                      color={metric ? "primary" : "secondary"}
                    >
                      {metric ? "km" : "miles"}
                    </IonBadge>
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
            <IonCard className="ion-padding-bottom constrain-medium">
              <IonCardHeader className="ion-no-padding" color="dark">
                <IonGrid className="ion-no-padding">
                  <IonRow className="ion-align-items-center">
                    <IonCol>
                      <IonCardSubtitle className="ion-padding ion-no-margin ion-text-uppercase ion-text-center">
                        Your Account
                      </IonCardSubtitle>
                    </IonCol>
                    <IonCol className="ion-text-end">
                      <IonButton
                        className="ion-margin-end"
                        color={editing ? "success" : "primary"}
                        size="small"
                        onClick={() => {
                          setEditing(!editing);
                        }}
                      >
                        {editing ? "Save?" : "Edit"}
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardHeader>
              <IonCardContent className="ion-no-padding">
                <IonList>
                  <IonItem>
                    <IonLabel position="fixed">
                      <small>Email</small>
                    </IonLabel>
                    <IonInput
                      type="text"
                      value={email}
                      readonly={!editing}
                      onIonChange={(event) => setEmail(event.detail.value!)}
                    />
                  </IonItem>
                </IonList>

                <IonButton
                  className="ion-margin"
                  color="danger"
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
              </IonCardContent>
            </IonCard>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
