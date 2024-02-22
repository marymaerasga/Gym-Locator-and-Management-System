export default function isValid24HourTime(time) {
  if (time === null || typeof time !== "string") {
    return false;
  }

  // Check if the time follows the format HH:mm (2 digits for both hour and minute)
  const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

  // Check if the time is in 24-hour format
  const hour = parseInt(time.split(":")[0]);
  if (hour < 0 || hour > 23) {
    return false;
  }

  return timeRegex.test(time);
}
