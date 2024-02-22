import { format, parse } from "date-fns";

export const formattedTime = (time) => {
  const parsedTime = format(
    parse(time || "00:00", "HH:mm", new Date()),
    "h:mm a"
  );

  return parsedTime;
};
