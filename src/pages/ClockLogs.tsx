import getRecordsByDate from "../hooks/getRecordsByDate";
import groupRecordsById from "../hooks/groupRecordsById";
import { useEffect, useState } from "react";
import ClockLogTableTitle from "../components/ClockLogTableTitle";
import ClockLogTable from "../components/ClockLogTable";
import ButtonToHome from "../components/ButtonToHome";
import getMatchedShift from "../hooks/getMatchedShift";
import ButtonToCorrectionCheck from "../components/ButtonToCorrectionCheck";
import toDatestring from "../hooks/toDatestring";
import { NOW } from "../constants/appConfig";

const ClockLogs = () => {
  const [showRoleWithColor, setShowRoleWithColor] = useState(false);
  const [showDiffs, setShowDiffs] = useState(false);
  const [selectedDateString, setSelectedDateString] = useState(
    toDatestring(NOW)
  );
  const recordsOfDate = getRecordsByDate({
    datetimeString: selectedDateString,
    key: "time_records",
  });
  const groupedRecords = groupRecordsById(recordsOfDate);

  const matchedShift = getMatchedShift({
    selectedDateString: selectedDateString,
  });

  const [differenceExceptionMessage, setDifferenceExceptionMessage] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (matchedShift.length === 0) {
      setDifferenceExceptionMessage("照合するシフトが見つかりません");
    } else {
      setDifferenceExceptionMessage(null);
    }
  }, [matchedShift]);

  const pageContent = (
    <div className="container-large">
      <div className="flex justify-between align-center">
        <h3>タイムレコーダー履歴</h3>
        <div className="flex gap-medium">
          <ButtonToHome />
          <ButtonToCorrectionCheck />
        </div>
      </div>
      <ClockLogTableTitle
        selectedDateString={selectedDateString}
        setSelectedDateString={setSelectedDateString}
        showRoleWithColor={showRoleWithColor}
        setShowRoleWithColor={setShowRoleWithColor}
        showDiffs={showDiffs}
        setShowDiffs={setShowDiffs}
      />
      <div>
        {showDiffs && differenceExceptionMessage && (
          <div className="difference-exception-message">
            {differenceExceptionMessage}
          </div>
        )}
        <ClockLogTable
          groupedRecords={groupedRecords}
          selectedDateString={selectedDateString}
          showRoleWithColor={showRoleWithColor}
          showDiffs={showDiffs}
          withName={true}
        />
      </div>
    </div>
  );

  return pageContent;
};

export default ClockLogs;
