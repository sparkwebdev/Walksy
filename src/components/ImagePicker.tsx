import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Plugins,
  CameraResultType,
  CameraSource,
  Capacitor,
} from "@capacitor/core";
import exifr from "exifr";
import { Location, Photo } from "../data/models";
import { IonToast } from "@ionic/react";
import { getFileExtension } from "../helpers";

const { Camera } = Plugins;

const ImagePicker: React.FC<{
  onImagePick: (photo: Photo) => void;
  onCancel?: () => void;
  ref?: any;
}> = forwardRef((props, ref) => {
  const [takenPhoto, setTakenPhoto] = useState<Photo>();
  const [error, setError] = useState<{
    showError: boolean;
    message?: string;
  }>({ showError: false });

  const filePickerRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    triggerTakePhoto() {
      takePhotoHandler();
    },
  }));

  const openFilePicker = () => {
    filePickerRef.current!.click();
  };

  const getGPSData = async (file: any) => {
    return await exifr.gps(file);
  };

  const pickFileHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target!.files![0];
    if (!file) {
      return;
    }
    if (file.size > 1000000) {
      setError({
        showError: true,
        message: "Please upload a file less than 1MB",
      });
      return;
    }
    const fileExtensionData = getFileExtension(file.name);
    if (
      !fileExtensionData ||
      (fileExtensionData[1] !== "jpg" &&
        fileExtensionData[1] !== "jpeg" &&
        fileExtensionData[1] !== "png")
    ) {
      setError({
        showError: true,
        message: "Please upload a valid file type (.jpg or .png)",
      });
      return;
    }
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
        width: 740,
        saveToGallery: true,
      });

      if (!photo || !photo.webPath) {
        return;
      }
      let pickedPhoto: Photo = {
        path: photo.path,
        preview: photo.webPath,
      };
      await getGPSData(photo.webPath).then((data) => {
        if (data) {
          const location: Location = {
            lat: data.latitude,
            lng: data.longitude,
          };
          pickedPhoto = { ...pickedPhoto, location };
        }
      });
      setTakenPhoto(pickedPhoto);
      props.onImagePick(pickedPhoto);
    } catch (error) {
      if (props.onCancel) {
        props.onCancel();
      }
    }
  };

  return (
    <div
      onClick={takePhotoHandler}
      className={
        takenPhoto
          ? "image-preview-container image-preview-container--with-image"
          : "image-preview-container"
      }
    >
      {!takenPhoto && <p className="text-body small-print">No photo chosen.</p>}
      {takenPhoto && <img src={takenPhoto.preview} alt="Preview" />}
      <input
        type="file"
        hidden
        ref={filePickerRef}
        onChange={pickFileHandler}
      />
      <IonToast
        duration={3000}
        position="middle"
        isOpen={error.showError}
        onDidDismiss={() => setError({ showError: false, message: undefined })}
        message={error.message}
      />
    </div>
  );
});

export default ImagePicker;
