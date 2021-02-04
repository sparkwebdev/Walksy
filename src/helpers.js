
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);

/* Date/time functions */
export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}
export function formatTime(isoString) {
  return new Date(isoString).toLocaleDateString('en-GB', {
    hour: '2-digit', minute: '2-digit'
  });
}
export function formatDateTime(isoString) {
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

/* User preferences functions */
export function getUnitDistance() {
  return 'km';
}

export function getFriendlyTimeOfDay() {
  var now = dayjs();
  var day = now.format('dddd');
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
};

export function getFriendlyWalkDescriptor() {
  const descriptor = [
    'stroll',
    'walk',
    'jaunt',
    'meander',
    'amble',
    'saunter'
  ];
  return descriptor[Math.floor(Math.random() * descriptor.length)];
};