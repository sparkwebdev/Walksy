import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonLabel,
  IonModal,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
  IonToast,
  IonToggle,
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { Redirect } from "react-router";
import { useAuth } from "../auth";
import { appData } from "../data/appData";
import WalksContext from "../data/walks-context";
import {
  generateHslaColors,
  getFriendlyTimeOfDay,
  getFriendlyWalkDescriptor,
  readAsDataURL,
} from "../helpers";
import { checkmark as tickIcon } from "ionicons/icons";
// import WalkItem from "../components/WalkItem";
import { storeWalkHandler } from "../firebase";
import { Location, UploadedFile } from "../data/models";

const suggestedDescriptors = appData.suggestedDescriptors;

const suggestedTitle = `${getFriendlyTimeOfDay()} ${getFriendlyWalkDescriptor()}`;

const suggestedColour = generateHslaColors(1, undefined, undefined, true);

const titleMaxLength = 40;
const textAreaMaxLength = 280;

const AdminPage: React.FC = () => {
  const { loggedIn } = useAuth();

  const walksCtx = useContext(WalksContext);

  // const [momentsOutput, setMomentsOutput] = useState<Moment[]>([]);

  const [type, setType] = useState<string>("curated");
  const [colour, setColour] = useState<string>(suggestedColour[0]);
  const [title, setTitle] = useState<string>(suggestedTitle);
  const [overview, setOverview] = useState<string>("");
  const [descriptor1, setDescriptor1] = useState<string>("");
  const [descriptor2, setDescriptor2] = useState<string>("");
  const [descriptor3, setDescriptor3] = useState<string>("");
  const [start, setStart] = useState<string>();
  const [end, setEnd] = useState<string>();
  const [distance, setDistance] = useState<number>();

  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [editMoments, setEditMoments] = useState(false);

  const [chosenCoverImage, setChosenCoverImage] = useState<string>("");

  const [notice, setNotice] = useState<{
    showNotice: boolean;
    noticeColour?: string;
    message?: string;
  }>({ showNotice: false });

  const fileUploadHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    let files = event.target.files;
    if (!files || !files.length) return;

    readAsDataURL(event.target)
      .then((results: any) => {
        results.sort((a: UploadedFile, b: UploadedFile) => {
          var x = a["fileName"];
          var y = b["fileName"];
          return x < y ? 1 : x > y ? -1 : 0;
        });
        for (let i = 0; i < results.length; i++) {
          walksCtx.addMoment(
            "",
            results![i].type === "image" ? results![i].filePath : "",
            results![i].type === "audio" ? results![i].filePath : "",
            "",
            "",
            {
              lat: results![i].latitude || 0,
              lng: results![i].longitude || 0,
              timestamp: Date.now(),
            },
            results![i].timestamp
          );
        }
        setNotice({
          showNotice: true,
          message: `${results.length} moments added`,
        });
        event.target.value = "";
      })
      .catch((e) => {
        setNotice({
          showNotice: true,
          message:
            "There was a problem uploading. Please check the type of files you are adding.",
        });
        event.target.value = "";
        console.log(e);
      });
  };

  const addWalkHandler = async () => {
    if (!walksCtx.walk) {
      return;
    }
    if (!title || !colour || !start || !type) {
      setNotice({
        showNotice: true,
        noticeColour: "danger",
        message:
          "Please make the walk has a title, colour, start date/time and a type",
      });
      return;
    }
    if (walksCtx.moments && walksCtx.moments.length < 1) {
      setNotice({
        showNotice: true,
        noticeColour: "danger",
        message: "Please add some moments.",
      });
      return;
    }
    const momentsWithoutErrors = walksCtx.moments?.filter((moment) => {
      return (
        moment.location?.lat &&
        moment.location?.lat !== 0 &&
        moment.location?.lng &&
        (moment.audioPath || moment.imagePath || moment.note)
      );
    });
    if (momentsWithoutErrors && momentsWithoutErrors.length < 1) {
      setNotice({
        showNotice: true,
        noticeColour: "danger",
        message:
          "Please make sure each moment has data, including latitude and longitude.",
      });
      return;
    }

    await storeWalkHandler(walksCtx.walk)
      .then((storedWalkId) => {
        if (storedWalkId) {
          walksCtx.updateWalkIdForStorage(storedWalkId!);
        }
      })
      .catch(() => {
        setNotice({
          showNotice: true,
          noticeColour: "danger",
          message: "Problem adding walk. Please try again.",
        });
      });
  };

  const previewWalkHandler = () => {
    setShowPreview(true);
  };

  const updateMoment = (
    momentId: string,
    key: string,
    value: string | Location
  ) => {
    if (!walksCtx.moments) {
      return;
    }
    const newMoments = walksCtx.moments.map((moment) => {
      if (key === "latitude" || key === "longitude") {
        // if (key === "latitude") {
        //   const currentLongitude = moment.location ? moment.location.lng : 0;
        //   value = {
        //     lat: +value,
        //     lng: currentLongitude,
        //   };
        // }
        // if (key === "longitude") {
        //   const currentLatitude = moment.location ? moment.location.lat : 0;
        //   value = {
        //     lat: currentLatitude,
        //     lng: +value,
        //   };
        // }
        key = "location";
        value = {
          lat: 1,
          lng: 2,
          timestamp: Date.now(),
        };
      }
      return moment.id === momentId ? { ...moment, [key]: value } : moment;
    });
    walksCtx.updateMoments(newMoments);
  };

  const addMomentHandler = () => {
    walksCtx.addMoment("", "", "", "", "", null, "");
  };

  const deleteMomentHandler = (momentId: string) => {
    walksCtx.deleteMoment(momentId);
  };

  // const testeroo = () => {
  //   return Promise.all(
  //     walksCtx.moments.map((moment) => {
  //       loadImage(moment.imagePath);
  //     })
  //   );
  // };

  // const transformMomentsOutput = async () => {
  //   await testeroo().then((result) => {
  //     console.log(result);
  //   });
  const transformMomentsOutput = async () => {
    // const moments = [...walksCtx.moments];
    // for (let i = 0; i < moments.length; i++) {
    //   if (moments[i].imagePath && !moments[i].imagePath.startsWith("data:")) {
    //     const finalPhotoUri = await Filesystem.getUri({
    //       directory: FilesystemDirectory.Data,
    //       path: `moments/${moments[i].imagePath}`,
    //     });
    //     console.log("0", finalPhotoUri.uri);
    //     let photoPath = Capacitor.convertFileSrc(finalPhotoUri.uri);
    //     console.log("1", Capacitor.convertFileSrc(finalPhotoUri.uri));
    //     const filePath = await Filesystem.readFile({
    //       path: `moments/${moments[i].imagePath}`,
    //       directory: FilesystemDirectory.Data,
    //     })
    //       .then((file) => {
    //         return `data:image/jpeg;base64,${file.data}`;
    //       })
    //       .catch((e: Error) => {
    //         console.log(e);
    //       });
    //     if (filePath) {
    //       // moments[i].imagePath = filePath;
    //       setTesteroo(filePath);
    //     }
    //   } else if (moments[i].audioPath) {
    //     // const audioPath = await loadImage(moments[i].audioPath);
    //     // moments[i].audioPath = audioPath;
    //   }
    // }
    // console.log(moments);
    // setMomentsOutput(moments);
  };

  useEffect(() => {
    transformMomentsOutput();
    if (!chosenCoverImage) {
      const momentsWithImages = walksCtx.moments?.filter(
        (moment) => moment.imagePath !== ""
      );
      if (momentsWithImages && momentsWithImages.length > 0) {
        setChosenCoverImage(momentsWithImages[0].id);
      }
    }
  }, [walksCtx.moments]);

  useEffect(() => {
    const description = [descriptor1, descriptor2, descriptor3]
      .filter(Boolean)
      .join(", ");
    walksCtx.updateWalk({
      title,
      type,
      overview,
      description,
      colour,
      start,
      end,
      distance,
    });
  }, [
    title,
    type,
    overview,
    descriptor1,
    descriptor2,
    descriptor3,
    colour,
    start,
    end,
    distance,
  ]);

  const moveMomentHandler = (
    momentId: string,
    index: number,
    direction: "up" | "down"
  ) => {
    const momentsTarget = walksCtx.moments?.find(
      (moment) => moment.id === momentId
    );
    const momentsNew = walksCtx.moments?.filter(
      (moment) => moment.id !== momentId
    );
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (momentsNew) {
      momentsNew.splice(newIndex, 0, momentsTarget!);
      walksCtx.updateMoments(momentsNew);
    }
  };

  if (!loggedIn) {
    return <Redirect to="/app/home" />;
  }

  return (
    <IonPage>
      <PageHeader title="Add Walk" />
      <IonContent className="ion-padding">
        <IonGrid className="ion-text-center">
          <IonRow className="ion-align-items-center">
            <IonCol>
              <IonText color={editMoments ? "dark" : "primary"}>
                <strong>Walk Details</strong>
              </IonText>
            </IonCol>
            <IonCol>
              <IonToggle
                checked={editMoments}
                onIonChange={(e) => setEditMoments(e.detail.checked)}
              />
            </IonCol>
            <IonCol>
              <IonText color={editMoments ? "primary" : "dark"}>
                <strong>Moments</strong>
              </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
        {!editMoments ? (
          <div className="constrain constrain--medium">
            <div>
              <IonLabel position="stacked">
                <small>Title (max {titleMaxLength} characters)</small>
              </IonLabel>
              <IonInput
                className="input-text input-text--small"
                type="text"
                maxlength={titleMaxLength}
                value={title}
                onIonChange={(event) => setTitle(event.detail!.value!)}
              />
            </div>
            <div>
              <IonLabel position="stacked">
                <small>Type</small>
              </IonLabel>
              <IonSelect
                onIonChange={(event) => setType(event.detail!.value!)}
                value={type}
                className="input-select input-select--small"
              >
                <IonSelectOption value="curated">curated</IonSelectOption>
                <IonSelectOption value="featured">featured</IonSelectOption>
                <IonSelectOption value="user">user</IonSelectOption>
              </IonSelect>
            </div>
            {type == "curated" && (
              <div>
                <IonLabel position="stacked">
                  <small>Overview (max {textAreaMaxLength} characters)</small>
                </IonLabel>
                <IonTextarea
                  placeholder="Joe Bloggs takes us on a stroll through..."
                  maxlength={textAreaMaxLength}
                  className="input-select input-select--small"
                  rows={7}
                  value={overview}
                  onIonChange={(event) => {
                    setOverview(event.detail!.value!);
                  }}
                ></IonTextarea>
              </div>
            )}
            <IonGrid className="ion-no-padding">
              <IonRow className="ion-align-items-center">
                <IonCol>
                  <div>
                    <IonLabel position="stacked">
                      <small>Colour</small>
                    </IonLabel>
                    <IonInput
                      className="input-text input-text--small"
                      placeholder="#29aae2"
                      type="text"
                      maxlength={7}
                      value={colour}
                      onIonChange={(event) => setColour(event.detail!.value!)}
                    />
                  </div>
                </IonCol>
                <IonCol>
                  <div
                    style={{
                      background: colour,
                      width: "50%",
                      height: "2em",
                      marginTop: "1em",
                    }}
                  ></div>
                </IonCol>
              </IonRow>
            </IonGrid>
            <div>
              <IonLabel position="stacked">
                <small>Description (choose 3)</small>
              </IonLabel>
              <br />
              <small className="small-print">
                Choose from: {suggestedDescriptors.join(", ")}
              </small>
              <IonGrid className="ion-no-padding">
                <IonRow>
                  <IonCol size="12" sizeSm="4">
                    <IonInput
                      className="input-text input-text--small"
                      type="text"
                      placeholder="foraging"
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
                      placeholder="beach"
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
                      placeholder="nature"
                      value={descriptor3}
                      onIonChange={(event) =>
                        setDescriptor3(event.detail!.value!)
                      }
                    />
                  </IonCol>
                </IonRow>
              </IonGrid>
            </div>
            <div>
              <IonGrid className="ion-no-padding">
                <IonRow>
                  <IonCol size="12" sizeSm="6">
                    <IonLabel position="stacked">
                      <small>Start</small>
                    </IonLabel>
                    <IonInput
                      className="input-text input-text--small"
                      type="datetime-local"
                      onIonChange={(event) => {
                        setStart(new Date(event.detail!.value!).toISOString());
                      }}
                    />
                  </IonCol>
                  <IonCol size="12" sizeSm="6">
                    <div>
                      <IonLabel position="stacked">
                        <small>End</small>
                      </IonLabel>
                      <IonInput
                        className="input-text input-text--small"
                        type="datetime-local"
                        onIonChange={(event) => {
                          setEnd(new Date(event.detail!.value!).toISOString());
                        }}
                      />
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </div>
            <div className="ion-no-padding constrain--tiny">
              <IonLabel position="stacked">
                <small>Distance (in km)</small>
              </IonLabel>
              <IonInput
                className="input-text input-text--small"
                type="number"
                placeholder="0.00"
                onIonChange={(event) => setDistance(+event.detail!.value!)}
              />
            </div>
            {/* <div>
              <IonLabel position="stacked">
                <small>Cover Image (URL)</small>
              </IonLabel>
              <IonInput
                className="input-text input-text--small"
                type="text"
                placeholder="https://"
                ref={refCoverImage}
              />
            </div> */}
          </div>
        ) : (
          <div>
            <IonCard className="ion-text-center">
              <IonCardHeader>
                <IonCardSubtitle>Add Moments</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="ion-margin">
                  <strong>Add image or audio: </strong>
                  <input type="file" multiple onChange={fileUploadHandler} />
                </div>
                <IonButton color="success" onClick={addMomentHandler}>
                  + Add Note
                </IonButton>
                <br />
                {walksCtx.moments && walksCtx.moments.length > 0 && (
                  <IonButton
                    onClick={() => walksCtx.resetMoments()}
                    fill="clear"
                    color="danger"
                  >
                    Reset Moments
                  </IonButton>
                )}
              </IonCardContent>
            </IonCard>
            <IonGrid>
              {walksCtx.moments?.map((moment, index) => {
                return (
                  <IonRow key={moment.id}>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="11">
                          <IonCard>
                            <IonCardContent>
                              <IonGrid>
                                <IonRow>
                                  {moment.imagePath && (
                                    <IonCol
                                      size="12"
                                      sizeMd="3"
                                      className="ion-text-center"
                                    >
                                      <img src={moment.imagePath} alt="" />
                                      {moment.imagePath}
                                      <IonButton
                                        fill="clear"
                                        color="dark"
                                        onClick={() => {
                                          setChosenCoverImage(moment.id);
                                        }}
                                      >
                                        <IonButton
                                          color={
                                            chosenCoverImage === moment.id
                                              ? "success"
                                              : "light"
                                          }
                                          style={{ marginRight: "8px" }}
                                        >
                                          <IonIcon icon={tickIcon} />
                                        </IonButton>
                                        Cover Image?
                                      </IonButton>
                                    </IonCol>
                                  )}
                                  <IonCol
                                    size="12"
                                    sizeMd={moment.imagePath ? "4" : "7"}
                                  >
                                    <div>
                                      <IonLabel position="stacked">
                                        <small>
                                          Note (max {textAreaMaxLength}{" "}
                                          characters)
                                        </small>
                                      </IonLabel>
                                      <IonTextarea
                                        placeholder=""
                                        maxlength={textAreaMaxLength}
                                        className="input-select input-select--small"
                                        value={moment.note}
                                        onIonChange={(event) =>
                                          updateMoment(
                                            moment.id,
                                            "note",
                                            event.detail!.value!
                                          )
                                        }
                                      ></IonTextarea>
                                    </div>
                                  </IonCol>
                                  <IonCol size="12" sizeMd="5">
                                    <div>
                                      <IonGrid className="ion-no-padding">
                                        <IonRow>
                                          <IonCol size="12" sizeSm="6">
                                            <IonLabel position="stacked">
                                              <small>Latitude</small>
                                            </IonLabel>
                                            <IonInput
                                              className="input-text input-text--small"
                                              type="number"
                                              value={moment.location?.lat}
                                              onIonChange={(event) =>
                                                updateMoment(
                                                  moment.id,
                                                  "latitude",
                                                  event.detail!.value!
                                                )
                                              }
                                            />
                                          </IonCol>
                                          <IonCol
                                            size="12"
                                            sizeSm="6"
                                            // style={{
                                            //   opacity: !latitude ? 0.35 : 1,
                                            // }}
                                          >
                                            <div>
                                              <IonLabel position="stacked">
                                                <small>Longitude</small>
                                              </IonLabel>
                                              <IonInput
                                                className="input-text input-text--small"
                                                type="number"
                                                value={moment.location?.lng}
                                                // disabled={!latitude}
                                                onIonChange={(event) =>
                                                  updateMoment(
                                                    moment.id,
                                                    "longitude",
                                                    event.detail!.value!
                                                  )
                                                }
                                                style={{
                                                  border: "solid 1px #777269",
                                                }}
                                              />
                                            </div>
                                          </IonCol>
                                        </IonRow>
                                      </IonGrid>
                                    </div>
                                    <div hidden={false}>
                                      <IonLabel position="stacked">
                                        <small>Timestamp</small>
                                      </IonLabel>
                                      <IonInput
                                        className="input-text input-text--small"
                                        type="text"
                                        // type="datetime-local"
                                        value={moment.timestamp}
                                        onIonChange={(event) =>
                                          updateMoment(
                                            moment.id,
                                            "timestamp",
                                            event.detail!.value!
                                          )
                                        }
                                      />
                                    </div>
                                  </IonCol>
                                </IonRow>
                              </IonGrid>
                            </IonCardContent>
                          </IonCard>
                        </IonCol>
                        <IonCol size="1" className="ion-text-center">
                          <IonButton
                            color={index === 0 ? "dark" : "primary"}
                            onClick={() =>
                              moveMomentHandler(moment.id, index, "up")
                            }
                            disabled={index === 0}
                          >
                            &#8963;
                          </IonButton>
                          <br />
                          <IonButton
                            color="danger"
                            onClick={() => deleteMomentHandler(moment.id)}
                          >
                            x
                          </IonButton>
                          <br />
                          <IonButton
                            color={
                              walksCtx.moments &&
                              index === walksCtx.moments.length - 1
                                ? "dark"
                                : "primary"
                            }
                            onClick={() =>
                              moveMomentHandler(moment.id, index, "down")
                            }
                            disabled={
                              walksCtx.moments &&
                              index === walksCtx.moments.length - 1
                            }
                          >
                            &#8964;
                          </IonButton>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonRow>
                );
              })}
            </IonGrid>
          </div>
        )}
        <IonCard className="ion-text-center" color="light">
          <IonCardContent>
            <IonButton onClick={previewWalkHandler} fill="clear">
              Preview
            </IonButton>
            <IonButton onClick={addWalkHandler} color="success">
              Add Walk
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
      <IonModal
        isOpen={showPreview}
        onDidDismiss={() => {
          setShowPreview(false);
        }}
        backdropDismiss={false}
      >
        <IonContent className="ion-padding-bottom">
          <div className="ion-margin-bottom constrain constrain--large">
            {/* <WalkItem
              title={refTitle.current?.value?.toString()}
              colour={refColour.current?.value?.toString()}
              // description={[refDescription1.current?.value?.toString()]}
              // start={walk?.start}
              // end={walk?.end}
              // distance={refDistance.current?.value?.parseFloat()}
              coverImage={refCoverImage.current?.value?.toString()}
              type={refType.current?.value?.toString()}
              // userId={walk?.userId}
              moments={walksCtx.moments}
            /> */}
          </div>
        </IonContent>
        <IonButton onClick={() => setShowPreview(false)} color="success">
          Close
        </IonButton>
      </IonModal>
      <IonToast
        duration={5000}
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

export default AdminPage;
