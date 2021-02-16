import React, { useState, useEffect } from "react";
import { IonPage, IonContent, IonToast } from "@ionic/react";
import "./NewWalk.css";
import PageHeader from "../components/PageHeader";
import WalkTutorial from "../components/WalkTutorial";
import { Plugins } from "@capacitor/core";

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

  const [error, setError] = useState<{
    showError: boolean;
    message?: string;
  }>({ showError: false });

  return (
    <IonPage>
      <PageHeader title="Walk" />
      <IonContent>
        {showTutorial && <WalkTutorial onFinish={finishTutorialHandler} />}
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
