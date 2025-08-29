import { useNavigate } from "react-router-dom";
import getRecordsByDate from "../hooks/getRecordsByDate";
import groupRecordsById from "../hooks/groupRecordsById";
import { useState } from "react";
import ClockLogTableTitle from "../components/ClockLogTableTitle";
import ClockLogTable from "../components/ClockLogTable";
import ButtonToHome from "../components/ButtonToHome";

const ClockLogs = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [showRoleWithColor, setShowRoleWithColor] = useState(false);
  const [showDiffs, setShowDiffs] = useState(false);
  const [selectedDateString, setSelectedDateString] = useState(
    today.toISOString().split("T")[0]
  );
  const recordsOfDate = getRecordsByDate({
    datetimeString: selectedDateString,
    key: "time_records",
  });
  const groupedRecords = groupRecordsById(recordsOfDate);

  const pageContent = (
    <div className="container-large">
      <ClockLogTableTitle
        selectedDateString={selectedDateString}
        setSelectedDateString={setSelectedDateString}
        showRoleWithColor={showRoleWithColor}
        setShowRoleWithColor={setShowRoleWithColor}
        showDiffs={showDiffs}
        setShowDiffs={setShowDiffs}
      />
      <ClockLogTable
        groupedRecords={groupedRecords}
        selectedDateString={selectedDateString}
        showRoleWithColor={showRoleWithColor}
        showDiffs={showDiffs}
        withName={true}
      />
      <ButtonToHome />
    </div>
  );

  return pageContent;
};

export default ClockLogs;
