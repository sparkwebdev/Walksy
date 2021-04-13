import { IonPage, IonContent } from "@ionic/react";
import React from "react";
import PageHeader from "../components/PageHeader";

const GalleryPage: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Wellbeing" />
      <IonContent>
        <div className="constrain constrain--large">
          <p>Wellbeing content</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default GalleryPage;
