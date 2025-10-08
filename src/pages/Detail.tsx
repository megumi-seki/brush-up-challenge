import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type {
  CorrectionRequestType,
  CorrectionTimeRecordType,
  Employee,
  GroupedTimeRecorderType,
  MessageOnRequestType,
  TimeRecorderType,
} from "../types";
import ClockLogTableTitle from "../components/ClockLogTableTitle";
import ClockLogTable from "../components/ClockLogTable";
import getRecordsByDate from "../hooks/getRecordsByDate";
import groupRecordsById from "../hooks/groupRecordsById";
import getRolesText from "../hooks/getRolesText";
import ButtonToHome from "../components/ButtonToHome";
import TimeRecorderForm from "../components/TimeRecorderForm";
import CorrectionRequestedRecordTr from "../components/CorrectionRequestedRecordTr";
import getMatchedShift from "../hooks/getMatchedShift";
import RecordToShowTr from "../components/RecordToShowTr";
import RecordsThead from "../components/RecordsThead";

// 個人詳細ページ
const Detail = () => {
  const { empId, dateStringParam } = useParams();
  const [employeee, setEmployee] = useState<Employee | null>(null);
  if (!empId) return <div>従業員が選択されていません。</div>;
  if (!dateStringParam) return <div>対象の日付が選択されていません。</div>;

  const [lastType, setLastType] = useState<string | null>(null);
  const [lastRole, setLastRole] = useState<string | null>(null);
  const [showRoleWithColor, setShowRoleWithColor] = useState(false);
  const [showDiffs, setShowDiffs] = useState(false);
  const [selectedDateString, setSelectedDateString] = useState(dateStringParam);

  const [recordsToShow, setRecordsToShow] = useState<TimeRecorderType[]>([]);
  const [groupedRecords, setGroupedRecords] = useState<
    GroupedTimeRecorderType[] | null
  >(null);
  const [matchedShift, setMatchedShift] = useState<TimeRecorderType[]>([]);

  const [correctionRequestedRecords, setCorrectionRequestedRecords] = useState<
    CorrectionTimeRecordType[] | null
  >(null);
  const [messageOnRequest, setMessageOnRequest] =
    useState<MessageOnRequestType | null>(null);
  const [differenceExceptionMessage, setDifferenceExceptionMessage] = useState<
    string | null
  >(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem("employees");
    if (storedData && empId) {
      const employees: Employee[] = JSON.parse(storedData);
      const selectedEmployee = employees.find((emp) => emp.id === empId);
      setEmployee(selectedEmployee || null);
    }
  }, [empId]);

  // 打刻された時（最後の登録種別/担当が変わった時）、または日付が変わった時に表示データを更新
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

  useEffect(() => {
    // 表示データが変わった時にグルーピングされたデータ・対応シフトを更新
    setGroupedRecords(groupRecordsById(recordsToShow));
    const matchedShift = getMatchedShift({
    emp_id: empId,
    selectedDateString: selectedDateString,
  });
    setMatchedShift(matchedShift);
    
    const matchedShiftTypes = matchedShift.map((shift) => shift.type);
    const recordsToShowTypes = recordsToShow.map((record) => record.type);
    const areTypesEqual =
      matchedShiftTypes.length === recordsToShowTypes.length &&
      matchedShiftTypes.every(
        (type, index) => type === recordsToShowTypes[index]
      );
    
    // 表示データと対応シフトを比較し例外メッセージを更新
    if (matchedShift.length === 0) {
      setDifferenceExceptionMessage("照合するシフトが見つかりません");
    } else if (!areTypesEqual) {
      setDifferenceExceptionMessage(
        "シフトとタイムレコーダー記録が大幅に乖離しています。実際のシフトと照合することをお勧めします。"
      );
    } else {
      setDifferenceExceptionMessage(null);
    }
  }, [recordsToShow]);

  useEffect(() => {
    // 修正申請中であればその内容をセット
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

    // 修正申請に対する店長からのコメントがあればセット
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
      else setMessageOnRequest(null);
    } else {
      setMessageOnRequest(null);
    }
  }, [selectedDateString]);

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
            <RecordsThead withDelete={false} />
            <tbody>
              {recordsToShow.map((record, index) => (
                <RecordToShowTr
                  key={index}
                  record={record}
                  index={index}
                  showDiffs={showDiffs}
                  matchedShift={matchedShift}
                />
              ))}
            </tbody>
          </table>
          {groupedRecords && (
            <ClockLogTable
              groupedRecords={groupedRecords}
              selectedDateString={selectedDateString}
              showRoleWithColor={showRoleWithColor}
              showDiffs={showDiffs}
              withName={false}
            />
          )}
          {!correctionRequestedRecords && messageOnRequest && (
            <p className="message-on-request text-center">{`${messageOnRequest.message} 店長からのコメント：${messageOnRequest.comment}`}</p>
          )}
        </div>
        {correctionRequestedRecords && (
          <div>
            <h3>修正申請中のタイムレコーダー履歴</h3>
            <table border={1}>
              <RecordsThead withDelete={true} />
              <tbody>
                {correctionRequestedRecords.map((record, index) => (
                  <CorrectionRequestedRecordTr
                    key={`${record.type}-${index}`}
                    record={record}
                    index={index}
                  />
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
