import { toZonedTime } from "date-fns-tz";
import type { GroupedTimeRecorderType, TimeRecorderType } from "../types";
import { TIMEZONE } from "../constants/appConfig";

// 打刻データを従業員IDと日付ごとにグルーピングし、一つのオブジェクトにまとめる
const groupRecordsById = (
  records: TimeRecorderType[]
): GroupedTimeRecorderType[] => {
  // reduceを使ってグルーピングかつrole, datetimeをセット
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
        group.clock_in.role = record.role;
        group.clock_in.datetime = record.datetime;
        break;
      case "break_begin":
        group.break_begin.role = record.role;
        group.break_begin.datetime = record.datetime;
        break;
      case "break_end":
        group.break_end.role = record.role;
        group.break_end.datetime = record.datetime;
        break;
      case "clock_out":
        group.clock_out.role = record.role;
        group.clock_out.datetime = record.datetime;
        break;
      case "role_change":
        group.role_changes.push({
          role: record.role,
          datetime: record.datetime,
        });
        break;
      default:
        throw Error("不正な登録種別");
    }

    return acc;
  }, {} as Record<string, GroupedTimeRecorderType>);

  // 各グループでセットされたdatetimeをもとに勤務時間と休憩時間を計算してセット
  Object.values(groupedMap).forEach((group) => {
    const parse = (datetime: string | null) =>
      datetime ? toZonedTime(new Date(datetime), TIMEZONE) : null;

    const clockInDatetime = parse(group.clock_in.datetime);
    const clockOutDatetime = parse(group.clock_out.datetime);
    const breakBeginDatetime = parse(group.break_begin.datetime);
    const breakEndDatetime = parse(group.break_end.datetime);

    if (clockInDatetime && clockOutDatetime) {
      group.work_duration_millis = clockOutDatetime.getTime() - clockInDatetime.getTime();
    }
    if (breakBeginDatetime && breakEndDatetime && group.work_duration_millis) {
      group.break_duration_millis = breakEndDatetime.getTime() - breakBeginDatetime.getTime();
      group.work_duration_millis -= group.break_duration_millis;
    }
  });

  return Object.values(groupedMap);
};

export default groupRecordsById;
