import React, { useState, useEffect, useContext, useRef } from "react";
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
  IonModal,
  IonTextarea,
  IonText,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import "./NewWalk.css";
import WalkTutorial from "../components/WalkTutorial";
import PageHeader from "../components/PageHeader";
// import WalkPreSettings from "../components/WalkPreSettings";
// import WalkInProgress from "../components/WalkInProgress";
// import WalkPostSettings from "../components/WalkPostSettings";
// import AddMoment from "../components/AddMoment";
import { Filesystem, FilesystemDirectory, Plugins } from "@capacitor/core";
import { Pedometer } from "@ionic-native/pedometer";
import Progress from "../components/Progress";

import { Location, Moment, Photo, Time } from "../data/models";
import WalksContext from "../data/walks-context";
import {
  generateHslaColors,
  getFriendlyTimeOfDay,
  getFriendlyWalkDescriptor,
  getMinAndSec,
  getTimeDiff,
} from "../helpers";

import {
  checkmark as finishIcon,
  close as cancelIcon,
  chevronDown as chevronDownIcon,
  flagOutline as flagIcon,
  map as mapIcon,
} from "ionicons/icons";
import ImagePicker from "../components/ImagePicker";
import { base64FromPath } from "@ionic/react-hooks/filesystem";

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

  const getLocationBackground = async () => {
    try {
      const position = await Geolocation.getCurrentPosition();
      const currentLocation: Location = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
        timestamp: position.timestamp,
      };
      setCurrentLocation(currentLocation);
    } catch (e) {
      setCurrentLocation(null);
    }
  };

  useEffect(() => {
    if (currentLocation !== undefined) {
      if (!start) {
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
      ticker = setInterval(() => {
        const timeDiff = getTimeDiff(start, new Date().toISOString());
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
        distance,
        moments
        // locations
      );
    }
  }, [end]);

  // Walk view state - Finished Walking
  const saveHandler = (description: string) => {
    console.log("should update description and cover");
    history.replace("/app/home");
  };

  // Add Moment
  const [moments, setMoments] = useState<Moment[]>([]);
  const [note, setNote] = useState<string>("");
  const [location, setLocation] = useState<Location | null | undefined>(
    undefined
  );
  const [addMomentModal, setAddMomentModal] = useState<boolean>(false);
  const [addMomentCurrent, setAddMomentCurrent] = useState<string>("");
  const [takenPhoto, setTakenPhoto] = useState<Photo | null>(null);
  const [takenPhotoPath, setTakenPhotoPath] = useState<string>("");

  const filePickerChildRef = useRef();

  const addMomentHandler = (type: string) => {
    setAddMomentModal(true);
    setAddMomentCurrent(type);
    getLocationBackground();
  };

  const photoPickHandler = (photo: Photo | null) => {
    if (photo) {
      savePhoto(photo).then((path) => {
        setTakenPhotoPath(path);
      });
    }
    setTakenPhoto(photo);
  };

  const savePhoto = async (photo: Photo) => {
    const base64 = await base64FromPath(photo.preview);
    let fileName = new Date().getTime() + ".jpeg";
    Filesystem.writeFile({
      path: fileName,
      data: base64,
      directory: FilesystemDirectory.Data,
    });
    return fileName;
  };

  const resetMoments = () => {
    setMoments([]);
  };

  const saveMomentHandler = () => {
    const newMoment: Moment = {
      imagePath: takenPhotoPath,
      note: note,
      location: currentLocation!,
    };
    setMoments([...moments, newMoment]);
    clearMomentHandler();
  };

  const viewMapHandler = async () => {
    console.log("View map");
  };

  const clearMomentHandler = () => {
    setNote("");
    setTakenPhoto(null);
    setTakenPhotoPath("");
    setAddMomentModal(false);
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
                  {/* 
                  *
                  *
                  Progress
                  *
                  *
                  */}
                  <Progress time={time} distance={distance} steps={steps} />
                  {/* 
                  *
                  *
                  Add Moment
                  *
                  *
                  */}
                  <IonCard className="moment-panel ion-no-margin">
                    <IonCardContent>
                      <IonGrid>
                        <IonRow>
                          <IonCol
                            onClick={() => {
                              addMomentHandler("Photo");
                            }}
                          >
                            <img src="assets/img/icon-camera.svg" alt="" />
                            <h3 className="text-heading ion-text-center">
                              <strong>Add Photo</strong>
                            </h3>
                          </IonCol>
                          <IonCol
                            onClick={() => {
                              addMomentHandler("Audio");
                            }}
                          >
                            <img src="assets/img/icon-audio.svg" alt="" />
                            <h3 className="text-heading ion-text-center">
                              <strong>Add Sound</strong>
                            </h3>
                          </IonCol>
                          <IonCol
                            onClick={() => {
                              addMomentHandler("Note");
                            }}
                          >
                            <img src="assets/img/icon-note.svg" alt="" />
                            <h3 className="text-heading ion-text-center">
                              <strong>Add Note</strong>
                            </h3>
                          </IonCol>
                        </IonRow>
                      </IonGrid>

                      <IonModal isOpen={addMomentModal}>
                        <div className="constrain constrain--medium">
                          <IonCard color="medium">
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
                                Add {addMomentCurrent}
                              </IonCardSubtitle>
                            </IonCardHeader>
                            <IonCardContent className="ion-no-padding">
                              {addMomentCurrent === "Photo" && (
                                <ImagePicker
                                  onImagePick={photoPickHandler}
                                  ref={filePickerChildRef}
                                ></ImagePicker>
                              )}
                              {addMomentCurrent === "Audio" && (
                                <IonItem>
                                  <IonLabel position="floating">
                                    Add a sound...
                                  </IonLabel>
                                </IonItem>
                              )}
                              {addMomentCurrent === "Note" && (
                                <div>
                                  <IonLabel hidden={true}>
                                    Add a note...
                                  </IonLabel>
                                  <IonTextarea
                                    placeholder="A thought or description..."
                                    autoGrow={true}
                                    maxlength={280}
                                    rows={4}
                                    style={{
                                      padding: "10px 20px",
                                      backgroundColor: "white",
                                    }}
                                    value={note}
                                    onIonChange={(event) => {
                                      setNote(event.detail.value!);
                                    }}
                                  ></IonTextarea>
                                  <p className="ion-padding">
                                    <small>
                                      {280 - note.length} characters remaining
                                    </small>
                                  </p>
                                </div>
                              )}
                            </IonCardContent>

                            <IonCardHeader
                              className="ion-no-padding"
                              color="light"
                            >
                              <IonGrid>
                                <IonRow>
                                  <IonCol size="5">
                                    <IonButton
                                      expand="block"
                                      color="danger"
                                      onClick={() => {
                                        if (note.length > 0) {
                                          setCancelAlert(true);
                                        } else {
                                          setAddMomentModal(false);
                                        }
                                      }}
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
                                          handler: clearMomentHandler,
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
                                        saveMomentHandler();
                                      }}
                                    >
                                      <IonIcon slot="start" icon={finishIcon} />
                                      Add {addMomentCurrent}
                                    </IonButton>
                                  </IonCol>
                                </IonRow>
                              </IonGrid>
                            </IonCardHeader>
                          </IonCard>
                        </div>
                      </IonModal>

                      {moments.length > 0 ? (
                        <IonGrid>
                          <IonRow>
                            <IonCol size="12" className="ion-text-center">
                              {moments.length > 0 && (
                                <IonText className="text-body">
                                  <p>
                                    <IonIcon
                                      icon={flagIcon}
                                      className="icon-large"
                                    />
                                  </p>
                                  {moments.length} moment
                                  {moments.length !== 1 && "s"}
                                  <p>
                                    <IonIcon
                                      icon={chevronDownIcon}
                                      className="icon-small"
                                    />
                                  </p>
                                </IonText>
                              )}
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol
                              className="ion-no-margin ion-no-padding"
                              size="12"
                              sizeSm="8"
                              offsetSm="2"
                            >
                              <IonButton
                                expand="block"
                                onClick={viewMapHandler}
                              >
                                <IonIcon slot="start" icon={mapIcon} />
                                View on Map
                              </IonButton>
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      ) : (
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
                                Record anything that draws your attention, or
                                that you see or hear.
                              </p>
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      )}
                    </IonCardContent>
                    <IonLoading
                      message={"Getting your location..."}
                      isOpen={loading}
                    />
                  </IonCard>
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
