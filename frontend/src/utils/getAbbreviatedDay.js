const getAbbreviatedDay = (dayName) => {
  const daysMap = {
    Sunday: "Sun",
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
  };

  return daysMap[dayName] || dayName;
};

export default getAbbreviatedDay;
