import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

type Employee = {
  id: string;
  name: string;
  roles: string[];
};

const Detail = () => {
  const { empId, weekStart, compare } = useParams();
  const [employeee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("employees");
    if (storedData && empId) {
      const employees: Employee[] = JSON.parse(storedData);
      const selectedEmployee = employees.find((emp) => emp.id === empId);
      setEmployee(selectedEmployee || null);
    }
  }, [empId]);

  const pageContent = (
    <div>
      <div>
        <span>従業員番号: {empId}</span>
        <span>名前: {employeee?.name}</span>
        <span>担当: {employeee?.roles}</span>
        <span>ステータス:</span>
      </div>
      <div>
        <span>前週 </span>
        <span>{weekStart}の週のタイムレコーダー履歴</span>
        <span>次週</span>
      </div>
      <div>グラフ</div>
      <div>シフトと比較</div>
      <h3>タイムレコーダー</h3>
      <form action="">
        <div>
          <label htmlFor="target_date">対象日時: </label>
          <input type="date" id="target_date" />
          <br />
          <label htmlFor="target_type">登録種別: </label>
          <select name="target_type" id="target_type">
            <option value="clock_in">出勤</option>
            <option value="break_begin">休憩開始</option>
            <option value="break_end">休憩終了</option>
            <option value="clock_out">退勤</option>
          </select>
          <br />
          <label htmlFor="target_role">担当: </label>
          <select name="target_role" id="target_role">
            <option value="sandwitch">サンド</option>
            <option value="bake">釜</option>
            <option value="make">麺台</option>
            <option value="sell">販売</option>
          </select>
          <br />
          <label htmlFor="note">メモ: </label>
          <input type="text" id="note" />
          <br />
          <button className="btn-frame">登録</button>
        </div>
      </form>
      <div>
        <h3>警告</h3>
        <p>働きすぎ！</p>
      </div>
    </div>
  );

  return pageContent;
};

export default Detail;
