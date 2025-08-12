import { useEffect, useRef, useState } from "react";
import formatTime from "../hooks/formatTime";
import formatDate from "../hooks/formatDate";
import RadioGroup from "./RadioGroup";

type Props = {
  empId: string | undefined;
};

type timeRecorderType = {
  emp_id: string;
  target_datetime: string;
  target_role: string;
  target_type: string;
  note?: string;
};

const typeOptions = [
  { value: "clock_in", label: "出勤" },
  { value: "break_begin", label: "休憩開始" },
  { value: "break_end", label: "休憩終了" },
  { value: "clock_out", label: "退勤" },
  { value: "role_change", label: "担当切替" },
];

const roleOptions = [
  { value: "sandwitch", label: "サンド" },
  { value: "bake", label: "釜" },
  { value: "make", label: "麺台" },
  { value: "sell", label: "販売" },
];

const TimeRecorderForm = ({ empId }: Props) => {
  const [selectedType, setSelectedType] = useState("clock_in");
  const [selectedRole, setSelectedRole] = useState("sandwitch");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!empId) return;

    const newRecord: timeRecorderType = {
      emp_id: empId,
      target_datetime: now.toISOString(),
      target_role: selectedRole,
      target_type: selectedType,
      note: note.trim(),
    };

    const key = `${empId}_time_records`;
    const storedData = localStorage.getItem(key);
    console.log("storedData", storedData);
    const records: timeRecorderType[] = storedData
      ? JSON.parse(storedData)
      : [];
    records.push(newRecord);
    localStorage.setItem(key, JSON.stringify(records));
    setNote("");
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
