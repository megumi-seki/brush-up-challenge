import { toZonedTime } from "date-fns-tz";
import { GRAPH_START_HOUR, TIMEZONE } from "../constants/appConfig";

const getMinutes = (datetimeString: string): number => {
  const datetime = toZonedTime(new Date(datetimeString), TIMEZONE);
  const minutes =
    (datetime.getHours() - GRAPH_START_HOUR) * 60 + datetime.getMinutes();
  return minutes;
};

export default getMinutes;
