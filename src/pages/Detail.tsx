import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type {
  CorrectionRequestType,
  CorrectionTimeRecordType,
  Employee,
  MessageOnRequestType,
  TimeRecorderType,
} from "../types";
import ClockLogTableTitle from "../components/ClockLogTableTitle";
import ClockLogTable from "../components/ClockLogTable";
import getRecordsByDate from "../hooks/getRecordsByDate";
import groupRecordsById from "../hooks/groupRecordsById";
import formatTime from "../hooks/formatTime";
import getMinutes from "../hooks/getMinutes";
import getMatchedShift from "../hooks/getMatchedShift";
import formatTimeFromMillis from "../hooks/formatTimeFromMillis";
import getRolesText from "../hooks/getRolesText";
import ButtonToHome from "../components/ButtonToHome";
import getLabel from "../hooks/getLabel";
import TimeRecorderForm from "../components/TimeRecorderForm";

// 別ブランチ TODO: 差異表示、差異が10分以上だとboldになるようにする　（優先度低）
// 別ブランチ  TODO: 全体のタイムレコーダー記録再表示　総時間の際は（）書きに変更する（優先度高）

// 別ブランチ　TODO: カレンダー　当日より後は開けないようにする（優先度低）

// 別ブランチ  TODO: clocklogspage　表示順のソート（優先度低）

// 別ブランチ　TODO: getMatchedShiftとgetGroupedMatchedShiftを整理する（優先度低）
// TODO: getLabel切り離して改善する（優先度低）

// TODO: 休憩や担当切替の回数や扱いの制限どこまでにしてるか確認する（優先度中）

// TODO: datetimeを日本時間に変換する　（優先度高）
// const utcDate = new Date("2025-09-07T23:00:00.000Z");
// // 日本時間に変換して文字列化
// const jstString = utcDate.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
// console.log(jstString); // 2025/9/8 8:00:00

const Detail = () => {
  const { empId, dateStringParam } = useParams();
  const [employeee, setEmployee] = useState<Employee | null>(null);
  if (!empId) {
    return <div>従業員が選択されていません。</div>;
  }

  if (!dateStringParam) {
    return <div>対象の日付が選択されていません。</div>;
  }
  const [lastType, setLastType] = useState<string | null>(null);
  const [lastRole, setLastRole] = useState<string | null>(null);
  const navigate = useNavigate();

  // ページのURLが変わったときに従業員データを更新
  useEffect(() => {
    const storedData = localStorage.getItem("employees");
    if (storedData && empId) {
      const employees: Employee[] = JSON.parse(storedData);
      const selectedEmployee = employees.find((emp) => emp.id === empId);
      setEmployee(selectedEmployee || null);
    }
  }, []);

  const [showRoleWithColor, setShowRoleWithColor] = useState(false);
  const [showDiffs, setShowDiffs] = useState(false);
  const [selectedDateString, setSelectedDateString] = useState(dateStringParam);
  const [recordsToShow, setRecordsToShow] = useState<TimeRecorderType[]>([]);
  const [correctionRequestedRecords, setCorrectionRequestedRecords] = useState<
    CorrectionTimeRecordType[] | null
  >(null);
  const [messageOnRequest, setMessageOnRequest] =
    useState<MessageOnRequestType | null>(null);

  useEffect(() => {
    const recordsOfSelectedDate = getRecordsByDate({
      datetimeString: selectedDateString,
      key: "time_records",
    });
    const filteredRecords = recordsOfSelectedDate.filter(
      (record) => record.emp_id === empId
    );

    setRecordsToShow(filteredRecords);
  }, [lastType, lastRole, selectedDateString]);

  const groupedRecord = groupRecordsById(recordsToShow);

  const matchedShift = getMatchedShift({
    emp_id: empId,
    selectedDateString: selectedDateString,
  });

  const [differenceExceptionMessage, setDifferenceExceptionMessage] = useState<
    string | null
  >(null);

  useEffect(() => {
    const matchedShiftTypes = matchedShift.map((shift) => shift.type);
    const recordsToShowTypes = recordsToShow.map((record) => record.type);
    const areTypesEqual =
      matchedShiftTypes.length === recordsToShowTypes.length &&
      matchedShiftTypes.every(
        (type, index) => type === recordsToShowTypes[index]
      );
    if (matchedShift.length === 0) {
      setDifferenceExceptionMessage("照合するシフトが見つかりません");
    } else if (!areTypesEqual) {
      setDifferenceExceptionMessage(
        "シフトとタイムレコーダー記録が大幅に乖離しています。実際のシフトと照合することをお勧めします。"
      );
    } else {
      setDifferenceExceptionMessage(null);
    }

    const storedMessagesOnRequests = localStorage.getItem(
      "messages_on_requests"
    );
    if (storedMessagesOnRequests) {
      const parsedMessages: MessageOnRequestType[] = JSON.parse(
        storedMessagesOnRequests
      );
      const messageForRecordsToShow = parsedMessages.find(
        (message) =>
          message.emp_id === empId && message.dateString === selectedDateString
      );
      if (messageForRecordsToShow) setMessageOnRequest(messageForRecordsToShow);
    }
  }, [recordsToShow]);

  useEffect(() => {
    // 修正申請済みのものがあれば表示
    const storedCorrectionRequests = localStorage.getItem(
      "time_records_correction_requests"
    );
    if (storedCorrectionRequests) {
      const parsedRequests: CorrectionRequestType[] = JSON.parse(
        storedCorrectionRequests
      );

      if (parsedRequests.length > 0) {
        const matchedRequest = parsedRequests.find(
          (request) =>
            request.emp_id === empId &&
            request.dateString === selectedDateString
        );
        if (matchedRequest) {
          setCorrectionRequestedRecords(matchedRequest.records);
        } else {
          setCorrectionRequestedRecords(null);
        }
      }
    }
  }, [selectedDateString]);

  type differenceTextType = {
    datetimeDiff: string | null;
    roleDiff: string | null;
    typeDiff: string | null;
  };

  const getDifferenceTexts = (record: TimeRecorderType, index: number) => {
    let differenceTexts: differenceTextType = {
      datetimeDiff: null,
      roleDiff: null,
      typeDiff: null,
    };

    if (matchedShift.length === 0) return differenceTexts;

    if (record.type !== matchedShift[index].type) {
      differenceTexts.typeDiff = ` (シフトでは${getLabel(
        matchedShift[index],
        "type"
      )})`;
    }

    if (record.role !== matchedShift[index].role)
      differenceTexts.roleDiff = ` (シフトでは${getLabel(
        matchedShift[index],
        "role"
      )})`;

    const recordMinute = getMinutes(record.datetime);
    const shiftMinute = getMinutes(matchedShift[index].datetime);
    const differenceMin = shiftMinute - recordMinute;
    if (differenceMin !== 0) {
      const datetimeDiffText =
        differenceMin > 0
          ? `(シフトより${formatTimeFromMillis(differenceMin * 60 * 1000)}早い)`
          : `(シフトより${formatTimeFromMillis(
              Math.abs(differenceMin * 60 * 1000)
            )}遅い)`;
      differenceTexts.datetimeDiff = datetimeDiffText;
    }
    return differenceTexts;
  };

  const pageContent = (
    <>
      <div className="container-large flex flex-col gap-learge">
        <div className="flex justify-between">
          <div className="flex gap-medium">
            <span>従業員番号: {empId}</span>
            <span>名前: {employeee?.name}</span>
            <span>担当: {getRolesText({ roles: employeee?.roles })}</span>
          </div>
          <div className="flex gap-medium">
            <ButtonToHome />
          </div>
        </div>
        <div className="time-recorder">
          <h3 className="my-none">タイムレコーダー</h3>
          <TimeRecorderForm
            empId={empId}
            lastType={lastType}
            setLastType={setLastType}
            lastRole={lastRole}
            setLastRole={setLastRole}
          />
        </div>
        <div>
          <div className="flex justify-between align-center">
            <h3>タイムレコーダー履歴</h3>
            <button
              className="btn"
              onClick={() =>
                navigate(`/correction/${empId}/${selectedDateString}`)
              }
            >
              タイムレコーダー修正申請
            </button>
          </div>
          <ClockLogTableTitle
            selectedDateString={selectedDateString}
            setSelectedDateString={setSelectedDateString}
            showRoleWithColor={showRoleWithColor}
            setShowRoleWithColor={setShowRoleWithColor}
            showDiffs={showDiffs}
            setShowDiffs={setShowDiffs}
          />
          {showDiffs && differenceExceptionMessage && (
            <div className="difference-exception-message">
              {differenceExceptionMessage}
            </div>
          )}
          <table border={1}>
            <thead>
              <tr>
                <th className="detail-logs-th">登録種別</th>
                <th className="detail-logs-th">担当</th>
                <th className="detail-logs-th">時刻</th>
                <th className="detail-logs-th">メモ</th>
              </tr>
            </thead>
            <tbody>
              {recordsToShow.map((record, index) => (
                <tr key={index}>
                  <td className="detail-logs-td">
                    <div>
                      <span>{getLabel(record, "type")}</span>
                      {showDiffs && (
                        <span className="differenceText">
                          {getDifferenceTexts(record, index).typeDiff}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="detail-logs-td">
                    {record.type !== "clock_out" &&
                    record.type !== "break_begin" ? (
                      <div>
                        <span>{getLabel(record, "role")}</span>
                        {showDiffs && (
                          <span className="differenceText">
                            {getDifferenceTexts(record, index).roleDiff}
                          </span>
                        )}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="detail-logs-td">
                    <div className="flex gap-small justify-center align-baseline">
                      <span>{formatTime(record.datetime)}</span>
                      {showDiffs && (
                        <span className="differenceText">
                          {getDifferenceTexts(record, index).datetimeDiff}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="detail-logs-td">{record.note || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ClockLogTable
            groupedRecords={groupedRecord}
            selectedDateString={selectedDateString}
            showRoleWithColor={showRoleWithColor}
            showDiffs={showDiffs}
            withName={false}
          />
          {messageOnRequest && (
            <p className="message-on-request text-center">{`${messageOnRequest.message} 店長からのコメント：${messageOnRequest.comment}`}</p>
          )}
        </div>
        {correctionRequestedRecords && (
          <div>
            <h3>修正申請中のタイムレコーダー履歴</h3>
            <table border={1}>
              <thead>
                <tr>
                  <th className="detail-logs-th">登録種別</th>
                  <th className="detail-logs-th">担当</th>
                  <th className="detail-logs-th">時刻</th>
                  <th className="detail-logs-th">メモ</th>
                </tr>
              </thead>
              <tbody>
                {correctionRequestedRecords.map((record, index) => (
                  <tr key={index}>
                    <td className="detail-logs-td">
                      {getLabel(record, "type")}
                    </td>
                    <td
                      className={
                        record.role.label
                          ? "detail-logs-td modified-record-td"
                          : "detail-logs-td"
                      }
                    >
                      {record.type !== "clock_out" &&
                      record.type !== "break_begin" ? (
                        <span>{getLabel(record, "role")}</span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td
                      className={
                        record.datetime.label
                          ? "detail-logs-td modified-record-td"
                          : "detail-logs-td"
                      }
                    >
                      {formatTime(record.datetime.value)}
                    </td>
                    <td
                      className={
                        record.note.label
                          ? "detail-logs-td modified-record-td"
                          : "detail-logs-td"
                      }
                    >
                      {record.note.value || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );

  return pageContent;
};

export default Detail;
