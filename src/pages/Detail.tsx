import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

type Employee = {
  id: string;
  name: string;
  roles: string[];
};

const Detail = () => {
  const { empId, weekStart, compare } = useParams();
  const [now, setNow] = useState(new Date());
  const prevMinuteRef = useRef(now.getMinutes());
  const [employeee, setEmployee] = useState<Employee | null>(null);
  const [selectedType, setSelectedType] = useState("clock_in");
  const [selectedRole, setSelectedRole] = useState("sandwitch");

  // ページのURLが変わったときに従業員データを更新
  useEffect(() => {
    const storedData = localStorage.getItem("employees");
    if (storedData && empId) {
      const employees: Employee[] = JSON.parse(storedData);
      const selectedEmployee = employees.find((emp) => emp.id === empId);
      setEmployee(selectedEmployee || null);
    }
  }, [empId]);

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

  const formatTime = (date: Date) =>
    `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

  const formatDate = (date: Date) =>
    `${date.getFullYear().toString()}/${date.getMonth().toString()}/${date
      .getDate()
      .toString()} (${
      ["日", "月", "火", "水", "木", "金", "土"][date.getDay()]
    })`;

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
        <form action="" className="flex-col gap-small">
          <label htmlFor="target_date" className="hidden">
            登録日時
          </label>
          <input
            type="date"
            id="target_date"
            className="hidden"
            value={now.toISOString().split("T")[0]}
          />
          <div className="flex-col align-center">
            <span className="time-big">{formatTime(now)}</span>
            <span>{formatDate(now)}</span>
          </div>
          <div className="flex justify-around">
            {[
              { value: "clock_in", label: "出勤" },
              { value: "break_begin", label: "休憩開始" },
              { value: "break_end", label: "休憩終了" },
              { value: "clock_out", label: "退勤" },
            ].map((item) => (
              <label
                key={item.value}
                className={`radio-label${
                  selectedType === item.value ? " selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="target_type"
                  value={item.value}
                  checked={selectedType === item.value}
                  onChange={() => setSelectedType(item.value)}
                />
                {item.label}
              </label>
            ))}
          </div>
          <div className="border"></div>
          <div className="flex justify-around">
            {[
              { value: "sandwitch", label: "サンド" },
              { value: "bake", label: "釜" },
              { value: "make", label: "麺台" },
              { value: "sell", label: "販売" },
            ].map((item) => (
              <label
                key={item.value}
                className={`radio-label${
                  selectedRole === item.value ? " selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="target_type"
                  value={item.value}
                  checked={selectedRole === item.value}
                  onChange={() => setSelectedRole(item.value)}
                />
                {item.label}
              </label>
            ))}
          </div>
          <div className="note-frame">
            <label htmlFor="note" className="hidden">
              メモ
            </label>
            <input
              type="text"
              id="note"
              placeholder="メモ"
              className="note-input"
            />
          </div>
          <button className="btn-frame submit-btn">登録</button>
        </form>
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
