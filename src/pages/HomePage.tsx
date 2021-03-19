import { IonPage, IonContent, IonCard, IonList, IonItem } from "@ionic/react";
import React, { useEffect, useState } from "react";
import MomentItemPreview from "../components/MomentItemPreview";
import PageHeader from "../components/PageHeader";
import { Moment, toMoment } from "../data/models";
import { firestore } from "../firebase";

const HomePage: React.FC = () => {
  const [moments, setMoments] = useState<Moment[]>([]);

  useEffect(() => {
    const momentsRef = firestore
      .collection("users-moments")
      .where("imagePath", "!=", "");
    return momentsRef.orderBy("imagePath").onSnapshot(({ docs }) => {
      setMoments(docs.map(toMoment));
    });
  }, []);

  return (
    <IonPage>
      <PageHeader title="Browse Gallery" />
      <IonContent>
        <IonList>
          <IonItem routerLink="/app/good-memories">Good Memories</IonItem>
          <IonItem routerLink="/app/bad-memories">Bad Memories</IonItem>
          <IonItem routerLink="/app/new-memory">New Memory</IonItem>
        </IonList>
        {moments.map((moment, index) => (
          <IonCard
            className="ion-no-margin ion-no-padding"
            key={index}
            routerLink={`/app/walk/${moment.walkId}`}
          >
            <MomentItemPreview
              walkId={moment.walkId}
              coverImage={moment.imagePath}
            />
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
