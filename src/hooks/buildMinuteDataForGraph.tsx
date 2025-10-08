import { toZonedTime } from "date-fns-tz";
import {
  DEFAULT_ROLE_OPTIONS,
  GRAPH_TOTAL_MINUTES,
  TIMEZONE,
} from "../constants/appConfig";
import type { GroupedTimeRecorderType, MinuteDataForGraphType } from "../types";
import getMinutes from "./getMinutes";

type buildMinuteDataForGraphProps = {
  data: GroupedTimeRecorderType;
  showRoleWithColor?: boolean;
  showDiffs?: boolean;
  shiftMinuteDataForGraph?:
    MinuteDataForGraphType[];
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
  const sortedEvents = eventsWithDatetime.sort((a, b) => {
    const jstA = toZonedTime(new Date(a.datetime!), TIMEZONE);
    const jstB = toZonedTime(new Date(b.datetime!), TIMEZONE);
    return jstA.getTime() - jstB.getTime();
  });

  const startMin = getMinutes(clock_in.datetime!); //isDataEnoughのチェックによりclockInDatetimeは必ずstring
  const endMin = getMinutes(clock_out.datetime!); //isDataEnoughのチェックによりclockOutDatetimeは必ずstring

  //　休憩中かどうかを記録するための配列を作成
  const breakMap = new Array(GRAPH_TOTAL_MINUTES).fill(false);
  if (break_begin.datetime && break_end.datetime) {
    const breakBeginMin = getMinutes(break_begin.datetime);
    const breakEndMin = getMinutes(break_end.datetime);

    if (breakBeginMin && breakEndMin) {
      const breakFrom = Math.max(0, breakBeginMin);  // 0未満の場合は0に補正
      const breakTo = Math.min(GRAPH_TOTAL_MINUTES, breakEndMin); // GRAPH_TOTAL_MINUTESを超える場合はGRAPH_TOTAL_MINUTESに補正
      for (let i = breakFrom; i < breakTo; i++) {
        breakMap[i] = true;
      }
    }
  }

  // 担当の切り替え区間を記録する配列作成
  const roleRanges: { from: number; to: number; role: string }[] = [];
  for (let i = 0; i < sortedEvents.length; i++) {
    const currentEvent = sortedEvents[i];
    const nextEvent = sortedEvents[i + 1];

    const fromMin = getMinutes(currentEvent.datetime!);
    const toMin = nextEvent ? getMinutes(nextEvent.datetime!) : endMin + 1;

    if (currentEvent.role) {
      roleRanges.push({
        from: fromMin,
        to: toMin,
        role: currentEvent.role,
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

  //　グラフ作成に使うため、分単位でデータを作成
  let minuteDataForGraph: MinuteDataForGraphType[] = [];
  for (let i = 0; i <= GRAPH_TOTAL_MINUTES; i++) {
    const role = getRoleForMinute(i);
    const roleClassName = role ? role : "";
    const roleLabel = DEFAULT_ROLE_OPTIONS.find(
      (role) => role.value === roleClassName
    )?.label;

    if (i < startMin || endMin < i) {
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

    // シフトと乖離がある場合はclass名、diffsTextを更新
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
