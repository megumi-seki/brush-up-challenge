const formatTime = (dateString: string | null) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const formattedDate = `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
  return formattedDate;
};

export default formatTime;
