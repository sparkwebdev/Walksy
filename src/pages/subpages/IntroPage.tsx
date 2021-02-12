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
  IonCardTitle,
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
            <IonGrid>
              <IonRow>
                <IonCol className="ion-text-center">
                  <img
                    className="intro__logo"
                    src="assets/img/placeholder.png"
                    alt=""
                  />
                  <img
                    className="intro__icon"
                    src="assets/img/placeholder.png"
                    alt=""
                  />
                  <h2>&#8216;Walk &amp; See&#8217;</h2>
                  <p>
                    A fun way to do more walking, and to record those things we
                    observe as we walk our local landscapes. <br />
                    Find, Explore, and Record walks in your nearby.
                  </p>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonSlide>
          <IonSlide>
            <IonGrid>
              <IonRow>
                <IonCol className="ion-text-center">
                  <img
                    className="intro__logo"
                    src="assets/img/placeholder.png"
                    alt=""
                  />
                  <img
                    className="intro__icon"
                    src="assets/img/placeholder.png"
                    alt=""
                  />
                  <h3>
                    Browse <br />
                    <small>our curated or other users&#8217; walks</small>
                  </h3>
                  <h3>
                    Make <br />
                    <small>your own walk by capturing what you see</small>
                  </h3>
                  <h3>
                    Watch <br />
                    <small>your steps, distance +more</small>
                  </h3>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonSlide>
          <IonSlide>
            <IonGrid>
              <IonRow>
                <IonCol className="ion-text-center">
                  <img
                    className="intro__logo"
                    src="assets/img/placeholder.png"
                    alt=""
                  />
                  <h3>
                    <small>
                      The &#8216;Walksy&#8217; (Walk &amp; See) App has been
                      devised and created by Art Walk Projects (Edinburgh)
                      offering a creative and fun way to collect the things we
                      observe as we walk, whilst encouraging us to walk more and
                      explore our nearby.
                    </small>
                  </h3>
                  <p>
                    <strong>Funded by:</strong>
                  </p>
                  <img
                    className="intro__partner"
                    src="assets/img/login_smarter-choices.png"
                    alt=""
                  />
                  <img
                    className="intro__partner"
                    src="assets/img/logo_community-fund.png"
                    alt=""
                  />
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonSlide>
          <IonSlide>
            <IonGrid>
              <IonRow>
                <IonCol className="ion-text-center">
                  <img
                    className="intro__logo"
                    src="assets/img/placeholder.png"
                    alt=""
                  />
                  <img
                    className="intro__icon"
                    src="assets/img/placeholder.png"
                    alt=""
                  />
                  <div className="constrain constrain--medium">
                    <IonCard>
                      <IonCardHeader
                        className="ion-no-padding"
                        color="tertiary"
                      >
                        <IonCardSubtitle className="ion-padding ion-text-uppercase">
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
                        <IonButton
                          expand="block"
                          fill="clear"
                          routerLink="/login"
                        >
                          Login
                        </IonButton>
                      </IonCardContent>
                    </IonCard>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
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
