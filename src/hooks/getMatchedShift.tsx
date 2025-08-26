import getRecordsByDate from "./getRecordsByDate";
import groupRecordsById from "./groupRecordsById";

type matchedShiftProps = {
  selectedDateString: string;
  emp_id: string;
};

const getMatchedShift = ({ selectedDateString, emp_id }: matchedShiftProps) => {
  const shiftOfDate = getRecordsByDate({
    datetimeString: selectedDateString,
    key: "shift",
  });
  const groupedshift = groupRecordsById(shiftOfDate);

  return groupedshift.find((shift) => shift.emp_id === emp_id);
};

export default getMatchedShift;
