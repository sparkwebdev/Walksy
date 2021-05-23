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

const { Camera } = Plugins;

const ImagePicker: React.FC<{
  onImagePick: (photo: Photo) => void;
  onCancel?: () => void;
  ref?: any;
}> = forwardRef((props, ref) => {
  const [takenPhoto, setTakenPhoto] = useState<Photo>();

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
    </div>
  );
});

export default ImagePicker;
