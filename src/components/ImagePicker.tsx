import React, { useState, useRef } from "react";
import { IonButton, IonIcon, IonLabel } from "@ionic/react";
import { camera } from "ionicons/icons";
import {
  Plugins,
  CameraResultType,
  CameraSource,
  Capacitor,
} from "@capacitor/core";

import "./ImagePicker.css";

export interface Photo {
  path: string | undefined;
  preview: string;
}

const { Camera } = Plugins;

const ImagePicker: React.FC<{
  onImagePick: (photo: Photo) => void;
}> = (props) => {
  const [takenPhoto, setTakenPhoto] = useState<Photo>();

  const filePickerRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    filePickerRef.current!.click();
  };

  const pickFileHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target!.files![0];
    const fr = new FileReader();
    fr.onload = () => {
      const photo: Photo = {
        path: undefined,
        preview: fr.result!.toString(),
      };
      setTakenPhoto(photo);
      props.onImagePick(photo);
    };
    fr.readAsDataURL(file);
  };

  const takePhotoHandler = async () => {
    if (!Capacitor.isPluginAvailable("Camera")) {
      openFilePicker();
      return;
    }
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
        quality: 80,
        width: 800,
      });

      if (!photo || !photo.webPath) {
        return;
      }
      const pickedPhoto: Photo = {
        path: photo.path,
        preview: photo.webPath,
      };
      setTakenPhoto(pickedPhoto);
      props.onImagePick(pickedPhoto);
    } catch (error) {
      openFilePicker();
    }
  };

  return (
    <React.Fragment>
      <div className="image" onClick={takePhotoHandler}>
        <div className="image-preview">
          {!takenPhoto && <h3>No photo chosen.</h3>}
          {takenPhoto && <img src={takenPhoto.preview} alt="Preview" />}
        </div>
        <IonButton fill="clear">
          <IonIcon icon={camera} slot="start"></IonIcon>
          <IonLabel>Take Photo</IonLabel>
        </IonButton>
      </div>
      <input
        type="file"
        hidden
        ref={filePickerRef}
        onChange={pickFileHandler}
      />
    </React.Fragment>
  );
};

export default ImagePicker;
