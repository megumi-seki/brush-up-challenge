import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TimeRecorderForm from "../components/TimeRecorderForm";
import type { Employee } from "../types";

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

  const pageContent = (
    <div className="container">
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
        <div className="flex gap-medium align-center">
          <h3>週のタイムレコーダー履歴</h3>
          <span>前週</span>
          <span>次週</span>
        </div>
        <div>グラフ</div>
        <div>シフトと比較</div>
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
