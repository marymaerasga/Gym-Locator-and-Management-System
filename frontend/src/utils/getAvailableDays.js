const getAvailableDays = (openDay, closeDay) => {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const openIndex = daysOfWeek.indexOf(openDay);
  const closeIndex = daysOfWeek.indexOf(closeDay);

  if (openIndex === -1 || closeIndex === -1) {
    // Handle invalid open/close days
    return [];
  }

  // If close day is on or after open day, generate the array of available days
  const availableDays = daysOfWeek.slice(openIndex, closeIndex + 1);

  return availableDays;
};

// Example usage
const openDay = "Monday";
const closeDay = "Thursday";

const availableDays = getAvailableDays(openDay, closeDay);
console.log(availableDays);
