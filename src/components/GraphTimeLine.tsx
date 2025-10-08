import { GRAPH_START_HOUR, GRAPH_TOTAL_MINUTES } from "../constants/appConfig";
import formatTime from "../hooks/formatTime";
import getMinutes from "../hooks/getMinutes";
import isDataEnough from "../hooks/isDataEnough";
import type { GroupedTimeRecorderType } from "../types";

type GraphTimeLineProps = {
  record: GroupedTimeRecorderType;
  showRoleWithColor: boolean;
};

const GraphTimeLine = ({ record, showRoleWithColor }: GraphTimeLineProps) => {
  const { clock_in, clock_out, break_begin, break_end, role_changes } = record;
  const clockInDatetime = clock_in.datetime;
  const clockOutDatetime = clock_out.datetime;
  const breakBeginDatetime = break_begin.datetime;
  const breakEndDatetime = break_end.datetime;
  const roleChangeDatetimes = role_changes
    .map((roleChange) => roleChange.datetime)
    .filter((datetime) => datetime !== null);

  if (!isDataEnough(record)) {
    return <></>;
  }

  const startMin = getMinutes(clockInDatetime!); //isDataEnoughのチェックによりclockInDatetimeは必ずstring
  const endMin = getMinutes(clockOutDatetime!); //isDataEnoughのチェックによりclockInDatetimeは必ずstring
  const breakBeginMin = breakBeginDatetime
    ? getMinutes(breakBeginDatetime)
    : null;
  const breakEndMin = breakEndDatetime
    ? getMinutes(breakEndDatetime)
    : null;
  const roleChangeMins = roleChangeDatetimes.map((datetime) =>
    getMinutes(datetime)
  );

  let graphTimelineBar = [];
  for (let i = 0; i <= GRAPH_TOTAL_MINUTES; i++) {
    // イベントがある場合には時刻をセット、クラス名セットのためtypeもセット
    if (i == startMin) {
      graphTimelineBar.push({
        type: "timeClockValue",
        time: formatTime(clockInDatetime),
      });
    } else if (clockOutDatetime && i == endMin) {
      graphTimelineBar.push({
        type: "timeClockValue",
        time: formatTime(clockOutDatetime),
      });
    } else if (breakBeginDatetime && i == breakBeginMin) {
      graphTimelineBar.push({
        type: "timeClockValue",
        time: formatTime(breakBeginDatetime),
      });
    } else if (breakEndDatetime && i == breakEndMin) {
      graphTimelineBar.push({
        type: "timeClockValue",
        time: formatTime(breakEndDatetime),
      });
    } else if (showRoleWithColor && roleChangeMins.includes(i)) {
      roleChangeMins.forEach((roleChangeMin, index) => {
        if (i === roleChangeMin) {
          graphTimelineBar.push({
            type: "timeClockValue",
            time: formatTime(roleChangeDatetimes[index]),
          });
        }
      });
    } else if (i % 30 === 0) { // 30分刻みの参照時刻をセット
      const totalMinutesFromStart = i;
      const hour = Math.floor(totalMinutesFromStart / 60) + GRAPH_START_HOUR;
      const minute = totalMinutesFromStart % 60;
      const label =
        hour.toString().padStart(2, "0") + ":" + (minute === 0 ? "00" : "30");
      graphTimelineBar.push({ type: "timeLineValue", time: label });
    } else {
      graphTimelineBar.push({ type: "none", time: "" });
    }
  }

  const content = graphTimelineBar.map((status, index) => {
    let className = "";
    if (status.type == "timeClockValue") className = "timeClockValue";
    else if (status.type == "timeLineValue") className = "timeLineValue";

    return (
      <span className={`minute ${className}`} key={index}>
        {status.time}
      </span>
    );
  });

  return <div className="flex timeline-layer">{content}</div>;
};

export default GraphTimeLine;
