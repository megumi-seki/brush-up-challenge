import { GRAPH_START_HOUR, GRAPH_TOTAL_MINUTES } from "../constants/appConfig";
import formatTime from "../hooks/formatTime";
import getMinutes from "../hooks/getMinutes";
import type { GroupedTimeRecorderType } from "../types";

type GraphTimeLineProps = {
  record: GroupedTimeRecorderType;
  showRoleWithColor: boolean;
};

const GraphTimeLine = ({ record, showRoleWithColor }: GraphTimeLineProps) => {
  const { clock_in, clock_out, break_begin, break_end, role_changes } = record;
  const clockInDatetime = clock_in.datetime;
  if (clockInDatetime === null) return <></>;
  const clockOutDatetime = clock_out.datetime;
  const breakBeginDatetime = break_begin.datetime;
  const breakEndDatetime = break_end.datetime;
  const roleChangeDatetimes = role_changes
    .map((roleChange) => roleChange.datetime)
    .filter((datetime) => datetime !== null);

  const isDataEnough =
    (clockInDatetime &&
      breakBeginDatetime &&
      breakEndDatetime &&
      clockOutDatetime) ||
    (!breakBeginDatetime && clockInDatetime && clockOutDatetime);

  const startMin = getMinutes(clockInDatetime);
  const endMin = clockOutDatetime ? getMinutes(clockOutDatetime) : startMin; // nullにしないため、datetimeがnullの場合はtotal minutes範囲外の値をセット
  const breakBeginMin = breakBeginDatetime
    ? getMinutes(breakBeginDatetime)
    : null;
  const breakEndMin = breakEndDatetime
    ? getMinutes(breakEndDatetime)
    : breakBeginMin;
  const roleChangeMins = roleChangeDatetimes.map((datetime) =>
    getMinutes(datetime)
  );

  let graphTimelineBar = [];
  for (let i = 0; i <= GRAPH_TOTAL_MINUTES; i++) {
    // graphTimelineBarには30分刻みで時刻をセット。それ以外は""
    if (isDataEnough && i == startMin) {
      graphTimelineBar.push({
        type: "timeClockValue",
        time: formatTime(clockInDatetime),
      });
    } else if (isDataEnough && clockOutDatetime && i == endMin) {
      graphTimelineBar.push({
        type: "timeClockValue",
        time: formatTime(clockOutDatetime),
      });
    } else if (isDataEnough && breakBeginDatetime && i == breakBeginMin) {
      graphTimelineBar.push({
        type: "timeClockValue",
        time: formatTime(breakBeginDatetime),
      });
    } else if (isDataEnough && breakEndDatetime && i == breakEndMin) {
      graphTimelineBar.push({
        type: "timeClockValue",
        time: formatTime(breakEndDatetime),
      });
    } else if (
      isDataEnough &&
      showRoleWithColor &&
      roleChangeMins.includes(i)
    ) {
      roleChangeMins.forEach((roleChangeMin, index) => {
        if (i === roleChangeMin) {
          graphTimelineBar.push({
            type: "timeClockValue",
            time: formatTime(roleChangeDatetimes[index]),
          });
        }
      });
    } else if (i % 30 === 0) {
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
    if (status.type == "timeLineValue") className = "timeLineValue";

    return (
      <span className={`minute ${className}`} key={index}>
        {status.time}
      </span>
    );
  });

  return <>{content}</>;
};

export default GraphTimeLine;
