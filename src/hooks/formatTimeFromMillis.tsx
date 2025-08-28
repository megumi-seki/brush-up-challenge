const formatTimeFromMillis = (millis: number | null) => {
  if (!millis) return "-";
  const hour = Math.floor(millis / (1000 * 60 * 60));
  const minutes = Math.floor((millis / (1000 * 60)) % 60);
  if (hour === 0) return `${minutes.toString()}分`;
  return `${hour}時間${minutes.toString()}分`;
};

export default formatTimeFromMillis;
