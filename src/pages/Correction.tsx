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
import { DEFAULT_ROLE_OPTIONS, TIMEZONE } from "../constants/appConfig";
import getRoleLabel from "../hooks/getRoleLabel";
import getTypeLabel from "../hooks/getTypeLabel";
import formatDateToJst from "../hooks/formatDateToJst";

const Correction = () => {
  const { empId, dateStringParam } = useParams();
  const [employeee, setEmployee] = useState<Employee | null>(null);
  const navigate = useNavigate();
  if (!empId) {
    return <div>従業員が選択されていません。</div>;
  } else if (!dateStringParam) {
    return <div>修正対象の日付が選択されていません。</div>;
  }

  // ページのURLが変わったときに従業員データを更新
  useEffect(() => {
    const storedData = localStorage.getItem("employees");
    if (storedData && empId) {
      const employees: Employee[] = JSON.parse(storedData);
      const selectedEmployee = employees.find((emp) => emp.id === empId);
      setEmployee(selectedEmployee || null);
    }
  }, [empId]);

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
      type: record.type,
      note: { value: record.note, label: null },
    }));

  const [correctedRecords, setCorredtedRecords] =
    useState<CorrectionTimeRecordType[]>(initCorrectedRecords);

  type CorrectionActions =
    | "modifyRole"
    | "modifyTime"
    | "modifyNote"
    | "deleteRecord"
    | "addRecord";
  const handleCorrection = (
    index: number,
    action: CorrectionActions,
    value: string
  ) => {
    const updatedRecords = [...correctedRecords];

    switch (action) {
      case "modifyRole":
        const initRole = initCorrectedRecords[index].role.value;

        updatedRecords[index].role = {
          value,
          label: `${getRoleLabel(initRole!)} -> ${getRoleLabel(value)}`,
        };
        break;
      case "modifyTime":
        const utcInitTime = new Date(
          initCorrectedRecords[index].datetime.value
        );
        const initTime = toZonedTime(utcInitTime, TIMEZONE);
        const formattedInitTime = formatTime(initTime);

        const [hours, minutes] = value.split(":");
        const utcUpdatedDatetime = new Date(
          updatedRecords[index].datetime.value
        );
        const updatedDatetime = toZonedTime(utcUpdatedDatetime, TIMEZONE);
        updatedDatetime.setHours(Number(hours), Number(minutes));
        const updatedDatetimeString = formatDateToJst(updatedDatetime);
        updatedRecords[index].datetime = {
          value: updatedDatetimeString,
          label: `${formattedInitTime} -> ${formatTime(updatedDatetimeString)}`,
        };
        break;
      case "modifyNote":
        const initNote = initCorrectedRecords[index].note.value;

        updatedRecords[index].note = {
          value,
          label: `${initNote} -> ${value}`,
        };
        break;
      case "deleteRecord":
        updatedRecords[index].deleted = !updatedRecords[index].deleted;
        break;
      case "addRecord":
        break;
      default:
        break;
    }

    setCorredtedRecords(updatedRecords);
  };

  const handleSubmit = () => {
    if (
      JSON.stringify(recordsBeforeCorrection) ===
      JSON.stringify(correctedRecords)
    )
      return;

    const key = "time_records_correction_requests";
    const storedRequests = localStorage.getItem(key);
    const parsedRequests: CorrectionRequestType[] = storedRequests
      ? JSON.parse(storedRequests)
      : [];

    // 修正対象の日付と従業員IDに基づいて、元のレコードを除外
    const filteredRequests = parsedRequests.filter(
      (request) =>
        !(request.emp_id === empId && request.dateString === dateStringParam)
    );

    const newRequest: CorrectionRequestType = {
      emp_id: empId,
      dateString: dateStringParam,
      records: correctedRecords,
    };

    // 修正後のレコードを追加
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
        <div>
          <p className="bold">修正後</p>
          <table border={1}>
            <RecordsThead withDelete={true} />
            <tbody>
              {correctedRecords.map((record, index) => (
                <>
                  <tr key={index}>
                    <td className="detail-logs-td">
                      <span>{getTypeLabel(record)}</span>
                    </td>
                    <td className="detail-logs-td">
                      {record.type !== "clock_out" &&
                      record.type !== "break_begin" ? (
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
                            handleCorrection(
                              index,
                              "modifyTime",
                              e.target.value
                            )
                          }
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
                            handleCorrection(
                              index,
                              "modifyNote",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <label
                        htmlFor="delete-record-checkbox"
                        className="hidden"
                      >
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
                </>
              ))}
            </tbody>
          </table>
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
