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
      .orderBy("date")
      .limit(count)
      .onSnapshot(({ docs }) => setEntries(docs.map(toEntry)));
  }, [count]);

  return (
    <IonList>
      {entries.map((entry) => (
        <IonItem
          className="ion-no-margin ion-no-padding"
          button
          key={entry.id}
          routerLink={`/app/entries/${entry.id}`}
        >
          <IonLabel>
            <h2 className="text-heading">{entry.title}</h2>
            {entry.createdAt && (
              <h3 className="text-heading">
                {dayjs(entry.createdAt).format("dddd, DD MMM 'YY")}
              </h3>
            )}
            {entry.excerpt && <p className="text-body">{entry.excerpt}</p>}
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
};

export default LatestNews;
