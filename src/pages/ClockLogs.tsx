import { useNavigate } from "react-router-dom";
import getRecordsByDate from "../hooks/getRecordsByDate";
import groupRecordsById from "../hooks/groupRecordsById";
import formatTimeFromMillis from "../hooks/formatTimeFromMillis";
import Graph from "../components/Graph";
import GraphTimeLine from "../components/GraphTimeLine";
import { useState } from "react";
import RoleColorExplanation from "../components/RoleColorExplanation";
import getEmpNameById from "../hooks/getEmpNameById";

const ClockLogs = () => {
  const today = new Date();
  const formattedToday = new Date(today).toISOString().split("T")[0];
  const navigate = useNavigate();
  // 別ブランチ TODO: 個人ページ: タイムレコーダー→〇日のタイムレコーダー履歴（文字）＋ グラフ
  //                                           →シフトとの差異

  // 別ブランチ　feature-improve-timerecorder-logic TODO: 打刻が足りない場合でも、日をまたげばタイムレコーダーは出勤から始まるようにする

  // 別ブランチ　TODO: カレンダー　当日より後は開けないようにする（優先度低）

  const [selectedDateString, setSelectedDateString] = useState(
    today.toISOString().split("T")[0]
  );
  const recordsOfDate = getRecordsByDate({
    datetimeString: selectedDateString,
    key: "time_records",
  });
  const groupedRecords = groupRecordsById(recordsOfDate);
  const [showRoleWithColor, setShowRoleWithColor] = useState(false);
  const [showDiffs, setShowDiffs] = useState(false);

  const shiftOfDate = getRecordsByDate({
    datetimeString: selectedDateString,
    key: "shift",
  });
  const groupedshift = groupRecordsById(shiftOfDate);

  const handleOnClick = (type: "previous" | "next") => {
    const selectedDate = new Date(selectedDateString);
    if (type === "next") {
      selectedDate.setDate(selectedDate.getDate() + 1);
    } else {
      selectedDate.setDate(selectedDate.getDate() - 1);
    }
    const newSelectedDateString = selectedDate.toISOString().split("T")[0];
    setSelectedDateString(newSelectedDateString);
  };

  const isCurrentSelectedDateToday =
    selectedDateString === today.toISOString().split("T")[0];

  const matchedShift = (emp_id: string) =>
    groupedshift.find((shift) => shift.emp_id === emp_id);

  const getDiffsTitleFromMillis = (
    emp_id: string,
    recordDurationMillis: number | null,
    key: "work_duration_millis" | "break_duration_millis"
  ) => {
    const shiftDurationMillis = matchedShift(emp_id)?.[key];
    if (!shiftDurationMillis || !recordDurationMillis) return;
    const diffs = shiftDurationMillis - recordDurationMillis;
    if (diffs === 0) return;
    else if (diffs < 0) {
      const millis = Math.abs(diffs);
      const formattedTime = formatTimeFromMillis(millis);
      return `シフトよりも${formattedTime}長い`;
    } else {
      const formattedTime = formatTimeFromMillis(diffs);
      return `シフトよりも${formattedTime}短い`;
    }
  };

  const pageContent = (
    <div className="container-large">
      <div className="flex justify-between align-center">
        <div className="flex gap-medium align-center">
          <div className="flex gap-small align-center">
            <label htmlFor="selectedDate" className="hidden">
              日付を選択
            </label>
            <input
              type="date"
              id="selectedDate"
              value={selectedDateString}
              className="selected-date"
              onChange={(e) => setSelectedDateString(e.target.value)}
            />
            <h3>のタイムレコーダー履歴</h3>
          </div>
          <div className="flex gap-small">
            <button
              type="button"
              className="small-btn"
              onClick={() => handleOnClick("previous")}
            >
              前日
            </button>
            <button
              type="button"
              className="small-btn"
              onClick={() => handleOnClick("next")}
              disabled={isCurrentSelectedDateToday}
            >
              翌日
            </button>
          </div>
        </div>
        <div className="flex gap-medium">
          <button
            className="small-btn"
            onClick={() => setShowRoleWithColor(!showRoleWithColor)}
          >
            担当別配色 {showRoleWithColor ? "OFF" : "ON"}
          </button>
          <button
            className="small-btn"
            onClick={() => setShowDiffs(!showDiffs)}
          >
            シフトとの差異表示 {showDiffs ? "OFF" : "ON"}
          </button>
        </div>
      </div>
      <table border={1}>
        <thead>
          <tr>
            <th className="logs-th">名前</th>
            <th className="logs-th">総労働時間</th>
            <th className="logs-th">総休憩時間</th>
            <th className="logs-th">
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
              <td
                className="with-hover"
                onClick={() =>
                  navigate(`/detail/${record.emp_id}/${formattedToday}`)
                }
              >
                {getEmpNameById(record.emp_id)}
              </td>
              <td
                title={getDiffsTitleFromMillis(
                  record.emp_id,
                  record.work_duration_millis,
                  "work_duration_millis"
                )}
                className={
                  showDiffs &&
                  getDiffsTitleFromMillis(
                    record.emp_id,
                    record.work_duration_millis,
                    "work_duration_millis"
                  )
                    ? "diff"
                    : ""
                }
              >
                {formatTimeFromMillis(record.work_duration_millis)}
              </td>
              <td
                title={getDiffsTitleFromMillis(
                  record.emp_id,
                  record.break_duration_millis,
                  "break_duration_millis"
                )}
                className={
                  showDiffs &&
                  getDiffsTitleFromMillis(
                    record.emp_id,
                    record.break_duration_millis,
                    "break_duration_millis"
                  )
                    ? "diff"
                    : ""
                }
              >
                {formatTimeFromMillis(record.break_duration_millis)}
              </td>
              <td className="px-small">
                <div className="graph-wrapper">
                  <Graph
                    record={record}
                    matchedShift={matchedShift(record.emp_id)}
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
      <button className="btn ml-auto" onClick={() => navigate("/")}>
        ホーム画面に戻る
      </button>
    </div>
  );

  return pageContent;
};

export default ClockLogs;
