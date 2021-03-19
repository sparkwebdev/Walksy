import React from "react";
import { IonCol, IonContent, IonGrid, IonPage, IonRow } from "@ionic/react";
import PageHeader from "../components/PageHeader";
import LatestNews from "../components/LatestNews";

const NewsPage: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Latest ArtWalk News" />
      <IonContent>
        <IonGrid className="constrain constrain--large">
          <IonRow className="ion-margin-top">
            <IonCol>
              <LatestNews count={10} />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default NewsPage;
