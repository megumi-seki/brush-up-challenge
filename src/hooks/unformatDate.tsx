import { toZonedTime } from "date-fns-tz";
import { TIMEZONE } from "../constants/appConfig";

const unformatDate = (dateString: string): Date => {
  // Check if the date string is in the format YYYY-MM-DD
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(dateString)) {
    throw new Error("Invalid date format. Expected format: YYYY-MM-DD");
  }

  return toZonedTime(new Date(dateString), TIMEZONE);
};

export default unformatDate;
