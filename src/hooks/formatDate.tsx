const formatDate = (date: Date) =>
  `${date.getFullYear().toString()}/${(date.getMonth() + 1).toString()}/${date
    .getDate()
    .toString()} (${
    ["日", "月", "火", "水", "木", "金", "土"][date.getDay()]
  })`;

export default formatDate;
