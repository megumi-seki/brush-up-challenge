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
import getRolesText from "../hooks/getRolesText";
import ButtonToHome from "../components/ButtonToHome";

// 別ブランチ TODO: 差異表示、差異が10分以上だとboldになるようにする　（優先度低）
// 別ブランチ feature-improve-show-difference-logic TODO: 差異表示、担当が違う→時刻と同じように表示、登録種別が違う→シフトを実際に見比べることをお勧めするメッセージを表示（優先度中）

// 別ブランチ　TODO: カレンダー　当日より後は開けないようにする（優先度低）

// 別ブランチ  TODO: clocklogspage　表示順のソート（優先度低）

// 別ブランチ　TODO: getMatchedShiftとgetGroupedMatchedShiftを整理する（優先度低）

// TODO: 休憩や担当切替の回数や扱いの制限どこまでにしてるか確認する（優先度中）

const Detail = () => {
  const { empId, weekStart, compare } = useParams();
  const [employeee, setEmployee] = useState<Employee | null>(null);
  if (!empId) {
    return <div>従業員が選択されていません。</div>;
  }
  const [lastType, setLastType] = useState<string | null>(null);
  const [lastRole, setLastRole] = useState<string | null>(null);

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
  const [recordsToShow, setRecordsToShow] = useState<TimeRecorderType[]>([]);

  useEffect(() => {
    const recordsOfSelectedDate = getRecordsByDate({
      datetimeString: selectedDateString,
      key: "time_records",
    });
    const filteredRecords = recordsOfSelectedDate.filter(
      (record) => record.emp_id === empId
    );

    setRecordsToShow(filteredRecords);
  }, [lastType, lastRole, selectedDateString]);

  const groupedRecord = groupRecordsById(recordsToShow);

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
    if (matchedShift.length === 0) return;
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
      <div className="flex justify-between">
        <div className="flex gap-medium">
          <span>従業員番号: {empId}</span>
          <span>名前: {employeee?.name}</span>
          <span>担当: {getRolesText({ roles: employeee?.roles })}</span>
          <span>ステータス:</span>
        </div>
        <ButtonToHome />
      </div>
      <div className="time-recorder">
        <h3 className="my-none">タイムレコーダー</h3>
        <TimeRecorderForm
          empId={empId}
          lastType={lastType}
          setLastType={setLastType}
          lastRole={lastRole}
          setLastRole={setLastRole}
        />
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
              <th className="detail-logs-th">登録種別</th>
              <th className="detail-logs-th">担当</th>
              <th className="detail-logs-th">時刻</th>
              <th className="detail-logs-th">メモ</th>
            </tr>
          </thead>
          <tbody>
            {recordsToShow.map((record, index) => (
              <tr key={index}>
                <td className="detail-logs-td">{getLabel(record, "type")}</td>
                <td className="detail-logs-td">
                  {record.type !== "clock_out" && record.type !== "break_begin"
                    ? getLabel(record, "role")
                    : "-"}
                </td>
                <td className="detail-logs-td">
                  <div className="flex gap-small justify-center align-baseline">
                    <span>{formatTime(record.datetime)}</span>
                    {showDiffs && (
                      <span className="differenceText">
                        {getDifferenceText(record.datetime, index)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="detail-logs-td">{record.note || "-"}</td>
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
    </div>
  );

  return pageContent;
};

export default Detail;
