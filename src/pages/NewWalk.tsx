import React, { useState, useEffect, useContext } from "react";
import {
  IonPage,
  IonContent,
  IonToast,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonLoading,
} from "@ionic/react";
import "./NewWalk.css";
import "../components/ImagePicker.css";
import { Plugins } from "@capacitor/core";
import WalkTutorial from "../components/WalkTutorial";
import PageHeader from "../components/PageHeader";
import Progress from "../components/Progress";

import { Location, Moment } from "../data/models";
import WalksContext from "../data/walks-context";

import { useAuth } from "../auth";
import NewWalkPre from "./NewWalkPre";
import NewWalkAddMoment from "./NewWalkAddMoment";
import NewWalkPost from "./NewWalkPost";
import { useHistory } from "react-router-dom";

const { Storage, Geolocation } = Plugins;

const NewWalk: React.FC = () => {
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
  const [title, setTitle] = useState<string>("");
  const [colour, setColour] = useState<string>("");
  const [start, setStart] = useState<string>("");
  const [steps, setSteps] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [locations, setLocations] = useState<Location[] | []>([]);
  const [moments, setMoments] = useState<Moment[]>([]);
  // const [coverImage, setCoverImage] = useState("");
  const [end, setEnd] = useState<string>("");

  // Walk view state - Tutorial
  const [showTutorial, setShowTutorial] = useState<boolean | undefined>(
    undefined
  );
  const [showTutorialText, setShowTutorialText] = useState<string>("Help");

  const [showHelp, setShowHelp] = useState<boolean>(false);

  const finishTutorialHandler = () => {
    setShowTutorial(false);
    setShowHelp(false);
    setShowTutorialText("Help");
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
    if (showHelp) {
      setShowHelp(false);
      setShowTutorialText("Help");
    } else {
      setShowHelp(true);
      setShowTutorialText("Close");
    }
  };

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

  const startWalkHandler = () => {
    getLocation().then(() => {
      setStart(new Date().toISOString());
    });
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
  const updateWalkTitleColour = (title: string, colour: string) => {
    setTitle(title);
    setColour(colour);
  };
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

  return (
    <IonPage>
      <PageHeader
        title="New Walk"
        // back={!start && !end}
        showTool={!start && !end && !showTutorial}
        toolText={showTutorialText}
        toolAction={getHelpHandler}
      />
      <IonContent
        scrollY={false}
        style={{
          margin: "auto",
        }}
      >
        <IonCard
          color="light"
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
          className="ion-no-margin"
        >
          {/* Tutorial view state */}
          {(showTutorial || showHelp) && (
            <WalkTutorial onFinish={finishTutorialHandler} />
          )}

          {/* Walk view states */}
          {showTutorial === false && !showHelp && (
            <>
              {/* Header */}
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
                  {title ? title : "Start your walk..."}
                </IonCardSubtitle>
              </IonCardHeader>

              {/* Pre Walk view state */}
              {!start && !end && (
                <NewWalkPre
                  startWalk={startWalkHandler}
                  updateWalk={(title: string, colour: string) =>
                    updateWalkTitleColour(title, colour)
                  }
                />
              )}

              {/* Walk In Progress view state */}
              {start && !end && (
                <>
                  {/* Progress */}
                  <Progress
                    start={start}
                    updateWalk={(steps: number, distance: number) =>
                      updateWalkStepsDistance(steps, distance)
                    }
                  />
                  {/* Add Moment */}
                  <NewWalkAddMoment
                    updateWalk={(moments: Moment[]) =>
                      updateWalkMoments(moments)
                    }
                    resetWalk={resetWalkHandler}
                    endWalk={endWalkHandler}
                    getLocation={getLocation}
                  />
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
            </>
          )}
        </IonCard>
      </IonContent>

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

export default NewWalk;
