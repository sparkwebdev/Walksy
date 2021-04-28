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
      <PageHeader title="About" back={true} />
      <IonContent>
        <IonGrid className="constrain constrain--large">
          <IonRow className="ion-margin-top">
            <IonCol>
              <p className="text-body">
                The &#8216;Walksy&#8217; (Walk &amp; See) App has been devised
                and created by Art Walk Projects (Edinburgh). Minim adipisicing
                aliqua esse sunt Lorem eu consequat enim exercitation veniam
                minim. Quis duis consequat aute nostrud elit non sint esse ipsum
                laborum exercitation labore elit amet.
              </p>
              <p className="text-body">
                Aliqua veniam voluptate elit voluptate sunt dolor duis magna.
                Ipsum laboris eu sint labore excepteur magna anim officia irure
                labore. Aliqua incididunt non fugiat ullamco non.
              </p>
            </IonCol>
          </IonRow>
          <IonRow className="ion-margin-top">
            <IonCol>
              <IonCard className="ion-no-margin">
                <IonCardHeader className="ion-no-padding" color="dark">
                  <IonCardSubtitle className="ion-padding ion-no-margin ion-text-uppercase ion-text-center">
                    Funded by:
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
          <IonRow>
            <IonCol>
              <p className="text-body">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
                voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores eos qui ratione voluptatem sequi
                nesciunt.
              </p>
              <p className="text-body">
                Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
                consectetur, adipisci velit, sed quia non numquam eius modi
                tempora incidunt ut labore et dolore magnam aliquam quaerat
                voluptatem.
              </p>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default AboutPage;
