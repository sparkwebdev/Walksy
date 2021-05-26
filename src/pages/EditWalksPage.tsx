import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonList,
  IonToast,
  IonRouterLink,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonAlert,
  IonLoading,
} from "@ionic/react";
import { firestore } from "../firebase";
import { Walk, toWalk } from "../data/models";
import PageHeader from "../components/PageHeader";
import { deleteStoredItem } from "../firebase";
import { trash as deleteIcon, createOutline as editIcon } from "ionicons/icons";
import WalkItemPreview from "../components/WalkItemPreview";

const EditWalksPage: React.FC = () => {
  const [walks, setWalks] = useState<Walk[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [notice, setNotice] = useState<{
    showNotice: boolean;
    noticeColour?: string;
    message?: string;
  }>({ showNotice: false });
  const [itemIdToDelete, setItemIdToDelete] = useState<string>("");
  const [deleteAlert, setDeleteAlert] = useState<boolean>(false);

  const deleteWalk = async () => {
    setLoading(true);
    if (!itemIdToDelete) {
      return;
    }
    await deleteStoredItem("users-walks", itemIdToDelete)
      .then(() => {
        const momentsRef = firestore
          .collection("users-moments")
          .where("walkId", "==", itemIdToDelete);
        return momentsRef
          .get()
          .then((query) => {
            query.docs.forEach((moment) => {
              const data = moment.data();
              deleteStoredItem(
                "users-moments",
                moment.id,
                data.imagePath || data.audioPath
              );
            });
          })
          .catch(() => {
            setNotice({
              showNotice: true,
              message: "Error removing moments",
              noticeColour: "error",
            });
          });
      })
      .catch(() => {
        setNotice({
          showNotice: true,
          message: "Error removing walk",
          noticeColour: "error",
        });
      });
    setNotice({
      showNotice: true,
      message: "Successfully deleted walk and moments",
      noticeColour: "error",
    });
    setLoading(false);
  };

  useEffect(() => {
    const walksRef = firestore.collection("users-walks");
    return walksRef
      .orderBy("start", "desc")
      .limit(50)
      .onSnapshot(({ docs }) => setWalks(docs.map(toWalk)));
  }, []);

  return (
    <IonPage>
      <PageHeader title="Edit Walks" />
      <IonContent>
        <div className="constrain constrain--wide ion-padding">
          {walks.length > 0 && (
            <>
              <IonGrid>
                <IonRow>
                  <IonCol className="ion-text-center">
                    <IonButton
                      className="ion-margin"
                      color="secondary"
                      routerLink="/app/new-walk"
                    >
                      Add new
                    </IonButton>
                  </IonCol>
                </IonRow>
                <IonList lines="none">
                  {walks.map((walk) => (
                    <IonRow
                      className="ion-no-margin ion-no-padding"
                      key={walk.id}
                    >
                      <IonGrid>
                        <IonRow>
                          <IonCol size="10">
                            <IonRouterLink routerLink={`/app/walk/${walk.id}`}>
                              <WalkItemPreview
                                id={walk.id}
                                title={walk.title}
                                colour={walk.colour}
                                description={walk.description}
                                start={walk.start}
                                distance={walk.distance}
                                userId={walk.userId}
                                isCircular={walk.circular}
                                location={walk?.location}
                                isMiniPreview={true}
                              />
                            </IonRouterLink>
                          </IonCol>
                          <IonCol size="2" className="ion-align-self-center">
                            <IonButton routerLink={`/app/walk/edit/${walk.id}`}>
                              <IonIcon
                                icon={editIcon}
                                slot="icon-only"
                                size="small"
                              />
                            </IonButton>
                            <IonButton
                              onClick={() => {
                                setItemIdToDelete(walk.id);
                                setDeleteAlert(true);
                              }}
                              color="danger"
                            >
                              <IonIcon
                                icon={deleteIcon}
                                slot="icon-only"
                                size="small"
                              />
                            </IonButton>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonRow>
                  ))}
                </IonList>
              </IonGrid>
              <IonAlert
                isOpen={deleteAlert}
                onDidDismiss={() => {
                  setDeleteAlert(false);
                  setItemIdToDelete("");
                }}
                header={"Delete Walk"}
                subHeader={
                  "Are you sure? This will also delete the Walks's Moments."
                }
                buttons={[
                  {
                    text: "No",
                    role: "cancel",
                  },
                  {
                    text: "Yes",
                    cssClass: "secondary",
                    handler: deleteWalk,
                  },
                ]}
              />
            </>
          )}
        </div>
      </IonContent>
      <IonLoading isOpen={loading} />
      <IonToast
        duration={2000}
        position="middle"
        isOpen={notice.showNotice}
        onDidDismiss={() =>
          setNotice({ showNotice: false, message: undefined })
        }
        message={notice.message}
        color="success"
      />
    </IonPage>
  );
};

export default EditWalksPage;
