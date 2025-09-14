import { format } from "date-fns-tz";
import { TIMEZONE } from "../constants/appConfig";

const formatDateToJst = (date: Date) =>
  format(date, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: TIMEZONE });

export default formatDateToJst;
