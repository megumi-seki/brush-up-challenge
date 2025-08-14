const formatTimeFromMillis = (millis: number) => {
  const h = Math.floor(millis / (1000 * 60 * 60));
  const m = Math.floor((millis / (1000 * 60)) % 60);
  return `${h}時間${m.toString()}分`;
};

export default formatTimeFromMillis;
