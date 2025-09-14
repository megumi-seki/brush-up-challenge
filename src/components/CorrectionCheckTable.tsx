import { useState } from "react";
import formatDate from "../hooks/formatDate";
import formatTime from "../hooks/formatTime";
import getEmpNameById from "../hooks/getEmpNameById";
import type {
  CorrectionRequestType,
  MessageOnRequestType,
  TimeRecorderType,
} from "../types";
import getTypeLabel from "../hooks/getTypeLabel";
import getRoleLabel from "../hooks/getRoleLabel";
import RecordsThead from "./RecordsThead";

type CorrectionCheckTableProps = {
  tabelId: string;
  request: CorrectionRequestType;
  setStoredCorrectionRequests: React.Dispatch<
    React.SetStateAction<CorrectionRequestType[]>
  >;
};

const CorrectionCheckTable = ({
  tabelId,
  request,
  setStoredCorrectionRequests,
}: CorrectionCheckTableProps) => {
  const [approveSelected, setApproveSelected] = useState(true);
  const [comment, setComment] = useState("");

  const handleOnChangeComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    // 承認された場合のみタイムレコーダー履歴を更新
    if (approveSelected) {
      const storedRecords = localStorage.getItem("time_records");
      if (!storedRecords) return;
      const parsedRecords: TimeRecorderType[] = JSON.parse(storedRecords);
      const filteredRecords = parsedRecords.filter((record) => {
        const recordDateString = record.datetime.split("T")[0];
        return !(
          record.emp_id === request.emp_id &&
          recordDateString === request.dateString
        );
      });

      const filteredRequestedRecords = request.records.filter(
        (record) => !record.deleted
      );

      const rowRequestedRecords: TimeRecorderType[] =
        filteredRequestedRecords.map((record) => ({
          emp_id: record.emp_id,
          datetime: record.datetime.value,
          role: record.role.value,
          type: record.type.value,
          note: record.note.value,
        }));

      const sortedRequestedRecords = rowRequestedRecords.sort(
        (a, b) =>
          new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
      );

      const adjustedRequestedRecords = sortedRequestedRecords.map(
        (record, index) => {
          if (
            index > 0 &&
            (record.type === "break_begin" || record.type === "clock_out")
          ) {
            return {
              ...record,
              role: rowRequestedRecords[index - 1].role,
            };
          } else return record;
        }
      );

      const updatedRecords = [...filteredRecords, ...adjustedRequestedRecords];
      localStorage.setItem("time_records", JSON.stringify(updatedRecords));
    }

    // 変更申請を削除
    const storedCorrectionRequests = localStorage.getItem(
      "time_records_correction_requests"
    );
    if (!storedCorrectionRequests) return;
    const parsedRequests: CorrectionRequestType[] = JSON.parse(
      storedCorrectionRequests
    );
    const filteredRequests = parsedRequests.filter(
      (req) =>
        !(
          req.emp_id === request.emp_id && req.dateString === request.dateString
        )
    );
    localStorage.setItem(
      "time_records_correction_requests",
      JSON.stringify(filteredRequests)
    );
    setStoredCorrectionRequests(filteredRequests);

    // 修正申請処理に関するメッセージを更新
    const storedMessagesOnRequests = localStorage.getItem(
      "messages_on_requests"
    );
    const parsedMessagesOnRequests: MessageOnRequestType[] =
      storedMessagesOnRequests ? JSON.parse(storedMessagesOnRequests) : [];
    const filteredMessages = parsedMessagesOnRequests.filter(
      (message) =>
        !(
          message.emp_id === request.emp_id &&
          message.dateString === request.dateString
        )
    );
    const message = approveSelected
      ? "タイムレコーダー修正申請が承認されました。"
      : "タイムレコーダー修正申請が拒否されました。";
    const newMessage: MessageOnRequestType = {
      emp_id: request.emp_id,
      dateString: request.dateString,
      message: message,
      comment: comment,
    };
    const updatedMessagesOnRequests = [...filteredMessages, newMessage];
    localStorage.setItem(
      "messages_on_requests",
      JSON.stringify(updatedMessagesOnRequests)
    );
  };

  return (
    <div key={tabelId}>
      <div className="flex justify-between">
        <div className="flex gap-medium">
          <span>従業員番号: {request.emp_id}</span>
          <span>名前: {getEmpNameById(request.emp_id)}</span>
          <span>日付: {formatDate(request.dateString)}</span>
        </div>
      </div>
      <div className="correction-check-table-container">
        <table border={1}>
          <RecordsThead withDelete={true} />
          <tbody>
            {request.records.map((record, index) => (
              <tr
                key={index}
                className={
                  record.deleted
                    ? "deleted-tr"
                    : record.added
                    ? "modified-record-td"
                    : ""
                }
              >
                <td>
                  {record.added
                    ? `(追加) -> ${getTypeLabel(record)}`
                    : getTypeLabel(record)}
                </td>
                <td
                  className={
                    !record.deleted && record.role.label
                      ? "modified-record-td"
                      : ""
                  }
                >
                  {record.type.value !== "clock_out" &&
                  record.type.value !== "break_begin" ? (
                    <span>{record.role.label ?? getRoleLabel(record)}</span>
                  ) : (
                    "-"
                  )}
                </td>
                <td
                  className={
                    !record.deleted && record.datetime.label
                      ? "modified-record-td"
                      : ""
                  }
                >
                  {record.datetime.label ?? formatTime(record.datetime.value)}
                </td>
                <td
                  className={
                    !record.deleted && record.note.label
                      ? "modified-record-td"
                      : ""
                  }
                >
                  {record.note.label ?? (record.note.value || "-")}
                </td>
                <td>
                  <div>
                    <label htmlFor="delete-record-checkbox" className="hidden">
                      打刻を削除
                    </label>
                    <input
                      id="delete-record-checkbox"
                      disabled={true}
                      type="checkbox"
                      checked={record.deleted}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="correction-approve-deny-container">
          <div className="flex justify-center gap-medium">
            <label
              htmlFor={`${tabelId}-correction-approve`}
              className={`approve-deny-label correction-approve-label ${
                approveSelected ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name={`${tabelId}-correction-approve-or-deny`}
                id={`${tabelId}-correction-approve`}
                value="approve"
                checked={approveSelected}
                onChange={() => setApproveSelected(true)}
              />
              承認
            </label>
            <label
              htmlFor={`${tabelId}-correction-deny`}
              className={`approve-deny-label correction-deny-label ${
                !approveSelected ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name={`${tabelId}-correction-approve-or-deny`}
                id={`${tabelId}-correction-deny`}
                value="deny"
                checked={!approveSelected}
                onChange={() => setApproveSelected(false)}
              />
              拒否
            </label>
          </div>
          <div>
            <label
              htmlFor={`${tabelId}-approve-or-deny-comment`}
              className="hidden"
            >
              コメント
            </label>
            <input
              id={`${tabelId}-approve-or-deny-comment`}
              type="text"
              className="approve-or-deny-comment"
              placeholder="コメント/拒否理由"
              onChange={handleOnChangeComment}
              value={comment}
            />
          </div>
          <button className="approve-or-deny-submit-btn" onClick={handleSubmit}>
            送信
          </button>
        </div>
      </div>
    </div>
  );
};

export default CorrectionCheckTable;
