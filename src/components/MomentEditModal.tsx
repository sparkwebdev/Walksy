import {
  IonAlert,
  IonButton,
  IonCol,
  IonGrid,
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
import React, { useEffect, useState } from "react";
import { Moment } from "../data/models";
import dayjs from "dayjs";

import { firestore } from "../firebase";

const MomentEditModal: React.FC<{
  moment?: Moment;
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
  const [note, setNote] = useState<string>();
  const [latitude, setLatitude] = useState<string>();
  const [longitude, setLongitude] = useState<string>();
  const [time, setTime] = useState<string>();

  const storeMoment = async () => {
    setLoading(true);
    if (props.moment?.id) {
      const data = {
        imagePath,
        audioPath,
        note,
        location: {
          lat: parseFloat(latitude + ""),
          lng: parseFloat(longitude + ""),
          timestamp: +dayjs(time).valueOf(),
        },
        timestamp: new Date(time + "").toISOString(),
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
      // store new moment
    }
    setLoading(false);
  };

  useEffect(() => {
    setImagePath(props.moment?.imagePath || "");
    setAudioPath(props.moment?.audioPath || "");
    setNote(props.moment?.note || "");
    setLatitude(props.moment?.location?.lat.toString() || "");
    setLongitude(props.moment?.location?.lng.toString() || "");
    setTime(dayjs(props.moment?.timestamp).format("YYYY-MM-DDTHH:mm:ss") || "");
  }, [props.moment]);

  return (
    <>
      <IonModal
        isOpen={props.isOpen}
        onDidDismiss={() => {
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
                <strong>New moment</strong>
              </small>
            )}
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Image Path</IonLabel>
            <IonInput
              className="input-text input-text--small"
              type="text"
              value={imagePath}
              onIonChange={(e) => setImagePath(e.detail!.value!)}
              disabled={audioPath !== ""}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Audio Path</IonLabel>
            <IonInput
              className="input-text input-text--small"
              type="text"
              value={audioPath}
              onIonChange={(e) => setAudioPath(e.detail!.value!)}
              disabled={imagePath !== ""}
            />
          </IonItem>
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
            <IonGrid>
              <IonRow>
                <IonCol size="12" sizeSm="6" sizeMd="4">
                  <IonLabel position="stacked">Latitude</IonLabel>
                  <IonInput
                    className="input-text input-text--small"
                    type="text"
                    value={latitude}
                    onIonChange={(e) => setLatitude(e.detail!.value!)}
                  />
                </IonCol>
                <IonCol size="12" sizeSm="6" sizeMd="4">
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
                    onIonChange={(e) => setTime(e.detail!.value!)}
                  />
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>
        </IonList>
        <IonGrid>
          <IonRow>
            <IonCol className="ion-text-center">
              <IonButton
                className="ion-margin"
                color="tertiary"
                onClick={() => setCloseMomentAlert(true)}
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
                    handler: props.closeMomentModal,
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
                {loading ? "Saving" : "Save Moment"}
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
