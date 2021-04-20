import React, { useEffect, useState } from "react";
import { IonList, IonItem, IonLabel, IonText, IonBadge } from "@ionic/react";
import { firestore } from "../firebase";
import { Entry, toEntry } from "../data/models";
import dayjs from "dayjs";

interface ContainerProps {
  count?: number;
}

const LatestWellbeing: React.FC<ContainerProps> = ({ count = 12 }) => {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const entriesRef = firestore.collection("wellbeing-entries");
    return entriesRef
      .orderBy("createdAt")
      .limit(count)
      .onSnapshot(({ docs }) => setEntries(docs.map(toEntry)));
  }, [count]);

  return (
    <>
      {entries.map((entry) => (
        <div
          className={`ion-no-margin ion-no-padding info-bubble info-bubble--${entry.category}`}
          key={entry.id}
        >
          <h2 className="text-heading">{entry.title}</h2>
          <IonBadge className="info-bubble__category" color="light">
            {entry.category}
          </IonBadge>
          {entry.content && (
            <p className="text-body">
              <IonText color="light">{entry.content}</IonText>
            </p>
          )}
          {entry.createdAt && (
            <p className="text-heading">
              {dayjs(entry.createdAt).format("dddd, DD MMM 'YY")}
            </p>
          )}
        </div>
      ))}
    </>
  );
};

export default LatestWellbeing;
