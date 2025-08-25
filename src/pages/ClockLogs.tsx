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

  // 別ブランチ TODO: タイムレコーダー履歴ページ：シフトとの差異表示オンオフ付け加える。
  // 1. 担当別配色はテーブルの中とかに移す  ✓
  // 2. シフトとの差異表示オンのとき、差異があるところが赤でグラフに加えられる（ロジックは休憩時間示すときなどと同じ）
  // 2. それぞれにカーソール合わせると、内容が表示されるようにする

  // 別ブランチ TODO: 打刻が足りない場合でも、日をまたげばタイムレコーダーは出勤から始まるようにする

  const [selectedDateString, setSelectedDateString] = useState(
    today.toISOString().split("T")[0]
  );
  const recordsOfDate = getRecordsByDate(selectedDateString);
  const groupedRecords = groupRecordsById(recordsOfDate);
  const [showRoleWithColor, setShowRoleWithColor] = useState(false);

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
        <div className="flex gap-small">
          <button
            className="small-btn"
            onClick={() => setShowRoleWithColor(!showRoleWithColor)}
          >
            担当別配色 {showRoleWithColor ? "OFF" : "ON"}
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
              <td>{formatTimeFromMillis(record.work_duration_millis)}</td>
              <td>{formatTimeFromMillis(record.break_duration_millis)}</td>
              <td className="px-small">
                <div className="graph-wrapper">
                  <Graph
                    record={record}
                    showRoleWithColor={showRoleWithColor}
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
