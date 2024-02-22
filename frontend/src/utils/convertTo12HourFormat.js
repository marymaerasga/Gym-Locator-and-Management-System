import { format, parse } from "date-fns";

export default function convertTo12HourFormat(time24) {
  // Parse the input time
  const parsedTime = parse(time24, "HH:mm", new Date());

  // Format the time in 12-hour format
  const time = format(parsedTime, "h:mm a");

  return time;
}
