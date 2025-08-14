import type { TimeRecorderType } from "../types";
import formatDate from "./formatDate";

const getRecordsByDate = (datetimeString: string): TimeRecorderType[] => {
  const formattedDate = formatDate(datetimeString);
  const key = `time_records`;
  const storedData = localStorage.getItem(key);
  const records: TimeRecorderType[] = storedData ? JSON.parse(storedData) : [];
  const filteredRecords = records.filter((record) => {
    const formattedRecordDate = formatDate(record.datetime);
    return formattedRecordDate === formattedDate;
  });
  return filteredRecords;
};

export default getRecordsByDate;
