import { useNavigate } from "react-router-dom";
import type { GroupedTimeRecorderType } from "../types";
import getEmpNameById from "../hooks/getEmpNameById";
import getDiffsTitleFromMillis from "../hooks/getDiffsTitleFromMillis";
import formatTimeFromMillis from "../hooks/formatTimeFromMillis";
import Graph from "./Graph";
import getMatchedShift from "../hooks/getMatchedShift";
import GraphTimeLine from "./GraphTimeLine";

type ClockLogTableBodyProps = {
  groupedRecords: GroupedTimeRecorderType[];
  selectedDateString: string;
  showRoleWithColor: boolean;
  showDiffs: boolean;
};

const ClockLogTableBody = ({
  groupedRecords,
  selectedDateString,
  showRoleWithColor,
  showDiffs,
}: ClockLogTableBodyProps) => {
  const navigate = useNavigate();
  const today = new Date();
  const formattedToday = new Date(today).toISOString().split("T")[0];
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
    <tbody>
      {groupedRecords.map((record) => (
        <tr key={record.emp_id}>
          <td
            className="with-hover"
            onClick={() =>
              navigate(`/detail/${record.emp_id}/${formattedToday}`)
            }
          >
            {getEmpNameById(record.emp_id)}
          </td>
          <td
            title={showDiffs ? workDurationDifferenceTitle(record) : undefined}
            className={
              showDiffs && workDurationDifferenceTitle(record) ? "diff" : ""
            }
          >
            {formatTimeFromMillis(record.work_duration_millis)}
          </td>
          <td
            title={showDiffs ? breakDurationDifferenceTitle(record) : undefined}
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
                matchedShift={getMatchedShift({
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
  );
};

export default ClockLogTableBody;
