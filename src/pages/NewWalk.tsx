import React, { useState, useEffect, useContext } from "react";
import {
  IonPage,
  IonContent,
  IonToast,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonLoading,
  IonButton,
  IonIcon,
  IonAlert,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import "./NewWalk.css";
import WalkTutorial from "../components/WalkTutorial";
import PageHeader from "../components/PageHeader";
// import WalkPreSettings from "../components/WalkPreSettings";
// import WalkInProgress from "../components/WalkInProgress";
// import WalkPostSettings from "../components/WalkPostSettings";
import { Plugins } from "@capacitor/core";
import { Pedometer } from "@ionic-native/pedometer";
import Progress from "../components/Progress";
import AddMoment from "../components/AddMoment";

import { Location, Time } from "../data/models";
import WalksContext from "../data/walks-context";
import {
  generateHslaColors,
  getFriendlyTimeOfDay,
  getFriendlyWalkDescriptor,
  getMinAndSec,
  getTimeDiff,
} from "../helpers";

import { checkmark as finishIcon, close as cancelIcon } from "ionicons/icons";

const { Storage } = Plugins;
const { Geolocation } = Plugins;

const suggestedTitle = () => {
  return `${getFriendlyTimeOfDay()} ${getFriendlyWalkDescriptor()}`;
};

let colours = generateHslaColors(14, undefined, undefined, true);
function shift(arr: any) {
  const shiftByRandom = Math.floor(Math.random() * colours.length);
  return arr.map(
    (_: any, i: any, a: any) => a[(i + a.length - shiftByRandom) % a.length]
  );
}
colours = shift(colours);

const NewWalk: React.FC = () => {
  const history = useHistory();
  const walksCtx = useContext(WalksContext);

  // Global (View) states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<{
    showError: boolean;
    message?: string;
  }>({ showError: false });

  // Global (Walk) states
  const [title, setTitle] = useState<string>(suggestedTitle());
  const [colour, setColour] = useState<string>(colours[0]);
  const [start, setStart] = useState<string>("");
  const [currentLocation, setCurrentLocation] = useState<
    Location | null | undefined
  >(undefined);
  const [locations, setLocations] = useState<Location[]>([]);
  const [time, setTime] = useState<Time>({
    min: 0,
    sec: 0,
  });
  const [steps, setSteps] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [end, setEnd] = useState<string>("");

  // Walk view state - Tutorial
  const [showTutorial, setShowTutorial] = useState<boolean | undefined>(
    undefined
  );
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const finishTutorialHandler = () => {
    setShowTutorial(false);
    setShowHelp(false);
    Storage.set({
      key: "showWalkTutorial",
      value: JSON.stringify(false),
    });
  };

  useEffect(() => {
    Storage.get({
      key: "showWalkTutorial",
    }).then((data) => {
      setShowTutorial(data.value ? JSON.parse(data.value) : true);
    });
  }, [showTutorial]);

  const getHelpHandler = () => {
    setShowHelp(true);
  };

  // Walk view state - Pre Walking

  // Walk view state - Is Walking
  const [cancelAlert, setCancelAlert] = useState(false);

  const cancelHandler = () => {
    setLocations([]);
    setStart("");
    setEnd("");
  };

  const endHandler = () => {
    getLocation();
    setEnd(new Date().toISOString());
  };

  const getLocation = async () => {
    setLoading(true);
    try {
      const position = await Geolocation.getCurrentPosition();
      const currentLocation: Location = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
        timestamp: position.timestamp,
      };
      setCurrentLocation(currentLocation);
      setLoading(false);
    } catch (e) {
      setCurrentLocation(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentLocation !== undefined) {
      if (!start) {
        walksCtx.resetMoments();
        setStart(new Date().toISOString());
      }
      if (
        currentLocation !== null &&
        currentLocation !== locations[locations.length - 1]
      ) {
        setLocations([...locations, currentLocation]);
      }
    }
  }, [currentLocation]);

  useEffect(() => {
    let ticker: any = null;
    if (start) {
      // let seconds: number = 0;
      ticker = setInterval(() => {
        // seconds++;
        const timeDiff = getTimeDiff(start, new Date().toISOString());
        // const minAndSec = getMinAndSec(seconds);
        const minAndSec = getMinAndSec(timeDiff);
        setTime(minAndSec);
      }, 1000);
      Pedometer.startPedometerUpdates().subscribe((data) => {
        setSteps(data.numberOfSteps);
        setDistance(data.distance / 1000); // metres to km
      });
    }
    return () => {
      clearInterval(ticker);
      Pedometer.stopPedometerUpdates();
    };
  }, [start]);

  useEffect(() => {
    if (end) {
      walksCtx.addWalk(
        title,
        colour,
        description,
        "user",
        start,
        end,
        steps,
        distance
        // [startLocation, endLocation]
      );
    }
  }, [end]);

  // Walk view state - Finished Walking
  const saveHandler = (description: string) => {
    console.log("should update description and cover");
    history.replace("/app/home");
  };

  return (
    <IonPage>
      {!start && !end && (
        <PageHeader
          title="Walk"
          back={!start && !end}
          showTool={!start && !end && !showTutorial}
          toolText="Help"
          toolAction={getHelpHandler}
        />
      )}
      <IonContent>
        {/* 
        *
        *
        Tutorial view state
        *
        *
        */}
        {(showTutorial || showHelp) && (
          <WalkTutorial onFinish={finishTutorialHandler} />
        )}
        {/* 
        *
        *
        Pre Walk view state
        *
        *
        */}
        {!start && !end && showTutorial === false && !showHelp && (
          <div className="centered-content">
            <div className="constrain constrain--medium">
              <IonCard>
                <IonCardHeader
                  className="ion-no-padding"
                  style={{
                    backgroundColor: colour,
                  }}
                >
                  <IonCardSubtitle
                    className="ion-padding ion-no-margin ion-text-uppercase ion-text-center"
                    color="dark"
                  >
                    Start your walk...
                  </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent className="ion-no-padding">
                  <IonList>
                    <IonItem className="ion-margin-top">
                      <IonLabel position="stacked">
                        Give this walk a title...
                      </IonLabel>
                      <IonInput
                        type="text"
                        value={title}
                        maxlength={40}
                        onIonChange={(event) => setTitle(event.detail!.value!)}
                      />
                    </IonItem>
                    <p className="ion-padding-start">
                      <small>{40 - title.length} characters remaining</small>
                    </p>
                  </IonList>
                  <IonList lines="none">
                    <IonItem className="ion-margin-top">
                      <IonLabel position="stacked">
                        Give this walk a colour...
                      </IonLabel>
                      <IonGrid
                        className="swatches ion-margin-top ion-justify-content-center"
                        style={{ backgroundColor: "var(--ion-color-light)" }}
                      >
                        <IonRow className="ion-justify-content-between">
                          {colours.map((current) => {
                            return (
                              <IonCol
                                className={
                                  current === colour
                                    ? "swatches__colour swatches__colour--chosen"
                                    : "swatches__colour"
                                }
                                key={current}
                                style={{
                                  background: current,
                                }}
                                onClick={() => {
                                  setColour(current);
                                }}
                              ></IonCol>
                            );
                          })}
                        </IonRow>
                      </IonGrid>
                    </IonItem>
                    <IonItem
                      lines="none"
                      className="ion-hide ion-margin-bottom"
                    >
                      <IonInput
                        type="text"
                        value={colour}
                        className="swatches__colour swatches__colour--output"
                        onIonChange={() => setColour(colour)}
                        disabled={true}
                        hidden={true}
                      ></IonInput>
                    </IonItem>
                  </IonList>
                </IonCardContent>
                <IonCardHeader
                  className="ion-margin-top ion-no-padding"
                  color="light"
                >
                  <IonCardSubtitle>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="12" sizeSm="8" offsetSm="2">
                          <IonButton
                            expand="block"
                            disabled={title === ""}
                            onClick={() => {
                              getLocation();
                            }}
                          >
                            Start
                          </IonButton>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            </div>
            <IonLoading message={"Getting your location..."} isOpen={loading} />
          </div>
        )}
        {/* 
        *
        *
        Walk In Progress view state
        *
        *
        */}
        {start && !end && (
          <div className="centered-content">
            <div className="constrain constrain--medium">
              <IonCard>
                <IonCardHeader
                  className="ion-no-padding"
                  style={{
                    backgroundColor: colour,
                  }}
                >
                  <IonCardSubtitle
                    className="ion-padding ion-no-margin ion-text-uppercase ion-text-center"
                    color="dark"
                  >
                    {title}
                  </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent className="ion-no-padding">
                  <Progress time={time} distance={distance} steps={steps} />
                  {/* <AddMoment colour={colour} /> */}
                </IonCardContent>
                <IonCardHeader className="ion-no-padding" color="light">
                  <IonGrid>
                    <IonRow>
                      <IonCol size="5">
                        <IonButton
                          expand="block"
                          color="danger"
                          onClick={() => setCancelAlert(true)}
                        >
                          <IonIcon slot="start" icon={cancelIcon} />
                          Cancel
                        </IonButton>
                        <IonAlert
                          header={"Cancel"}
                          subHeader={"Are you sure?"}
                          buttons={[
                            {
                              text: "No",
                              role: "cancel",
                            },
                            {
                              text: "Yes",
                              cssClass: "secondary",
                              handler: cancelHandler,
                            },
                          ]}
                          isOpen={cancelAlert}
                          onDidDismiss={() => setCancelAlert(false)}
                        />
                      </IonCol>
                      <IonCol size="7">
                        <IonButton
                          expand="block"
                          color="success"
                          onClick={() => {
                            endHandler();
                          }}
                        >
                          <IonIcon slot="start" icon={finishIcon} />
                          End Walk
                        </IonButton>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardHeader>
              </IonCard>
            </div>
            <IonLoading message={"Getting your location..."} isOpen={loading} />
          </div>
        )}
        {/* 
        *
        *
        Walk Finished view state
        *
        *
        */}
        {start && end && (
          // <WalkPostSettings
          //   title={title}
          //   colour={colour}
          //   start={start}
          //   end={end}
          //   time={time}
          //   distance={distance}
          //   steps={steps}
          //   onSave={saveHandler}
          // />
          <div className="centered-content">
            <div className="constrain constrain--medium">
              <IonCard>
                <IonCardHeader
                  className="ion-no-padding"
                  style={{
                    backgroundColor: colour,
                  }}
                >
                  <IonCardSubtitle className="ion-padding ion-no-margin ion-text-uppercase ion-text-center">
                    Well done!
                  </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent className="ion-no-padding">
                  <Progress time={time} distance={distance} steps={steps} />
                  <IonList>
                    <IonItem className="ion-margin-top">
                      <IonLabel position="stacked">
                        Give this walk a short description...
                      </IonLabel>
                      <IonInput
                        type="text"
                        value={description}
                        onIonChange={(event) =>
                          setDescription(event.detail!.value!)
                        }
                      />
                    </IonItem>
                  </IonList>
                </IonCardContent>
                <IonCardHeader
                  className="ion-margin-top ion-no-padding"
                  color="light"
                >
                  <IonCardSubtitle>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="12" sizeSm="8" offsetSm="2">
                          <IonButton
                            expand="block"
                            color="success"
                            disabled={description === ""}
                            onClick={() => {
                              saveHandler(description);
                            }}
                          >
                            <IonIcon slot="start" icon={finishIcon} />
                            Save
                          </IonButton>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            </div>
          </div>
        )}
      </IonContent>
      <IonToast
        duration={3000}
        isOpen={error.showError}
        onDidDismiss={() => setError({ showError: false, message: undefined })}
        message={error.message}
      />
    </IonPage>
  );
};

export default NewWalk;
