import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonLabel,
  IonRow,
  IonTitle,
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import {
  checkmark as finishIcon,
  shareOutline as shareIcon,
} from "ionicons/icons";
import { Moment } from "../data/models";
import "./NewWalkPost.css";
import { appData } from "../data/appData";
import WalksContext from "../data/walks-context";

const suggestedDescriptors = appData.suggestedDescriptors;
const descriptorsMaxCount = 3;

const NewWalkPost: React.FC<{
  saveShareWalk: (share: boolean) => void;
  moments: Moment[];
}> = ({ saveShareWalk, moments }) => {
  const [description, setDescription] = useState<string>("");
  const [chosenDescription, setChosenDescription] = useState<boolean>(false);
  const [chosenCoverImage, setChosenCoverImage] = useState<boolean>(false);
  const [descriptors, setDescriptors] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string>("");
  const walksCtx = useContext(WalksContext);

  useEffect(() => {
    const momentsWithImages = moments.filter(
      (moment) => moment.imagePath !== ""
    );
    momentsWithImages.length < 2
      ? setChosenCoverImage(true)
      : setChosenCoverImage(false);
    // const latestImage = moments.find((moment) => {
    //   return moment.imagePath !== "";
    // });
    if (momentsWithImages.length > 0) {
      setCoverImage(momentsWithImages[0].imagePath);
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

  const chosenCoverImageHandler = () => {
    walksCtx.updateWalk({
      coverImage,
    });
    setChosenCoverImage(true);
  };

  const chosenDescriptionHandler = () => {
    walksCtx.updateWalk({
      description,
    });
    setChosenDescription(true);
  };

  return (
    <>
      <IonCardContent style={{ margin: "auto" }}>
        {coverImage && !chosenCoverImage && (
          <>
            <div className="ion-text-center ion-padding ion-margin-top">
              <IonCardTitle className="title text-heading">
                Choose a cover image...
              </IonCardTitle>
              <p className="small-print">
                Choose your favourite image from this walk...
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
            <IonGrid className="ion-text-center">
              <IonRow>
                <IonCol className="ion-no-padding">
                  <IonButton color="success" onClick={chosenCoverImageHandler}>
                    <strong>Next</strong>
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </>
        )}
        {!chosenDescription && chosenCoverImage && (
          <>
            <div className="ion-text-center">
              <IonCardTitle className="title text-heading ion-margin-top">
                Describe this walk...
              </IonCardTitle>
              <p className="small-print">
                Choose up to {descriptorsMaxCount} words to describe this
                walk...
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
                      key={keyword}
                    >
                      {keyword}
                    </IonBadge>
                  );
                })}
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
              <IonGrid className="ion-text-center">
                <IonRow>
                  <IonCol className="ion-no-padding">
                    <IonButton
                      color="success"
                      onClick={chosenDescriptionHandler}
                    >
                      <strong>Next</strong>
                    </IonButton>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol className="ion-no-padding">
                    <IonButton
                      color="dark"
                      fill="clear"
                      onClick={chosenDescriptionHandler}
                    >
                      Skip
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </div>
          </>
        )}
        {chosenCoverImage && chosenDescription && (
          <div className="ion-text-center ion-padding ion-margin-top">
            <img
              src="assets/img/walksy-panel.svg"
              alt=""
              style={{ maxHeight: "22vh" }}
            />
            <h2 className="title text-heading">Well done!</h2>
            <p className="small-print">Would you like to share this walk?</p>
            <IonGrid>
              <IonRow>
                <IonCol size="6">
                  <IonButton
                    expand="block"
                    color="primary"
                    onClick={() => {
                      saveShareWalk(true);
                    }}
                  >
                    <IonIcon slot="start" icon={shareIcon} />
                    Share
                  </IonButton>
                </IonCol>
                <IonCol size="6">
                  <IonButton
                    expand="block"
                    color="success"
                    onClick={() => {
                      saveShareWalk(false);
                    }}
                  >
                    <IonIcon slot="start" icon={finishIcon} />
                    Done
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
        )}
      </IonCardContent>
    </>
  );
};

export default NewWalkPost;
