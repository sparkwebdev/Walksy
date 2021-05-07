import {
  IonButton,
  IonCardTitle,
  IonSlide,
  IonSlides,
  IonText,
} from "@ionic/react";
import React from "react";

const WalkTutorial: React.FC<{
  onFinish: () => void;
}> = ({ onFinish }) => {
  return (
    <div className="centered-content">
      <div className="constrain constrain--medium ion-padding-start ion-padding-end">
        <IonSlides pager={true}>
          <IonSlide>
            <IonText
              className="title text-heading ion-margin-bottom"
              color="primary"
              style={{
                fontSize: "1.2em",
              }}
            >
              <strong>Getting Started</strong>
            </IonText>
            <IonCardTitle className="title text-heading constrain constrain--medium">
              <IonText color="tertiary">
                What do you notice as&nbsp;you&nbsp;walk?
              </IonText>
            </IonCardTitle>
            <p className="text-body">
              The app will record your journey as you walk. Please stop anytime
              to record anything that draws your attention, or that you see or
              hear. These recorded ‘Moments’ will act as markers to guide others
              along the route. This might be the taking of a photo, the
              recording of a sound, or something written.
            </p>
          </IonSlide>
          <IonSlide>
            <img
              src="assets/img/icon-camera.svg"
              alt=""
              style={{ maxHeight: "80px" }}
            />
            <IonText
              className="title text-heading ion-margin-bottom"
              color="primary"
              style={{
                fontSize: "1.2em",
              }}
            >
              <strong>Adding Moments: Photos</strong>
            </IonText>
            <IonCardTitle className="title text-heading constrain constrain--small">
              <IonText color="tertiary">
                What catches your eye as you walk?
              </IonText>
            </IonCardTitle>
            <p className="text-body">
              A view perhaps, a small detail on a wall or path, a colour, a
              plant or texture.
            </p>
            <div className="constrain constrain--small ion-margin-top ion-margin-bottom info-bubble">
              <p className="text-body small-print ion-no-margin">
                Keep holding your phone vertically to take the best pics.
              </p>
            </div>
          </IonSlide>
          <IonSlide>
            <img
              src="assets/img/icon-audio.svg"
              alt=""
              style={{ maxHeight: "80px" }}
            />
            <IonText
              className="title text-heading ion-margin-bottom"
              color="primary"
              style={{
                fontSize: "1.2em",
              }}
            >
              <strong>Adding Moments: Audio</strong>
            </IonText>
            <IonCardTitle className="title text-heading constrain constrain--small">
              <IonText color="tertiary">Listen, and what do you hear?</IonText>
            </IonCardTitle>
            <p className="text-body">
              Perhaps the tweet of birds singing, the rush of the waves, a train
              passing or you want to speak about something.
            </p>
            <div className="constrain constrain--small ion-margin-top ion-margin-bottom info-bubble info-bubble--alt">
              <p className="text-body small-print ion-no-margin">
                Create all your ‘Moments’ as sounds and you’ll have made a sound
                walk.
              </p>
            </div>
          </IonSlide>
          <IonSlide>
            <img
              src="assets/img/icon-note.svg"
              alt=""
              style={{ maxHeight: "80px" }}
            />
            <IonText
              className="title text-heading ion-margin-bottom"
              color="primary"
              style={{
                fontSize: "1.15em",
              }}
            >
              <strong>Adding Moments: Notes</strong>
            </IonText>
            <IonCardTitle className="title text-heading constrain">
              <IonText
                color="tertiary"
                style={{
                  fontSize: "0.9em",
                }}
              >
                Anything you want to note about today’s journey?
              </IonText>
            </IonCardTitle>
            <p className="text-body">
              Let others know about observations, or encounters, or how you feel
              as you walk today, or it might be something about the weather, or
              a turn in the road.
            </p>
            <div className="constrain constrain--small ion-margin-top ion-margin-bottom info-bubble">
              <p className="text-body small-print ion-no-margin">
                Why not add a poem or list of guiding instructions using a
                series of Notes?
              </p>
            </div>
          </IonSlide>
          <IonSlide>
            <IonText
              className="title text-heading ion-margin-bottom"
              color="tertiary"
            >
              <strong>Finishing Up</strong>
            </IonText>
            <p className="text-body">
              Once you complete your walk, you’ll be able to add a short
              description about your walk, how it was or where you went. You can
              also select browsable tags, before making any final edits and
              saving.
            </p>
            <IonButton className="ion-margin-top" onClick={onFinish}>
              Let's Walk!
            </IonButton>
          </IonSlide>
        </IonSlides>
      </div>
    </div>
  );
};

export default WalkTutorial;
