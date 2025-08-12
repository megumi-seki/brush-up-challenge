type timeRecorderType = {
  emp_id: string;
  datetime: string;
  role: string;
  type: string;
  note?: string;
};

const getRecordsById = (empId: string): timeRecorderType[] => {
  const key = `${empId}_time_records`;
  const storedData = localStorage.getItem(key);
  const records: timeRecorderType[] = storedData ? JSON.parse(storedData) : [];
  return records;
};

export default getRecordsById;
