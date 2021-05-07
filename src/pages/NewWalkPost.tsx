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
  IonText,
  IonToast,
  IonToggle,
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import {
  checkmark as finishIcon,
  shareOutline as shareIcon,
} from "ionicons/icons";
import { appData } from "../data/appData";
import WalksContext from "../data/walks-context";
import { updateWalkHandler } from "../firebase";

const suggestedDescriptors = appData.suggestedDescriptors;
const locationMaxLength = 28;
const descriptorsMaxCount = 3;

const NewWalkPost: React.FC<{
  saveShareWalk: (share: boolean) => void;
}> = (props) => {
  const [description, setDescription] = useState<string[]>([]);
  const [chosenLocation, setChosenLocation] = useState<boolean>(false);
  const [chosenDescription, setChosenDescription] = useState<boolean>(false);
  const [chosenCoverImage, setChosenCoverImage] = useState<boolean>(false);
  const [location, setLocation] = useState<string>("");
  const [circular, setCircular] = useState<boolean>(false);
  const [descriptors, setDescriptors] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string>("");
  const walksCtx = useContext(WalksContext);

  useEffect(() => {
    if (walksCtx.moments && walksCtx.moments.length === 0) {
      if (walksCtx.storedImagesForCover.length === 1) {
        const image = walksCtx.storedImagesForCover[0];
        updateWalkHandler({ coverImage: image }, walksCtx.storedWalkId);
        setChosenCoverImage(true);
        walksCtx.resetStoredImagesForCover();
      } else if (walksCtx.storedImagesForCover.length > 1) {
        const image = walksCtx.storedImagesForCover[0];
        setCoverImage(image);
        updateWalkHandler({ coverImage: image }, walksCtx.storedWalkId);
      } else if (walksCtx.storedImagesForCover.length === 0) {
        setChosenCoverImage(true);
      }
    }
  }, [walksCtx.moments]);

  const chooseKeywordHandler = (keyword: string) => {
    if (descriptors.includes(keyword)) {
      setDescriptors(descriptors.filter((item) => item !== keyword));
    } else {
      if (descriptors.length < descriptorsMaxCount) {
        setDescriptors([...descriptors, keyword]);
      }
    }
  };

  const chosenLocationHandler = () => {
    updateWalkHandler({ location, circular }, walksCtx.storedWalkId);
    setChosenLocation(true);
  };

  const chosenCoverImageHandler = () => {
    updateWalkHandler({ coverImage }, walksCtx.storedWalkId);
    setChosenCoverImage(true);
    walksCtx.resetStoredImagesForCover();
  };

  const chosenDescriptionHandler = () => {
    updateWalkHandler({ description }, walksCtx.storedWalkId);
    setChosenDescription(true);
  };

  return (
    <IonCardContent style={{ margin: "auto", width: "100%" }}>
      {coverImage && !chosenLocation && !chosenCoverImage && (
        <>
          <div className="ion-text-center ion-padding">
            <IonCardTitle className="title text-heading">
              Choose a cover image...
            </IonCardTitle>
            <p className="small-print">
              Choose your favourite image from this walk...
            </p>
          </div>
          <IonCard className="ion-no-margin constrain constrain--medium">
            <IonCardContent className="ion-no-padding cover-image-picker">
              <div className="cover-image-picker__cover-image-container">
                <img
                  src={coverImage}
                  alt=""
                  className="cover-image-picker__cover-image"
                />
              </div>
              {walksCtx.storedImagesForCover.length > 0 ? (
                <div className="cover-image-picker__scroller">
                  {walksCtx.storedImagesForCover.map((image, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          setCoverImage(image);
                        }}
                        className={
                          coverImage === image
                            ? "cover-image-picker__scroller-image-container cover-image-picker__scroller-image-container--chosen"
                            : "cover-image-picker__scroller-image-container"
                        }
                      >
                        <img
                          src={image}
                          alt=""
                          className="cover-image-picker__scroller-image"
                        />
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </IonCardContent>
          </IonCard>
          <IonGrid className="ion-text-center">
            <IonRow>
              <IonCol className="ion-no-padding">
                <IonButton color="secondary" onClick={chosenCoverImageHandler}>
                  <strong>Next</strong>
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </>
      )}
      {chosenCoverImage && !chosenLocation && !chosenDescription && (
        <>
          <div className="ion-text-center ion-padding constrain constrain--medium">
            <IonCardTitle className="title text-heading">
              Circular route...
            </IonCardTitle>
            <p className="small-print">Was this walk in a loop?</p>

            <IonGrid className="ion-text-center">
              <IonRow className="ion-align-items-center">
                <IonCol className="ion-text-end">
                  <IonText
                    color={circular ? "dark" : "primary"}
                    style={
                      circular ? { fontSize: "1em" } : { fontSize: "1.35em" }
                    }
                  >
                    <strong>No</strong>
                  </IonText>
                </IonCol>
                <IonCol size="3">
                  <IonToggle
                    checked={circular}
                    onIonChange={(e) => {
                      setCircular(e.detail.checked);
                    }}
                  />
                </IonCol>
                <IonCol className="ion-text-start">
                  <IonText
                    color={!circular ? "dark" : "primary"}
                    style={
                      !circular ? { fontSize: "1em" } : { fontSize: "1.35em" }
                    }
                  >
                    <strong>Yes</strong>
                  </IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
          <div className="ion-text-center ion-padding-bottom constrain constrain--medium">
            <IonCardTitle className="title text-heading">
              Add a location...
            </IonCardTitle>
            <p className="small-print">Where was this walk?</p>
            <IonLabel className="ion-hide">Walk location...</IonLabel>
            <IonInput
              type="text"
              value={location}
              autocapitalize="on"
              maxlength={locationMaxLength}
              onIonChange={(event) => setLocation(event.detail!.value!)}
              className="input-text"
            ></IonInput>
            <p className="small-print">
              {locationMaxLength - location.length} characters remaining
            </p>
          </div>
          <IonGrid className="ion-text-center">
            <IonRow>
              <IonCol className="ion-no-padding">
                <IonButton color="secondary" onClick={chosenLocationHandler}>
                  <strong>Next</strong>
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-no-padding">
                <IonButton
                  color="dark"
                  fill="clear"
                  onClick={chosenLocationHandler}
                >
                  Skip
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </>
      )}
      {!chosenDescription && chosenLocation && chosenCoverImage && (
        <>
          <div className="ion-text-center constrain constrain--large">
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
              onIonChange={(event) =>
                setDescription(event.detail!.value!.split(", "))
              }
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
                    color="secondary"
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
      {chosenCoverImage && chosenDescription && chosenLocation && (
        <div className="ion-text-center ion-padding ion-margin-top">
          <img
            src="assets/img/walksy-anim-jiggle.gif"
            alt=""
            style={{ margin: "-60px auto -30px auto", maxHeight: "200px" }}
          />
          <h2 className="title text-heading">You’ve added your walk!</h2>
          <p className="small-print">Hope to see you again here soon</p>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton
                  color="primary"
                  onClick={() => {
                    props.saveShareWalk(true);
                  }}
                >
                  <IonIcon slot="start" icon={shareIcon} />
                  Share
                </IonButton>
                <IonButton
                  color="secondary"
                  onClick={() => {
                    props.saveShareWalk(false);
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
      <IonToast
        position="middle"
        color="secondary"
        isOpen={!!walksCtx.moments && walksCtx.moments.length > 0}
        message={`Saving your moments: ${walksCtx.moments?.length}`}
      />
    </IonCardContent>
  );
};

export default NewWalkPost;
