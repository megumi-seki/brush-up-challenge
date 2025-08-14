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

type RoleTimeType = {
  role: string | null;
  datetime: string | null;
};

export type GroupedTimeRecorderType = {
  emp_id: string;
  date: string;
  clock_in: RoleTimeType;
  break_begin: RoleTimeType;
  break_end: RoleTimeType;
  clock_out: RoleTimeType;
  work_duration_millis: number | null; // ミリ秒単位
  break_duration_millis: number | null; // ミリ秒単位
  role_changes: RoleTimeType[];
};
