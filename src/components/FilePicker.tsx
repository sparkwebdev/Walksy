import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import exifr from "exifr";
import { Location, File } from "../data/models";
import { IonToast } from "@ionic/react";
import { getFileExtension } from "../helpers";

const possibleFileTypes = {
  audio: ["aac"],
  image: ["jpg", "jpeg", "png"],
};

const FilePicker: React.FC<{
  onFilePick: (file: File) => void;
  onCancel?: () => void;
  ref?: any;
  fileType: "audio" | "image";
}> = forwardRef((props, ref) => {
  const [chosenFile, setChosenFile] = useState<File>();
  const [error, setError] = useState<{
    showError: boolean;
    message?: string;
  }>({ showError: false });

  const allowedFileTypes = possibleFileTypes[props.fileType];

  const filePickerRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    triggerChooseFile() {
      openFilePicker();
    },
  }));

  const openFilePicker = () => {
    filePickerRef.current!.click();
  };

  const getGPSData = async (file: any) => {
    return await exifr.gps(file);
  };

  const pickFileHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputFile = event.target!.files![0];
    if (!inputFile) {
      return;
    }
    // if (inputFile.size > 1000000) {
    //   setError({
    //     showError: true,
    //     message: "Please upload a file less than 1MB",
    //   });
    //   return;
    // }
    const fileExtensionData = getFileExtension(inputFile.name);
    if (
      !fileExtensionData ||
      !allowedFileTypes.includes(fileExtensionData[1])
    ) {
      setError({
        showError: true,
        message: `Please upload a valid file type (${allowedFileTypes.join(
          ", "
        )})`,
      });
      return;
    }
    const fr = new FileReader();
    fr.onload = async () => {
      let file: File = {
        path: inputFile.name,
        preview: fr.result!.toString(),
      };
      await getGPSData(file.preview)
        .then((data) => {
          if (data) {
            const location: Location = {
              lat: data.latitude,
              lng: data.longitude,
            };
            file = { ...file, location };
          }
        })
        .catch((e) => {
          console.log("Can't get GPS data.", e);
        });
      setChosenFile(file);
      props.onFilePick(file);
    };
    fr.readAsDataURL(inputFile);
  };

  return (
    <div
      onClick={openFilePicker}
      className={
        chosenFile
          ? "image-preview-container image-preview-container--with-image"
          : "image-preview-container"
      }
    >
      {!chosenFile && <p className="text-body small-print">No file chosen.</p>}
      {chosenFile && <img src={chosenFile.preview} alt="Preview" />}
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

export default FilePicker;
