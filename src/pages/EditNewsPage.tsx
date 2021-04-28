import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonRow,
  IonCol,
  IonGrid,
  IonButton,
  IonIcon,
  IonAlert,
} from "@ionic/react";
import { firestore } from "../firebase";
import { Entry, toEntry } from "../data/models";
import dayjs from "dayjs";
import PageHeader from "../components/PageHeader";
import { trash as deleteIcon, createOutline as editIcon } from "ionicons/icons";
import { deleteStoredItem } from "../firebase";

const EditNewsPage: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentAction, setCurrentAction] = useState<string>("View");

  const addEntry = async () => {};

  const editEntry = async (entryId: string) => {};

  const [itemIdToDelete, setItemIdToDelete] = useState<string>("");
  const [deleteAlert, setDeleteAlert] = useState<boolean>(false);
  const deleteEntry = () => {
    deleteStoredItem("entries", itemIdToDelete);
  };

  useEffect(() => {
    const entriesRef = firestore.collection("entries");
    return entriesRef
      .orderBy("createdAt", "desc")
      .limit(999)
      .onSnapshot(({ docs }) => setEntries(docs.map(toEntry)));
  }, []);

  return (
    <IonPage>
      <PageHeader title={`${currentAction} News`} />
      <IonContent>
        <div className="constrain constrain--wide ion-padding">
          {currentAction === "View" && (
            <IonGrid>
              <IonRow>
                <IonCol className="ion-text-center">
                  <IonButton
                    className="ion-margin"
                    color="secondary"
                    onClick={() => setCurrentAction("Add")}
                  >
                    Add new
                  </IonButton>
                </IonCol>
              </IonRow>
              {entries.map((entry) => (
                <IonRow className="ion-no-margin ion-no-padding" key={entry.id}>
                  <IonGrid>
                    <IonRow>
                      <IonCol size="9">
                        <h3 className="text-heading">{entry.title}</h3>
                        {entry.createdAt && (
                          <p className="text-heading">
                            {dayjs(entry.createdAt).format("dddd, DD MMM 'YY")}
                          </p>
                        )}
                      </IonCol>
                      <IonCol
                        offset="1"
                        size="2"
                        className="ion-align-self-center"
                      >
                        <IonButton
                          onClick={() => {
                            editEntry(entry.id);
                          }}
                        >
                          <IonIcon
                            icon={editIcon}
                            slot="icon-only"
                            size="small"
                          />
                        </IonButton>
                        <IonButton
                          onClick={() => {
                            setItemIdToDelete(entry.id);
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
              <IonAlert
                isOpen={deleteAlert}
                onDidDismiss={() => {
                  setDeleteAlert(false);
                  setItemIdToDelete("");
                }}
                header={"Delete"}
                subHeader={"Are you sure?"}
                buttons={[
                  {
                    text: "No",
                    role: "cancel",
                  },
                  {
                    text: "Yes",
                    cssClass: "secondary",
                    handler: deleteEntry,
                  },
                ]}
              />
            </IonGrid>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EditNewsPage;
