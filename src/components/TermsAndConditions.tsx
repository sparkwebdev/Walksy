import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCol,
  IonContent,
  IonGrid,
  IonRow,
} from "@ionic/react";
import React from "react";
import PrivacyPolicy from "./PrivacyPolicy";

const TermsAndConditions: React.FC<{
  onDismiss: () => void;
}> = (props) => {
  return (
    <IonContent className="ion-padding-top">
      <IonCard>
        <IonCardHeader className="ion-no-padding" color="dark">
          <IonCardSubtitle className="ion-padding ion-no-margin ion-text-uppercase ion-text-center">
            Terms and Conditions
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent className="ion-margin-top small-print">
          <PrivacyPolicy />
        </IonCardContent>
        <IonCardHeader className="ion-no-padding ion-margin-top" color="light">
          <IonGrid>
            <IonRow>
              <IonCol size="8" offset="2">
                <IonButton expand="block" onClick={props.onDismiss}>
                  Accept
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardHeader>
      </IonCard>
    </IonContent>
  );
};
export default TermsAndConditions;
