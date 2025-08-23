import { GRAPH_TOTAL_MINUTES } from "../constants/appConfig";
import getMinutes from "../hooks/getMinutes";
import type { GroupedTimeRecorderType } from "../types";

type props = {
  record: GroupedTimeRecorderType;
};

const Graph = ({ record }: props) => {
  const { clock_in, clock_out, break_begin, break_end, role_changes } = record;

  const clockInDatetime = clock_in.datetime;
  const clockOutDatetime = clock_out.datetime;
  const breakBeginDatetime = break_begin.datetime;
  const breakEndDatetime = break_end.datetime;
  const isDataEnough =
    (clockInDatetime &&
      breakBeginDatetime &&
      breakEndDatetime &&
      clockOutDatetime) ||
    (!breakBeginDatetime && clockInDatetime && clockOutDatetime);
  if (!isDataEnough) {
    let lack = "退勤";
    if (clockInDatetime && breakBeginDatetime && !breakEndDatetime)
      lack = "休憩終了";
    return (
      <span className="incomplete-graph">
        打刻データが不足しています。不足打刻：{lack}
      </span>
    );
  }

  const eventsWithDatetime = [
    clock_in,
    clock_out,
    break_begin,
    break_end,
    ...role_changes,
  ].filter((e) => e?.datetime);
  const sortedRoleChanges = eventsWithDatetime.sort(
    (a, b) => new Date(a.datetime!).getTime() - new Date(b.datetime!).getTime()
  );

  const startMin = getMinutes(clockInDatetime);
  const breakBeginMin = breakBeginDatetime
    ? getMinutes(breakBeginDatetime)
    : null;
  const breakEndMin = breakEndDatetime ? getMinutes(breakEndDatetime) : null;
  const endMin = getMinutes(clockOutDatetime);

  const breakMap = new Array(GRAPH_TOTAL_MINUTES).fill(false);
  if (breakBeginMin && breakEndMin) {
    const breakFrom = Math.max(0, breakBeginMin);
    const breakTo = Math.min(GRAPH_TOTAL_MINUTES, breakEndMin);
    for (let i = breakFrom; i < breakTo; i++) {
      breakMap[i] = true;
    }
  }

  const roleRanges: { from: number; to: number; role: string }[] = [];
  for (let i = 0; i < sortedRoleChanges.length; i++) {
    const current = sortedRoleChanges[i];
    const next = sortedRoleChanges[i + 1];

    const fromMin = getMinutes(current.datetime!);
    const toMin = next ? getMinutes(next.datetime!) : endMin + 1;

    if (current.role) {
      roleRanges.push({
        from: fromMin,
        to: toMin,
        role: current.role,
      });
    }
  }

  const getRoleForMinute = (minute: number): string | null => {
    for (const range of roleRanges) {
      if (range.from <= minute && minute < range.to) {
        return range.role;
      }
    }
    return null;
  };

  let minuteDataForGraph = [];
  for (let i = 0; i <= GRAPH_TOTAL_MINUTES; i++) {
    const role = getRoleForMinute(i);
    const roleClassName = role ? `role-${role}` : "";

    if (i < startMin || (endMin && endMin < i)) {
      minuteDataForGraph.push("none"); // 非労働時間
    } else if (breakMap[i]) {
      minuteDataForGraph.push(`break ${roleClassName}`); // 休憩中
    } else {
      minuteDataForGraph.push(`work ${roleClassName}`); // 勤務中
    }
  }

  const content = minuteDataForGraph.map((status, index) => (
    <span className={`minute ${status}`} key={index}></span>
  ));

  return <>{content}</>;
};

export default Graph;
