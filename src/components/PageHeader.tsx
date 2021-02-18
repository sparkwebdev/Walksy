import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { attachProps } from "@ionic/react/dist/types/components/utils";
import { useLocation } from "react-router-dom";

interface ContainerProps {
  title: string;
  back?: boolean;
  showTool?: boolean;
  toolText?: string;
  toolAction?: () => void;
}

const PageHeader: React.FC<ContainerProps> = ({
  title,
  back = false,
  showTool,
  toolText,
  toolAction,
}) => {
  const location = useLocation();
  return (
    <IonHeader>
      <IonToolbar>
        {back && (
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/home" />
          </IonButtons>
        )}
        <IonTitle className="ion-text-center">{title}</IonTitle>
        {location.pathname === "/app/walk" && showTool && toolAction && (
          <IonButtons slot="end">
            <IonButton>
              <span
                onClick={() => {
                  toolAction();
                }}
              >
                {toolText}
              </span>
            </IonButton>
          </IonButtons>
        )}
      </IonToolbar>
    </IonHeader>
  );
};
export default PageHeader;
