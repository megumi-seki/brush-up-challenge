import buildMinuteDataForGraph from "../hooks/buildMinuteDataForGraph";
import isDataEnough from "../hooks/isDataEnough";
import type { GroupedTimeRecorderType } from "../types";

type props = {
  record: GroupedTimeRecorderType;
  matchedShift: GroupedTimeRecorderType | undefined;
  showRoleWithColor: boolean;
  showDiffs: boolean;
};

const Graph = ({
  record,
  showRoleWithColor,
  matchedShift,
  showDiffs,
}: props) => {
  const { emp_id, clock_in, break_begin, break_end } = record;

  if (!isDataEnough(record)) {
    let lack = "退勤";
    if (clock_in.datetime && break_begin.datetime && !break_end.datetime)
      lack = "休憩終了";
    return (
      <div className="incomplete-graph">
        打刻データが不足しています。不足打刻：{lack}
      </div>
    );
  }

  const shiftMinuteDataForGraph = matchedShift
    ? buildMinuteDataForGraph({
        data: matchedShift,
        showRoleWithColor: true,
      })
    : undefined;

  const clockLogMinuteDataForGraph = buildMinuteDataForGraph({
    data: record,
    showRoleWithColor,
    shiftMinuteDataForGraph,
    showDiffs,
  });

  const graphWithColor = clockLogMinuteDataForGraph.map((status, index) => (
    <span className={`minute ${status.className}`} key={index}></span>
  ));

  const graphWithTitle = clockLogMinuteDataForGraph.map((status, index) => (
    <span className="minute" key={index} title={status.diffText ?? ""}></span>
  ));

  return (
    <>
      <div className="flex color-graph-layer">{graphWithColor}</div>
      <div className="flex title-graph-layer">{graphWithTitle}</div>
    </>
  );
};

export default Graph;
