import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useLocation } from "react-router-dom";
import { informationCircleOutline as informationIcon } from "ionicons/icons";

interface ContainerProps {
  title: string;
  back?: boolean;
  showTool?: boolean;
  toolText?: string;
  toolAction?: () => void;
  defaultHref?: string;
}

const PageHeader: React.FC<ContainerProps> = ({
  title,
  back = false,
  showTool,
  toolText,
  toolAction,
  defaultHref = "/app/home",
}) => {
  const location = useLocation();
  return (
    <IonHeader>
      <IonToolbar>
        {back && (
          <IonButtons slot="start">
            <IonBackButton defaultHref={defaultHref} text="" />
          </IonButtons>
        )}
        <IonTitle className="ion-text-center">{title}</IonTitle>
        {location.pathname === "/app/new-walk" && showTool && toolAction && (
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
        {!showTool && !toolAction && (
          <IonButtons slot="end">
            <IonButton routerLink="/app/about">
              <IonIcon slot="icon-only" icon={informationIcon} />
            </IonButton>
          </IonButtons>
        )}
      </IonToolbar>
    </IonHeader>
  );
};
export default PageHeader;
