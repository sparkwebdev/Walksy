import { IonPage, IonContent, IonGrid, IonRow, IonCol } from "@ionic/react";
import React from "react";
import LatestWellbeing from "../components/LatestWellbeing";
import PageHeader from "../components/PageHeader";

const WellBeingPage: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Wellbeing" />
      <IonContent>
        <IonGrid className="constrain constrain--large">
          <IonRow className="ion-margin-top">
            <IonCol>
              <LatestWellbeing count={10} />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default WellBeingPage;
