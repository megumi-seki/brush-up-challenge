import formatTimeFromMillis from "./formatTimeFromMillis";
import getGroupedMatchedShift from "./getGroupedMatchedShift";

type getDiffsTitleFromMillisProps = {
  emp_id: string;
  recordDurationMillis: number | null;
  key: "work_duration_millis" | "break_duration_millis";
  selectedDateString: string;
};

// ミリセカンドからシフトとの差分ラベルを作成
const getDiffsTitleFromMillis = ({
  emp_id,
  recordDurationMillis,
  key,
  selectedDateString,
}: getDiffsTitleFromMillisProps) => {
  const matchedShift = getGroupedMatchedShift({
    emp_id: emp_id,
    selectedDateString: selectedDateString,
  });

  const shiftDurationMillis = matchedShift?.[key];
  if (!shiftDurationMillis || !recordDurationMillis) return undefined;

  const diffs = shiftDurationMillis - recordDurationMillis;
  if (diffs === 0) return undefined;
  else if (diffs < 0) {
    const millis = Math.abs(diffs);
    const formattedTime = formatTimeFromMillis(millis);
    return `シフトより${formattedTime}長い`;
  } else {
    const formattedTime = formatTimeFromMillis(diffs);
    return `シフトより${formattedTime}短い`;
  }
};

export default getDiffsTitleFromMillis;
