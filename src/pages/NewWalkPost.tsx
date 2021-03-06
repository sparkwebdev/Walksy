import {
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import {
  checkmark as finishIcon,
  shareOutline as shareIcon,
} from "ionicons/icons";

const NewWalkPost: React.FC<{
  updateWalk: (description: string, coverImage: string) => void;
}> = ({ updateWalk }) => {
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");

  useEffect(() => {
    updateWalk(description, coverImage);
  }, [description, coverImage]);

  return (
    <>
      <IonCardContent>
        {/* <Progress time={time} distance={distance} steps={steps} /> */}
        <IonList>
          <IonItem className="ion-margin-top">
            {/* <img src={coverImage} alt="" />
          <IonLabel position="stacked">
            Choose a cover image...
          </IonLabel>
          {moments.length > 0 ? (
            <IonGrid>
              <IonRow>
                {moments.map((moment) => {
                  return (
                    <IonCol>
                      <img
                        src="{moment.imagePath}"
                        alt=""
                        onClick={() => {
                          setCoverImage(moment.imagePath);
                        }}
                      />
                    </IonCol>
                  );
                })}
              </IonRow>
            </IonGrid>
          ) : null} */}
            <IonLabel position="stacked">
              Give this walk a short description...
            </IonLabel>
            <IonInput
              type="text"
              value={description}
              onIonChange={(event) => setDescription(event.detail!.value!)}
            />
          </IonItem>
        </IonList>
      </IonCardContent>
      <IonCardHeader
        className="ion-no-padding"
        color="light"
        style={{
          marginTop: "auto",
        }}
      >
        <IonCardSubtitle className="ion-no-margin constrain constrain--medium">
          <IonGrid>
            <IonRow>
              <IonCol size="5">
                <IonButton
                  expand="block"
                  color="primary"
                  // onClick={() => shareWalk()}
                >
                  <IonIcon slot="start" icon={shareIcon} />
                  Share
                </IonButton>
              </IonCol>
              <IonCol size="7">
                <IonButton
                  expand="block"
                  color="success"
                  onClick={() => {
                    // updateWalkHandler(description, coverImage);
                  }}
                >
                  <IonIcon slot="start" icon={finishIcon} />
                  Finish
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardSubtitle>
      </IonCardHeader>
    </>
  );
};

export default NewWalkPost;
