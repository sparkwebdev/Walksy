import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import PageHeader from "../components/PageHeader";

const EditWalksPage: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Edit Walks" />
      <IonContent>
        <div className="constrain constrain--wide">Edit Walks</div>
      </IonContent>
    </IonPage>
  );
};

export default EditWalksPage;
