import { IonPage, IonContent, IonGrid, IonRow, IonCol } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { firestore } from "../firebase";
import { Entry, toEntry } from "../data/models";
import PageHeader from "./PageHeader";
import dayjs from "dayjs";

interface RouteParams {
  id: string;
}

const EntryPage: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const [entry, setEntry] = useState<Entry>();
  useEffect(() => {
    const entryRef = firestore.collection("entries").doc(id);
    entryRef
      .get()
      .then((doc) => {
        setEntry(toEntry(doc));
      })
      .catch((e) => {
        console.log("Couldn't get entries", e);
      });
  }, [id]);
  return (
    <IonPage>
      <PageHeader title="News" back={true} />
      <IonContent>
        <IonGrid className="constrain constrain--large">
          <IonRow className="ion-margin-top">
            <IonCol>
              {entry?.createdAt && (
                <p className="text-heading">
                  {dayjs(entry?.createdAt).format("dddd, DD MMM 'YY")}
                </p>
              )}
              <h1 className="text-heading" style={{ lineHeight: 1.6 }}>
                {entry?.title}
              </h1>

              {entry?.excerpt && (
                <p
                  className="text-body"
                  style={{ lineHeight: 1.6, fontSize: "1em" }}
                >
                  {entry.excerpt}
                </p>
              )}
              <div
                className="text-body"
                style={{
                  whiteSpace: "pre-line",
                  lineHeight: 1.6,
                  fontSize: "1em",
                }}
              >
                {entry?.content &&
                  entry?.content
                    .split("\n")
                    .map((str, index) => <p key={index}>{str}</p>)}
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default EntryPage;
