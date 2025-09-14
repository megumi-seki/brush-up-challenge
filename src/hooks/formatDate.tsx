import { toZonedTime } from "date-fns-tz";
import { TIMEZONE } from "../constants/appConfig";

const formatDate = (datetimeProp: string | Date | null) => {
  if (!datetimeProp) return "-";
  const datetime =
    typeof datetimeProp === "string"
      ? toZonedTime(new Date(datetimeProp), TIMEZONE)
      : datetimeProp;
  const formattedDate = `${datetime.getFullYear().toString()}/${(
    datetime.getMonth() + 1
  ).toString()}/${datetime.getDate().toString()} (${
    ["日", "月", "火", "水", "木", "金", "土"][datetime.getDay()]
  })`;

  return formattedDate;
};

export default formatDate;
