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

const { Storage, Geolocation } = Plugins;

const NewWalk: React.FC = () => {
  const walksCtx = useContext(WalksContext);
  const { userId } = useAuth();

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
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
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

  const saveWalkHandler = async () => {
    setLoading(true);
    await walksCtx.saveWalk(
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
  };

  useEffect(() => {
    if (end) {
      saveWalkHandler();
    }
  }, [end]);

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
  const updateWalkDescriptionCoverImage = (
    description: string,
    coverImage: string
  ) => {
    setDescription(description);
    setCoverImage(coverImage);
  };

  return (
    <IonPage>
      <PageHeader
        title="New Walk"
        back={!start && !end}
        showTool={!start && !end && !showTutorial}
        toolText="Help"
        toolAction={getHelpHandler}
      />
      <IonContent
        scrollY={false}
        style={{
          margin: "auto",
        }}
      >
        <IonCard
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
                    endWalk={endWalkHandler}
                    updateWalk={(moments: Moment[]) =>
                      updateWalkMoments(moments)
                    }
                    getLocation={getLocation}
                  />
                </>
              )}

              {/* Walk Finished view state */}
              {start && end && (
                <NewWalkPost
                  updateWalk={(description: string, coverImage: string) =>
                    updateWalkDescriptionCoverImage(description, coverImage)
                  }
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
