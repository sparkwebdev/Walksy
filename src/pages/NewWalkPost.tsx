import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonLabel,
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
import { appData } from "../data/appData";

const suggestedDescriptors = appData.suggestedDescriptors;
const descriptorsMaxCount = 3;

const NewWalkPost: React.FC<{
  updateWalk: (description: string, coverImage: string, share: boolean) => void;
  moments: Moment[];
  steps: number;
  distance: number;
  start: string;
  end: string;
}> = ({ updateWalk, moments, steps, distance, start, end }) => {
  const [description, setDescription] = useState<string>("");
  const [descriptors, setDescriptors] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string>("");

  useEffect(() => {
    const latestImage = moments.find((moment) => {
      return moment.imagePath !== "";
    });
    if (latestImage) {
      setCoverImage(latestImage.imagePath);
    }
  }, [moments]);

  const chooseKeywordHandler = (keyword: string) => {
    if (descriptors.includes(keyword)) {
      setDescriptors(descriptors.filter((item) => item !== keyword));
    } else {
      if (descriptors.length < descriptorsMaxCount) {
        setDescriptors([...descriptors, keyword]);
      }
    }
  };

  return (
    <>
      <ProgressOverview
        distance={distance}
        steps={steps}
        start={start}
        end={end}
      />
      <IonCardContent className="constrain constrain--medium">
        <div className="ion-text-center">
          <IonCardTitle className="title text-heading">
            Describe this walk...
          </IonCardTitle>
          <p className="small-print">
            Choose up to {descriptorsMaxCount} words to describe this walk...
          </p>
          <div
            className={
              descriptors.length === 3
                ? "ion-margin-top keywords keywords--complete"
                : "ion-margin-top keywords"
            }
          >
            {suggestedDescriptors.map((keyword) => {
              return (
                <IonBadge
                  className={
                    descriptors.includes(keyword)
                      ? "badge-keyword badge-keyword--active"
                      : "badge-keyword"
                  }
                  onClick={() => {
                    chooseKeywordHandler(keyword);
                  }}
                >
                  {keyword}
                </IonBadge>
              );
            })}
          </div>
        </div>
        <IonLabel className="ion-hide">Walk description...</IonLabel>
        <IonInput
          type="text"
          value={descriptors.join(", ")}
          onIonChange={(event) => setDescription(event.detail!.value!)}
          className="input-text"
          disabled={true}
        >
          {descriptors.length === 3 ? (
            <IonIcon
              icon={finishIcon}
              size="large"
              color="success"
              className="badge-input-feedback-complete"
            />
          ) : (
            <IonBadge className="badge-input-feedback" color="light">
              {descriptorsMaxCount - descriptors.length}
            </IonBadge>
          )}
        </IonInput>

        {coverImage && (
          <>
            <div className="ion-text-center ion-padding ion-margin-top">
              <IonCardSubtitle className="sub-title">Step 2:</IonCardSubtitle>
              <IonCardTitle className="title text-heading">
                Choose a cover image...
              </IonCardTitle>
              <p className="small-print">
                Choose your favourit image from this walk...
              </p>
            </div>
            <IonCard>
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
                      .map((moment) => {
                        return (
                          <img
                            key={moment.timestamp}
                            src={moment.imagePath}
                            alt=""
                            onClick={() => {
                              setCoverImage(moment.imagePath);
                            }}
                            className={
                              coverImage === moment.imagePath
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
          </>
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
