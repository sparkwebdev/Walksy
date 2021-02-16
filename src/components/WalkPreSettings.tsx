import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
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

const colours = generateHslaColors(9, undefined, undefined, true);
const randomColour = () => {
  return colours[Math.floor(Math.random() * colours.length)];
};

const WalkPreSettings: React.FC<{
  onStart: (title: string, colour: string, location?: Location | null) => void;
}> = (props) => {
  const [title, setTitle] = useState(suggestedTitle());
  const [colour, setColour] = useState<string>(randomColour);
  const [location, setLocation] = useState<Location | null | undefined>(
    undefined
  );

  const getLocation = async () => {
    setLoading(true);
    try {
      const position = await Geolocation.getCurrentPosition();
      let currentLocation = {
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
      props.onStart(title, colour, location);
    }
  }, [location]);

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="centered-content">
      <div className="constrain constrain--medium">
        <IonCard>
          <IonCardHeader className="ion-no-padding" color="tertiary">
            <IonCardSubtitle className="ion-padding ion-text-uppercase">
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
                  value={title}
                  onIonChange={(event) => setTitle(event.detail!.value!)}
                />
              </IonItem>
            </IonList>
            <IonList lines="none">
              <IonItem>
                <IonLabel position="stacked">
                  Give this walk a colour...
                </IonLabel>
                <ul className="swatches">
                  {colours.map((colour) => {
                    return (
                      <li
                        className={
                          colour === colour
                            ? "swatches__colour swatches__colour--chosen"
                            : "swatches__colour"
                        }
                        key={colour}
                        style={{
                          background: colour,
                        }}
                        onClick={() => {
                          setColour(colour);
                        }}
                      ></li>
                    );
                  })}
                </ul>
              </IonItem>
              <IonItem lines="none">
                <IonInput
                  type="text"
                  value={colour}
                  className="swatches__colour swatches__colour--output"
                  onIonChange={() => setColour(colour)}
                  disabled={true}
                  style={{
                    background: colour,
                  }}
                ></IonInput>
              </IonItem>
            </IonList>
            <IonButton
              className="ion-margin"
              expand="block"
              disabled={title === ""}
              onClick={() => {
                getLocation();
              }}
            >
              Start
            </IonButton>
          </IonCardContent>
        </IonCard>
      </div>
      <IonLoading message={"Getting your location..."} isOpen={loading} />
    </div>
  );
};

export default WalkPreSettings;
