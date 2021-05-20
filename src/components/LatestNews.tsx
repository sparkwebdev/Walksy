import React, { useEffect, useState } from "react";
import { IonList, IonItem, IonLabel } from "@ionic/react";
import { firestore } from "../firebase";
import { Entry, toEntry } from "../data/models";
import dayjs from "dayjs";

interface ContainerProps {
  count?: number;
}

const LatestNews: React.FC<ContainerProps> = ({ count = 3 }) => {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const entriesRef = firestore.collection("entries");
    return entriesRef
      .orderBy("createdAt", "desc")
      .limit(count)
      .onSnapshot(({ docs }) => setEntries(docs.map(toEntry)));
  }, [count]);

  return (
    <IonList className="ion-padding-start ion-padding-end">
      {entries.map((entry) => (
        <IonItem
          className="ion-no-margin ion-no-padding ion-text-wrap ion-margin-bottom"
          button
          key={entry.id}
          detail
          routerLink={`/entries/${entry.id}`}
        >
          <IonLabel className="ion-text-wrap">
            <h2
              className="text-heading"
              style={{ lineHeight: 1.6, fontSize: "1.2em" }}
            >
              {entry.title}
            </h2>
            {entry.createdAt && (
              <h3
                className="text-heading"
                style={{ lineHeight: 1.6, margin: "10px 0" }}
              >
                {dayjs(entry.createdAt).format("dddd, DD MMM 'YY")}
              </h3>
            )}
            {entry.excerpt && (
              <p
                className="text-body ion-padding-bottom"
                style={{ lineHeight: 1.6, fontSize: "1em" }}
              >
                {entry.excerpt.substring(0, 225)}...
              </p>
            )}
            {!entry.excerpt && entry.content && (
              <p
                className="text-body ion-padding-bottom"
                style={{ lineHeight: 1.6, fontSize: "1em" }}
              >
                {entry.content.substring(0, 225)}...
              </p>
            )}
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
};

export default LatestNews;
