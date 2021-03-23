import React, { useState, useEffect, useContext } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardSubtitle,
  IonCardContent,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonCardTitle,
  IonLabel,
} from "@ionic/react";
import { Plugins } from "@capacitor/core";
import WalkTutorial from "../components/WalkTutorial";
import PageHeader from "../components/PageHeader";
import { useHistory } from "react-router-dom";
import {
  generateHslaColors,
  getFriendlyTimeOfDay,
  getFriendlyWalkDescriptor,
} from "../helpers";
import WalksContext from "../data/walks-context";
import { useAuth } from "../auth";

const { Storage } = Plugins;

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

const titleMaxLength = 40;

const NewWalk: React.FC = () => {
  const history = useHistory();
  const { userId } = useAuth();

  const walksCtx = useContext(WalksContext);

  const [title, setTitle] = useState<string>(suggestedTitle());
  const [colour, setColour] = useState<string>(colours[0]);

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

  const startWalkHandler = () => {
    walksCtx.reset(); // To Do — check for existing data (previous walk) and handle?
    const generatedWalkId = new Date().getTime().toString();

    walksCtx.updateWalk({
      walkId: generatedWalkId,
      title,
      colour,
      userId,
    });

    history.push({
      pathname: `/walking`,
      state: { walkId: generatedWalkId, title: title, colour: colour },
    });
  };

  return (
    <IonPage>
      <PageHeader
        title="New Walk"
        showTool={!showTutorial}
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
          color="medium"
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
              <IonCardContent
                className="ion-no-padding constrain constrain--medium"
                style={{ margin: "auto" }}
              >
                <div className="ion-text-center ion-padding">
                  <IonCardSubtitle className="sub-title">
                    Step 1:
                  </IonCardSubtitle>
                  <IonCardTitle className="title text-heading">
                    Give this walk a title...
                  </IonCardTitle>
                  <IonLabel className="ion-hide">Walk title...</IonLabel>
                  <IonInput
                    type="text"
                    value={title}
                    maxlength={titleMaxLength}
                    onIonChange={(event) => setTitle(event.detail.value as any)}
                    className="input-text"
                  />
                  <p className="small-print">
                    {titleMaxLength - title.length} characters remaining
                  </p>
                </div>
                <div className="ion-text-center ion-padding">
                  <IonCardSubtitle className="sub-title">
                    Step 2:
                  </IonCardSubtitle>
                  <IonCardTitle className="title text-heading">
                    Choose a colour...
                  </IonCardTitle>
                  <IonGrid className="swatches ion-justify-content-center ion-padding">
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
                  <IonInput
                    type="text"
                    value={colour}
                    className="swatches__colour swatches__colour--output"
                    onIonChange={() => setColour(colour)}
                    disabled={true}
                    hidden={true}
                  ></IonInput>
                </div>
                <div className="ion-text-center ion-padding">
                  <IonCardSubtitle className="sub-title">
                    Step 3:
                  </IonCardSubtitle>
                  <IonGrid>
                    <IonRow>
                      <IonCol size="8" offset="2">
                        <IonButton
                          expand="block"
                          disabled={title === ""}
                          onClick={startWalkHandler}
                          color="success"
                        >
                          Start Walk
                        </IonButton>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </div>
              </IonCardContent>
            </>
          )}
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default NewWalk;
