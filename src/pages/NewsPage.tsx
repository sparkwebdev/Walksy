import React from "react";
import {
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  IonSpinner,
} from "@ionic/react";
import PageHeader from "../components/PageHeader";
import LatestNews from "../components/LatestNews";
import { useAuthInit } from "../auth";

const NewsPage: React.FC = () => {
  const { loading } = useAuthInit();
  return (
    <IonPage>
      <PageHeader title="Latest ArtWalk News" />
      <IonContent>
        <IonGrid className="constrain constrain--large">
          <IonRow className="ion-margin-top">
            <IonCol>
              {loading && (
                <div className="spinner ion-text-center">
                  <IonSpinner color="primary" name="dots" />
                </div>
              )}
              {!loading && <LatestNews count={10} />}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default NewsPage;
