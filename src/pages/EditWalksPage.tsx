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
  IonLoading,
  IonToast,
  IonItem,
  IonCard,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelectOption,
  IonSelect,
} from "@ionic/react";
import { firestore } from "../firebase";
import { Walk, toWalk, toMoment, Moment } from "../data/models";
import PageHeader from "../components/PageHeader";
import { trash as deleteIcon, createOutline as editIcon } from "ionicons/icons";
import { deleteStoredItem } from "../firebase";
import WalkItemPreview from "../components/WalkItemPreview";
import dayjs from "dayjs";
import { appData } from "../data/appData";
import {
  generateHslaColors,
  getFriendlyTimeOfDay,
  getFriendlyWalkDescriptor,
} from "../helpers";

const suggestedDescriptors = appData.suggestedDescriptors;

const suggestedTitle = `${getFriendlyTimeOfDay()} ${getFriendlyWalkDescriptor()}`;

const suggestedColour = generateHslaColors(1, undefined, undefined, true);

const EditWalksPage: React.FC = () => {
  const [walks, setWalks] = useState<Walk[]>([]);
  const [currentAction, setCurrentAction] = useState<string>("View");

  const [loading, setLoading] = useState<boolean>(false);
  const [notice, setNotice] = useState<{
    showNotice: boolean;
    noticeColour?: string;
    message?: string;
  }>({ showNotice: false });

  const [editWalkId, setEditWalkId] = useState<string>("");
  const [title, setTitle] = useState<string>(suggestedTitle);
  const [type, setType] = useState<"user" | "curated" | "featured">("user");
  const [colour, setColour] = useState<string>(suggestedColour[0]);
  const [overview, setOverview] = useState<string>("");
  const [descriptor1, setDescriptor1] = useState<string>("");
  const [descriptor2, setDescriptor2] = useState<string>("");
  const [descriptor3, setDescriptor3] = useState<string>("");
  const [start, setStart] = useState<string>(
    dayjs().format("YYYY-MM-DDThh:mm")
  );
  const [end, setEnd] = useState<string>(dayjs().format("YYYY-MM-DDThh:mm"));
  const [distance, setDistance] = useState<number>(0);
  const [location, setLocation] = useState<string>("");
  const [circular, setCircular] = useState<string>("false");

  const addWalk = async () => {
    setCurrentAction("Add");
    setEditWalkId("");
    setMoments([]);
  };

  const editWalk = (walkId: string) => {
    setCurrentAction("Edit");
    const walkData = walks.find((walk) => {
      return walk.id === walkId;
    });
    if (walkData) {
      setEditWalkId(walkData?.id || "");
      setTitle(walkData?.title || "");
      setType(walkData?.type || "");
      setOverview(walkData?.overview || "");
      setColour(walkData?.colour || "");
      if (walkData.start) {
        const dateFormatted = dayjs(walkData.start).format("YYYY-MM-DDThh:mm");
        setStart(dateFormatted);
      }
      if (walkData.end) {
        const dateFormatted = dayjs(walkData.end).format("YYYY-MM-DDThh:mm");
        setEnd(dateFormatted);
      }
      if (walkData.description) {
        walkData.description.forEach((descriptor, index) => {
          if (index === 0) {
            setDescriptor1(descriptor);
          } else if (index === 1) {
            setDescriptor2(descriptor);
          } else if (index === 2) {
            setDescriptor3(descriptor);
          }
        });
      }
      setDistance(walkData?.distance || 0);
      setLocation(walkData?.location || "");
      setCircular(walkData?.circular.toString() || "false");
    }
  };

  const storeWalk = async () => {
    setLoading(true);
    const description = [descriptor1, descriptor2, descriptor3].filter(Boolean);
    const data = {
      title,
      type,
      colour,
      overview,
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      distance,
      location,
      circular: circular === "true",
      description,
    };
    if (editWalkId) {
      await firestore
        .collection("users-walks")
        .doc(editWalkId)
        .get()
        .then((doc) => {
          doc.ref.update(data);
          setNotice({
            showNotice: true,
            message: "Walk updated",
            noticeColour: "success",
          });
          resetEdit();
        })
        .catch(() => {
          setNotice({
            showNotice: true,
            message: "Error updating walk to storage",
            noticeColour: "error",
          });
        });
    } else {
      // await firestore
      //   .collection("users-walks")
      //   .add(data)
      //   .then(() => {
      //     setNotice({
      //       showNotice: true,
      //       message: "Walk added",
      //       noticeColour: "success",
      //     });
      //     resetEdit();
      //   })
      //   .catch((e) => {
      //     setNotice({
      //       showNotice: true,
      //       message: "Error adding walk to storage",
      //       noticeColour: "error",
      //     });
      //   });
    }
    setLoading(false);
  };

  const [closeAlert, setCloseAlert] = useState<boolean>(false);

  const [itemIdToDelete, setItemIdToDelete] = useState<string>("");
  const [deleteAlert, setDeleteAlert] = useState<boolean>(false);
  const deleteWalk = async () => {
    setLoading(true);
    await deleteStoredItem("users-walks", itemIdToDelete)
      .then(() => {
        console.log("Successfully deleted walk: ", itemIdToDelete);
        const momentsRef = firestore
          .collection("users-moments")
          .where("walkId", "==", itemIdToDelete);
        return momentsRef
          .get()
          .then((query) => {
            query.docs.forEach((moment) => {
              moment.ref.delete();
              console.log("Successfully deleted moment: ", moment.id);
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

  const resetEdit = async () => {
    setEditWalkId("");
    setType("user");
    setTitle("");
    setColour("");
    setOverview("");
    setDescriptor1("");
    setDescriptor2("");
    setDescriptor3("");
    setStart(dayjs().format("YYYY-MM-DDThh:mm"));
    setEnd(dayjs().format("YYYY-MM-DDThh:mm"));
    setDistance(0);
    setLocation("");
    setCircular("false");
    setCurrentAction("View");
    setMoments([]);
  };

  const [moments, setMoments] = useState<Moment[]>([]);
  const [deleteMomentAlert, setDeleteMomentAlert] = useState<boolean>(false);
  const [momentItemIdToDelete, setMomentItemIdToDelete] = useState<string>("");

  const deleteMoment = async () => {
    setLoading(true);
    await deleteStoredItem("users-moments", momentItemIdToDelete)
      .then(() => {
        setNotice({
          showNotice: true,
          message: "Successfully deleted moment",
          noticeColour: "error",
        });
      })
      .catch(() => {
        setNotice({
          showNotice: true,
          message: "Error removing moment",
          noticeColour: "error",
        });
      });
    setLoading(false);
  };

  useEffect(() => {
    const walksRef = firestore.collection("users-walks");
    return walksRef
      .orderBy("start", "desc")
      .limit(25)
      .onSnapshot(({ docs }) => setWalks(docs.map(toWalk)));
  }, []);

  useEffect(() => {
    if (editWalkId) {
      const momentsRef = firestore
        .collection("users-moments")
        .where("walkId", "==", editWalkId);
      return momentsRef.orderBy("timestamp").onSnapshot(({ docs }) => {
        setMoments(docs.map(toMoment));
      });
    }
  }, [editWalkId]);

  return (
    <IonPage>
      <PageHeader title={`${currentAction} Walk`} />
      <IonContent>
        <div className="constrain constrain--wide ion-padding">
          <IonGrid>
            {(currentAction === "Edit" || currentAction === "Add") && (
              <>
                <IonRow>
                  <IonCol>
                    <IonList>
                      <IonGrid>
                        <IonRow>
                          <IonCol size="12" sizeSm="6" sizeMd="8">
                            <IonLabel position="stacked">Title</IonLabel>
                            <IonInput
                              className="input-text input-text--small"
                              type="text"
                              value={title}
                              onIonChange={(e) => setTitle(e.detail!.value!)}
                            />
                          </IonCol>
                          <IonCol size="12" sizeSm="6" sizeMd="4">
                            <IonLabel position="stacked">Type</IonLabel>
                            <IonSelect
                              onIonChange={(event) =>
                                setType(event.detail!.value!)
                              }
                              value={type}
                              className="input-select input-select--small"
                            >
                              <IonSelectOption value="curated">
                                curated
                              </IonSelectOption>
                              <IonSelectOption value="featured">
                                featured
                              </IonSelectOption>
                              <IonSelectOption value="user">
                                user
                              </IonSelectOption>
                            </IonSelect>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                      <IonItem>
                        <IonGrid>
                          <IonRow>
                            <IonCol size="12" sizeMd="4">
                              <IonLabel position="stacked">Location</IonLabel>
                              <IonInput
                                className="input-text input-text--small"
                                type="text"
                                value={location}
                                onIonChange={(e) =>
                                  setLocation(e.detail!.value!)
                                }
                              />
                            </IonCol>
                            <IonCol size="12" sizeSm="6" sizeMd="4">
                              <IonLabel position="stacked">Distance</IonLabel>
                              <IonInput
                                className="input-text input-text--small"
                                type="number"
                                value={distance}
                                onIonChange={(e) =>
                                  setDistance(Number(e.detail!.value!))
                                }
                              />
                            </IonCol>
                            <IonCol size="12" sizeSm="6" sizeMd="4">
                              <IonGrid className="ion-no-padding">
                                <IonRow className="ion-align-items-center">
                                  <IonCol size="8">
                                    <IonLabel position="stacked">
                                      Colour
                                    </IonLabel>
                                    <IonInput
                                      className="input-text input-text--small"
                                      placeholder="#29aae2"
                                      type="text"
                                      maxlength={7}
                                      value={colour}
                                      onIonChange={(event) =>
                                        setColour(event.detail!.value!)
                                      }
                                    />
                                  </IonCol>
                                  <IonCol size="4">
                                    <div
                                      style={{
                                        background: colour,
                                        height: "2em",
                                        marginTop: "1em",
                                      }}
                                    ></div>
                                  </IonCol>
                                </IonRow>
                              </IonGrid>
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      </IonItem>
                      <IonItem>
                        <IonGrid>
                          <IonRow>
                            <IonCol size="12" sizeSm="6">
                              <IonLabel position="stacked">Start</IonLabel>
                              <IonInput
                                className="input-text input-text--small"
                                type="datetime-local"
                                value={start}
                                onIonChange={(e) => setStart(e.detail!.value!)}
                              />
                            </IonCol>
                            <IonCol size="12" sizeSm="6">
                              <IonLabel position="stacked">End</IonLabel>
                              <IonInput
                                className="input-text input-text--small"
                                type="datetime-local"
                                value={end}
                                onIonChange={(e) => setEnd(e.detail!.value!)}
                              />
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      </IonItem>
                      <IonItem>
                        <IonLabel position="stacked">
                          Description (choose 3)
                        </IonLabel>
                        <br />
                        <span className="small-print">
                          <small>
                            Choose from: {suggestedDescriptors.join(", ")}
                          </small>
                        </span>
                        <IonGrid>
                          <IonRow>
                            <IonCol size="12" sizeSm="4">
                              <IonInput
                                className="input-text input-text--small"
                                type="text"
                                value={descriptor1}
                                onIonChange={(event) =>
                                  setDescriptor1(event.detail!.value!)
                                }
                              />
                            </IonCol>
                            <IonCol size="12" sizeSm="4">
                              <IonInput
                                className="input-text input-text--small"
                                type="text"
                                value={descriptor2}
                                onIonChange={(event) =>
                                  setDescriptor2(event.detail!.value!)
                                }
                              />
                            </IonCol>
                            <IonCol size="12" sizeSm="4">
                              <IonInput
                                className="input-text input-text--small"
                                type="text"
                                value={descriptor3}
                                onIonChange={(event) =>
                                  setDescriptor3(event.detail!.value!)
                                }
                              />
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      </IonItem>
                      <IonItem>
                        <IonLabel position="stacked">Circular</IonLabel>
                        <IonSelect
                          onIonChange={(event) =>
                            setCircular(event.detail!.value!)
                          }
                          value={circular.toString()}
                          className="input-select input-select--small"
                        >
                          <IonSelectOption value="true">Yes</IonSelectOption>
                          <IonSelectOption value="false">No</IonSelectOption>
                        </IonSelect>
                      </IonItem>
                      <IonItem>
                        <IonLabel position="stacked">
                          Overview (for curated walks)
                        </IonLabel>
                        <IonTextarea
                          className="input-select input-select--small"
                          rows={6}
                          value={overview}
                          onIonChange={(event) => {
                            setOverview(event.detail!.value!);
                          }}
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
                      onClick={storeWalk}
                      disabled={!title || !start}
                    >
                      {loading ? "Saving" : "Save"}
                    </IonButton>
                    <IonButton
                      className="ion-margin"
                      color="tertiary"
                      onClick={() => setCloseAlert(true)}
                    >
                      Close
                    </IonButton>
                    <IonAlert
                      isOpen={closeAlert}
                      onDidDismiss={() => {
                        setCloseAlert(false);
                      }}
                      header={"Are you sure?"}
                      subHeader={"Any changes you make will be lost"}
                      buttons={[
                        {
                          text: "No",
                          role: "cancel",
                        },
                        {
                          text: "Yes",
                          cssClass: "secondary",
                          handler: resetEdit,
                        },
                      ]}
                    />
                  </IonCol>
                </IonRow>
                <hr className="separator" />
                <ol
                  reversed
                  className="moments-list moments-list--editing"
                  style={{
                    color: colour,
                  }}
                >
                  {moments.map((moment: Moment) => (
                    <li
                      className={`moments-list__item moments-list__item--${
                        (moment.imagePath && "photo") ||
                        (moment.audioPath && "audio") ||
                        (moment.note && "note")
                      }`}
                      key={moment.id}
                    >
                      <IonGrid className="ion-no-padding">
                        <IonRow className="ion-no-margin ion-align-items-center">
                          <IonCol size="9" sizeSm="10">
                            {moment.imagePath && (
                              <IonCard className="moments-list__image-container ion-no-margin">
                                <img src={moment.imagePath} alt="" />
                              </IonCard>
                            )}
                            {moment.audioPath && (
                              <IonCard className="moments-list__audio-container ion-no-margin ion-padding">
                                <audio controls className="moments-list__audio">
                                  <source
                                    src={moment.audioPath}
                                    type="audio/mpeg"
                                  />
                                </audio>
                              </IonCard>
                            )}
                            {moment.note && (
                              <IonCard className="moments-list__note text-body ion-no-margin">
                                {moment.note.split("\n").map((str, index) => (
                                  <p key={index}>{str}</p>
                                ))}
                              </IonCard>
                            )}
                          </IonCol>
                          <IonCol className="ion-text-end">
                            <IonButton
                              className="moments-list__delete"
                              color="danger"
                              onClick={() => {
                                setMomentItemIdToDelete(moment.id);
                                setDeleteMomentAlert(true);
                              }}
                            >
                              <IonIcon icon={deleteIcon} slot="icon-only" />
                            </IonButton>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </li>
                  ))}
                </ol>
                <IonAlert
                  isOpen={deleteMomentAlert}
                  onDidDismiss={() => {
                    setDeleteMomentAlert(false);
                    setMomentItemIdToDelete("");
                  }}
                  header={"Delete Moment"}
                  subHeader={"Are you sure?"}
                  buttons={[
                    {
                      text: "No",
                      role: "cancel",
                    },
                    {
                      text: "Yes",
                      cssClass: "secondary",
                      handler: deleteMoment,
                    },
                  ]}
                />
              </>
            )}
            {currentAction === "View" && (
              <>
                <IonRow>
                  <IonCol className="ion-text-center">
                    <IonButton
                      className="ion-margin"
                      color="secondary"
                      onClick={addWalk}
                    >
                      Add new
                    </IonButton>
                  </IonCol>
                </IonRow>
                {walks.map((walk) => (
                  <IonRow
                    className="ion-no-margin ion-no-padding"
                    key={walk.id}
                  >
                    <IonGrid>
                      <IonRow>
                        <IonCol size="10">
                          <WalkItemPreview
                            id={walk.id}
                            title={walk.title}
                            colour={walk.colour}
                            description={walk.description}
                            start={walk.start}
                            end={walk.end}
                            steps={walk.steps}
                            distance={walk.distance}
                            coverImage={walk.coverImage}
                            userId={walk.userId}
                            isCircular={walk.circular}
                            location={walk?.location}
                            isMiniPreview={true}
                          />
                        </IonCol>
                        <IonCol size="2" className="ion-align-self-center">
                          <IonButton
                            onClick={() => {
                              editWalk(walk.id);
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
          </IonGrid>
        </div>
      </IonContent>
      <IonLoading isOpen={loading} />
      <IonToast
        duration={2000}
        position="top"
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

export default EditWalksPage;
