import {
  IonAlert,
  IonButton,
  IonCard,
  IonCol,
  IonGrid,
  IonIcon,
  IonImg,
  IonLoading,
  IonModal,
  IonRow,
  IonText,
  IonToast,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { Moment, Location } from "../data/models";
import {
  trash as deleteIcon,
  createOutline as editIcon,
  addOutline as addIcon,
} from "ionicons/icons";
import MapWithMarkers from "./MapWithMarkers";
import dayjs from "dayjs";
import MomentEditModal from "./MomentEditModal";
import { deleteStoredItem } from "../firebase";
import LocationInfo from "./LocationInfo";

const MomentsEditList: React.FC<{
  moments: Moment[];
  userId: string;
  walkId: string;
  locations?: Location[];
  colour?: string;
  coverImage: string;
}> = (props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [notice, setNotice] = useState<{
    showNotice: boolean;
    noticeColour?: string;
    message?: string;
  }>({ showNotice: false });
  const [momentsWithLocations, setMomentsWithLocations] = useState<Moment[]>(
    []
  );
  const [showMap, setShowMap] = useState<boolean>(false);
  const [mapKey, setMapKey] = useState<number>(Math.random());

  const [deleteMomentAlert, setDeleteMomentAlert] = useState<boolean>(false);
  const [momentItemToDelete, setMomentItemToDelete] = useState<Moment>();

  const viewMapHandler = () => {
    setShowMap(true);
  };

  useEffect(() => {
    const momentsLoc = props.moments?.filter(
      (moment) => moment.location !== null
    );
    if (momentsLoc!.length > 0) {
      setMomentsWithLocations(momentsLoc);
    }
  }, [props.moments]);

  const deleteMoment = () => {
    setLoading(true);
    if (momentItemToDelete) {
      deleteStoredItem(
        "users-moments",
        momentItemToDelete.id,
        momentItemToDelete.imagePath || momentItemToDelete.audioPath
      )
        .then(() => {
          setLoading(false);
          setNotice({
            showNotice: true,
            noticeColour: "success",
            message: "Moment deleted.",
          });
        })
        .catch(() => {
          setLoading(false);
          setNotice({
            showNotice: true,
            noticeColour: "danger",
            message: "Couldn't delete moment.",
          });
        });
    }
  };

  const [editMomentModal, setEditMomentModal] = useState<boolean>(false);
  const [momentItemToEdit, setMomentItemToEdit] = useState<Moment | null>(null);

  const closeMomentModalHandler = (message: string = "") => {
    setEditMomentModal(false);
    setMomentItemToEdit(null);
    if (message) {
      setNotice({
        showNotice: true,
        noticeColour: "success",
        message: message,
      });
    }
  };

  return (
    <>
      <IonGrid className="ion-no-padding ion-margin-top">
        <IonRow>
          <IonCol>
            <MapWithMarkers
              moments={momentsWithLocations}
              locations={props.locations ? props.locations : []}
              onDismiss={() => setShowMap(false)}
              colour={props.colour}
              key={mapKey}
              isWalking={false}
            />
            <hr className="separator" />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="2">
            <IonText
              className="text-body moments-list-count"
              style={{
                color: props.colour,
              }}
            >
              <img
                src="assets/icon/map_marker_plain.svg"
                alt=""
                className="moments-list-count__icon"
              />
              {/* <IonIcon icon={flagIcon} className="icon-large" /> */}
              <span className="moments-list-count__total">
                {props.moments.length}{" "}
              </span>
              {/* <span className="moments-list-count__label">
                moment{props.moments.length !== 1 && "s"}
              </span> */}
            </IonText>
          </IonCol>
          <IonCol size="10" sizeSm="8" offsetSm="2" className="ion-text-right">
            <IonButton
              className="moments-list__add"
              color="success"
              onClick={() => {
                setMomentItemToEdit(null);
                setEditMomentModal(true);
              }}
            >
              <IonIcon icon={addIcon} slot="icon-only" size="small" /> Add
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
      <ol
        reversed
        className="moments-list moments-list--editing constrain constrain--large"
        style={{
          color: props.colour,
        }}
      >
        {props.moments.map((moment: Moment) => (
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
                <IonCol size="9">
                  {moment.imagePath && (
                    <IonCard className="moments-list__image-container ion-no-margin">
                      <IonImg
                        src={moment.base64Data || moment.imagePath}
                        alt=""
                      />
                    </IonCard>
                  )}
                  {moment.audioPath && (
                    <IonCard className="moments-list__audio-container ion-no-margin ion-padding">
                      <audio controls className="moments-list__audio">
                        <source
                          src={moment.base64Data || moment.audioPath}
                          type="audio/mpeg"
                        />
                      </audio>
                    </IonCard>
                  )}
                  {moment.note && (
                    <IonCard
                      className={
                        moment.imagePath || moment.audioPath
                          ? "moments-list__note moments-list__note--caption text-body ion-no-margin"
                          : "moments-list__note text-body ion-no-margin"
                      }
                    >
                      {moment.note.split("\n").map((str, index) => (
                        <p key={index}>{str}</p>
                      ))}
                    </IonCard>
                  )}
                </IonCol>
                <IonCol size="3" className="ion-align-self-center ion-text-end">
                  <IonButton
                    onClick={() => {
                      setMomentItemToEdit(moment);
                      setEditMomentModal(true);
                    }}
                  >
                    <IonIcon icon={editIcon} slot="icon-only" size="small" />
                    <span className="ion-hide">Edit Moment</span>
                  </IonButton>
                  <IonButton
                    className="moments-list__delete"
                    color="danger"
                    onClick={() => {
                      if (
                        moment.imagePath === props.coverImage &&
                        moment.imagePath !== ""
                      ) {
                        setNotice({
                          showNotice: true,
                          noticeColour: "danger",
                          message:
                            "Error: This is currently used for your cover image. Please amend before deleting.",
                        });
                      } else {
                        setMomentItemToDelete(moment);
                        setDeleteMomentAlert(true);
                      }
                    }}
                  >
                    <IonIcon icon={deleteIcon} slot="icon-only" />
                  </IonButton>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="9">
                  <IonCard className="ion-no-margin ion-padding">
                    <LocationInfo
                      lat={moment.location?.lat}
                      lng={moment.location?.lng}
                      timestamp={moment.timestamp}
                    />
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonGrid>
          </li>
        ))}
        <IonAlert
          isOpen={deleteMomentAlert}
          onDidDismiss={() => {
            setDeleteMomentAlert(false);
            setMomentItemToDelete(undefined);
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
      </ol>
      {props.locations && (
        <>
          <h2>Locations</h2>
          <ol>
            {props.locations?.map((location: Location, index) => {
              return (
                <li key={index} className="ion-text-start">
                  <IonGrid className="ion-no-padding">
                    <IonRow>
                      <IonCol>
                        <small>Lat:</small>&nbsp;<strong>{location.lat}</strong>{" "}
                        — 
                        <small>Lng:</small>&nbsp;
                        <strong>{location.lng}</strong>
                      </IonCol>
                      <IonCol>
                        <small>Time: </small>
                        <strong>
                          {dayjs(location.timestamp).format("HH:mm DD/MM/YY")}
                        </strong>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </li>
              );
            })}
          </ol>
        </>
      )}
      <IonModal
        isOpen={showMap}
        onDidDismiss={() => {
          setShowMap(false);
        }}
        onWillPresent={() => {
          setMapKey(Math.random());
        }}
      >
        <MapWithMarkers
          moments={momentsWithLocations}
          locations={props.locations ? props.locations : []}
          onDismiss={() => setShowMap(false)}
          colour={props.colour}
          key={mapKey}
          isWalking={false}
        />
      </IonModal>
      <MomentEditModal
        moment={momentItemToEdit}
        userId={props.userId}
        walkId={props.walkId}
        isOpen={editMomentModal}
        closeMomentModal={(message: string) => {
          closeMomentModalHandler(message);
        }}
      />
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

export default MomentsEditList;
