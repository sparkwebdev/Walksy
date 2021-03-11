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
import LatestNews from "../components/LatestNews";

const AboutPage: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="About" back={true} />
      <IonContent>
        <div className="constrain constrain--large">
          <div className="ion-padding">
            <LatestNews count={5} />
            <hr />
            <h2 className="text-heading">About</h2>
            <p className="text-body">
              The &#8216;Walksy&#8217; (Walk &amp; See) App has been devised and
              created by Art Walk Projects (Edinburgh). Minim adipisicing aliqua
              esse sunt Lorem eu consequat enim exercitation veniam minim. Quis
              duis consequat aute nostrud elit non sint esse ipsum laborum
              exercitation labore elit amet. Aliqua veniam voluptate elit
              voluptate sunt dolor duis magna. Ipsum laboris eu sint labore
              excepteur magna anim officia irure labore. Aliqua incididunt non
              fugiat ullamco non.
            </p>
          </div>
          <IonCard>
            <IonCardHeader className="ion-no-padding" color="dark">
              <IonCardSubtitle className="ion-padding ion-no-margin ion-text-uppercase ion-text-center">
                Funded by:
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
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
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AboutPage;
