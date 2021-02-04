import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import React from 'react';

const NotFound: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Not found</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        Sorry, not found.
      </IonContent>
    </IonPage>
  );
};

export default NotFound;
