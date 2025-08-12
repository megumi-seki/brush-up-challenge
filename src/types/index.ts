export type Employee = {
  id: string;
  name: string;
  roles: string[];
};

export type timeRecorderType = {
  emp_id: string;
  datetime: string;
  role: string;
  type: string;
  note?: string;
};
