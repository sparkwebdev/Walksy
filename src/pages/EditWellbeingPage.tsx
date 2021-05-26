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
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonLoading,
  IonToast,
  IonBadge,
} from "@ionic/react";
import { firestore } from "../firebase";
import { Entry, toEntry } from "../data/models";
import dayjs from "dayjs";
import PageHeader from "../components/PageHeader";
import { trash as deleteIcon, createOutline as editIcon } from "ionicons/icons";
import { deleteStoredItem } from "../firebase";

const EditWellbeingPage: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentAction, setCurrentAction] = useState<string>("View");

  const [loading, setLoading] = useState<boolean>(false);
  const [notice, setNotice] = useState<{
    showNotice: boolean;
    noticeColour?: string;
    message?: string;
  }>({ showNotice: false });

  const [editEntryId, setEditEntryId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>(
    dayjs().format("YYYY-MM-DDTHH:mm")
  );

  const addEntry = async () => {
    setCurrentAction("Add");
  };

  const editEntry = (entryId: string) => {
    setCurrentAction("Edit");
    const entryData = entries.find((entry) => {
      return entry.id === entryId;
    });
    if (entryData) {
      setEditEntryId(entryData?.id || "");
      setTitle(entryData?.title || "");
      setContent(entryData?.content || "");
      setCategory(entryData?.category || "");
      if (entryData.createdAt) {
        const dateFormatted = dayjs(entryData.createdAt).format(
          "YYYY-MM-DDTHH:mm"
        );
        setCreatedAt(dateFormatted);
      }
    }
  };

  const storeEntry = async () => {
    setLoading(true);
    const data = {
      title,
      category,
      content,
      createdAt: new Date(createdAt).toISOString(),
    };
    if (editEntryId) {
      await firestore
        .collection("wellbeing-entries")
        .doc(editEntryId)
        .get()
        .then((doc) => {
          doc.ref.update(data);
          setNotice({
            showNotice: true,
            message: "Entry updated",
            noticeColour: "success",
          });
          resetEdit();
        })
        .catch(() => {
          setNotice({
            showNotice: true,
            message: "Error updating entry to storage",
            noticeColour: "error",
          });
        });
    } else {
      await firestore
        .collection("wellbeing-entries")
        .add(data)
        .then(() => {
          setNotice({
            showNotice: true,
            message: "Entry added",
            noticeColour: "success",
          });
          resetEdit();
        })
        .catch((e) => {
          setNotice({
            showNotice: true,
            message: "Error adding entry to storage",
            noticeColour: "error",
          });
        });
    }
    setLoading(false);
  };

  const [itemIdToDelete, setItemIdToDelete] = useState<string>("");
  const [deleteAlert, setDeleteAlert] = useState<boolean>(false);
  const deleteEntry = () => {
    deleteStoredItem("wellbeing-entries", itemIdToDelete);
    setNotice({
      showNotice: true,
      message: "Entry deleted",
      noticeColour: "success",
    });
  };

  const resetEdit = async () => {
    setEditEntryId("");
    setTitle("");
    setCategory("");
    setContent("");
    setCreatedAt(dayjs().format("YYYY-MM-DDTHH:mm"));
    setCurrentAction("View");
  };

  useEffect(() => {
    const entriesRef = firestore.collection("wellbeing-entries");
    return entriesRef
      .orderBy("createdAt", "desc")
      .limit(16)
      .onSnapshot(({ docs }) => setEntries(docs.map(toEntry)));
  }, []);

  return (
    <IonPage>
      <PageHeader title={`${currentAction} Wellbeing`} />
      <IonContent>
        <div className="constrain constrain--wide ion-padding">
          <IonGrid>
            {(currentAction === "Edit" || currentAction === "Add") && (
              <>
                <IonRow>
                  <IonCol>
                    <IonList>
                      <IonItem>
                        <IonLabel position="stacked">Title</IonLabel>
                        <IonInput
                          className="input-text input-text--small"
                          type="text"
                          value={title}
                          onIonChange={(e) => setTitle(e.detail!.value!)}
                        />
                      </IonItem>
                      <IonItem>
                        <IonLabel position="stacked">Created At</IonLabel>
                        <IonInput
                          className="input-text input-text--small"
                          type="datetime-local"
                          value={createdAt}
                          onIonChange={(e) => setCreatedAt(e.detail!.value!)}
                        />
                      </IonItem>
                      <IonItem>
                        <IonLabel position="stacked">
                          Category (optional)
                        </IonLabel>
                        <IonInput
                          className="input-text input-text--small"
                          type="text"
                          value={category}
                          onIonChange={(e) => setCategory(e.detail!.value!)}
                        />
                      </IonItem>
                      <IonItem>
                        <IonLabel position="stacked">Content</IonLabel>
                        <IonTextarea
                          className="input-text input-text--small"
                          rows={8}
                          value={content}
                          onIonChange={(e) => setContent(e.detail.value!)}
                        ></IonTextarea>
                      </IonItem>
                    </IonList>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol className="ion-text-center">
                    <IonButton
                      className="ion-margin"
                      color={loading ? "dark" : "secondary"}
                      onClick={storeEntry}
                      disabled={!title && !content}
                    >
                      {loading ? "Saving" : "Save"}
                    </IonButton>
                    <IonButton
                      className="ion-margin"
                      color="tertiary"
                      onClick={resetEdit}
                    >
                      Close
                    </IonButton>
                  </IonCol>
                </IonRow>
              </>
            )}
            {currentAction === "View" && (
              <>
                <IonRow>
                  <IonCol className="ion-text-center">
                    <IonButton
                      className="ion-margin"
                      color="secondary"
                      onClick={addEntry}
                    >
                      Add new
                    </IonButton>
                  </IonCol>
                </IonRow>
                {entries.map((entry) => (
                  <IonRow
                    className="ion-no-margin ion-no-padding"
                    key={entry.id}
                  >
                    <IonGrid>
                      <IonRow>
                        <IonCol size="10">
                          <div
                            className="ion-no-margin ion-no-padding info-bubble"
                            key={entry.id}
                          >
                            {entry.title && (
                              <h2 className="text-heading">{entry.title}</h2>
                            )}
                            {entry.category && (
                              <IonBadge
                                className="info-bubble__category"
                                color="light"
                              >
                                {entry.category}
                              </IonBadge>
                            )}
                            {entry.content && (
                              <p className="text-body">{entry.content}</p>
                            )}
                            {entry.createdAt && (
                              <p className="text-heading">
                                {dayjs(entry.createdAt).format(
                                  "dddd, DD MMM 'YY"
                                )}
                              </p>
                            )}
                          </div>
                        </IonCol>
                        <IonCol size="2" className="ion-align-self-center">
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
              </>
            )}
          </IonGrid>
        </div>
      </IonContent>
      <IonLoading isOpen={loading} />
      <IonToast
        duration={3000}
        position="middle"
        isOpen={notice.showNotice}
        onDidDismiss={() =>
          setNotice({ showNotice: false, message: undefined })
        }
        message={notice.message}
        color={notice.noticeColour}
      />
    </IonPage>
  );
};

export default EditWellbeingPage;
