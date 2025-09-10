import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Employee } from "../types";
import getRolesText from "../hooks/getRolesText";
import ButtonToClockLogs from "../components/ButtonToClockLogs";
import ButtonToHome from "../components/ButtonToHome";
import getRecordsByDate from "../hooks/getRecordsByDate";
import getLabel from "../hooks/getLabel";
import formatTime from "../hooks/formatTime";
import formatDate from "../hooks/formatDate";

const Correction = () => {
  const { empId, selectedDateString } = useParams();
  const [employeee, setEmployee] = useState<Employee | null>(null);
  if (!empId) {
    return <div>従業員が選択されていません。</div>;
  } else if (!selectedDateString) {
    return <div>修正対象の日付が選択されていません。</div>;
  }
  const navigate = useNavigate();

  // ページのURLが変わったときに従業員データを更新
  useEffect(() => {
    const storedData = localStorage.getItem("employees");
    if (storedData && empId) {
      const employees: Employee[] = JSON.parse(storedData);
      const selectedEmployee = employees.find((emp) => emp.id === empId);
      setEmployee(selectedEmployee || null);
    }
  }, [empId]);

  const recordsOfSelectedDate = getRecordsByDate({
    datetimeString: selectedDateString,
    key: "time_records",
  });
  const recordsToShow = recordsOfSelectedDate.filter(
    (record) => record.emp_id === empId
  );

  const pageContent = (
    <>
      <div className="container-large flex flex-col gap-medium">
        <div className="flex justify-between">
          <div className="flex gap-medium">
            <span>従業員番号: {empId}</span>
            <span>名前: {employeee?.name}</span>
            <span>担当: {getRolesText({ roles: employeee?.roles })}</span>
            <span>ステータス:</span>
          </div>
        </div>
        <div>
          <h3>{formatDate(selectedDateString)}のタイムレコーダー履歴修正</h3>
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
                  <td className="detail-logs-td">
                    <div>
                      <span>{getLabel(record, "type")}</span>
                    </div>
                  </td>
                  <td className="detail-logs-td">
                    {record.type !== "clock_out" &&
                    record.type !== "break_begin" ? (
                      <div>
                        <span>{getLabel(record, "role")}</span>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="detail-logs-td">
                    <div className="flex gap-small justify-center align-baseline">
                      <span>{formatTime(record.datetime)}</span>
                    </div>
                  </td>
                  <td className="detail-logs-td">{record.note || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  return pageContent;
};

export default Correction;
