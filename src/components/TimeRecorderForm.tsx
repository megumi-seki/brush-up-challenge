import { useEffect, useRef, useState } from "react";
import formatTime from "../hooks/formatTime";
import formatDate from "../hooks/formatDate";
import RadioGroup from "./RadioGroup";
import getRecordsById from "../hooks/getRecordsById";
import type { timeRecorderType } from "../types";
import getEmployeeById from "../hooks/getEmployeeById";

type Props = {
  empId: string | undefined;
};

const getLastType = (empId: string | undefined): string | null => {
  if (!empId) return null;
  const records = getRecordsById(empId);
  if (records.length === 0) return null;
  return records[records.length - 1].type;
};

const getTypeOptions = (lastType: string | null) => {
  switch (lastType) {
    case "clock_in":
    case "role_change":
      return [
        { value: "break_begin", label: "休憩開始" },
        { value: "role_change", label: "担当切替" },
        { value: "clock_out", label: "退勤" },
      ];
    case "break_begin":
      return [{ value: "break_end", label: "休憩終了" }];
    case "break_end":
      return [
        { value: "role_change", label: "担当切替" },
        { value: "clock_out", label: "退勤" },
      ];
    case "clock_out":
    default:
      return [{ value: "clock_in", label: "出勤" }];
  }
};

const defaultRoleOptions = [
  { value: "oven", label: "釜" },
  { value: "dough", label: "仕込み" },
  { value: "cafe", label: "品カフェ" },
  { value: "shaping", label: "麺台" },
  { value: "sandwich", label: "サンド" },
  { value: "sales", label: "販売" },
];

const getRoleOptions = (empId: string | undefined) => {
  if (!empId) return [];
  const employee = getEmployeeById(empId);
  if (!employee || !employee.roles || employee.roles.length === 0) return [];
  return defaultRoleOptions.filter((option) =>
    employee.roles.includes(option.value)
  );
};

const TimeRecorderForm = ({ empId }: Props) => {
  const [lastType, setLastType] = useState<string | null>(null);
  const typeOptions = getTypeOptions(lastType);
  const roleOptions = getRoleOptions(empId);
  const [selectedType, setSelectedType] = useState(typeOptions[0].value);
  const [selectedRole, setSelectedRole] = useState(roleOptions[0].value);
  const [note, setNote] = useState("");
  const [now, setNow] = useState(new Date());
  const prevMinuteRef = useRef(now.getMinutes());

  // 分単位で時刻を更新
  useEffect(() => {
    const timer = setInterval(() => {
      const current = new Date();
      if (current.getMinutes() !== prevMinuteRef.current) {
        setNow(current);
        prevMinuteRef.current = current.getMinutes();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setLastType(getLastType(empId));
  }, [empId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empId) return;

    const newRecord: timeRecorderType = {
      emp_id: empId,
      datetime: now.toISOString(),
      role: selectedRole,
      type: selectedType,
      note: note.trim(),
    };

    const key = `${empId}_time_records`;
    const records = getRecordsById(empId);
    records.push(newRecord);
    localStorage.setItem(key, JSON.stringify(records));
    setNote("");
    const newLastType = selectedType;
    const newTypeOptions = getTypeOptions(newLastType);
    setLastType(newLastType);
    setSelectedType(newTypeOptions[0].value);
  };

  return (
    <form action="" className="flex-col gap-small" onSubmit={handleSubmit}>
      <div className="flex-col align-center">
        <span className="time-big">{formatTime(now)}</span>
        <span>{formatDate(now)}</span>
      </div>
      <RadioGroup
        name="target_type"
        options={typeOptions}
        selectedValue={selectedType}
        onChange={setSelectedType}
      />
      <RadioGroup
        name="target_role"
        options={roleOptions}
        selectedValue={selectedRole}
        onChange={setSelectedRole}
      />
      <div className="note-frame">
        <label htmlFor="note" className="hidden">
          メモ
        </label>
        <input
          type="text"
          id="note"
          placeholder="メモ"
          className="note-input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <button className="btn-frame submit-btn" type="submit">
        登録
      </button>
    </form>
  );
};

export default TimeRecorderForm;
