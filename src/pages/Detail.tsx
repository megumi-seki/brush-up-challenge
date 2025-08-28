import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TimeRecorderForm, {
  defaultRoleOptions,
  defaultTypeOptions,
} from "../components/TimeRecorderForm";
import type { Employee, TimeRecorderType } from "../types";
import ClockLogTableTitle from "../components/ClockLogTableTitle";
import ClockLogTable from "../components/ClockLogTable";
import getRecordsByDate from "../hooks/getRecordsByDate";
import groupRecordsById from "../hooks/groupRecordsById";
import formatTime from "../hooks/formatTime";
import getMinutes from "../hooks/getMinutes";
import getMatchedShift from "../hooks/getMatchedShift";
import formatTimeFromMillis from "../hooks/formatTimeFromMillis";

// 別ブランチ feature-detail-page TODO: 個人ページ: タイムレコーダー→〇日のタイムレコーダー履歴（文字 メモも表示）＋ グラフ
//                                           →シフトとの差異　（優先度高）　✓
// 1. タイムレコーダー表示　✓
// 2. グラフの真下に打刻履歴詳細テーブルを追加、noteなど含め（登録種別、担当、メモ、時間、（シフトとの差異））すべて表示→それも日ごとで、選択された日付に対応させるように ✓
// 3. シフトとの差異オンの時に、打刻履歴詳細にも（？？）できれば　getMinutesなどを使って、シフトよりも〇分遅い/早いなど表示できるのでは  ✓
// 4. 新たに打刻された際に、グラフや詳細情報も自動で更新されるようにしたい(useEffect?)

// 別ブランチ TODO: 差異表示、差異が10分以上だとboldになるようにする　（優先度低）
// 別ブランチ TODO: 差異表示、担当が違う→時刻と同じように表示、登録種別が違う→シフトを実際に見比べることをお勧めするメッセージを表示（優先度中）

// 別ブランチ　TODO: カレンダー　当日より後は開けないようにする（優先度低）

// 別ブランチ  TODO: clocklogspage　表示順のソート（優先度低）

// 別ブランチ　TODO: そう休憩時間と総労働時間、再表示オフでも表示されるから直す（優先度中） ✓

// 別ブランチ　TODO: getMatchedShiftとgetGroupedMatchedShiftを整理する（優先度低）

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

  const getLabel = (record: TimeRecorderType, recordType: "type" | "role") => {
    const defaultOptions =
      recordType === "type" ? defaultTypeOptions : defaultRoleOptions;

    const label = defaultOptions.find(
      (option) => option.value === record[recordType]
    )?.label;

    return label;
  };

  const matchedShift = getMatchedShift({
    emp_id: empId,
    selectedDateString: selectedDateString,
  });

  const getDifferenceText = (recordDatetimeString: string, index: number) => {
    const recordMinute = getMinutes(recordDatetimeString);
    const shiftMinute = getMinutes(matchedShift[index].datetime);
    const differenceMin = shiftMinute - recordMinute;
    if (differenceMin === 0) return null;
    const text =
      differenceMin > 0
        ? `(シフトより${formatTimeFromMillis(differenceMin * 60 * 1000)}早い)`
        : `(シフトより${formatTimeFromMillis(
            Math.abs(differenceMin * 60 * 1000)
          )}遅い)`;
    return text;
  };

  const pageContent = (
    <div className="container-large flex flex-col gap-learge">
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
        <table border={1}>
          <thead>
            <tr>
              <th className="home-th">登録種別</th>
              <th className="home-th">担当</th>
              <th className="home-th">時刻</th>
              <th className="home-th">メモ</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record, index) => (
              <tr key={index}>
                <td className="home-td">{getLabel(record, "type")}</td>
                <td className="home-td">
                  {record.type !== "clock_out" && record.type !== "break_begin"
                    ? getLabel(record, "role")
                    : "-"}
                </td>
                <td className="home-td">
                  <div className="flex gap-small justify-center align-baseline">
                    <span>{formatTime(record.datetime)}</span>
                    {showDiffs && (
                      <span className="differenceText">
                        {getDifferenceText(record.datetime, index)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="home-td">{record.note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
