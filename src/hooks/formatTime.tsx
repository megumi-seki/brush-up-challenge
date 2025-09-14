import { toZonedTime } from "date-fns-tz";
import { TIMEZONE } from "../constants/appConfig";

const formatTime = (datetimeProp: string | Date | null) => {
  if (!datetimeProp) return "-";
  const datetime =
    typeof datetimeProp === "string"
      ? toZonedTime(new Date(datetimeProp), TIMEZONE)
      : datetimeProp;
  const formattedDate = `${datetime
    .getHours()
    .toString()
    .padStart(2, "0")}:${datetime.getMinutes().toString().padStart(2, "0")}`;
  return formattedDate;
};

export default formatTime;
