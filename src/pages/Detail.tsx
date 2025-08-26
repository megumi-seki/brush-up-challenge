import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TimeRecorderForm from "../components/TimeRecorderForm";
import type { Employee } from "../types";
import ClockLogTableTitle from "../components/ClockLogTableTitle";
import ClockLogTable from "../components/ClockLogTable";
import getRecordsByDate from "../hooks/getRecordsByDate";
import groupRecordsById from "../hooks/groupRecordsById";

// 別ブランチ feature-detail-page TODO: 個人ページ: タイムレコーダー→〇日のタイムレコーダー履歴（文字 メモも表示）＋ グラフ
//                                           →シフトとの差異　（優先度高）
// 1. タイムレコーダー表示　✓
// 2. グラフの真下に打刻履歴詳細テーブルを追加、noteなど含め（登録種別、担当、メモ、時間、（シフトとの差異））すべて表示→それも日ごとで、選択された日付に対応させるように
// 3. シフトとの差異オンの時に、打刻履歴詳細にも（？？）できれば　getMinutesなどを使って、シフトよりも〇分遅い/早いなど表示できるのでは
// 4. 新たに打刻された際に、グラフや詳細情報も自動で更新されるようにしたい(useEffect?)

// 別ブランチ　TODO: カレンダー　当日より後は開けないようにする（優先度低）

// 別ブランチ  TODO: clocklogspage　表示順のソート（優先度低）

// 別ブランチ　TODO: そう休憩時間と総労働時間、再表示オフでも表示されるから直す（優先度中） ✓

const Detail = () => {
  const { empId, weekStart, compare } = useParams();
  const [employeee, setEmployee] = useState<Employee | null>(null);
  if (!empId) {
    return <div>従業員が選択されていません。</div>;
  }

  // ページのURLが変わったときに従業員データを更新
  useEffect(() => {
    const storedData = localStorage.getItem("employees");
    if (storedData && empId) {
      const employees: Employee[] = JSON.parse(storedData);
      const selectedEmployee = employees.find((emp) => emp.id === empId);
      setEmployee(selectedEmployee || null);
    }
  }, [empId]);

  const today = new Date();
  const [showRoleWithColor, setShowRoleWithColor] = useState(false);
  const [showDiffs, setShowDiffs] = useState(false);
  const [selectedDateString, setSelectedDateString] = useState(
    today.toISOString().split("T")[0]
  );

  const recordsOfSelectedDate = getRecordsByDate({
    datetimeString: selectedDateString,
    key: "time_records",
  });
  const filteredRecords = recordsOfSelectedDate.filter(
    (record) => record.emp_id === empId
  );
  const groupedRecord = groupRecordsById(filteredRecords);
  console.log(groupedRecord);

  const pageContent = (
    <div className="container-large">
      <div className="flex gap-medium">
        <span>従業員番号: {empId}</span>
        <span>名前: {employeee?.name}</span>
        <span>担当: {employeee?.roles}</span>
        <span>ステータス:</span>
      </div>
      <div className="time-recorder">
        <h3 className="my-none">タイムレコーダー</h3>
        <TimeRecorderForm empId={empId} />
      </div>
      <div>
        <ClockLogTableTitle
          selectedDateString={selectedDateString}
          setSelectedDateString={setSelectedDateString}
          showRoleWithColor={showRoleWithColor}
          setShowRoleWithColor={setShowRoleWithColor}
          showDiffs={showDiffs}
          setShowDiffs={setShowDiffs}
        />
        <ClockLogTable
          groupedRecords={groupedRecord}
          selectedDateString={selectedDateString}
          showRoleWithColor={showRoleWithColor}
          showDiffs={showDiffs}
          withName={false}
        />
      </div>
      <div>
        <h3>警告</h3>
        <p>働きすぎ！</p>
      </div>
    </div>
  );

  return pageContent;
};

export default Detail;
