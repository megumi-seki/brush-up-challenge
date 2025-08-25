import buildMinuteDataForGraph from "../hooks/buildMinuteDataForGraph";
import isDataEnough from "../hooks/isDataEnough";
import type { GroupedTimeRecorderType } from "../types";

type props = {
  record: GroupedTimeRecorderType;
  showRoleWithColor: boolean;
  groupedShiftOfDate: GroupedTimeRecorderType[];
};

const Graph = ({ record, showRoleWithColor, groupedShiftOfDate }: props) => {
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

  const clockLogMinuteDataForGraph = buildMinuteDataForGraph({
    record,
    showRoleWithColor,
  });

  const matchedShift = groupedShiftOfDate.find(
    (shift) => shift.emp_id === emp_id
  );
  if (!matchedShift) console.error("該当従業員のシフトが見つかりません");

  const content = clockLogMinuteDataForGraph.map((status, index) => (
    <span className={`minute ${status}`} key={index}></span>
  ));

  return <div className="flex graph-layer">{content}</div>;
};

export default Graph;
