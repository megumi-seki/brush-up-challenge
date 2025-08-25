import { GRAPH_TOTAL_MINUTES } from "../constants/appConfig";
import type { GroupedTimeRecorderType } from "../types";
import getMinutes from "./getMinutes";

type buildMinuteDataForGraphProps = {
  record: GroupedTimeRecorderType;
  showRoleWithColor: boolean;
};

const buildMinuteDataForGraph = ({
  record,
  showRoleWithColor,
}: buildMinuteDataForGraphProps) => {
  const { clock_in, clock_out, break_begin, break_end, role_changes } = record;

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

  const startMin = getMinutes(clock_in.datetime!); //isDataEnoughのチェックによりclockInDatetimeは必ずstring
  const endMin = getMinutes(clock_out.datetime!); //isDataEnoughのチェックによりclockOutDatetimeは必ずstring

  const breakMap = new Array(GRAPH_TOTAL_MINUTES).fill(false);
  if (break_begin.datetime && break_end.datetime) {
    const breakBeginMin = getMinutes(break_begin.datetime);
    const breakEndMin = getMinutes(break_end.datetime);

    if (breakBeginMin && breakEndMin) {
      const breakFrom = Math.max(0, breakBeginMin);
      const breakTo = Math.min(GRAPH_TOTAL_MINUTES, breakEndMin);
      for (let i = breakFrom; i < breakTo; i++) {
        breakMap[i] = true;
      }
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
    const roleClassName = role ? role : "";

    if (i < startMin || (endMin && endMin < i)) {
      minuteDataForGraph.push("none"); // 非労働時間
    } else if (breakMap[i]) {
      minuteDataForGraph.push(`break`); // 休憩中
    } else {
      minuteDataForGraph.push(`work ${showRoleWithColor && roleClassName}`); // 勤務中
    }
  }

  return minuteDataForGraph;
};

export default buildMinuteDataForGraph;
