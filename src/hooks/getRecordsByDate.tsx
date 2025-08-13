import type { TimeRecorderType } from "../types";
import formatDate from "./formatDate";

const getRecordsByDate = (date: Date): TimeRecorderType[] => {
  const formattedDate = formatDate(date);
  const key = `time_records`;
  const storedData = localStorage.getItem(key);
  const records: TimeRecorderType[] = storedData ? JSON.parse(storedData) : [];
  const filteredRecords = records.filter((record) => {
    const recordDatetime = new Date(record.datetime);
    const formattedRecordDate = formatDate(recordDatetime);
    return formattedRecordDate === formattedDate;
  });
  return filteredRecords;
};

export default getRecordsByDate;
