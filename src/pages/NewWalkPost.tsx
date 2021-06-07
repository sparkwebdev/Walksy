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
  IonModal,
  IonRow,
  IonSlide,
  IonSlides,
  IonText,
  IonToast,
  IonToggle,
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import {
  checkmark as finishIcon,
  shareOutline as shareIcon,
  helpCircleOutline as infoIcon,
} from "ionicons/icons";
import WalksContext from "../data/walks-context";
import { isPlatform } from "@ionic/react";
import { updateStoredWalkHandler } from "../firebase";
import { Project, Tag } from "../data/models";

const locationMaxLength = 28;
const descriptorsMaxCount = 3;

const NewWalkPost: React.FC<{
  saveShareWalk: (share: boolean) => void;
}> = (props) => {
  const walksCtx = useContext(WalksContext);
  const [chosenCoverImage, setChosenCoverImage] = useState<boolean>(false);
  const [chosenLocation, setChosenLocation] = useState<boolean>(false);
  const [chosenDescription, setChosenDescription] = useState<boolean>(false);

  const [coverImage, setCoverImage] = useState<string>(
    walksCtx.walk?.coverImage || ""
  );
  const [circular, setCircular] = useState<boolean>(
    walksCtx.walk?.circular || false
  );
  const [location, setLocation] = useState<string>(
    walksCtx.walk?.location || ""
  );
  const [project, setProject] = useState<string>(walksCtx.walk?.project || "");
  const [description, setDescription] = useState<string[]>([]);
  const [descriptors, setDescriptors] = useState<string[]>([]);

  useEffect(() => {
    if (walksCtx.walk?.coverImage) {
      setChosenCoverImage(true);
    }
    if (walksCtx.walk?.description && walksCtx.walk?.description.length > 0) {
      setChosenDescription(true);
    }
    if (walksCtx.walk?.location) {
      setChosenLocation(true);
    }
  }, []);

  const [showProjectsMoreInfo, setShowProjectsMoreInfo] =
    useState<boolean>(false);

  useEffect(() => {
    if (walksCtx.moments && walksCtx.moments.length === 0) {
      if (walksCtx.storedImagesForCover.length === 1) {
        const image = walksCtx.storedImagesForCover[0];
        updateStoredWalkHandler({ coverImage: image }, walksCtx.storedWalkId);
        setChosenCoverImage(true);
        walksCtx.resetStoredImagesForCover();
      } else if (walksCtx.storedImagesForCover.length > 1) {
        const image = walksCtx.storedImagesForCover[0];
        setCoverImage(image);
        updateStoredWalkHandler({ coverImage: image }, walksCtx.storedWalkId);
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

  const chosenCoverImageHandler = () => {
    if (walksCtx.storedWalkId) {
      walksCtx.updateWalk({ coverImage });
      updateStoredWalkHandler({ coverImage }, walksCtx.storedWalkId);
      setChosenCoverImage(true);
      walksCtx.resetStoredImagesForCover();
    }
  };

  const chosenLocationHandler = () => {
    if (walksCtx.storedWalkId) {
      walksCtx.updateWalk({ location, circular });
      updateStoredWalkHandler({ location, circular }, walksCtx.storedWalkId);
      setChosenLocation(true);
    }
  };

  const chosenDescriptionHandler = () => {
    if (walksCtx.storedWalkId) {
      walksCtx.updateWalk({ description, project });
      updateStoredWalkHandler({ description, project }, walksCtx.storedWalkId);
      setChosenDescription(true);
    }
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
                  <IonSlides
                    pager={true}
                    options={{
                      slidesPerView: 4.5,
                    }}
                  >
                    {walksCtx.storedImagesForCover.map((image, index) => {
                      return (
                        <IonSlide>
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
                        </IonSlide>
                      );
                    })}
                  </IonSlides>
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
          <div className="ion-text-center ion-padding constrain constrain--medium">
            <IonCardTitle className="title text-heading">
              Add a location...
            </IonCardTitle>
            <p className="small-print">Where was this walk?</p>
            <IonLabel className="ion-hide">Walk location</IonLabel>
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
          {walksCtx.appData.projects.length > 0 && (
            <div className="ion-text-center ion-padding constrain constrain--large">
              <IonCardTitle className="title text-heading">
                Tag project...
              </IonCardTitle>
              <p className="small-print">
                Was this walk part of a themed project?{" "}
                <IonButton
                  color="secondary"
                  style={{ textDecoration: "underline", marginTop: "-1rem" }}
                  onClick={() => setShowProjectsMoreInfo(true)}
                  fill="clear"
                  size="small"
                  className="ion-no-margin ion-no-padding"
                >
                  <IonIcon icon={infoIcon} size="large" />
                  <strong className="ion-hide">More info</strong>
                </IonButton>
              </p>
              <div
                className={
                  project !== ""
                    ? "ion-margin-top keywords keywords--complete"
                    : "ion-margin-top keywords"
                }
              >
                {walksCtx.appData.projects.map((projectItem: Project) => {
                  return (
                    projectItem.tag && (
                      <IonBadge
                        className={
                          project === projectItem.tag
                            ? "badge-keyword badge-keyword--active"
                            : "badge-keyword"
                        }
                        onClick={() => {
                          setProject(projectItem.tag!);
                        }}
                        key={projectItem.tag}
                      >
                        {projectItem.title}
                      </IonBadge>
                    )
                  );
                })}
                <IonBadge
                  className={
                    project === ""
                      ? "badge-keyword badge-keyword--active badge-keyword--active-alt"
                      : "badge-keyword"
                  }
                  onClick={() => {
                    setProject("");
                  }}
                  key="no"
                >
                  No
                </IonBadge>
              </div>
            </div>
          )}
          <div className="ion-text-center ion-padding constrain constrain--large">
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
              {walksCtx.appData.suggestedDescriptors.map((descriptor: Tag) => {
                return descriptor.tag ? (
                  <IonBadge
                    className={
                      descriptors.includes(descriptor.tag)
                        ? "badge-keyword badge-keyword--active"
                        : "badge-keyword"
                    }
                    onClick={() => {
                      chooseKeywordHandler(descriptor.tag!);
                    }}
                    key={descriptor.tag}
                  >
                    {descriptor.tag}
                  </IonBadge>
                ) : null;
              })}
            </div>
            <IonLabel className="ion-hide">Walk description</IonLabel>
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
                {isPlatform("mobile") && (
                  <IonButton
                    color="primary"
                    onClick={() => {
                      props.saveShareWalk(true);
                    }}
                  >
                    <IonIcon slot="start" icon={shareIcon} />
                    Share
                  </IonButton>
                )}
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
        message="Saving your moments"
      />
      <IonModal
        isOpen={showProjectsMoreInfo}
        onDidDismiss={() => setShowProjectsMoreInfo(false)}
      >
        <IonCard
          className="ion-no-margin"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <IonCardHeader className="ion-no-padding" color="dark">
            <IonCardSubtitle className="ion-padding ion-no-margin ion-text-uppercase ion-text-center">
              Projects
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent className="ion-margin-top small-print">
            <p>
              Walksy projects are organised walking events which you can
              participate in and contribute to. If you know your walk is part of
              a Walksy project, please tag this walk with the appropriate tag.
              If it is not part of a project, simply select 'No';
            </p>
            <ul>
              {walksCtx.appData.projects.map((project: Project) => {
                return (
                  <li>
                    <h2>
                      <strong>{project.title}</strong>
                    </h2>
                    {project.description}
                  </li>
                );
              })}
            </ul>
          </IonCardContent>
          <IonCardHeader
            className="ion-no-padding ion-margin-top"
            color="light"
            style={{ marginTop: "auto" }}
          >
            <IonGrid>
              <IonRow>
                <IonCol className="ion-text-center">
                  <IonButton onClick={() => setShowProjectsMoreInfo(false)}>
                    Close
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardHeader>
        </IonCard>
      </IonModal>
    </IonCardContent>
  );
};

export default NewWalkPost;
