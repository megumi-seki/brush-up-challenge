import { useParams } from "react-router-dom";
import formatDate from "../hooks/formatDate";
import getRecordsByDate from "../hooks/getRecordsByDate";
import groupRecordsById from "../hooks/groupRecordsById";
import formatTime from "../hooks/formatTime";
import formatTimeFromMillis from "../hooks/formatTimeFromMillis";
import Graph from "../components/Graph";
import GraphTimeLine from "../components/GraphTimeLine";

const ClockLogs = () => {
  const { date } = useParams();
  if (date === undefined) {
    return <span>日付が選択されていません</span>;
  }

  const recordsOfDate = getRecordsByDate(date);
  const groupedRecords = groupRecordsById(recordsOfDate);

  const pageContent = (
    <div className="container-large">
      <div>
        <h3>{formatDate(date)}の勤怠記録</h3>
      </div>
      <table border={1}>
        <thead>
          <tr>
            <th>スタッフID</th>
            <th>開始時間</th>
            <th>終了時間</th>
            <th>総労働時間</th>
            <th>総休憩時間</th>
            <th>勤怠グラフ</th>
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
      <div className="btn-frame">
        <a href="<?= getAppUrl() ?>">ホーム画面に戻る</a>
      </div>
    </div>
  );

  return pageContent;
};

export default ClockLogs;
