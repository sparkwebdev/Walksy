import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonSlide,
  IonSlides,
  IonText,
} from "@ionic/react";
import React from "react";

const WalkTutorial: React.FC<{
  onFinish: () => void;
}> = (props) => {
  return (
    <div className="centered-content">
      <div className="constrain constrain--medium">
        <IonCard>
          <IonCardHeader className="ion-no-padding" color="tertiary">
            <IonCardSubtitle className="ion-padding ion-no-margin ion-text-uppercase">
              Let's get started...
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonSlides pager={true}>
              <IonSlide>
                <IonText className="ion-margin-bottom">
                  <h1 className="text-heading">
                    What do you notice as you&nbsp;walk?
                  </h1>
                </IonText>
                <p className="text-body">
                  The app will record your journey as you walk. Please stop
                  anytime to record anything that draws your attention, or that
                  you see or hear. These will act as markers to guide others
                  along the route. This might be the taking of a photo, the
                  recording of a sound, or something written.
                </p>
              </IonSlide>
              <IonSlide>
                <p className="text-body">
                  Notes can be added such as an observation, a direction about a
                  turn to take, or anything else that marks a particular spot on
                  your route. You can edit once you’ve finished the walk before
                  then finally uploading to the app.
                </p>
              </IonSlide>
              <IonSlide>
                <p className="text-body">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur.
                </p>
              </IonSlide>
              <IonSlide>
                <p className="text-body">
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deserunt mollit anim id est laborum.
                </p>
                <IonButton className="ion-margin-top" onClick={props.onFinish}>
                  Let's Walk!
                </IonButton>
              </IonSlide>
            </IonSlides>
          </IonCardContent>
        </IonCard>
      </div>
    </div>
  );
};

export default WalkTutorial;
