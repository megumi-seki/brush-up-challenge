import type { TimeRecorderType } from "../types";

const getRecordsById = (empId: string): TimeRecorderType[] => {
  const key = "time_records";
  const storedData = localStorage.getItem(key);
  const records: TimeRecorderType[] = storedData ? JSON.parse(storedData) : [];
  const filteredRecords = records.filter((record) => record.emp_id === empId);
  return filteredRecords;
};

export default getRecordsById;
