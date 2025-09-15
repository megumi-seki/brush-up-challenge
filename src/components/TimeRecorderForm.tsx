import { useEffect, useRef, useState } from "react";
import formatTime from "../hooks/formatTime";
import formatDate from "../hooks/formatDate";
import RadioGroup from "./RadioGroup";
import getRecordsById from "../hooks/getRecordsById";
import type { Employee, TimeRecorderType } from "../types";
import getEmployeeById from "../hooks/getEmployeeById";
import { DEFAULT_ROLE_OPTIONS, TIMEZONE } from "../constants/appConfig";
import { toZonedTime } from "date-fns-tz";
import formatDateToJst from "../hooks/formatDateToJst";

type TimeRecorderFormProps = {
  empId: string;
  lastType: string | null;
  setLastType: React.Dispatch<React.SetStateAction<string | null>>;
  lastRole: string | null;
  setLastRole: React.Dispatch<React.SetStateAction<string | null>>;
};

type roleTypeOptionType = {
  value: string;
  label: string;
};

const TimeRecorderForm = ({
  empId,
  lastType,
  setLastType,
  lastRole,
  setLastRole,
}: TimeRecorderFormProps) => {
  const employee = getEmployeeById(empId);
  if (!employee) {
    return <div>従業員が見つかりません</div>;
  }
  const [selectedType, setSelectedType] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | undefined>(
    undefined
  );
  const [note, setNote] = useState<string | null>(null);
  const [now, setNow] = useState(toZonedTime(new Date(), TIMEZONE));
  const prevMinuteRef = useRef(now.getMinutes());
  const [typeOptions, setTypeOptions] = useState<roleTypeOptionType[]>([]);
  const [roleOptions, setRoleOptions] = useState<roleTypeOptionType[]>([]);

  // 分単位で時刻を更新
  useEffect(() => {
    const timer = setInterval(() => {
      const current = toZonedTime(new Date(), TIMEZONE);
      if (current.getMinutes() !== prevMinuteRef.current) {
        setNow(current);
        prevMinuteRef.current = current.getMinutes();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isLastRecordToday(empId)) {
      setLastType(getLastType(empId));
      setLastRole(getLastRole(empId));
    }
  }, [empId]);

  useEffect(() => {
    const typeOptions =
      employee.roles.length > 1
        ? getTypeOptions(lastType)
        : getTypeOptionsWithoutRoleChange(lastType);
    setTypeOptions(typeOptions);
  }, [lastType]);

  useEffect(() => {
    if (typeOptions.length > 0) {
      setSelectedType(typeOptions[0].value);
    }
  }, [typeOptions]);

  useEffect(() => {
    setRoleOptions(getRoleOptions(employee, selectedType));
  }, [empId, selectedType, lastRole]);

  useEffect(() => {
    if (roleOptions.length > 0) {
      setSelectedRole(roleOptions[0].value);
    } else {
      setSelectedRole(undefined);
    }
  }, [roleOptions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRecord: TimeRecorderType = {
      emp_id: empId,
      datetime: formatDateToJst(now),
      role: selectedRole ? selectedRole : lastRole ?? employee.roles[0],
      type: selectedType,
      note: note ? note.trim() : "-",
    };

    const key = "time_records";
    const records = localStorage.getItem(key);
    const parsedRecords: TimeRecorderType[] = records
      ? JSON.parse(records)
      : [];
    parsedRecords.push(newRecord);
    localStorage.setItem(key, JSON.stringify(parsedRecords));

    setNote("");
    const newLastRole = selectedRole ? selectedRole : lastRole;
    setLastRole(newLastRole);
    const newLastType = selectedType;
    setLastType(newLastType);
  };

  return (
    <form
      action=""
      className="flex-col align-center gap-small"
      onSubmit={handleSubmit}
    >
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
      {roleOptions.length > 0 && selectedRole && (
        <>
          <div className="divider"></div>
          <RadioGroup
            name="target_role"
            options={roleOptions}
            selectedValue={selectedRole}
            onChange={setSelectedRole}
            text={getTypeTexts[selectedType]}
          />
        </>
      )}
      <div className="note-frame">
        <label htmlFor="note" className="hidden">
          メモ
        </label>
        <input
          type="text"
          id="note"
          placeholder="メモ"
          className="note-input"
          value={note || ""}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <button className="btn submit-btn" type="submit">
        登録
      </button>
    </form>
  );
};

export default TimeRecorderForm;

const isLastRecordToday = (empId: string) => {
  if (!empId) return null;
  const records = getRecordsById(empId);
  if (records.length === 0) return null;
  const jstLastRecord = toZonedTime(
    new Date(records[records.length - 1].datetime),
    TIMEZONE
  );
  const lastRecordDate = jstLastRecord.getDate();
  return lastRecordDate === toZonedTime(new Date(), TIMEZONE).getDate();
};

const getLastType = (empId: string | undefined): string | null => {
  if (!empId) return null;
  const records = getRecordsById(empId);
  if (records.length === 0) return null;
  return records[records.length - 1].type;
};

const getLastRole = (empId: string): string | null => {
  const records = getRecordsById(empId);
  if (records.length === 0) return null;
  return records[records.length - 1].role;
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
        { value: "clock_out", label: "退勤" },
        { value: "role_change", label: "担当切替" },
      ];
    case "clock_out":
    default:
      return [{ value: "clock_in", label: "出勤" }];
  }
};

const getTypeOptionsWithoutRoleChange = (lastType: string | null) => {
  switch (lastType) {
    case "clock_in":
    case "role_change":
      return [
        { value: "break_begin", label: "休憩開始" },
        { value: "clock_out", label: "退勤" },
      ];
    case "break_begin":
      return [{ value: "break_end", label: "休憩終了" }];
    case "break_end":
      return [{ value: "clock_out", label: "退勤" }];
    case "clock_out":
    default:
      return [{ value: "clock_in", label: "出勤" }];
  }
};

const getTypeTexts: Record<string, string> = {
  clock_in: "として業務を開始する",
  role_change: "に業務を切り替える",
  break_begin: "",
  break_end: "として業務を再開する",
  clock_out: "",
};

const getRoleOptions = (employee: Employee, selectedType: string) => {
  if (selectedType === "break_begin" || selectedType === "clock_out") return [];
  if (!employee) return [];
  if (employee.roles.length === 1) return [];
  return selectedType === "break_end" || selectedType === "clock_in"
    ? DEFAULT_ROLE_OPTIONS.filter((option) =>
        employee.roles.includes(option.value)
      )
    : DEFAULT_ROLE_OPTIONS.filter(
        (option) =>
          employee.roles.includes(option.value) &&
          getLastRole(employee.id) !== option.value
      );
};
