import React, { useState, useEffect } from "react";
import { IonPage, IonContent, IonToast } from "@ionic/react";
import "./NewWalk.css";
import PageHeader from "../components/PageHeader";
import WalkTutorial from "../components/WalkTutorial";
import WalkPreSettings from "../components/WalkPreSettings";
import { Plugins } from "@capacitor/core";
import { Pedometer } from "@ionic-native/pedometer";

import { Location, Time } from "../data/models";
import { getMinAndSec } from "../helpers";

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
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<string>("");
  const [walkTitle, setWalkTitle] = useState<string>("");
  const [walkColour, setWalkColour] = useState<string>("");
  const [startLocation, setStartLocation] = useState<Location | null>();
  const [time, setTime] = useState<Time>({
    min: 0,
    sec: 0,
  });
  const [steps, setSteps] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);

  const startWalkHandler = (
    walkTitle: string,
    walkColour: string,
    location?: Location | null
  ) => {
    if (location) {
      setStartLocation(location);
    } else {
      setError({
        showError: true,
        message: "Cannot get your location",
      });
    }
    setWalkTitle(walkTitle);
    setWalkColour(walkColour);
    setStartTime(new Date().toISOString());
    setIsWalking(true);
  };

  useEffect(() => {
    let ticker: number;
    let seconds: number = 0;
    if (isWalking) {
      ticker = window.setTimeout(() => {
        seconds++;
        const minAndSec = getMinAndSec(seconds);
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
      setIsWalking(false);
    };
  }, [isWalking]);

  const [error, setError] = useState<{
    showError: boolean;
    message?: string;
  }>({ showError: false });

  return (
    <IonPage>
      <PageHeader title="Walk" />
      <IonContent>
        {showTutorial && <WalkTutorial onFinish={finishTutorialHandler} />}
        {!isWalking && showTutorial === false && (
          <WalkPreSettings onStart={startWalkHandler} />
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
