import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TimeRecorderForm from "../components/TimeRecorderForm";
import type { Employee } from "../types";
import ClockLogTableTitle from "../components/ClockLogTableTitle";
import ClockLogTable from "../components/ClockLogTable";
import getRecordsByDate from "../hooks/getRecordsByDate";
import groupRecordsById from "../hooks/groupRecordsById";

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
