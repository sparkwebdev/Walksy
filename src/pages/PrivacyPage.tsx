import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import PageHeader from "../components/PageHeader";
import { appData } from "../data/appData";
import PrivacyPolicy from "../components/PrivacyPolicy";

const CopyrightPage: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Privacy Policy" back={true} />
      <IonContent className="ion-padding">
        <div
          className="constrain constrain--large ion-margin-top"
          style={{ lineHeight: 2 }}
        >
          <PrivacyPolicy />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CopyrightPage;
