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
  note: string;
};

export type ShiftType = {
  emp_id: string;
  datetime: string;
  role: string | null;
  type: string;
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

export type CorrectionTimeRecordType = {
  emp_id: string;
  datetime: {value: string, label: string | null};
  role: {value: string | null, label: string | null};
  type: {value: string, label: string | null};
  note: {value: string, label: string | null};
};

export type CorrectionRequestType = {
    emp_id: string;
    dateString: string;
    records: CorrectionTimeRecordType[];
  };
