import { toZonedTime } from "date-fns-tz";
import { TIMEZONE } from "../constants/appConfig";

const formatDate = (datetimeString: string | null) => {
  if (!datetimeString) return "-";
  const datetime = toZonedTime(new Date(datetimeString), TIMEZONE);
  const formattedDate = `${datetime.getFullYear().toString()}/${(
    datetime.getMonth() + 1
  ).toString()}/${datetime.getDate().toString()} (${
    ["日", "月", "火", "水", "木", "金", "土"][datetime.getDay()]
  })`;

  return formattedDate;
};

export default formatDate;
