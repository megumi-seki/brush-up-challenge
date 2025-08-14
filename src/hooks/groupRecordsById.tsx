import type { GroupedTimeRecorderType, TimeRecorderType } from "../types";

const groupRecordsById = (
  records: TimeRecorderType[]
): GroupedTimeRecorderType[] => {
  const groupedMap = records.reduce((acc, record) => {
    const date = record.datetime.split("T")[0];
    const key = `${record.emp_id}-${date}`;

    if (!acc[key]) {
      acc[key] = {
        emp_id: record.emp_id,
        date,
        clock_in: { role: null, datetime: null },
        break_begin: { role: null, datetime: null },
        break_end: { role: null, datetime: null },
        clock_out: { role: null, datetime: null },
        work_duration_millis: null,
        break_duration_millis: null,
        role_changes: [],
      };
    }

    const group: GroupedTimeRecorderType = acc[key];

    switch (record.type) {
      case "clock_in":
        group.clock_in.role = record.role || null;
        group.clock_in.datetime = record.datetime;
        break;
      case "break_begin":
        group.break_begin.role = record.role || null;
        group.break_begin.datetime = record.datetime;
        break;
      case "break_end":
        group.break_end.role = record.role || null;
        group.break_end.datetime = record.datetime;
        break;
      case "clock_out":
        group.clock_out.role = record.role || null;
        group.clock_out.datetime = record.datetime;
        break;
      case "role_change":
        group.role_changes.push({
          role: record.role || null,
          datetime: record.datetime,
        });
        break;
      default:
        throw Error("不正な登録種別");
    }

    return acc;
  }, {} as Record<string, GroupedTimeRecorderType>);

  Object.values(groupedMap).forEach((group) => {
    const parse = (datetime: string | null) =>
      datetime ? new Date(datetime) : null;

    const start = parse(group.clock_in.datetime);
    const end = parse(group.clock_out.datetime);
    const breakStart = parse(group.break_begin.datetime);
    const breakEnd = parse(group.break_end.datetime);

    if (start && end) {
      group.work_duration_millis = end.getTime() - start.getTime();
    }
    if (breakStart && breakEnd && group.work_duration_millis) {
      group.break_duration_millis = breakEnd.getTime() - breakStart.getTime();
      group.work_duration_millis -= group.break_duration_millis;
    }
  });

  return Object.values(groupedMap);
};

export default groupRecordsById;
