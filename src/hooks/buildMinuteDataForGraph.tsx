import { toZonedTime } from "date-fns-tz";
import {
  DEFAULT_ROLE_OPTIONS,
  GRAPH_TOTAL_MINUTES,
  TIMEZONE,
} from "../constants/appConfig";
import type { GroupedTimeRecorderType } from "../types";
import getMinutes from "./getMinutes";

type buildMinuteDataForGraphProps = {
  data: GroupedTimeRecorderType;
  showRoleWithColor?: boolean;
  showDiffs?: boolean;
  shiftMinuteDataForGraph?:
    | { className: string; label: string; diffText: string | null }[]
    | undefined;
};

const buildMinuteDataForGraph = ({
  data,
  showRoleWithColor,
  shiftMinuteDataForGraph,
  showDiffs,
}: buildMinuteDataForGraphProps) => {
  const { clock_in, clock_out, break_begin, break_end, role_changes } = data;

  const eventsWithDatetime = [
    clock_in,
    clock_out,
    break_begin,
    break_end,
    ...role_changes,
  ].filter((e) => e?.datetime);
  const sortedRoleChanges = eventsWithDatetime.sort((a, b) => {
    const jstA = toZonedTime(new Date(a.datetime!), TIMEZONE);
    const jstB = toZonedTime(new Date(b.datetime!), TIMEZONE);
    return jstA.getTime() - jstB.getTime();
  });

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

  let minuteDataForGraph: {
    className: string;
    label: string;
    diffText: string | null;
  }[] = [];
  for (let i = 0; i <= GRAPH_TOTAL_MINUTES; i++) {
    const role = getRoleForMinute(i);
    const roleClassName = role ? role : "";
    const roleLabel = DEFAULT_ROLE_OPTIONS.find(
      (role) => role.value === roleClassName
    )?.label;

    if (i < startMin || (endMin && endMin < i)) {
      minuteDataForGraph.push({
        className: "none",
        label: "労働時間外",
        diffText: null,
      }); // 非労働時間
    } else if (breakMap[i]) {
      minuteDataForGraph.push({
        className: "break",
        label: "休憩",
        diffText: null,
      }); // 休憩中
    } else {
      minuteDataForGraph.push({
        className: `work${showRoleWithColor ? ` ${roleClassName}` : ""}`,
        label: `${roleLabel}として勤務`,
        diffText: null,
      }); // 勤務中
    }

    if (
      showDiffs &&
      shiftMinuteDataForGraph &&
      shiftMinuteDataForGraph[i].label !== minuteDataForGraph[i].label
    ) {
      minuteDataForGraph[
        i
      ].diffText = `シフト：${shiftMinuteDataForGraph[i].label}  タイムレコーダー：${minuteDataForGraph[i].label}`;
      minuteDataForGraph[i].className += " diff";
    }
  }

  return minuteDataForGraph;
};

export default buildMinuteDataForGraph;
