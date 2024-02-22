function calculateEndTime(durationInDays) {
  const durationInMilliseconds = durationInDays * 24 * 60 * 60 * 1000; // Convert days to milliseconds
  const currentTime = Date.now();
  const result = currentTime + durationInMilliseconds;
  const endTime = new Date(result);
  return endTime;
}

export default calculateEndTime;
