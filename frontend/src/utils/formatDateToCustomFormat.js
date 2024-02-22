import { format, parseISO } from "date-fns";

export default function formatDateToCustomFormat(dateString) {
  const parsedDate = parseISO(dateString);
  return format(parsedDate, "MMMM d, yyyy");
}
