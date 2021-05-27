import {
  IonAlert,
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonModal,
  IonRow,
  IonTextarea,
  IonToast,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { addOutline as addIcon } from "ionicons/icons";
import { Moment, File } from "../data/models";
import dayjs from "dayjs";
import { base64FromPath } from "@ionic/react-hooks/filesystem";

import { firestore, storeFilehandler, storeMomentHandler } from "../firebase";
import FilePicker from "./FilePicker";

const MomentEditModal: React.FC<{
  moment?: Moment | null;
  userId?: string;
  walkId?: string;
  isOpen: boolean;
  closeMomentModal: (message: string) => void;
}> = (props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [notice, setNotice] = useState<{
    showNotice: boolean;
    noticeColour?: string;
    message?: string;
  }>({ showNotice: false });

  const [closeMomentAlert, setCloseMomentAlert] = useState<boolean>(false);

  const [imagePath, setImagePath] = useState<string>();
  const [audioPath, setAudioPath] = useState<string>();
  const [base64Data, setBase64Data] = useState<string>();
  const [note, setNote] = useState<string>();
  const [latitude, setLatitude] = useState<string>();
  const [longitude, setLongitude] = useState<string>();
  const [time, setTime] = useState<string>();

  const storeMoment = async () => {
    setLoading(true);
    if (props.moment?.id) {
      let storedUrl = "";
      if (base64Data) {
        await storeFilehandler(base64Data).then((newUrl) => {
          storedUrl = newUrl;
        });
      }
      const data = {
        imagePath: imagePath && storedUrl !== "" ? storedUrl : imagePath,
        audioPath: audioPath && storedUrl !== "" ? storedUrl : audioPath,
        note,
        location: {
          lat: parseFloat(latitude + ""),
          lng: parseFloat(longitude + ""),
          timestamp: +dayjs(time).valueOf(),
        },
        timestamp: dayjs(time).format("YYYY-MM-DDTHH:mm"),
      };
      await firestore
        .collection("users-moments")
        .doc(props.moment.id)
        .get()
        .then((doc) => {
          doc.ref
            .update(data)
            .then(() => {
              props.closeMomentModal("Moment updated");
            })
            .catch(() => {
              setNotice({
                showNotice: true,
                message: "Error updating moment to storage",
                noticeColour: "error",
              });
            });
        })
        .catch(() => {
          setNotice({
            showNotice: true,
            message: "Can't fine moment to update",
            noticeColour: "error",
          });
        });
    } else {
      if (props.walkId && props.userId) {
        const data: Moment = {
          id: "",
          walkId: props.walkId,
          imagePath: imagePath || "",
          audioPath: audioPath || "",
          base64Data: base64Data || "",
          note: note || "",
          location: {
            lat: parseFloat(latitude + ""),
            lng: parseFloat(longitude + ""),
            timestamp: +dayjs(time).valueOf(),
          },
          timestamp: dayjs(time).format("YYYY-MM-DDTHH:mm"),
        };
        await storeMomentHandler(data, props.walkId, props.userId)
          .then(() => {
            props.closeMomentModal("Moment added.");
          })
          .catch(() => {
            setNotice({
              showNotice: true,
              message: "Can't add moment.",
              noticeColour: "error",
            });
          });
      }
    }
    reset();
    setLoading(false);
  };

  const [addImage, setAddImage] = useState<boolean>(false);
  const [addAudio, setAddAudio] = useState<boolean>(false);
  const [filePreview, setFilePreview] = useState<string>("");

  const photoPickHandler = async (file: File) => {
    if (file.location) {
      setLatitude(file.location.lat.toString());
      setLongitude(file.location.lng.toString());
    }
    setImagePath(file.path);
    setFilePreview(file.preview);
    const base64 = await base64FromPath(file.preview);
    setBase64Data(base64);
    setAddImage(false);
  };

  const audioPickHandler = async (file: File) => {
    if (file.location) {
      setLatitude(file.location.lat.toString());
      setLongitude(file.location.lng.toString());
    }
    setAudioPath(file.path);
    setFilePreview(file.preview);
    const base64 = await base64FromPath(file.preview);
    setBase64Data(base64);
    setAddAudio(false);
  };

  const filePickerRef = useRef<any>();

  const reset = () => {
    setImagePath("");
    setAudioPath("");
    setBase64Data("");
    setNote("");
    setLatitude("");
    setLongitude("");
    setTime("");
    setFilePreview("");
  };

  useEffect(() => {
    setImagePath(props.moment?.imagePath || "");
    setAudioPath(props.moment?.audioPath || "");
    setNote(props.moment?.note || "");
    setLatitude(props.moment?.location?.lat.toString() || "");
    setLongitude(props.moment?.location?.lng.toString() || "");
    setTime(dayjs(props.moment?.timestamp).format("YYYY-MM-DDTHH:mm") || "");
  }, [props.moment]);

  return (
    <>
      <IonModal
        isOpen={props.isOpen}
        onDidDismiss={() => {
          // props.moment = undefined;
          props.closeMomentModal("");
        }}
      >
        <IonList>
          <IonItem>
            {props.moment?.id ? (
              <small className="small-print">
                Moment ID: {props.moment?.id}
              </small>
            ) : (
              <small>
                <strong className="ion-text-uppercase">Add new moment:</strong>
              </small>
            )}
          </IonItem>
          <IonItem>
            <IonGrid style={{ width: "100%" }} className="ion-no-padding">
              {!audioPath && (
                <IonRow className="ion-align-items-center">
                  <IonCol size="10">
                    {filePreview ? (
                      <>
                        <IonButton
                          onClick={() => {
                            setFilePreview("");
                            setImagePath("");
                          }}
                        >
                          Remove
                        </IonButton>{" "}
                        {!imagePath?.startsWith("https://firebasestorage") &&
                          imagePath}
                      </>
                    ) : (
                      <>
                        <IonLabel position="stacked">Image Path</IonLabel>
                        <IonInput
                          className="input-text input-text--small"
                          type="text"
                          value={imagePath}
                          onIonChange={(e) => setImagePath(e.detail!.value!)}
                          hidden={filePreview !== ""}
                        />
                      </>
                    )}
                  </IonCol>
                  <IonCol size="2" className="ion-text-right">
                    {filePreview || (imagePath && filePreview === "") ? (
                      <IonImg
                        src={filePreview || imagePath}
                        className="ion-margin"
                      />
                    ) : (
                      <IonButton
                        color="success"
                        className="ion-margin-top"
                        onClick={() => {
                          setAddImage(true);
                        }}
                      >
                        <IonIcon icon={addIcon} slot="icon-only" size="small" />
                      </IonButton>
                    )}
                  </IonCol>
                </IonRow>
              )}
            </IonGrid>
          </IonItem>
          {!imagePath && (
            <IonItem>
              <IonGrid style={{ width: "100%" }} className="ion-no-padding">
                <IonRow className="ion-align-items-center">
                  <IonCol size={audioPath ? "6" : "10"}>
                    {filePreview ? (
                      <>
                        <IonButton
                          onClick={() => {
                            setFilePreview("");
                            setAudioPath("");
                          }}
                        >
                          Remove
                        </IonButton>{" "}
                        {!audioPath?.startsWith("https://firebasestorage") &&
                          audioPath}
                      </>
                    ) : (
                      <>
                        <IonLabel position="stacked">Audio Path</IonLabel>
                        <IonInput
                          className="input-text input-text--small"
                          type="text"
                          value={audioPath}
                          onIonChange={(e) => setAudioPath(e.detail!.value!)}
                          hidden={filePreview !== ""}
                        />
                      </>
                    )}
                  </IonCol>
                  <IonCol
                    size={audioPath ? "6" : "2"}
                    className="ion-text-right"
                  >
                    {filePreview || (audioPath && filePreview === "") ? (
                      <audio controls className="ion-margin">
                        <source
                          src={filePreview || audioPath}
                          type="audio/mpeg"
                        />
                      </audio>
                    ) : (
                      <IonButton
                        color="success"
                        className="ion-margin-top"
                        onClick={() => {
                          setAddAudio(true);
                        }}
                      >
                        <IonIcon icon={addIcon} slot="icon-only" size="small" />
                      </IonButton>
                    )}
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
          )}
          {(addImage || addAudio) && (
            <IonModal
              isOpen={addImage || addAudio}
              onDidPresent={() => {
                if ((addImage || addAudio) && filePickerRef.current) {
                  filePickerRef.current.triggerChooseFile();
                }
              }}
            >
              <IonGrid>
                <IonRow>
                  <IonCol>
                    {addImage && (
                      <FilePicker
                        ref={filePickerRef}
                        onFilePick={photoPickHandler}
                        fileType={"image"}
                      />
                    )}
                    {addAudio && (
                      <FilePicker
                        ref={filePickerRef}
                        onFilePick={audioPickHandler}
                        fileType={"audio"}
                      />
                    )}
                    <IonButton
                      onClick={() => {
                        setAddImage(false);
                        setAddAudio(false);
                      }}
                    >
                      Cancel
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonModal>
          )}
          <IonItem>
            <IonLabel position="fixed">
              <small>Note</small>
            </IonLabel>
            <IonTextarea
              className="input-select input-select--small"
              rows={3}
              value={note}
              onIonChange={(event) => {
                setNote(event.detail!.value!);
              }}
            ></IonTextarea>
          </IonItem>
          <IonItem>
            <IonGrid className="ion-no-padding" style={{ width: "100%" }}>
              <IonRow>
                <IonCol
                  size="12"
                  sizeSm="6"
                  sizeMd="4"
                  className="ion-padding-end"
                >
                  <IonLabel position="stacked">Latitude</IonLabel>
                  <IonInput
                    className="input-text input-text--small"
                    type="text"
                    value={latitude}
                    onIonChange={(e) => setLatitude(e.detail!.value!)}
                  />
                </IonCol>
                <IonCol
                  size="12"
                  sizeSm="6"
                  sizeMd="4"
                  className="ion-padding-end"
                >
                  <IonLabel position="stacked">Longitude</IonLabel>
                  <IonInput
                    className="input-text input-text--small"
                    type="text"
                    value={longitude}
                    onIonChange={(e) => setLongitude(e.detail!.value!)}
                  />
                </IonCol>
                <IonCol size="12" sizeSm="12" sizeMd="4">
                  <IonLabel position="stacked">Time</IonLabel>
                  <IonInput
                    className="input-text input-text--small"
                    type="datetime-local"
                    value={time}
                    onIonChange={(e) => {
                      setTime(e.detail!.value!);
                    }}
                  />
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>
        </IonList>
        <IonGrid className="ion-no-padding">
          <IonRow>
            <IonCol className="ion-text-center">
              <IonButton
                className="ion-margin"
                color="tertiary"
                onClick={() => {
                  setCloseMomentAlert(true);
                }}
              >
                Close
              </IonButton>
              <IonAlert
                isOpen={closeMomentAlert}
                onDidDismiss={() => {
                  setCloseMomentAlert(false);
                }}
                header={"Are you sure?"}
                subHeader={"Any changes you made will be lost"}
                buttons={[
                  {
                    text: "No",
                    role: "cancel",
                  },
                  {
                    text: "Yes",
                    cssClass: "secondary",
                    handler: () => {
                      reset();
                      props.closeMomentModal("");
                    },
                  },
                ]}
              />
              <IonButton
                className="ion-margin"
                color={loading ? "dark" : "secondary"}
                onClick={() => {
                  storeMoment();
                }}
                disabled={
                  !latitude ||
                  !longitude ||
                  !time ||
                  (!imagePath && !audioPath && !note)
                }
              >
                {loading && "Saving"}
                {!loading && props.moment?.id && "Save Moment"}
                {!loading && !props.moment?.id && "Add Moment"}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonModal>
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
    </>
  );
};

export default MomentEditModal;
