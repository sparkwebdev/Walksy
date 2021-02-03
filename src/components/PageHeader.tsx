import { IonHeader, IonTitle, IonToolbar } from "@ionic/react";

interface ContainerProps {
  title: string;
}

const PageHeader: React.FC<ContainerProps> = ({ title }) => {
  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default PageHeader;
