import { useNavigate } from "react-router-dom";
import getRecordsByDate from "../hooks/getRecordsByDate";
import groupRecordsById from "../hooks/groupRecordsById";
import { useState } from "react";
import RoleColorExplanation from "../components/RoleColorExplanation";
import ClockLogTableTitle from "../components/ClockLogTableTitle";
import ClockLogTableBody from "../components/ClockLogTableBody";

const ClockLogs = () => {
  const today = new Date();
  const navigate = useNavigate();
  // 別ブランチ feature-detail-page TODO: 個人ページ: タイムレコーダー→〇日のタイムレコーダー履歴（文字 メモも表示）＋ グラフ
  //                                           →シフトとの差異　（優先度高）

  // 別ブランチ　TODO: カレンダー　当日より後は開けないようにする（優先度低）

  // 別ブランチ  TODO: clocklogspage　表示順のソート（優先度低）

  // 別ブランチ　TODO: そう休憩時間と総労働時間、再表示オフでも表示されるから直す（優先度中） ✓
  const [showRoleWithColor, setShowRoleWithColor] = useState(false);
  const [showDiffs, setShowDiffs] = useState(false);
  const [selectedDateString, setSelectedDateString] = useState(
    today.toISOString().split("T")[0]
  );
  const recordsOfDate = getRecordsByDate({
    datetimeString: selectedDateString,
    key: "time_records",
  });
  const groupedRecords = groupRecordsById(recordsOfDate);

  const pageContent = (
    <div className="container-large">
      <ClockLogTableTitle
        selectedDateString={selectedDateString}
        setSelectedDateString={setSelectedDateString}
        showRoleWithColor={showRoleWithColor}
        setShowRoleWithColor={setShowRoleWithColor}
        showDiffs={showDiffs}
        setShowDiffs={setShowDiffs}
      />
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
        <ClockLogTableBody
          groupedRecords={groupedRecords}
          selectedDateString={selectedDateString}
          showRoleWithColor={showRoleWithColor}
          showDiffs={showDiffs}
        />
      </table>
      <button className="btn ml-auto" onClick={() => navigate("/")}>
        ホーム画面に戻る
      </button>
    </div>
  );

  return pageContent;
};

export default ClockLogs;
