import React, { useState, useRef } from "react";
import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonSlides,
  IonSlide,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonText,
} from "@ionic/react";
import "./IntroPage.css";

const Intro: React.FC = () => {
  const [onLastSlide, setOnLastSlide] = useState(false);
  const slides = useRef<HTMLIonSlidesElement>(null);

  const skipIntro = () => {
    setOnLastSlide(true);
    slides.current?.slideTo(3);
  };

  const slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  return (
    <IonPage>
      <IonContent>
        <IonSlides
          pager={true}
          options={slideOpts}
          ref={slides}
          onIonSlideReachEnd={(event: any) => setOnLastSlide(true)}
        >
          <IonSlide>
            <img
              className="intro__panel"
              src="assets/img/walksy-panel.svg"
              alt=""
            />
            <div className="constrain constrain--medium">
              <h2 className="text-heading">&#8216;Walk &amp; See&#8217;</h2>
              <p className="text-body">
                A fun way to do more walking, and to record those things we
                observe as we walk our local landscapes. <br />
                Find, Explore, and Record walks in your nearby.
              </p>
            </div>
          </IonSlide>
          <IonSlide>
            <img
              className="intro__logo"
              src="assets/img/walksy-logo.svg"
              alt=""
            />
            <div className="constrain constrain--medium">
              <h3 className="text-heading">
                <span>Browse</span> <br />
                <span className="text-body">
                  our curated or other users&#8217; walks
                </span>
              </h3>
              <h3 className="text-heading">
                <span>Make</span> <br />
                <span className="text-body">
                  your own walk by capturing what you see
                </span>
              </h3>
              <h3 className="text-heading">
                <span>Watch</span> <br />
                <span className="text-body">your steps, distance +more</span>
              </h3>
            </div>
          </IonSlide>
          <IonSlide>
            <img
              className="intro__logo"
              src="assets/img/walksy-logo.svg"
              alt=""
            />
            <div className="constrain constrain--medium">
              <p className="text-body">
                The &#8216;Walksy&#8217; (Walk &amp; See) App has been devised
                and created by Art Walk Projects (Edinburgh) offering a creative
                and fun way to collect the things we observe as we walk, whilst
                encouraging us to walk more and explore our nearby.
              </p>
              <h3 className="text-heading">
                <strong>Funded by:</strong>
              </h3>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <img
                      className="intro__partner"
                      src="assets/img/login_smarter-choices.svg"
                      alt=""
                    />
                  </IonCol>
                  <IonCol>
                    <img
                      className="intro__partner"
                      src="assets/img/logo_community-fund.svg"
                      alt=""
                    />
                  </IonCol>
                </IonRow>
              </IonGrid>
            </div>
          </IonSlide>
          <IonSlide>
            <img
              className="intro__panel-2"
              src="assets/img/walksy-panel-2.svg"
              alt=""
            />
            <div className="constrain constrain--medium">
              <IonCard>
                <IonCardHeader className="ion-no-padding" color="tertiary">
                  <IonCardSubtitle className="ion-padding ion-no-margin ion-text-uppercase ion-text-center">
                    Get Started
                  </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonText color="dark" className="ion-margin">
                    <p>Please register to start your journey...</p>
                  </IonText>
                  <IonButton expand="block" routerLink="/register">
                    Register
                  </IonButton>
                  <IonButton expand="block" fill="clear" routerLink="/login">
                    Login
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </div>
          </IonSlide>
        </IonSlides>

        {!onLastSlide && (
          <IonButton
            className="intro__skip"
            fill="clear"
            onClick={() => skipIntro()}
          >
            Skip
          </IonButton>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Intro;
