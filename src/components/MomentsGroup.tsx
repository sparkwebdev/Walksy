import {
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonCardContent,
  IonLabel,
  IonItem,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import MomentItemPreview from "../components/MomentItemPreview";
import { Moment, toMoment } from "../data/models";
import { firestore, getRemoteUserData } from "../firebase";

const MomentsGroup: React.FC<{
  walkId: string;
  walkTitle: string;
  walkColour: string;
  userId: string;
}> = (props) => {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    if (props.userId) {
      getRemoteUserData(props.userId)
        .then((data) => {
          loadUserData(data);
        })
        .catch((e) => {
          console.log("Couldn't get remote user data", e);
        });
    }
  }, [props.userId]);

  const loadUserData = (userData: any) => {
    setDisplayName(userData?.displayName);
  };

  useEffect(() => {
    const momentsRef = firestore
      .collection("users-moments")
      .where("walkId", "==", props.walkId)
      .where("imagePath", "!=", "")
      .limit(3);
    return momentsRef.onSnapshot(({ docs }) => {
      const moments = docs.map(toMoment);
      setMoments(moments);
    });
  }, [props.walkId]);

  return (
    <div className="ion-margin-bottom">
      <IonCard
        className="ion-no-margin gallery-group"
        style={{ background: "#777269" }}
        routerLink={`/app/walk/${props.walkId}`}
      >
        <IonGrid className="grid grid--half grid--half-with-full ion-no-padding">
          <IonRow>
            {moments.map((moment) => (
              <IonCol key={moment.id}>
                <MomentItemPreview
                  walkId={moment.walkId}
                  coverImage={moment.imagePath}
                  imageOnly={true}
                />
              </IonCol>
            ))}
            <IonCardContent
              className="walk-item__content ion-no-padding ion-no-margin"
              style={{
                borderBottom: "solid 6px " + props.walkColour,
              }}
            >
              <IonItem
                className="ion-item-transparent"
                lines="none"
                detail={true}
              >
                <IonLabel color="medium">
                  <h3 className="walk-item__title text-heading">
                    {props.walkTitle}
                  </h3>
                  <ul className="walk-item__meta-data text-body">
                    {displayName && (
                      <li className="walk-item__username"> by {displayName}</li>
                    )}
                  </ul>
                </IonLabel>
              </IonItem>
            </IonCardContent>
          </IonRow>
        </IonGrid>
      </IonCard>
    </div>
  );
};

export default MomentsGroup;
