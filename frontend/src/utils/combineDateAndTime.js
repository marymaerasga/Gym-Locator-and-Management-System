function combineDateAndTime(date, timeString) {
  // Convert MongoDB Date to JavaScript Date
  var dateObject = new Date(date);

  // Extract hours and minutes from the time string
  var timeArray = timeString.split(":");
  var hours = parseInt(timeArray[0], 10);
  var minutes = parseInt(timeArray[1], 10);

  // Set hours and minutes in the Date object
  dateObject.setHours(hours, minutes);

  return dateObject;
}

export default combineDateAndTime;
