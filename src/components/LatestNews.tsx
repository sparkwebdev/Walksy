import React, { useEffect, useState } from "react";
import { IonList, IonItem, IonListHeader, IonLabel } from "@ionic/react";
import { firestore } from "../firebase";
import { Entry, toEntry } from "../data/models";
import dayjs from "dayjs";

interface ContainerProps {
  title?: string;
  count?: number;
}

const LatestNews: React.FC<ContainerProps> = ({
  title = "Latest News",
  count = 3,
}) => {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const entriesRef = firestore.collection("entries");
    return entriesRef
      .orderBy("date")
      .limit(count)
      .onSnapshot(({ docs }) => setEntries(docs.map(toEntry)));
  }, []);

  return (
    <div>
      <h2 className="text-heading">{title}</h2>
      <IonList inset={false}>
        {entries.map((entry) => (
          <IonItem
            className="ion-no-margin ion-no-padding"
            button
            key={entry.id}
            routerLink={`/app/entries/${entry.id}`}
          >
            <IonLabel>
              <h2 className="text-heading">{entry.title}</h2>
              <h3 className="text-heading">
                {dayjs(entry.date).format("dddd, DD MMM 'YY")}
              </h3>
              {entry.excerpt && <p>{entry.excerpt}</p>}
            </IonLabel>
          </IonItem>
        ))}
      </IonList>
    </div>
  );
};

export default LatestNews;
