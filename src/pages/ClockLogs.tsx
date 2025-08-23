import { Navigate, useNavigate, useParams } from "react-router-dom";
import formatDate from "../hooks/formatDate";
import getRecordsByDate from "../hooks/getRecordsByDate";
import groupRecordsById from "../hooks/groupRecordsById";
import formatTime from "../hooks/formatTime";
import formatTimeFromMillis from "../hooks/formatTimeFromMillis";
import Graph from "../components/Graph";
import GraphTimeLine from "../components/GraphTimeLine";
import { useState } from "react";

const ClockLogs = () => {
  const today = new Date();
  const navigate = useNavigate();
  // feature-enable-dateselect: TODO 日付変更できるようにする。

  const [selectedDateString, setSelectedDateString] = useState(
    today.toISOString().split("T")[0]
  );
  const recordsOfDate = getRecordsByDate(selectedDateString);
  const groupedRecords = groupRecordsById(recordsOfDate);

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
          <h3>の勤怠記録</h3>
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
      <table border={1}>
        <thead>
          <tr>
            <th>スタッフID</th>
            <th>開始時間</th>
            <th>終了時間</th>
            <th>総労働時間</th>
            <th>総休憩時間</th>
            <th>タイムレコーダーグラフ</th>
          </tr>
        </thead>
        <tbody>
          {groupedRecords.map((record) => (
            <tr key={record.emp_id}>
              <td>{record.emp_id}</td>
              <td>{formatTime(record.clock_in.datetime)}</td>
              <td>{formatTime(record.clock_out.datetime)}</td>
              <td>{formatTimeFromMillis(record.work_duration_millis)}</td>
              <td>{formatTimeFromMillis(record.break_duration_millis)}</td>
              <td className="px-small">
                <div className="graph-wrapper">
                  <div className="flex graph-layer">
                    <Graph record={record} />
                  </div>
                  <div className="flex timeline-layer">
                    <GraphTimeLine record={record} />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn" onClick={() => navigate("/")}>
        ホーム画面に戻る
      </button>
    </div>
  );

  return pageContent;
};

export default ClockLogs;
