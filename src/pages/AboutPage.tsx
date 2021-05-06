import React from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
} from "@ionic/react";
import PageHeader from "../components/PageHeader";

const AboutPage: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="About" />
      <IonContent>
        <IonGrid className="constrain constrain--large">
          <IonRow className="ion-margin-top">
            <IonCol>
              <p className="text-body">
                The 'Walksy.' (Walk &amp; See) App builds a collective library
                around walking. The App has been created to encourage more
                walking in our local environments and across neighbourhoods,
                providing a fun way to engage with our outdoors through an image
                based process of recording walks. Over time we hope for a
                library of walks to be created through the App collecting user’s
                walking journeys; of the places uncovered, recording the
                specific details observed or heard while we walk. Our curated
                walks show routes that walking practice artists have created,
                offering ways to reconsider our walking landscapes and
                cityscapes, with some focussed around a particular outdoor art
                trail or relating to a specific project we’ve produced. We hope
                users enjoy the act of creating walks for the app by using
                either images, audio or text to describe their walk, at the same
                time as improving their wellbeing.
              </p>
              <p className="text-body">
                Created for 2021 at a time when many of us have experienced
                various lockdowns, we feel its an exciting time to launch a
                walking App and to see where people take their walks,
                discovering new places to go during this time.
              </p>
              <p className="text-body">
                The App has been devised and created by Art Walk Projects
                (Edinburgh) working with app developer Steven Park, and
                supported by Smarter Choices, Smarter Places (Paths for All) &
                The National Lottery Community Fund.
              </p>
              <p className="text-body">
                We will be developing the App over time, and welcome user’s
                feedback via email{" "}
                <a href="mailto:walksy@artwalkporty.co.uk">
                  walksy@artwalkporty.co.uk
                </a>
              </p>

              <h3 className="text-heading ion-text-center">
                <a href="http://www.artwalkprojects.co.uk">
                  artwalkprojects.co.uk
                </a>
              </h3>
              <h3 className="text-heading ion-text-center">
                <a href="mailto:walksy@artwalkporty.co.uk">
                  walksy@artwalkporty.co.uk
                </a>
              </h3>
            </IonCol>
          </IonRow>
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
                      <IonCol className="ion-padding">
                        <img
                          className="intro__partner ion-margin"
                          src="assets/img/login_smarter-choices.svg"
                          alt=""
                        />
                      </IonCol>
                      <IonCol className="ion-padding ion-margin">
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
          <IonRow className="ion-margin ion-text-center">
            <IonCol>
              <p className="text-body">
                &copy; 2021 Art Walk Projects CIC All Rights Reserved
              </p>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default AboutPage;
