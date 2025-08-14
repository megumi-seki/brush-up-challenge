import { GRAPH_TOTAL_MINUTES } from "../constants/appConfig";
import getMinutes from "../hooks/getMinutes";
import type { GroupedTimeRecorderType } from "../types";

type props = {
  record: GroupedTimeRecorderType;
};

const Graph = ({ record }: props) => {
  const { clock_in, clock_out, break_begin, break_end, role_changes } = record;
  const clockInDatetime = clock_in.datetime;
  if (clockInDatetime === null) return <></>;
  const clockOutDatetime = clock_out.datetime;
  const breakBeginDatetime = break_begin.datetime;
  const breakEndDatetime = break_end.datetime;
  const sortedRoleChanges =
    clockOutDatetime || (clockOutDatetime && break_begin && break_end)
      ? [...role_changes, clock_in, clock_out, break_begin, break_end].sort(
          (a, b) =>
            new Date(a.datetime!).getTime() - new Date(b.datetime!).getTime()
        )
      : []; //TODO: ここのsortedRoleChanges怪しいからより良い書き方ないか見直す
  const now = new Date();

  const startMin = getMinutes(clockInDatetime);
  const breakBeginMin = breakBeginDatetime
    ? getMinutes(breakBeginDatetime)
    : null;
  const breakEndMin = breakEndDatetime
    ? getMinutes(breakEndDatetime)
    : getMinutes(now.toISOString()); //TODO: 日付によって条件分岐
  const endMin = clockOutDatetime
    ? getMinutes(clockOutDatetime)
    : getMinutes(now.toISOString()); //TODO: 日付によって条件分岐

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
    const toMin = next ? getMinutes(next.datetime!) : endMin;

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
      minuteDataForGraph.push("break"); // 休憩中
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
