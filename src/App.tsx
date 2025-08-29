import { Routes, Route } from "react-router-dom";
import ClockLogs from "./pages/ClockLogs";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import { useEffect, useState } from "react";
import type { Employee, ShiftType, TimeRecorderType } from "./types";

function App() {
  const [employeees, setEmployees] = useState<Employee[]>([]);
  const yesterday = new Date().setDate(new Date().getDate() - 1);
  const formattedYesterday = new Date(yesterday).toISOString().split("T")[0];

  useEffect(() => {}, []);

  useEffect(() => {
    const storedEmployeesData = localStorage.getItem("employees");
    if (storedEmployeesData) {
      setEmployees(JSON.parse(storedEmployeesData));
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

    const storedTimeRecordsData = localStorage.getItem("time_records");
    if (!storedTimeRecordsData) {
      const initialData: TimeRecorderType[] = [
        {
          emp_id: "001",
          datetime: `${formattedYesterday}T05:03:32.780Z`,
          role: "oven",
          type: "clock_in",
          note: "",
        },
        {
          emp_id: "001",
          datetime: `${formattedYesterday}T06:14:32.780Z`,
          role: "dough",
          type: "role_change",
          note: "",
        },
        {
          emp_id: "001",
          datetime: `${formattedYesterday}T08:03:32.780Z`,
          role: "dough",
          type: "break_begin",
          note: "",
        },
        {
          emp_id: "001",
          datetime: `${formattedYesterday}T09:05:32.780Z`,
          role: "oven",
          type: "break_end",
          note: "",
        },
        {
          emp_id: "001",
          datetime: `${formattedYesterday}T13:05:32.780Z`,
          role: "sandwich",
          type: "role_change",
          note: "",
        },
        {
          emp_id: "001",
          datetime: `${formattedYesterday}T14:00:32.780Z`,
          role: "sandwich",
          type: "clock_out",
          note: "",
        },
        {
          emp_id: "002",
          datetime: `${formattedYesterday}T06:03:32.780Z`,
          role: "oven",
          type: "clock_in",
          note: "",
        },
        {
          emp_id: "002",
          datetime: `${formattedYesterday}T07:50:32.780Z`,
          role: "oven",
          type: "break_begin",
          note: "",
        },
        {
          emp_id: "002",
          datetime: `${formattedYesterday}T08:30:32.780Z`,
          role: "oven",
          type: "break_end",
          note: "",
        },
        {
          emp_id: "002",
          datetime: `${formattedYesterday}T14:00:32.780Z`,
          role: "oven",
          type: "clock_out",
          note: "",
        },
        {
          emp_id: "003",
          datetime: `${formattedYesterday}T06:03:32.780Z`,
          role: "sales",
          type: "clock_in",
          note: "",
        },
      ];
      localStorage.setItem("time_records", JSON.stringify(initialData));
    }

    const storedShiftData = localStorage.getItem("shift");
    if (!storedShiftData) {
      const initialData: ShiftType[] = [
        {
          emp_id: "001",
          datetime: `${formattedYesterday}T05:00:32.780Z`,
          role: "sandwich",
          type: "clock_in",
        },
        {
          emp_id: "001",
          datetime: `${formattedYesterday}T06:30:32.780Z`,
          role: "dough",
          type: "role_change",
        },
        {
          emp_id: "001",
          datetime: `${formattedYesterday}T08:00:32.780Z`,
          role: "dough",
          type: "break_begin",
        },
        {
          emp_id: "001",
          datetime: `${formattedYesterday}T09:00:32.780Z`,
          role: "oven",
          type: "break_end",
        },
        {
          emp_id: "001",
          datetime: `${formattedYesterday}T13:00:32.780Z`,
          role: "sandwich",
          type: "role_change",
        },
        {
          emp_id: "001",
          datetime: `${formattedYesterday}T14:00:32.780Z`,
          role: "sandwich",
          type: "clock_out",
        },
        {
          emp_id: "002",
          datetime: `${formattedYesterday}T06:00:32.780Z`,
          role: "oven",
          type: "clock_in",
        },
        {
          emp_id: "002",
          datetime: `${formattedYesterday}T08:00:32.780Z`,
          role: "oven",
          type: "break_begin",
        },
        {
          emp_id: "002",
          datetime: `${formattedYesterday}T09:00:32.780Z`,
          role: "oven",
          type: "break_end",
        },
        {
          emp_id: "002",
          datetime: `${formattedYesterday}T14:00:32.780Z`,
          role: "oven",
          type: "clock_out",
        },
        {
          emp_id: "003",
          datetime: `${formattedYesterday}T06:00:32.780Z`,
          role: "sales",
          type: "clock_in",
        },
      ];
      localStorage.setItem("shift", JSON.stringify(initialData));
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home employees={employeees} />} />
      <Route path="/detail/:empId/" element={<Detail />} />
      <Route path="/logs" element={<ClockLogs />} />
    </Routes>
  );
}

export default App;
