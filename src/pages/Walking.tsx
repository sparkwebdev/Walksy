import React, { useState, useEffect, useContext } from "react";
import {
  IonPage,
  IonContent,
  IonToast,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonLoading,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonAlert,
  IonFab,
  IonFabButton,
  IonFabList,
  IonText,
  IonCardContent,
  IonList,
  IonItem,
} from "@ionic/react";
import "../components/ImagePicker.css";
import { Plugins } from "@capacitor/core";
import PageHeader from "../components/PageHeader";
import Progress from "../components/Progress";
import { Redirect, useLocation } from "react-router-dom";

import { Location, Moment } from "../data/models";
import WalksContext from "../data/walks-context";

import { useAuth } from "../auth";
import NewWalkAddMoment from "./NewWalkAddMoment";
import NewWalkPost from "./NewWalkPost";
import { useHistory } from "react-router-dom";
import {
  checkmark as finishIcon,
  close as cancelIcon,
  add as addIcon,
  // chevronForward as rightArrowIcon,
  // chevronDown as downArrowIcon,
  // chevronBack as leftArrowIcon,
  image as imageIcon,
  // camera as cameraIcon,
  mic as audioIcon,
  chatbubbleEllipses as noteIcon,
} from "ionicons/icons";

const { Geolocation } = Plugins;

interface LocationState {
  title: string;
  colour: string;
}

const Walking: React.FC = () => {
  const { loggedIn } = useAuth();
  const location = useLocation<LocationState>();
  const { title } = location.state || "";
  const { colour } = location.state || "";

  const walksCtx = useContext(WalksContext);
  const { userId } = useAuth();
  const history = useHistory();

  // Global (View) states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<{
    showError: boolean;
    message?: string;
  }>({ showError: false });

  // Global (Walk) states
  const [start, setStart] = useState<string>("");
  const [steps, setSteps] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [locations, setLocations] = useState<Location[] | []>([]);
  const [moments, setMoments] = useState<Moment[]>([]);
  // const [coverImage, setCoverImage] = useState("");
  const [end, setEnd] = useState<string>("");
  const [showPrompt, setShowPrompt] = useState(true);

  const [cancelWalkAlert, setCancelWalkAlert] = useState(false);

  useEffect(() => {
    getLocation().then(() => {
      setStart(new Date().toISOString());
    });
  }, []);

  const getLocation = async (showLoading: boolean = true) => {
    if (showLoading) {
      setLoading(true);
    }
    try {
      const position = await Geolocation.getCurrentPosition({
        timeout: 3000,
      });
      const location: Location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      if (location !== null) {
        setLocations([...locations, location]);
      }
      setLoading(false);
      return location;
    } catch (e) {
      setLoading(false);
      setError({ showError: true, message: "Could not get your location" });
      return null;
    }
  };

  const resetWalkHandler = () => {
    setStart("");
    setEnd("");
  };

  const endWalkHandler = () => {
    getLocation().then(() => {
      setEnd(new Date().toISOString());
    });
  };

  // Update state handlers
  const updateWalkStepsDistance = (steps: number, distance: number) => {
    setSteps(steps);
    setDistance(distance);
  };
  const updateWalkMoments = (moments: Moment[]) => {
    setMoments(moments);
  };

  const saveWalkHandler = async (
    description: string,
    coverImage: string,
    share: boolean
  ) => {
    setLoading(true);
    try {
      const storedWalkId = await walksCtx.saveWalk(
        title,
        colour,
        description,
        start,
        end,
        steps,
        distance,
        moments,
        coverImage,
        locations,
        userId!
      );
      setLoading(false);
      history.push({
        pathname: `/app/walk/${storedWalkId}`,
        state: { share: share },
      });
    } catch (error) {
      console.log("Could not save walk");
    }
  };

  if (!loggedIn || !title) {
    return <Redirect to="/" />;
  }

  return (
    <IonPage>
      {/* <PageHeader title="New Walk" /> */}
      <IonContent
      // scrollY={false}
      // style={{
      //   margin: "auto",
      // }}
      >
        <IonFab vertical="bottom" slot="fixed" edge horizontal="center">
          {moments.length < 1 && showPrompt && (
            <div className="tooltip text-body">Add a moment...</div>
          )}

          <IonFabButton
            onClick={() => {
              setShowPrompt(false);
            }}
          >
            <IonIcon icon={addIcon} />
          </IonFabButton>
          <IonFabList
            side="start"
            style={{ transform: "translate(-5px, -45px)" }}
          >
            <IonFabButton color="dark" style={{ transform: "scale(1.2)" }}>
              <IonIcon icon={audioIcon} />
            </IonFabButton>
            {/* <IonText className="sub-title">Audio</IonText> */}
          </IonFabList>
          <IonFabList side="top" style={{ transform: "translateY(-25px)" }}>
            <IonFabButton color="dark" style={{ transform: "scale(1.2)" }}>
              <IonIcon icon={noteIcon} />
            </IonFabButton>
            {/* <IonIcon icon={downArrowIcon} /> */}
            {/* <IonText className="sub-title">Note</IonText> */}
          </IonFabList>
          <IonFabList side="end" style={{ transform: "translate(5px, -45px)" }}>
            <IonFabButton color="dark" style={{ transform: "scale(1.2)" }}>
              <IonIcon icon={imageIcon} />
            </IonFabButton>
            {/* <IonText className="sub-title">Photo</IonText> */}
          </IonFabList>
        </IonFab>
        <IonCard
          color="medium"
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
          className="ion-no-margin"
        >
          {/* Header */}
          <IonCardHeader
            className="ion-no-padding"
            style={{
              backgroundColor: colour,
            }}
          >
            <IonCardSubtitle className="ion-padding ion-no-margin ion-text-uppercase ion-text-center">
              {title ? title : "Start your walk..."}
            </IonCardSubtitle>
          </IonCardHeader>

          {/* Walk In Progress view state */}
          {start && !end && (
            <>
              {/* Progress */}
              <div className="constrain constrain--large">
                <Progress
                  start={start}
                  updateWalk={(steps: number, distance: number) =>
                    updateWalkStepsDistance(steps, distance)
                  }
                />
              </div>

              {/* Add Moment */}
              {moments.length > 0 ? (
                {
                  /* <NewWalkAddMoment
                updateWalk={(moments: Moment[]) => updateWalkMoments(moments)}
                resetWalk={resetWalkHandler}
                endWalk={endWalkHandler}
                getLocation={getLocation}
              /> */
                }
              ) : (
                <IonCard
                  style={{ margin: "auto" }}
                  className="constrain constrain--medium"
                >
                  <IonCardContent>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="12" className="ion-text-center">
                          <IonText className="ion-margin-bottom">
                            <h1 className="text-heading">
                              What do you notice as&nbsp;you&nbsp;walk?
                            </h1>
                          </IonText>
                          <p
                            className="text-body"
                            style={{
                              marginTop: "10px",
                            }}
                          >
                            Record anything that draws your attention, or that
                            you see or hear.
                          </p>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
              )}
            </>
          )}

          {/* Walk Finished view state */}
          {start && end && (
            <NewWalkPost
              updateWalk={(
                description: string,
                coverImage: string,
                share: boolean
              ) => saveWalkHandler(description, coverImage, share)}
              moments={moments}
              start={start}
              end={end}
              steps={steps}
              distance={distance}
            />
          )}
        </IonCard>
      </IonContent>
      <IonCardHeader
        className="ion-no-padding"
        color="light"
        style={{
          marginTop: "auto",
          paddingTop: "0.8em",
          paddingBottom: "20px",
        }}
      >
        <IonCardSubtitle className="ion-no-margin constrain constrain--medium">
          <IonGrid>
            <IonRow>
              <IonCol size="5">
                <IonButton
                  expand="block"
                  color="danger"
                  fill="clear"
                  onClick={() => setCancelWalkAlert(true)}
                >
                  <IonIcon slot="start" icon={cancelIcon} />
                  Cancel
                </IonButton>
                <IonAlert
                  header={"End this walk?"}
                  subHeader={"Finish and lose changes?"}
                  buttons={[
                    {
                      text: "No",
                      role: "cancel",
                    },
                    {
                      text: "Yes",
                      cssClass: "secondary",
                      // handler: resetWalk,
                    },
                  ]}
                  isOpen={cancelWalkAlert}
                  onDidDismiss={() => setCancelWalkAlert(false)}
                />
              </IonCol>
              <IonCol offset="2" size="5">
                <IonButton
                  expand="block"
                  color="success"
                  fill="clear"
                  onClick={endWalkHandler}
                >
                  <IonIcon slot="start" icon={finishIcon} size="large" />
                  <big>
                    <strong>Finish</strong>
                  </big>
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardSubtitle>
      </IonCardHeader>

      <IonLoading message={"Loading..."} isOpen={loading} />
      <IonToast
        duration={2000}
        position="bottom"
        isOpen={error.showError}
        onDidDismiss={() => setError({ showError: false, message: undefined })}
        message={error.message}
      />
    </IonPage>
  );
};

export default Walking;
