import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import {
  generateHslaColors,
  getFriendlyTimeOfDay,
  getFriendlyWalkDescriptor,
} from "../helpers";
import { useHistory } from "react-router-dom";
import { close as cancelIcon } from "ionicons/icons";

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

const NewWalkPre: React.FC<{
  updateWalk: (title: string, colour: string) => void;
  startWalk: () => void;
}> = ({ updateWalk, startWalk }) => {
  const [title, setTitle] = useState<string>(suggestedTitle());
  const [colour, setColour] = useState<string>(colours[0]);
  const history = useHistory();

  useEffect(() => {
    updateWalk(title, colour);
  }, [title, colour, updateWalk]);

  return (
    <>
      <IonCardContent
        className="ion-no-padding constrain constrain--medium"
        style={{ margin: "auto" }}
      >
        <IonCard>
          <IonCardHeader className="ion-no-padding" color="dark">
            <IonCardSubtitle
              className="ion-padding ion-no-margin ion-text-uppercase ion-text-center"
              style={{
                color: "white",
              }}
            >
              Give this walk a title...
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent className="ion-no-padding">
            <IonList className="ion-padding-bottom">
              <IonItem>
                <IonLabel position="stacked" className="ion-hide">
                  Give this walk a title...
                </IonLabel>
                <IonInput
                  type="text"
                  value={title}
                  maxlength={titleMaxLength}
                  onIonChange={(event) => setTitle(event.detail.value as any)}
                />
              </IonItem>
              <p className="ion-padding-start">
                <small>
                  {titleMaxLength - title.length} characters remaining
                </small>
              </p>
            </IonList>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader className="ion-no-padding" color="dark">
            <IonCardSubtitle
              className="ion-padding ion-no-margin ion-text-uppercase ion-text-center"
              style={{
                color: "white",
              }}
            >
              Give this walk a colour...
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent className="ion-no-padding ion-no-margin">
            <IonList lines="none">
              <IonItem>
                <IonLabel position="stacked" className="ion-hide">
                  Give this walk a colour...
                </IonLabel>
                <IonGrid
                  className="swatches ion-justify-content-center"
                  // style={{ backgroundColor: "var(--ion-color-light)" }}
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
              <IonItem lines="none" className="ion-hide ion-margin-bottom">
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
        </IonCard>
      </IonCardContent>
      <IonCardHeader
        className="ion-no-padding"
        color="light"
        style={{
          marginTop: "auto",
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
                  onClick={() => history.goBack()}
                >
                  <IonIcon slot="start" icon={cancelIcon} />
                  Cancel
                </IonButton>
              </IonCol>
              <IonCol size="7">
                <IonButton
                  expand="block"
                  disabled={title === ""}
                  onClick={startWalk}
                >
                  Start Walk
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardSubtitle>
      </IonCardHeader>
    </>
  );
};

export default NewWalkPre;
