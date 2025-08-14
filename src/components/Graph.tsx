import { GRAPH_TOTAL_MINUTES } from "../constants/appConfig";
import getMinutes from "../hooks/getMinutes";
import type { GroupedTimeRecorderType } from "../types";

type props = {
  record: GroupedTimeRecorderType;
};

const Graph = ({ record }: props) => {
  const { clock_in, clock_out, break_begin, break_end } = record;
  const clockInDatetime = clock_in.datetime;
  if (clockInDatetime === null) return <></>;
  const clockOutDatetime = clock_out.datetime;
  const breakBeginDatetime = break_begin.datetime;
  const breakEndDatetime = break_end.datetime;

  const startMin = getMinutes(clockInDatetime);
  const endMin = clockOutDatetime ? getMinutes(clockOutDatetime) : startMin; // nullにしないため、datetimeがnullの場合はtotal minutes範囲外の値をセット
  const breakBeginMin = breakBeginDatetime
    ? getMinutes(breakBeginDatetime)
    : null;
  const breakEndMin = breakEndDatetime
    ? getMinutes(breakEndDatetime)
    : breakBeginMin;

  const breakMap = new Array(GRAPH_TOTAL_MINUTES).fill(false);
  if (breakBeginMin && breakEndMin) {
    const breakFrom = Math.max(0, breakBeginMin);
    const breakTo = Math.min(GRAPH_TOTAL_MINUTES, breakEndMin);
    for (let i = breakFrom; i < breakTo; i++) {
      breakMap[i] = true;
    }
  }

  let graphBar = [];
  for (let i = 0; i <= GRAPH_TOTAL_MINUTES; i++) {
    if (i < startMin || endMin < i) {
      graphBar.push("none"); // 非労働時間
    } else if (breakMap[i]) {
      graphBar.push("break"); // 休憩中
    } else {
      graphBar.push("work"); // 勤務中
    }
  }

  const content = graphBar.map((status) => (
    <span className={`minute ${status}`}></span>
  ));

  return <>{content}</>;
};

export default Graph;
