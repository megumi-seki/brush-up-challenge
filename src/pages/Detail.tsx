import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TimeRecorderForm from "../components/TimeRecorderForm";

//TODO time recorderを機能させる
// 1: 登録種別の項目追加（担当切替）✓
// 2: 登録種別の条件分岐
// 3: 個人情報による担当の条件分岐（担当１つだけなら担当表示しない）
// 4: 登録種別による担当の条件分岐（休憩開始、退勤のときは表示しない）
// 5: 登録種別による表示切替（出勤→〇〇として業務開始する、
// 休憩終了→〇〇として業務再開する、担当切替→〇〇から〇〇に業務担当を切り替える）
// 6:submitでlocalStorageに保存できるようにする ✓

type Employee = {
  id: string;
  name: string;
  roles: string[];
};

const Detail = () => {
  const { empId, weekStart, compare } = useParams();
  const [employeee, setEmployee] = useState<Employee | null>(null);

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
