import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Employee, TimeRecorderType } from "../types";

const Home = () => {
  const [employeees, setEmployees] = useState<Employee[]>([]);
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const storedData = localStorage.getItem("employees");
    if (storedData) {
      setEmployees(JSON.parse(storedData));
    } else {
      // デモ用に、初期データがない場合はダミーデータを保存
      const initialData: Employee[] = [
        { id: "001", name: "田中太郎", roles: ["oven", "sandwich", "dough"] },
        { id: "002", name: "山田花子", roles: ["sandwich", "shaping"] },
        { id: "003", name: "freee次郎", roles: ["sales"] },
      ];
      localStorage.setItem("employees", JSON.stringify(initialData));
      setEmployees(initialData);
    }
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem("time_records");
    if (!storedData) {
      const initialData: TimeRecorderType[] = [
        {
          emp_id: "001",
          datetime: "2025-08-14T05:03:32.780Z",
          role: "oven",
          type: "clock_in",
          note: "",
        },
        {
          emp_id: "001",
          datetime: "2025-08-14T06:14:32.780Z",
          role: "dough",
          type: "role_change",
          note: "",
        },
        {
          emp_id: "001",
          datetime: "2025-08-14T08:03:32.780Z",
          role: "dough",
          type: "break_begin",
          note: "",
        },
        {
          emp_id: "001",
          datetime: "2025-08-14T09:05:32.780Z",
          role: "oven",
          type: "break_end",
          note: "",
        },
        {
          emp_id: "001",
          datetime: "2025-08-14T13:05:32.780Z",
          role: "sandwich",
          type: "role_change",
          note: "",
        },
        {
          emp_id: "001",
          datetime: "2025-08-14T14:00:32.780Z",
          role: "sandwich",
          type: "clock_out",
          note: "",
        },
        {
          emp_id: "002",
          datetime: "2025-08-14T06:03:32.780Z",
          role: "oven",
          type: "clock_in",
          note: "",
        },
        {
          emp_id: "002",
          datetime: "2025-08-14T07:50:32.780Z",
          role: "oven",
          type: "break_begin",
          note: "",
        },
        {
          emp_id: "002",
          datetime: "2025-08-14T08:30:32.780Z",
          role: "oven",
          type: "break_end",
          note: "",
        },
        {
          emp_id: "002",
          datetime: "2025-08-14T14:00:32.780Z",
          role: "oven",
          type: "clock_out",
          note: "",
        },
        {
          emp_id: "003",
          datetime: "2025-08-14T06:03:32.780Z",
          role: "sales",
          type: "clock_in",
          note: "",
        },
      ];
      localStorage.setItem("time_records", JSON.stringify(initialData));
    }
  }, []);

  const pageContent = (
    <div className="container">
      <div className="flex gap-small">
        <span>事業所名称:</span>
        <span>開発用テスト事業所</span>
      </div>
      <div>
        <div className="flex justify-between align-center">
          <h3>従業員一覧</h3>
          <button className="btn" onClick={() => navigate(`/logs`)}>
            タイムレコーダー履歴
          </button>
        </div>
        <table border={1}>
          <thead>
            <tr>
              <th className="home-th">従業員番号</th>
              <th className="home-th">名前</th>
              <th className="home-th">役職</th>
            </tr>
          </thead>
          <tbody>
            {employeees.map((emp) => (
              <tr
                className="with-hover"
                key={emp.id}
                onClick={() => navigate(`/detail/${emp.id}/${today}`)}
              >
                <td className="home-td">{emp.id}</td>
                <td className="home-td">{emp.name}</td>
                <td className="home-td">{emp.roles}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return pageContent;
};

export default Home;
