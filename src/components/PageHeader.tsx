import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useLocation } from "react-router-dom";

interface ContainerProps {
  title: string;
  colour?: string;
  back?: boolean;
  showTool?: boolean;
  toolText?: string;
  toolAction?: () => void;
  defaultHref?: string;
}

const PageHeader: React.FC<ContainerProps> = ({
  title,
  colour,
  back = false,
  showTool,
  toolText,
  toolAction,
  defaultHref = "/app/home",
}) => {
  const location = useLocation();
  return (
    <IonHeader>
      <IonToolbar
        style={
          colour
            ? {
                color: colour,
              }
            : {}
        }
        className={
          colour ? "page-header page-header--with-colour" : "page-header"
        }
      >
        {back && !showTool && (
          <IonButtons slot="start">
            <IonBackButton defaultHref={defaultHref} text="" />
          </IonButtons>
        )}
        <IonTitle className="ion-text-center">{title}</IonTitle>
        {location.pathname === "/app/new-walk" && showTool && toolAction && (
          <IonButtons slot="start">
            <IonButton onClick={toolAction}>
              <span>{toolText}</span>
            </IonButton>
          </IonButtons>
        )}
        <IonButtons slot="end">
          <IonMenuButton />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};
export default PageHeader;
