import { Filesystem, FilesystemDirectory } from "@capacitor/core";
import { base64FromPath } from "@ionic/react-hooks/filesystem";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import exifr from "exifr";
import { UploadedFile } from "./data/models";
dayjs.extend(isSameOrAfter);

/* String functions */
export const numberWithCommas = (x: string | number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* File functions */
export const loadImage = async (imagePath: string) => {
  await Filesystem.readFile({
    path: `moments/${imagePath}`,
    directory: FilesystemDirectory.Data,
  }).then((file) => {
    return "data:image/jpeg;base64," + file.data;
  });
};

const saveImageHandler = async (file: string) => {
  const fileName = Math.floor(Math.random() * 99999) + new Date().getTime() + ".jpeg";
  const base64 = await base64FromPath(file);
  try {
    Filesystem.writeFile({
      path: `moments/${fileName}`,
      data: base64,
      directory: FilesystemDirectory.Data,
    });
    return fileName;
  } catch {
    console.log("Failed to write file");
    return;
  }
};

const fileToDataURL = async (file: any) => {
  const savedFileName = await saveImageHandler(file).then((result) => {
    return result;
  }).catch((e) => {
    console.log("36rt", e);
  });
  var reader = new FileReader();
  let type = file.type;
  if (type === "image/jpeg" || type === "image/jpg" || type === "image/png") {
    type = "image";
    // } else if (type === "image/mp3") {
    // type = "audio";
  } else {
    console.log(`File type '${type}' not supported`);
    return;
  }
  let latitude: number, longitude: number;
  const gpsData = await exifr.gps(file);
  if (gpsData) {
    latitude = gpsData.latitude;
    longitude = gpsData.longitude;
  }
  const { CreateDate } = (await exifr.parse(file)) || undefined;
  const timestamp = CreateDate ? new Date(CreateDate).toISOString() : "";
  return new Promise(function (resolve, reject) {
    reader.onload = function (event) {
      const fileDetails: UploadedFile = {
        type,
        fileName: file.name,
        filePath: savedFileName,
        data: event.target!.result,
        latitude,
        longitude,
        timestamp,
      };
      resolve(fileDetails);
    };
    reader.readAsDataURL(file);
  }).catch((e) => {
    console.log("Could not process upload", e);
  });
};

export const readAsDataURL = (target: any) => {
  var filesArray = Array.prototype.slice.call(target.files);
  return Promise.all(filesArray.map(fileToDataURL));
};

/* Date/time functions */
export function formatDate(isoString: string, showYear: boolean = true) {
  if (showYear) {
    return dayjs(isoString).format("D MMM 'YY");
  }
  return dayjs(isoString).format("D MMM");
}
export function formatTime(isoString: string) {
  return new Date(isoString).toLocaleDateString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
export function formatDateTime(isoString: string) {
  return new Date(isoString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* User preferences functions */
export function getUnitDistance() {
  const unit: string = "km";
  return unit;
}


/* Date/time functions */
export function getMinAndSec(totalSeconds: number) {
  let minutes: number = Math.floor(totalSeconds / 60);
  let seconds: number = totalSeconds % 60;
  return {
    min: minutes,
    sec: seconds,
  };
}

export function getTimeDiff(start: string, end: string) {
  return dayjs(end).diff(dayjs(start), "second");
}

export function getFriendlyTimeOfDay() {
  var now = dayjs();
  var day = now.format("dddd");
  var morning = dayjs().hour(5).minute(0).second(0);
  var lunchtime = dayjs().hour(11).minute(55).second(0);
  var afternoon = dayjs().hour(13).minute(30).second(0);
  var evening = dayjs().hour(17).minute(0).second(0);
  var night = dayjs().hour(20).minute(0).second(0);
  var latenight = dayjs().hour(0).minute(0).second(0);

  if (dayjs().isSameOrAfter(night)) {
    return day + " night";
  }
  if (dayjs().isSameOrAfter(evening)) {
    return day + " evening";
  }
  if (dayjs().isSameOrAfter(afternoon)) {
    return day + " afternoon";
  }
  if (dayjs().isSameOrAfter(lunchtime)) {
    return day + " lunchtime";
  }
  if (dayjs().isSameOrAfter(morning)) {
    return day + " morning";
  }
  if (dayjs().isSameOrAfter(latenight)) {
    return "Late night";
  }
  return day;
}


/* Content Generator functions */
export function getFriendlyWalkDescriptor() {
  const descriptor: string[] = [
    "stroll",
    "walk",
    "jaunt",
    "meander",
    "amble",
    "saunter",
  ];
  return descriptor[Math.floor(Math.random() * descriptor.length)];
}

export function generateHslaColors(
  amount = 1,
  saturation = 72,
  lightness = 72,
  randomise = false
) {
  let colors = [];
  let huedelta = Math.trunc(360 / amount);

  var ranNum = Math.ceil(Math.random() * (180 / amount)) * (Math.round(Math.random()) ? 1 : -1);
  for (let i = amount; i > 0; i--) {
    let hue = i * huedelta;
    if (randomise) {
      hue = hue + ranNum;
    }
    colors.push(hslToHex(hue, saturation, lightness));
  }
  return colors;
}

/**
 * Converts an HSL color value to Hex. Conversion formula
 * from https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {strinf}          The RGB representation
 */
export function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/* Map and Geo functions */
export function getDistanceBetweenPoints(
  start: { lat: number; long: number },
  end: { lat: number; long: number },
  unit: "km" | "miles"
) {
  let earthRadius = {
    miles: 3958.8,
    km: 6371,
  };

  let R = earthRadius[unit];
  let lat1 = start.lat;
  let lon1 = start.long;
  let lat2 = end.lat;
  let lon2 = end.long;

  let dLat = toRad(lat2 - lat1);
  let dLon = toRad(lon2 - lon1);
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;

  return d;
}

export function toRad(x: number) {
  return (x * Math.PI) / 180;
}
