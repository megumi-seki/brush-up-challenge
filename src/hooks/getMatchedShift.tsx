import getRecordsByDate from "./getRecordsByDate";

type getMatchedShiftProps = {
  emp_id?: string;
  selectedDateString: string;
};

const getMatchedShift = ({
  emp_id,
  selectedDateString,
}: getMatchedShiftProps) => {
  const shiftOfDate = getRecordsByDate({
    datetimeString: selectedDateString,
    key: "shift",
  });

  if (!emp_id) return shiftOfDate;
  return shiftOfDate.filter((shift) => shift.emp_id === emp_id);
};

export default getMatchedShift;
