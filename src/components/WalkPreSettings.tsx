import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonRow,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import {
  generateHslaColors,
  getFriendlyTimeOfDay,
  getFriendlyWalkDescriptor,
} from "../helpers";

import { Plugins } from "@capacitor/core";

import { Location } from "../data/models";

const { Geolocation } = Plugins;

const suggestedTitle = () => {
  return `${getFriendlyTimeOfDay()} ${getFriendlyWalkDescriptor()}`;
};

const colours = generateHslaColors(14, undefined, undefined, true);
const randomColour = () => {
  return colours[Math.floor(Math.random() * colours.length)];
};

const WalkPreSettings: React.FC<{
  onStart: (title: string, colour: string, location?: Location | null) => void;
}> = (props) => {
  const [chosenTitle, setChosenTitle] = useState(suggestedTitle());
  const [chosenColour, setChosenColour] = useState<string>(randomColour);
  const [location, setLocation] = useState<Location | null | undefined>(
    undefined
  );

  const getLocation = async () => {
    setLoading(true);
    try {
      const position = await Geolocation.getCurrentPosition();
      const currentLocation: Location = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
        timestamp: position.timestamp,
      };
      setLoading(false);
      setLocation(currentLocation);
    } catch (e) {
      setLoading(false);
      setLocation(null);
    }
  };

  useEffect(() => {
    if (location !== undefined) {
      props.onStart(chosenTitle, chosenColour, location);
    }
  }, [location]);

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="centered-content">
      <div className="constrain constrain--medium">
        <IonCard>
          <IonCardHeader
            className="ion-no-padding"
            style={{
              backgroundColor: chosenColour,
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
              <IonItem>
                <IonLabel position="stacked">
                  Give this walk a title...
                </IonLabel>
                <IonInput
                  type="text"
                  value={chosenTitle}
                  onIonChange={(event) => setChosenTitle(event.detail!.value!)}
                />
              </IonItem>
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
                    {colours.map((colour) => {
                      return (
                        <IonCol
                          className={
                            colour === chosenColour
                              ? "swatches__colour swatches__colour--chosen"
                              : "swatches__colour"
                          }
                          key={colour}
                          style={{
                            background: colour,
                          }}
                          onClick={() => {
                            setChosenColour(colour);
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
                  value={chosenColour}
                  className="swatches__colour swatches__colour--output"
                  onIonChange={() => setChosenColour(chosenColour)}
                  disabled={true}
                  hidden={true}
                  // style={{
                  //   background: chosenColour,
                  // }}
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
                      disabled={chosenTitle === ""}
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
  );
};

export default WalkPreSettings;
