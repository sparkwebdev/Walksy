import {
  IonPage,
  IonContent,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonLoading,
  IonCardContent,
  IonText,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useAuth } from "../auth";
import MomentItemPreview from "../components/MomentItemPreview";
import PageHeader from "../components/PageHeader";
import { Moment, toMoment } from "../data/models";
import { firestore, getRemoteUserData } from "../firebase";

const GalleryPage: React.FC = () => {
  const { userId } = useAuth();
  const [moments, setMoments] = useState<Moment[][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [displayName, setDisplayName] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string>("");

  useEffect(() => {
    if (userId) {
      getRemoteUserData(userId).then((data) => {
        loadUserData(data);
      });
    }
  }, [userId]);

  const loadUserData = (userData: any) => {
    setDisplayName(userData?.displayName);
    setProfilePic(userData?.profilePic);
  };

  useEffect(() => {
    setLoading(true);
    const momentsRef = firestore
      .collection("users-moments")
      .limit(60)
      .where("imagePath", "!=", "");
    return momentsRef.onSnapshot(({ docs }) => {
      const moments = docs.map(toMoment);
      const momentsWithImages = moments.filter(
        (moment) => moment.imagePath !== ""
      );
      const momentsGrouped = momentsWithImages.reduce(function (r, a) {
        r[a.walkId] = r[a.walkId] || [];
        r[a.walkId].push(a);
        return r;
      }, Object.create(null));

      const momentsGroupedArray = Object.keys(momentsGrouped).map(function (
        key
      ) {
        return momentsGrouped[key].splice(0, 3);
      });
      setMoments(momentsGroupedArray);
      setLoading(false);
    });
  }, []);

  return (
    <IonPage>
      <PageHeader title="Browse Gallery" />
      <IonContent>
        <div className="constrain constrain--large">
          {!loading &&
            moments.map((moment) => (
              <IonCard
                className="ion-no-margin gallery-group"
                style={{ background: "#777269" }}
                routerLink={`/app/walk/${moment[0].walkId}`}
                key={moment[0].walkId}
              >
                <IonGrid className="grid grid--half grid--half-with-full ion-no-padding">
                  <IonRow>
                    {moment.map((moment) => (
                      <IonCol key={moment.id}>
                        <MomentItemPreview
                          walkId={moment.walkId}
                          coverImage={moment.imagePath}
                          imageOnly={true}
                        />
                      </IonCol>
                    ))}

                    <IonCardContent className="walk-item__content">
                      <IonText className="text-heading">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            color: "#fff",
                          }}
                        >
                          {profilePic && (
                            <img
                              src={profilePic}
                              alt=""
                              className="walk-item__profile-badge profile-badge__image profile-badge__image--smaller"
                              width="40"
                              height="40"
                              style={{ marginRight: "10px" }}
                            />
                          )}
                          <p>
                            <strong>{displayName}</strong>
                          </p>
                        </div>
                      </IonText>
                    </IonCardContent>
                  </IonRow>
                </IonGrid>
              </IonCard>
            ))}
        </div>
        <IonLoading isOpen={loading} />
      </IonContent>
    </IonPage>
  );
};

export default GalleryPage;
