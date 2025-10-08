import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type {
  CorrectionRequestType,
  CorrectionTimeRecordType,
  Employee,
} from "../types";
import getRolesText from "../hooks/getRolesText";
import getRecordsByDate from "../hooks/getRecordsByDate";
import formatTime from "../hooks/formatTime";
import formatDate from "../hooks/formatDate";
import RecordToShowTr from "../components/RecordToShowTr";
import RecordsThead from "../components/RecordsThead";
import { toZonedTime } from "date-fns-tz";
import {
  DEFAULT_ROLE_OPTIONS,
  DEFAULT_TYPE_OPTIONS,
  TIMEZONE,
} from "../constants/appConfig";
import getRoleLabel from "../hooks/getRoleLabel";
import getTypeLabel from "../hooks/getTypeLabel";
import formatDateToJst from "../hooks/formatDateToJst";

// 修正ページ
const Correction = () => {
  const { empId, dateStringParam } = useParams();
  const [employeee, setEmployee] = useState<Employee | null>(null);
  const navigate = useNavigate();
  if (!empId) {
    return <div>従業員が選択されていません。</div>;
  } else if (!dateStringParam) {
    return <div>修正対象の日付が選択されていません。</div>;
  }

  useEffect(() => {
    const storedData = localStorage.getItem("employees");
    if (storedData && empId) {
      const employees: Employee[] = JSON.parse(storedData);
      const selectedEmployee = employees.find((emp) => emp.id === empId);
      setEmployee(selectedEmployee || null);
    }
  }, []);

  const recordsOfSelectedDate = getRecordsByDate({
    datetimeString: dateStringParam,
    key: "time_records",
  });
  const recordsBeforeCorrection = recordsOfSelectedDate.filter(
    (record) => record.emp_id === empId
  );

  const initCorrectedRecords: CorrectionTimeRecordType[] =
    recordsBeforeCorrection.map((record) => ({
      emp_id: record.emp_id,
      deleted: false,
      added: false,
      datetime: { value: record.datetime, label: null },
      role: {
        value: record.role,
        label: null,
      },
      type: { value: record.type, label: null },
      note: { value: record.note, label: null },
    }));

  const [correctedRecords, setCorredtedRecords] =
    useState<CorrectionTimeRecordType[]>(initCorrectedRecords);

  type CorrectionActions =
    | "modifyType"
    | "modifyRole"
    | "modifyTime"
    | "modifyNote"
    | "deleteRecord"
    | "addRecord";

  // 打刻追加以外の修正を反映
  const handleCorrection = (
    index: number,
    action: CorrectionActions,
    value: string
  ) => {
    const updatedRecords = [...correctedRecords];

    switch (action) {
      case "modifyType":
        const initType = initCorrectedRecords[index]?.type.value;
        const initTypeLabel = initType ? getTypeLabel(initType) : "";

        updatedRecords[index].type = {
          value,
          label: `${initTypeLabel ?? ""} -> ${getTypeLabel(value)}`,
        };
        break;
      case "modifyRole":
                const initRole = initCorrectedRecords[index]?.role.value;
        const initRoleLabel = initRole ? getRoleLabel(initRole) : "";

        updatedRecords[index].role = {
          value,
          label: `${initRoleLabel ?? ""} -> ${getRoleLabel(value)}`,
        };
        break;
      case "modifyTime":
        let formattedInitTime = "";
        if (initCorrectedRecords[index]) {
          const utcInitTime = new Date(
            initCorrectedRecords[index].datetime.value
          );
          const initTime = toZonedTime(utcInitTime, TIMEZONE);
          formattedInitTime = formatTime(initTime); // 修正前の時刻
        }

        const [hours, minutes] = value.split(":"); // 修正後の時刻の要素
        // ↓修正前の時刻と、編集途中の時刻を別々に管理することにより、最終保存時に正しいラベルを表示
        const utcUpdatedDatetime = new Date(
          updatedRecords[index].datetime.value
        );
        const updatedDatetime = toZonedTime(utcUpdatedDatetime, TIMEZONE);
        updatedDatetime.setHours(Number(hours), Number(minutes));
        const updatedDatetimeString = formatDateToJst(updatedDatetime); // 修正後の時刻
        
        updatedRecords[index].datetime = {
          value: updatedDatetimeString,
          label: `${formattedInitTime} -> ${formatTime(updatedDatetimeString)}`,
        };
        break;
      case "modifyNote":
        const initNote = initCorrectedRecords[index]
          ? initCorrectedRecords[index].note.value
          : "";
        updatedRecords[index].note = {
          value,
          label: `${initNote} -> ${value}`,
        };
        break;
      case "deleteRecord":
        updatedRecords[index].deleted = !updatedRecords[index].deleted;
        break;
      case "addRecord": // 打刻追加は別関数で対応
        break;
      default:
        break;
    }

    setCorredtedRecords(updatedRecords);
  };

  // 打刻追加
  const handleAddRecordButton = () => {
    const initDate = new Date(dateStringParam);
    initDate.setHours(12, 0, 0, 0); 
    const initDateString = formatDateToJst(initDate); // 追加打刻の初期値を12:00に設定

    const newRecord: CorrectionTimeRecordType = {
      emp_id: empId,
      deleted: false,
      added: true,
      datetime: {
        value: initDateString,
        label: `-> ${formatTime(initDateString)}`,
      },
      role: {
        value: employeee?.roles[0]!,
        label: ` -> ${getRoleLabel(employeee?.roles[0]!)}`,
      },
      type: {
        value: DEFAULT_TYPE_OPTIONS[0].value,
        label: ` -> ${DEFAULT_TYPE_OPTIONS[0].label}`,
      },
      note: {
        value: "",
        label: "-",
      },
    };

    setCorredtedRecords([...correctedRecords, newRecord]); 
  };

  const handleSubmit = () => {
    if (JSON.stringify(initCorrectedRecords) ===
      JSON.stringify(correctedRecords)) 
     return; // 変更がない場合はなにもしない
    
    const key = "time_records_correction_requests";
    const storedRequests = localStorage.getItem(key);
    const parsedRequests: CorrectionRequestType[] = storedRequests
      ? JSON.parse(storedRequests)
      : [];

    // 同じ対象の修正リクエストがすでにある場合は既存のものを削除し新しいものを追加する
    const filteredRequests = parsedRequests.filter(
      (request) =>
        !(request.emp_id === empId && request.dateString === dateStringParam)
    );

    const newRequest: CorrectionRequestType = {
      emp_id: empId,
      dateString: dateStringParam,
      records: correctedRecords,
    };

    // 修正後のリクエスト情報を保存
    const updatedRequests = [...filteredRequests, newRequest];
    localStorage.setItem(key, JSON.stringify(updatedRequests));

    navigate(`/detail/${empId}/${dateStringParam}`);
  };

  const pageContent = (
    <div className="container-large flex flex-col gap-medium">
      <div className="flex justify-between">
        <div className="flex gap-medium">
          <span>従業員番号: {empId}</span>
          <span>名前: {employeee?.name}</span>
          <span>担当: {getRolesText({ roles: employeee?.roles })}</span>
        </div>
      </div>
      <div className="flex justify-between align-center">
        <h3>{formatDate(dateStringParam)}のタイムレコーダー履歴修正</h3>
        <button className="btn" onClick={() => navigate(-1)}>
          戻る
        </button>
      </div>
      <div>
        <div className="flex flex-col">
          <p className="bold">修正前</p>
          <table border={1}>
            <RecordsThead withDelete={false} />
            <tbody>
              {recordsBeforeCorrection.map((record, index) => (
                <RecordToShowTr
                  key={index}
                  record={record}
                  index={index}
                  showDiffs={false}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col justify-center">
          <p className="bold">修正後</p>
          <table border={1}>
            <RecordsThead withDelete={true} />
            <tbody>
              {correctedRecords.map((record, index) => (
                <tr key={index} className={record.deleted ? "deleted-tr" : ""}>
                  <td className="detail-logs-td">
                    <div>
                      <label htmlFor="typeCorrection" className="hidden">
                        登録種別変更
                      </label>
                      <select
                        name="typeCorrection"
                        id="typeCorrection"
                        value={record.type.value!}
                        onChange={(e) =>
                          handleCorrection(index, "modifyType", e.target.value)
                        }
                        disabled={record.deleted}
                      >
                        {DEFAULT_TYPE_OPTIONS.map((type) => (
                          <option value={type.value} key={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="detail-logs-td">
                    {record.type.value !== "clock_out" &&
                    record.type.value !== "break_begin" ? (
                      <div>
                        <label htmlFor="roleCorrection" className="hidden">
                          役割変更
                        </label>
                        <select
                          name="roleCorrection"
                          id="roleCorrection"
                          value={record.role.value!} // null許容してるが、打刻情報にはすべてroleが入っている
                          onChange={(e) =>
                            handleCorrection(
                              index,
                              "modifyRole",
                              e.target.value
                            )
                          }
                          disabled={record.deleted}
                        >
                          {employeee?.roles.map((role) => (
                            <option value={role} key={role}>
                              {
                                DEFAULT_ROLE_OPTIONS.find(
                                  (defaultOption) =>
                                    defaultOption.value === role
                                )?.label
                              }
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="detail-logs-td">
                    <div>
                      <label htmlFor="datetimeCorrection" className="hidden">
                        時刻変更
                      </label>
                      <input
                        id="datetimeCorrection"
                        type="time"
                        value={formatTime(record.datetime.value)}
                        onChange={(e) =>
                          handleCorrection(index, "modifyTime", e.target.value)
                        }
                        disabled={record.deleted}
                      />
                    </div>
                  </td>
                  <td className="detail-logs-td">
                    <div>
                      <label htmlFor="noteCorrection" className="hidden">
                        メモ変更
                      </label>
                      <input
                        id="noteCorrection"
                        type="text"
                        value={record.note.value}
                        placeholder="-"
                        onChange={(e) =>
                          handleCorrection(index, "modifyNote", e.target.value)
                        }
                        disabled={record.deleted}
                      />
                    </div>
                  </td>
                  <td>
                    <label htmlFor="delete-record-checkbox" className="hidden">
                      打刻を削除
                    </label>
                    <input
                      id="delete-record-checkbox"
                      type="checkbox"
                      onChange={() =>
                        handleCorrection(index, "deleteRecord", "")
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleAddRecordButton} className="add-record-btn">
            + 打刻を追加
          </button>
        </div>
      </div>
      <button className="btn submit-btn" type="submit" onClick={handleSubmit}>
        申請
      </button>
    </div>
  );

  return pageContent;
};

export default Correction;
