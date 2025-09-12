import { useNavigate } from "react-router-dom";
import type { GroupedTimeRecorderType } from "../types";
import getEmpNameById from "../hooks/getEmpNameById";
import getDiffsTitleFromMillis from "../hooks/getDiffsTitleFromMillis";
import formatTimeFromMillis from "../hooks/formatTimeFromMillis";
import Graph from "./Graph";
import GraphTimeLine from "./GraphTimeLine";
import RoleColorExplanation from "./RoleColorExplanation";
import getGroupedMatchedShift from "../hooks/getGroupedMatchedShift";

type ClockLogTableProps = {
  groupedRecords: GroupedTimeRecorderType[];
  selectedDateString: string;
  showRoleWithColor: boolean;
  showDiffs: boolean;
  withName: boolean;
};

const ClockLogTable = ({
  groupedRecords,
  selectedDateString,
  showRoleWithColor,
  showDiffs,
  withName,
}: ClockLogTableProps) => {
  const navigate = useNavigate();
  const workDurationDifferenceTitle = (record: GroupedTimeRecorderType) =>
    getDiffsTitleFromMillis({
      emp_id: record.emp_id,
      recordDurationMillis: record.work_duration_millis,
      key: "work_duration_millis",
      selectedDateString: selectedDateString,
    });
  const breakDurationDifferenceTitle = (record: GroupedTimeRecorderType) =>
    getDiffsTitleFromMillis({
      emp_id: record.emp_id,
      recordDurationMillis: record.break_duration_millis,
      key: "break_duration_millis",
      selectedDateString: selectedDateString,
    });

  return (
    <table border={1}>
      <thead>
        <tr>
          {withName && <th className="logs-th">名前</th>}
          <th className="logs-th">総労働時間</th>
          <th className="logs-th">総休憩時間</th>
          <th className="logs-th graph-th">
            <div className="grid grid-cols-2">
              <span>タイムレコーダーグラフ</span>
              <RoleColorExplanation showRoleWithColor={showRoleWithColor} />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {groupedRecords.map((record) => (
          <tr key={record.emp_id}>
            {withName && (
              <td
                className="with-hover"
                onClick={() =>
                  navigate(`/detail/${record.emp_id}/${selectedDateString}`)
                }
              >
                {getEmpNameById(record.emp_id)}
              </td>
            )}
            <td
              title={
                showDiffs ? workDurationDifferenceTitle(record) : undefined
              }
              className={
                showDiffs && workDurationDifferenceTitle(record) ? "diff" : ""
              }
            >
              {formatTimeFromMillis(record.work_duration_millis)}
            </td>
            <td
              title={
                showDiffs ? breakDurationDifferenceTitle(record) : undefined
              }
              className={
                showDiffs && breakDurationDifferenceTitle(record) ? "diff" : ""
              }
            >
              {formatTimeFromMillis(record.break_duration_millis)}
            </td>
            <td className="px-small">
              <div className="graph-wrapper">
                <Graph
                  record={record}
                  matchedShift={getGroupedMatchedShift({
                    selectedDateString: selectedDateString,
                    emp_id: record.emp_id,
                  })}
                  showRoleWithColor={showRoleWithColor}
                  showDiffs={showDiffs}
                />
                <GraphTimeLine
                  record={record}
                  showRoleWithColor={showRoleWithColor}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ClockLogTable;
