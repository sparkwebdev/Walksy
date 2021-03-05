import { IonPage, IonContent } from "@ionic/react";
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
    entryRef.get().then((doc) => {
      setEntry(toEntry(doc));
    });
  }, [id]);
  return (
    <IonPage>
      <PageHeader title="News" back={true} />
      <IonContent className="ion-padding">
        {entry?.date && (
          <p className="text-heading">
            {dayjs(entry?.date).format("dddd, DD MMM 'YY")}
          </p>
        )}
        <h1 className="text-heading">{entry?.title}</h1>

        {entry?.excerpt && (
          <p>
            <em>{entry.excerpt}</em>
          </p>
        )}
        {entry?.content && entry.content}
      </IonContent>
    </IonPage>
  );
};

export default EntryPage;
