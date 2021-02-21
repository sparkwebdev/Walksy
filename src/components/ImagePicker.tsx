import React, { useState, useRef, forwardRef } from "react";
import { IonText } from "@ionic/react";
import {
  Plugins,
  CameraResultType,
  CameraSource,
  Capacitor,
} from "@capacitor/core";
import { Photo } from "../data/models";

import "./ImagePicker.css";

const { Camera } = Plugins;

const ImagePicker: React.FC<{
  onImagePick: (photo: Photo) => void;
  ref: any;
}> = forwardRef((props, ref) => {
  const [takenPhoto, setTakenPhoto] = useState<Photo | null>();

  const filePickerRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    filePickerRef.current!.click();
  };

  React.useImperativeHandle(ref, () => ({
    imageResetHandler: () => {
      console.log("imageResetHandler");
    },
  }));

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
      <div className="image-picker" onClick={takePhotoHandler}>
        {!takenPhoto && (
          <IonText className="image-picker__label">No photo chosen</IonText>
        )}
        {takenPhoto && (
          <img
            className="image-picker__preview"
            src={takenPhoto.preview}
            alt="Preview"
          />
        )}
      </div>
      <input
        type="file"
        hidden
        ref={filePickerRef}
        onChange={pickFileHandler}
      />
    </React.Fragment>
  );
});

export default ImagePicker;
