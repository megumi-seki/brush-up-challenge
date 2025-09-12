import { useEffect, useState } from "react";
import type { CorrectionRequestType } from "../types";
import getEmpNameById from "../hooks/getEmpNameById";
import formatDate from "../hooks/formatDate";
import getLabel from "../hooks/getLabel";
import formatTime from "../hooks/formatTime";

const CorrectionCheck = () => {
  const [storedCorrectionRequests, setStoredCorrectionRequests] = useState<
    CorrectionRequestType[]
  >([]);

  useEffect(() => {
    const storedCorrectionRequestsData = localStorage.getItem(
      "time_records_correction_requests"
    );
    if (storedCorrectionRequestsData) {
      const parsedRequests: CorrectionRequestType[] = JSON.parse(
        storedCorrectionRequestsData
      );
      setStoredCorrectionRequests(parsedRequests);
    } else {
      setStoredCorrectionRequests([]);
    }
  }, []);

  const pageContent = (
    <div className="container-large flex flex-col gap-medium">
      <h3>タイムレコーダー履歴申請</h3>
      {storedCorrectionRequests.length === 0 ? (
        <div>修正申請中のタイムレコーダー履歴はありません</div>
      ) : (
        storedCorrectionRequests.map((request) => (
          <>
            <div className="flex justify-between">
              <div className="flex gap-medium">
                <span>従業員番号: {request.emp_id}</span>
                <span>名前: {getEmpNameById(request.emp_id)}</span>
                <span>日付: {formatDate(request.dateString)}</span>
              </div>
            </div>
            <div>
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
                      <td>
                        {record.type.value !== "clock_out" &&
                        record.type.value !== "break_begin" ? (
                          <span>{getLabel(record, "role")}</span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>{formatTime(record.datetime.value)}</td>
                      <td>{record.note.value || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ))
      )}
    </div>
  );

  return pageContent;
};

export default CorrectionCheck;
