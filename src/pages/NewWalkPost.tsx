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
  checkmark as finishIcon,
  shareOutline as shareIcon,
} from "ionicons/icons";
import { Moment } from "../data/models";
import ProgressOverview from "../components/ProgressOverview";
import "./NewWalkPost.css";

const descriptionMaxLength = 40;

const NewWalkPost: React.FC<{
  updateWalk: (description: string, coverImage: string, share: boolean) => void;
  moments: Moment[];
  steps: number;
  distance: number;
  start: string;
  end: string;
}> = ({ updateWalk, moments, steps, distance, start, end }) => {
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");

  useEffect(() => {
    const latestImage = moments.find((moment) => {
      return moment.imagePath !== "";
    });
    if (latestImage) {
      setCoverImage(latestImage.imagePath);
    }
  }, [moments]);

  return (
    <>
      <ProgressOverview
        distance={distance}
        steps={steps}
        start={start}
        end={end}
      />
      <IonCardContent className="constrain constrain--medium">
        <IonCard>
          <IonCardHeader className="ion-no-padding" color="tertiary">
            <IonCardSubtitle
              className="ion-padding ion-no-margin ion-text-uppercase ion-text-center"
              style={{
                color: "white",
              }}
            >
              Give this walk a short description...
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent className="ion-no-padding">
            <IonList className="ion-padding-bottom">
              <IonItem>
                <IonLabel position="stacked" className="ion-hide">
                  Give this walk a short description...
                </IonLabel>
                <IonInput
                  type="text"
                  value={description}
                  onIonChange={(event) => setDescription(event.detail!.value!)}
                  maxlength={descriptionMaxLength}
                  placeholder="e.g. Long city walk"
                />
              </IonItem>
              <p className="ion-padding-start">
                <small>
                  {descriptionMaxLength - description.length} characters
                  remaining
                </small>
              </p>
            </IonList>
          </IonCardContent>
        </IonCard>
        {coverImage && (
          <IonCard>
            <IonCardHeader className="ion-no-padding" color="tertiary">
              <IonCardSubtitle
                className="ion-padding ion-no-margin ion-text-uppercase ion-text-center"
                style={{
                  color: "white",
                }}
              >
                Choose a cover image...
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent className="ion-no-padding cover-image-picker">
              <img
                src={coverImage}
                alt=""
                className="cover-image-picker__cover-image"
              />
              {moments.length > 0 ? (
                <div className="cover-image-picker__scroller">
                  {moments
                    .filter((moment) => moment.imagePath !== "")
                    .map((moment, index) => {
                      return (
                        <img
                          key={moment.timestamp}
                          src={moment.imagePath}
                          alt=""
                          onClick={() => {
                            setCoverImage(moment.imagePath);
                          }}
                          className={
                            index === 0
                              ? "cover-image-picker__image cover-image-picker__image--chosen"
                              : "cover-image-picker__image"
                          }
                        />
                      );
                    })}
                </div>
              ) : null}
            </IonCardContent>
          </IonCard>
        )}
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
                  color="primary"
                  onClick={() => {
                    updateWalk(description, coverImage, true);
                  }}
                >
                  <IonIcon slot="start" icon={shareIcon} />
                  Share
                </IonButton>
              </IonCol>
              <IonCol size="7">
                <IonButton
                  expand="block"
                  color="success"
                  onClick={() => {
                    updateWalk(description, coverImage, false);
                  }}
                >
                  <IonIcon slot="start" icon={finishIcon} />
                  Finish
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardSubtitle>
      </IonCardHeader>
    </>
  );
};

export default NewWalkPost;
