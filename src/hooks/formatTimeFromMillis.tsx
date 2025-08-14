const formatTimeFromMillis = (millis: number) => {
  const hour = Math.floor(millis / (1000 * 60 * 60));
  const minutes = Math.floor((millis / (1000 * 60)) % 60);
  return `${hour}時間${minutes.toString()}分`;
};

export default formatTimeFromMillis;
