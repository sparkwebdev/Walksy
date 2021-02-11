import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);

/* Date/time functions */
export function formatDate(isoString: string) {
  return new Date(isoString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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

// export function parseISOString(s: string) {
//   var b = s.split(/\D+/);
//   return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
// }

/* User preferences functions */
export function getUnitDistance() {
  const unit: string = "km";
  return unit;
}

export function getMinAndSec(totalSeconds: number) {
  let minutes: number = Math.floor(totalSeconds / 60);
  let seconds: number = totalSeconds % 60;
  return {
    min: minutes,
    sec: seconds,
  };
}

export function getFriendlyTimeOfDay() {
  var now = dayjs();
  var day = now.format("dddd");
  var morning = dayjs().hour(5).minute(0).second(0);
  var lunchtime = dayjs().hour(11).minute(55).second(0);
  var afternoon = dayjs().hour(13).minute(30).second(0);
  var evening = dayjs().hour(17).minute(0).second(0);
  var night = dayjs().hour(20).minute(0).second(0);

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
}

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
  saturation = 95,
  lightness = 75
) {
  let colors = [];
  let huedelta = Math.trunc(360 / amount);
  for (let i = 0; i < amount; i++) {
    let hue = i * huedelta;
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