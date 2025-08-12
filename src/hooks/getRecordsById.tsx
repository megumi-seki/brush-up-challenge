import type { TimeRecorderType } from "../types";

const getRecordsById = (empId: string): TimeRecorderType[] => {
  const key = `${empId}_time_records`;
  const storedData = localStorage.getItem(key);
  const records: TimeRecorderType[] = storedData ? JSON.parse(storedData) : [];
  return records;
};

export default getRecordsById;
