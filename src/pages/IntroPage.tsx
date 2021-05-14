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
  IonHeader,
  IonToolbar,
  IonButtons,
} from "@ionic/react";
import { useAuth } from "../auth";

const Intro: React.FC = () => {
  const { loggedIn } = useAuth();
  const [onLastSlide, setOnLastSlide] = useState(false);
  const slides = useRef<HTMLIonSlidesElement>(null);

  const skipIntro = () => {
    setOnLastSlide(true);
    slides.current?.slideTo(4);
  };

  const slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar color="medium">
          <IonButtons slot="end">
            {onLastSlide === false && (
              <IonButton onClick={skipIntro}>Skip</IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={false}>
        <IonSlides
          pager={true}
          options={slideOpts}
          ref={slides}
          onIonSlideReachEnd={(event: any) => setOnLastSlide(true)}
          className="intro"
        >
          <IonSlide>
            <img
              className="intro__panel"
              src="assets/img/walksy-panel.svg"
              alt=""
            />
            <div className="constrain constrain--medium ion-padding">
              <h2 className="text-heading">
                Walk &amp; See <br />
                A library of walks, <br />
                recording your nearby.
              </h2>
              {/* <h2 className="text-heading">&#8216;Walk &amp; See&#8217;</h2>
              <p className="text-body">
                A fun way to do more walking, and to record those things we
                observe as we walk our local landscapes. Find, Explore, and
                Record walks in your nearby.
              </p> */}
            </div>
          </IonSlide>
          <IonSlide>
            <img
              className="intro__logo"
              src="assets/img/walksy-logo-2.svg"
              alt=""
            />
            <div className="constrain constrain--medium ion-padding">
              <h2 className="text-heading">
                Browse <br />
                <span className="text-body" style={{ fontSize: "0.7em" }}>
                  our curated art walks or other users&#8217;&nbsp;walks
                </span>
              </h2>
              <h2 className="text-heading">
                Make <br />
                <span className="text-body" style={{ fontSize: "0.7em" }}>
                  your own walk by capturing what&nbsp;you&nbsp;see
                </span>
              </h2>
              <h2 className="text-heading">
                Watch <br />
                <span className="text-body" style={{ fontSize: "0.7em" }}>
                  your steps, distance + more
                </span>
              </h2>
            </div>
          </IonSlide>
          <IonSlide>
            <img
              className="intro__logo"
              src="assets/img/walksy-logo-2.svg"
              alt=""
            />
            <div className="constrain constrain--medium ion-padding">
              <img
                src="assets/img/walksy-anim-jiggle.gif"
                alt=""
                style={{ margin: "-60px auto -30px auto" }}
              />
              <h2 className="text-heading">Record your Nearby</h2>
              <p className="text-body" style={{ fontSize: "0.85em" }}>
                Join in adding to our library of walks, recording our collective
                outdoors. You can add images, sounds or notes to form your
                walks, whilst monitoring your distance&nbsp;&amp;&nbsp;steps.
              </p>
            </div>
          </IonSlide>
          <IonSlide>
            <img
              className="intro__logo"
              src="assets/img/walksy-logo-2.svg"
              alt=""
            />
            <div className="constrain constrain--medium ion-padding">
              <p className="text-body" style={{ fontSize: "0.85em" }}>
                The &#8216;Walksy.&#8217; (Walk &amp; See) App has been devised
                and created by Art Walk Projects (Edinburgh) offering a creative
                way to record our outdoors, whilst encouraging us to walk more
                and improve our&nbsp;wellbeing.
              </p>
              <IonGrid>
                <IonRow className="ion-margin-top">
                  <IonCol>
                    <IonCard className="ion-no-margin">
                      <IonCardHeader className="ion-no-padding" color="dark">
                        <IonCardSubtitle className="ion-padding ion-no-margin ion-text-uppercase ion-text-center">
                          Supported by:
                        </IonCardSubtitle>
                      </IonCardHeader>
                      <IonCardContent>
                        <IonGrid>
                          <IonRow class="ion-align-items-center">
                            <IonCol>
                              <img
                                className="intro__partner ion-margin"
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
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </div>
          </IonSlide>
          <IonSlide>
            <img
              src="assets/img/walksy-anim-rotate.gif"
              alt=""
              style={{ margin: "-60px auto 0 auto", maxHeight: "20vh" }}
            />
            <div className="constrain constrain--medium">
              {loggedIn ? (
                <>
                  <img
                    className="logo"
                    src="assets/img/walksy-logo-2.svg"
                    alt=""
                    style={{
                      maxHeight: "80px",
                    }}
                  />
                  <IonButton className="ion-margin-top" routerLink="/app/home">
                    Back to Home
                  </IonButton>
                </>
              ) : (
                <IonCard>
                  <IonCardHeader className="ion-no-padding" color="dark">
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
              )}
            </div>
          </IonSlide>
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};

export default Intro;
