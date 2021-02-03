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