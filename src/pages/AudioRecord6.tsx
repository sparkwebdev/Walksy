import React, { useState } from "react";
import { Media, MediaObject } from "@ionic-native/media";
import { File } from "@ionic-native/file";
import { IonButton, IonPage } from "@ionic/react";

const AudioRecord6: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioRec, setAudioRec] = useState<MediaObject>();
  const audio: MediaObject = Media.create("file.m4a");
  // file.onStatusUpdate.subscribe((status) => console.log(status)); // fires when file status changes

  // file.onSuccess.subscribe(() => console.log("Action is successful"));

  // file.onError.subscribe((error) => console.log("Error!", error));
  // window.setTimeout(() => file.stopRecord(), 10000);

  // const startRecording = () => {
  //   file.startRecord();
  //   setIsRecording(true);
  //   console.log("start recording");
  // };
  // const stopRecording = () => {
  //   file.stopRecord();
  //   setIsRecording(false);
  //   console.log("stop recording");
  //   file.play();
  // };

  const startRecording = () => {
    console.log("Started Recording");
    setIsRecording(true);
    // recording = true;
    // File.createFile(File.tempDirectory, "my_file.m4a", true).then(() => {
    //   const audio: MediaObject = Media.create(
    //     File.tempDirectory.replace(/^file:\/\//, "") + "my_file.m4a"
    //   );
    //   console.log("Audio assigned to constant audio media object");
    //   console.log(audio);
    //   // audio = audio;
    //   console.log("Audio assigned to audio media object");
    //   console.log(audio);
    audio!.startRecord();
    audio!.onStatusUpdate.subscribe((status) => {
      console.log("Status of audio updated");
      console.log(status);
      // if (status == 4 && playingAudio) {
      //   console.log("Time to stop playback")
      //   stopPlayback();
      // }
    });
    setAudioRec(audio);
    // window.setTimeout(() => {
    //   if (recording) stopRecording();
    // }, 10000);
    // });
  };

  const stopRecording = () => {
    audio!.stopRecord();
    console.log("Stopped Recording");
    console.log(audio);
    setIsRecording(false);
    // recording = false;
    // audioReady = true;
    const duration = audio!.getDuration();
    console.log("Audio Duration: " + duration);
    // console.log("Audio Duration Property: " + audio!.duration);
  };

  const playAudio = () => {
    console.log("Playing Audio");
    // playingAudio = true;
    audio!.play();
  };

  const stopPlayback = () => {
    console.log("Stopping Playback");
    // playingAudio = false;
    audio!.stop();
  };

  // uploadAudio() {
  //   console.log("Uploading record");
  //   storeRecord().subscribe((downloadURL) => {
  //     console.log("Finished storing record");
  //     console.log("Download URL is " + downloadURL);
  //     audioURL = downloadURL;
  //     audioURLReady = true;
  //   });
  // }

  // storeRecord() {
  //   return Observable.create((observer) => {
  //     console.log('Saving record');
  //     const filePath = `${file.tempDirectory}my_file.m4a`;
  //     console.log("Path to record is " + filePath);
  //     const readFile: any = window['resolveLocalFileSystemURL'];
  //     return readFile(filePath, (fileEntry) => {
  //       return fileEntry.file((file) => {
  //         const fileReader = new FileReader();
  //         fileReader.onloadend = (result: any) => {
  //           let arrayBuffer = result.target.result;
  //           let blob = new Blob([new Uint8Array(arrayBuffer)], { type: 'audio/m4a' });
  //           console.log("Blob is ");
  //           console.log(blob);
  //           var storageRef = firebase.storage().ref('content/' + firebase.user.uid + '/my-file.m4a');
  //           console.log("Storage reference is " + storageRef);
  //           var uploadTask = storageRef.put(blob);
  //           console.log('Upload started:');
  //           uploadTask.on('state_changed', (snapshot) => {
  //             console.log("state changed");
  //             let percent = uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes * 100;
  //             console.log(percent + "% done");
  //           }, (e) => {
  //             console.error(e);
  //             observer.error(e);
  //           }, () => {
  //             var downloadURL = uploadTask.snapshot.downloadURL;
  //             console.log('Storage Download URL:' + downloadURL);
  //             observer.next(downloadURL);
  //           });
  //         };
  //         fileReader.onerror = (e: any) => {
  //           console.error(e);
  //           observer.error(e);
  //         };
  //         fileReader.readAsArrayBuffer(file);
  //       }, (e) => {
  //         console.error(e);
  //         observer.error(e);
  //       });
  //     }, (e) => {
  //       console.error(e);
  //       observer.error(e);
  //     });
  //   });
  // }

  // downloadAudio() {
  //   console.log("Downloading Audio")
  //   const fileTransfer: FileTransferObject = fileTransfer.create();
  //   var destPath = (cordova.file.externalDataDirectory || cordova.file.dataDirectory) + "my_file.m4a"
  //   fileTransfer.download(audioURL, destPath, ).then((entry) => {
  //     let rawAudioURI = entry.toURL();
  //     audioURI = rawAudioURI.replace(/^file:\/\//, '/private');
  //     audioURIReady = true;
  //     console.log("Audio URI: " + audioURI);
  //   }, (error) => {
  //     console.error(error);
  //   });
  // }

  // playAudioURI() {
  //   console.log("Playing AudioURI");
  //   let downloadedAudio: MediaObject = media.create(audioURI);
  //   console.log("Downloaded audio: " + downloadedAudio);
  //   downloadedAudio.play();
  // }

  // File.createFile(File.tempDirectory, 'my_file.mp3', true).then(() => {
  //   let file = Media.create(File.tempDirectory.replace(/^file:\/\//, '') + 'my_file.mp3');
  //   file.startRecord();
  //   window.setTimeout(() => file.stopRecord(), 10000);
  // });
  return (
    <IonPage>
      {isRecording ? (
        <IonButton color="danger" onClick={stopRecording}>
          Stop Recording
        </IonButton>
      ) : (
        <IonButton color="success" onClick={startRecording}>
          Start Recording
        </IonButton>
      )}
      <IonButton color="success" onClick={playAudio}>
        Play
      </IonButton>
      <IonButton color="success" onClick={stopPlayback}>
        Stop
      </IonButton>
    </IonPage>
  );
};

export default AudioRecord6;
