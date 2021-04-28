import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import PageHeader from "../components/PageHeader";
import { appData } from "../data/appData";

const CopyrightPage: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Copyright" back={true} />
      <IonContent className="ion-padding">
        <div className="constrain constrain--large ion-margin-top">
          {appData.copyright}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CopyrightPage;
