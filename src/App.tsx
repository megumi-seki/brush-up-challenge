import { Routes, Route } from "react-router-dom";
import ClockLogs from "./pages/ClockLogs";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import { useEffect, useState } from "react";
import type { Employee, ShiftType, TimeRecorderType } from "./types";
import {
  EMPLOYEE_DEMO_DATA,
  SHIFT_DEMO_DATA,
  TIME_RECORDER_DEMO_DATA,
} from "./constants/appConfig";

function App() {
  const [employeees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {}, []);

  useEffect(() => {
    const storedEmployeesData = localStorage.getItem("employees");
    if (storedEmployeesData) {
      setEmployees(JSON.parse(storedEmployeesData));
    } else {
      // デモ用に、初期データがない場合はダミーデータを保存
      const initialData = EMPLOYEE_DEMO_DATA;
      localStorage.setItem("employees", JSON.stringify(initialData));
      setEmployees(initialData);
    }

    const storedTimeRecordsData = localStorage.getItem("time_records");
    if (!storedTimeRecordsData) {
      const initialData = TIME_RECORDER_DEMO_DATA;
      localStorage.setItem("time_records", JSON.stringify(initialData));
    }

    const storedShiftData = localStorage.getItem("shift");
    if (!storedShiftData) {
      const initialData = SHIFT_DEMO_DATA;
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
