import { useEffect, useState } from "react";
import type { CorrectionRequestType } from "../types";
import ButtonToHome from "../components/ButtonToHome";
import ButtonToClockLogs from "../components/ButtonToClockLogs";
import CorrectionCheckTable from "../components/CorrectionCheckTable";

// タイムレコーダー履歴確認ページ
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
      <div className="flex justify-between align-center">
        <h3>タイムレコーダー履歴申請</h3>
        <div className="flex gap-medium">
          <ButtonToHome />
          <ButtonToClockLogs />
        </div>
      </div>
      {storedCorrectionRequests.length === 0 ? (
        <div>修正申請中のタイムレコーダー履歴はありません</div>
      ) : (
        storedCorrectionRequests.map((request) => (
          <CorrectionCheckTable
            key={`${request.emp_id}-${request.dateString}`}
            tabelId={`${request.emp_id}-${request.dateString}`}
            request={request}
            setStoredCorrectionRequests={setStoredCorrectionRequests}
          />
        ))
      )}
    </div>
  );

  return pageContent;
};

export default CorrectionCheck;
