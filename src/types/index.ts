export type Employee = {
  id: string;
  name: string;
  roles: string[];
};

export type TimeRecorderType = {
  emp_id: string;
  datetime: string;
  role: string | null;
  type: string;
  note?: string;
};
