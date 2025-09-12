import { useState } from "react";
import formatDate from "../hooks/formatDate";
import formatTime from "../hooks/formatTime";
import getEmpNameById from "../hooks/getEmpNameById";
import getLabel from "../hooks/getLabel";
import type { CorrectionRequestType } from "../types";

type CorrectionCheckTableProps = {
  tabelId: string;
  request: CorrectionRequestType;
};

const CorrectionCheckTable = ({
  tabelId,
  request,
}: CorrectionCheckTableProps) => {
  const [approveSelected, setApproveSelected] = useState(true);

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
          <thead>
            <tr>
              <th className="detail-logs-th">登録種別</th>
              <th className="detail-logs-th">担当</th>
              <th className="detail-logs-th">時刻</th>
              <th className="detail-logs-th">メモ</th>
            </tr>
          </thead>
          <tbody>
            {request.records.map((record, index) => (
              <tr key={index}>
                <td>{getLabel(record, "type")}</td>
                <td className={record.role.label ? "modified-record-td" : ""}>
                  {record.type !== "clock_out" &&
                  record.type !== "break_begin" ? (
                    <span>
                      {record.role.label ??
                        getLabel(record.role.value!, "role")}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td
                  className={record.datetime.label ? "modified-record-td" : ""}
                >
                  {record.datetime.label ?? formatTime(record.datetime.value)}
                </td>
                <td className={record.note.label ? "modified-record-td" : ""}>
                  {record.note.label ?? (record.note.value || "-")}
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
            />
          </div>
          <button className="approve-or-deny-submit-btn">送信</button>
        </div>
      </div>
    </div>
  );
};

export default CorrectionCheckTable;
