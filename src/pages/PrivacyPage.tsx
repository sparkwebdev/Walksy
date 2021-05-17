import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import PageHeader from "../components/PageHeader";
import PrivacyPolicy from "../components/PrivacyPolicy";
import PrivacyPolicyExtended from "../components/PrivacyPolicyExtended";

const PrivacyPage: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Privacy Policy" back={true} />
      <IonContent className="ion-padding">
        <div
          className="constrain constrain--large ion-margin-top"
          style={{ lineHeight: 2 }}
        >
          <PrivacyPolicy />

          <hr className="separator" />

          <PrivacyPolicyExtended />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PrivacyPage;
