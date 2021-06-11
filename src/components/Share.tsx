import { IonButton, IonIcon } from "@ionic/react";
import React, { useEffect } from "react";
import { SocialSharing } from "@ionic-native/social-sharing";
import { shareOutline as shareIcon } from "ionicons/icons";

const Share: React.FC<{
  shareText?: string;
  shareImage?: string;
  shareUrl?: string;
  triggerShare?: boolean;
  iconOnly?: boolean;
}> = (props) => {
  const text = props.shareText || "";
  const image = props.shareImage || "";
  const url = props.shareUrl || "";

  const options = {
    message: text,
    subject: "Sharing from Walksy.",
    files: [image],
    url: url,
  };

  const share = () => {
    SocialSharing.shareWithOptions(options)
      .then()
      .catch((msg) => {
        console.log("Sharing failed with message: " + msg);
      });
  };

  useEffect(() => {
    if (props.triggerShare) {
      share();
    }
  }, [props.triggerShare]);

  return (
    <>
      {(text || image || url) && (
        <div className="ion-text-center">
          {!props.iconOnly && <h3 className="text-heading">Share walk</h3>}
          <IonButton
            onClick={share}
            fill={props.iconOnly ? "clear" : "default"}
            size={props.iconOnly ? "large" : "default"}
            className={props.iconOnly ? "ion-no-padding" : ""}
          >
            <IonIcon icon={shareIcon} />
          </IonButton>
        </div>
      )}
    </>
  );
};

export default Share;
