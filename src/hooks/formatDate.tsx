const formatDate = (datetimeString: string | null) => {
  if (!datetimeString) return "-";
  const datetime = new Date(datetimeString);
  const formattedDate = `${datetime.getFullYear().toString()}/${(
    datetime.getMonth() + 1
  ).toString()}/${datetime.getDate().toString()} (${
    ["日", "月", "火", "水", "木", "金", "土"][datetime.getDay()]
  })`;

  return formattedDate;
};

export default formatDate;
