import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
  IonToast,
} from "@ionic/react";

import { Moment, toMoment, Location } from "../data/models";

import { firestore } from "../firebase";
import MomentsEditList from "./MomentsEditList";
import { appData } from "../data/appData";
import dayjs from "dayjs";

const WalkEditItem: React.FC<{
  walkId: string;
  title?: string;
  colour?: string;
  description?: [];
  start?: string;
  end?: string;
  steps?: number;
  distance?: number;
  coverImage?: string;
  overview?: string;
  locations?: Location[];
  location?: string;
  isCircular?: boolean;
  type?: "user" | "curated" | "featured";
  userId: string;
  shouldShare?: boolean;
}> = (props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [notice, setNotice] = useState<{
    showNotice: boolean;
    noticeColour?: string;
    message?: string;
  }>({ showNotice: false });
  const [moments, setMoments] = useState<Moment[]>([]);

  const suggestedDescriptors = appData.suggestedDescriptors;

  const [title, setTitle] = useState<string>(props.title || "");
  const [type, setType] = useState<"user" | "curated" | "featured">(
    props.type || "user"
  );
  const [colour, setColour] = useState<string>(props.colour || "");
  const [overview, setOverview] = useState<string>(props.overview || "");
  const [description, setDescription] = useState<string[]>(
    props.description || []
  );
  const [start, setStart] = useState<string>(
    dayjs(props.start).format("YYYY-MM-DDTHH:mm") || ""
  );
  const [end, setEnd] = useState<string>(
    dayjs(props.end).format("YYYY-MM-DDTHH:mm") || ""
  );
  const [distance, setDistance] = useState<number>(props.distance || 0);
  const [location, setLocation] = useState<string>(props.location || "");
  const [circular, setCircular] = useState<boolean>(props.isCircular || false);
  const [coverImage, setCoverImage] = useState<string>(props.coverImage || "");

  const storeWalk = async () => {
    setLoading(true);
    const data = {
      title,
      type,
      colour,
      overview,
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      distance,
      location,
      circular,
      description: description.filter(Boolean),
      coverImage,
    };
    await firestore
      .collection("users-walks")
      .doc(props.walkId)
      .get()
      .then((doc) => {
        doc.ref
          .update(data)
          .then(() => {
            setNotice({
              showNotice: true,
              message: "Walk updated",
              noticeColour: "success",
            });
          })
          .catch();
      })
      .catch(() => {
        setNotice({
          showNotice: true,
          message: "Error updating walk to storage",
          noticeColour: "error",
        });
      });
    setLoading(false);
  };

  useEffect(() => {
    const momentsRef = firestore
      .collection("users-moments")
      .where("walkId", "==", props.walkId);
    return momentsRef.orderBy("timestamp").onSnapshot(({ docs }) => {
      setMoments(docs.map(toMoment));
    });
  }, [props.walkId, props.userId]);

  return (
    <>
      <div className="ion-padding-start ion-padding-end">
        <IonGrid>
          <IonRow
            className="ion-align-items-center"
            style={{
              borderBottom: "solid 4px " + colour,
            }}
          >
            <IonCol>
              <IonText className="text-heading">
                <h2>
                  <strong>{props.title}</strong>
                </h2>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12" sizeLg="6">
              <IonGrid className="ion-margin-bottom ion-padding-bottom">
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
                                value={description[0]}
                                onIonChange={(event) =>
                                  setDescription([
                                    event.detail!.value!,
                                    description[1],
                                    description[2],
                                  ])
                                }
                              />
                            </IonCol>
                            <IonCol size="12" sizeSm="4">
                              <IonInput
                                className="input-text input-text--small"
                                type="text"
                                value={description[1]}
                                onIonChange={(event) =>
                                  setDescription([
                                    description[0],
                                    event.detail!.value!,
                                    description[2],
                                  ])
                                }
                              />
                            </IonCol>
                            <IonCol size="12" sizeSm="4">
                              <IonInput
                                className="input-text input-text--small"
                                type="text"
                                value={description[2]}
                                onIonChange={(event) =>
                                  setDescription([
                                    description[0],
                                    description[1],
                                    event.detail!.value!,
                                  ])
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
                            setCircular(event.detail!.value! === "true")
                          }
                          value={circular?.toString()}
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
                      <IonItem>
                        <IonGrid style={{ width: "100%" }}>
                          <IonRow className="ion-align-items-center">
                            <IonCol size="7" sizeSm="8">
                              <IonLabel position="stacked">
                                Cover Image
                              </IonLabel>
                              <IonTextarea
                                className="input-select input-select--small"
                                rows={5}
                                value={coverImage}
                                onIonChange={(event) => {
                                  setCoverImage(event.detail!.value!);
                                }}
                              ></IonTextarea>
                            </IonCol>
                            <IonCol size="5" sizeSm="4">
                              {coverImage && <IonImg src={coverImage} />}
                            </IonCol>
                          </IonRow>
                        </IonGrid>
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
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>
            <IonCol size="12" sizeLg="6">
              <MomentsEditList
                moments={moments}
                userId={props.userId}
                walkId={props.walkId}
                locations={props.locations ? props.locations : []}
                colour={props.colour}
                coverImage={coverImage || ""}
              />
            </IonCol>
          </IonRow>
        </IonGrid>
      </div>
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
    </>
  );
};

export default WalkEditItem;
