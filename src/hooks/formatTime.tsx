import { toZonedTime } from "date-fns-tz";
import { TIMEZONE } from "../constants/appConfig";

const formatTime = (dateString: string | null) => {
  if (!dateString) return "-";
  const date = toZonedTime(new Date(dateString), TIMEZONE);
  const formattedDate = `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
  return formattedDate;
};

export default formatTime;
