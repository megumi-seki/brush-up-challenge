import type { TimeRecorderType } from "../types";
import formatDate from "./formatDate";

type getRecordsByDateProps = {
  datetimeString: string;
  key: "time_records" | "shift";
};

const getRecordsByDate = ({
  datetimeString,
  key,
}: getRecordsByDateProps): TimeRecorderType[] => {
  const formattedDate = formatDate(datetimeString);
  const storedData = localStorage.getItem(key);
  const records: TimeRecorderType[] = storedData ? JSON.parse(storedData) : [];
  const filteredRecords = records.filter((record) => {
    const formattedRecordDate = formatDate(record.datetime);
    return formattedRecordDate === formattedDate;
  });
  
  return filteredRecords;
};

export default getRecordsByDate;
