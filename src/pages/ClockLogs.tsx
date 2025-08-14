import { useParams } from "react-router-dom";
import formatDate from "../hooks/formatDate";
import unformatDate from "../hooks/unformatDate";
import getRecordsByDate from "../hooks/getRecordsByDate";
import groupRecordsById from "../hooks/groupRecordsById";
import formatTime from "../hooks/formatTime";
import formatTimeFromMillis from "../hooks/formatTimeFromMillis";

type ProcessedDataType = {
  emp_id: string;
  startTime: string;
  endTime: string;
  totalRestTime: string;
  totalWorkTime: string;
  graph: string;
  graphTimeline: string;
};

const ClockLogs = () => {
  const { date } = useParams();
  const unformattedDate = date ? unformatDate(date) : new Date();
  const formattedDate = formatDate(unformattedDate);

  const recordsOfDate = getRecordsByDate(unformattedDate);

  function getProccesedTimeRecorderByDateToGraph() {
    const groupedRecords = groupRecordsById(recordsOfDate);

    //TODO ここから下グラフ化のためのデータを加工を何とか頑張る。
    const processedData = [];

    const GRAPH_START_HOUR = 7;
    const GRAPH_END_HOUR = 24;
    const GRAPH_TOTAL_MINUTES = (GRAPH_END_HOUR - GRAPH_START_HOUR) * 60; // 1020分 分単位でグラフ化

    const getMinutes = (datetimeString: string) => {
      const datetime = new Date(datetimeString);
      const minutes =
        (datetime.getHours() - GRAPH_START_HOUR) * 60 + datetime.getMinutes();
      return minutes;
    };

    groupedRecords.map((record) => {
      const {
        emp_id,
        clock_in,
        clock_out,
        break_begin,
        break_end,
        work_duration_millis,
        break_duration_millis,
        role_change,
      } = record;
      const clockInDatetime = clock_in.datetime;
      if (clockInDatetime === null) return;
      const clockOutDatetime = clock_out.datetime;
      const breakBeginDatetime = break_begin.datetime;
      const breakEndDatetime = break_end.datetime;

      const startMin = getMinutes(clockInDatetime);
      const endMin = clockOutDatetime ? getMinutes(clockOutDatetime) : startMin; // nullにしないため、datetimeがnullの場合はtotal minutes範囲外の値をセット
      const breakBeginMin = breakBeginDatetime
        ? getMinutes(breakBeginDatetime)
        : null;
      const breakEndMin = breakEndDatetime
        ? getMinutes(breakEndDatetime)
        : breakBeginMin;

      const breakMap = new Array(GRAPH_TOTAL_MINUTES).fill(false);
      if (breakBeginMin && breakEndMin) {
        const breakFrom = Math.max(0, breakBeginMin);
        const breakTo = Math.min(GRAPH_TOTAL_MINUTES, breakEndMin);
        for (let i = breakFrom; i < breakTo; i++) {
          breakMap[i] = true;
        }
      }

      let graphBar = [];
      let graphTimelineBar = [];
      for (let i = 0; i <= GRAPH_TOTAL_MINUTES; i++) {
        if (i < startMin || endMin < i) {
          graphBar.push("none"); // 非労働時間
        } else if (breakMap[i]) {
          graphBar.push("break"); // 休憩中
        } else {
          graphBar.push("work"); // 勤務中
        }

        // graphTimelineBarには30分刻みで時刻をセット。それ以外は""
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
        } else if (i % 30 === 0) {
          const totalMinutesFromStart = i;
          const hour =
            Math.floor(totalMinutesFromStart / 60) + GRAPH_START_HOUR;
          const minute = totalMinutesFromStart % 60;
          const label =
            hour.toString().padStart(2, "0") +
            ":" +
            (minute === 0 ? "00" : "30");
          graphTimelineBar.push({ type: "timeLineValue", time: label });
        } else {
          graphTimelineBar.push({ type: "none", time: "" });
        }
      }

      const graphHtml = graphBar
        .map((status) => `<span class="minute ${status}"></span>`)
        .join("");
      const graphTimelineHtml = graphTimelineBar
        .map((status) => {
          let className = "";
          if (status.type == "timeClockValue") className = "timeClockValue";
          if (status.type == "timeLineValue") className = "timeLineValue";

          return `<span class="minute ${className}">${status.time}</span>`;
        })
        .join("");

      processedData.push({
        emp_id,
        startTime: formatDate(clockInDatetime),
        endTime: clockOutDatetime ? formatDate(clockOutDatetime) : "-",
        totalRestTime: formatTimeFromMillis(break_duration_millis),
        totalWorkTime: formatTimeFromMillis(work_duration_millis),
        graph: graphHtml,
        graphTimeline: graphTimelineHtml,
      });
    });

    return processedData;
  }

  const pageContent = (
    <div className="container-large">
      <div>
        <h3>{formattedDate}の勤怠記録</h3>
      </div>
      <table border={1}>
        <thead>
          <tr>
            <th>スタッフID</th>
            <th>開始時間</th>
            <th>終了時間</th>
            <th>総休憩時間</th>
            <th>総労働時間</th>
            <th>勤怠グラフ</th>
          </tr>
        </thead>
        <tbody>
          {/* <? */}
          {/* // 勤怠情報の配列の繰り返し処理 */}
          {/* for (var i = 0; i <= record.length - 1; i++) { */}
          {/* // ?> */}
          <tr>
            <td>{/* <?= record[i]['empId'] ?> */}</td>
            <td>{/* <?= record[i]['startTime'] ?> */}</td>
            <td>{/* <?= record[i]['endTime'] ?> */}</td>
            <td>{/* <?= record[i]['totalRestTime'] ?> */}</td>
            <td>{/* <?= record[i]['totalWorkTime'] ?> */}</td>
            <td className="px-small">
              <div className="graph-wrapper">
                <div className="flex graph-layer">
                  {/* <?!= record[i]['graph'] ?> */}
                </div>
                <div className="flex timeline-layer">
                  {/* <?!= record[i]['graphTimeline'] ?> */}
                </div>
              </div>
            </td>
          </tr>
          {/* // <? } ?> */}
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

// TODO １日のタイムレコーダー記録とグラフを表示する
