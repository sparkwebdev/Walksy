// @ts-nocheck
import React, { useState, useEffect } from "react";
import { IonPage, IonContent, IonToast } from "@ionic/react";
import "./NewWalk.css";
import WalkTutorial from "../components/WalkTutorial";
import PageHeader from "../components/PageHeader";
import WalkPreSettings from "../components/WalkPreSettings";
import WalkInProgress from "../components/WalkInProgress";
import WalkPostSettings from "../components/WalkPostSettings";
import { Plugins } from "@capacitor/core";

import { Location, Time } from "../data/models";

const { Storage } = Plugins;

const NewWalk: React.FC = () => {
  // Walk view state - Tutorial
  const [showTutorial, setShowTutorial] = useState<boolean | undefined>(
    undefined
  );

  const finishTutorialHandler = () => {
    setShowTutorial(false);
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

  // Walk view state - Is Walking
  // const [isWalking, setIsWalking] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [colour, setColour] = useState<string>("");
  const [start, setStart] = useState<string>("");
  const [startLocation, setStartLocation] = useState<Location | null>();
  const [time, setTime] = useState<Time>({
    min: 0,
    sec: 0,
  });
  const [steps, setSteps] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [endLocation, setEndLocation] = useState<Location | null>();
  const [end, setEnd] = useState<string>("");

  const startHandler = (
    title: string,
    colour: string,
    location?: Location | null
  ) => {
    if (location !== undefined) {
      setStartLocation(location);
    } else {
      setError({
        showError: true,
        message: "Cannot get your location",
      });
    }
    setTitle(title);
    setColour(colour);
    setStart(new Date().toISOString());
  };

  const finishHandler = (
    time: Time,
    steps: number,
    distance: number,
    endLocation?: Location | null
  ) => {
    if (endLocation !== undefined) {
      setEndLocation(endLocation);
    } else {
      setError({
        showError: true,
        message: "Cannot get your location",
      });
    }
    setTime(time);
    setSteps(steps);
    setDistance(distance);
    setEnd(new Date().toISOString());
  };

  const cancelHandler = () => {
    setStart("");
    setEnd("");
  };

  // Walk view state - Finished Walking
  const saveHandler = (description: string) => {
    const saveObject = {
      takenPhoto: null,
      title,
      colour,
      description,
      type: "user",
      start,
      end,
      steps,
      distance,
      startLocation,
      endLocation,
    };
    console.log(saveObject);
  };

  const [error, setError] = useState<{
    showError: boolean;
    message?: string;
  }>({ showError: false });

  return (
    <IonPage>
      <PageHeader title="Walk" />
      <IonContent>
        {showTutorial && <WalkTutorial onFinish={finishTutorialHandler} />}
        {!start && !end && showTutorial === false && (
          <WalkPreSettings onStart={startHandler} />
        )}
        {start && !end && (
          <WalkInProgress
            title={title}
            colour={colour}
            onCancel={cancelHandler}
            onFinish={finishHandler}
          />
        )}
        {start && end && (
          <WalkPostSettings
            title={title}
            colour={colour}
            start={start}
            end={end}
            time={time}
            distance={distance}
            steps={steps}
            onSave={saveHandler}
          />
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
