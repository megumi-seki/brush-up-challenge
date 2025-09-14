import formatTime from "../hooks/formatTime";
import formatTimeFromMillis from "../hooks/formatTimeFromMillis";
import getMinutes from "../hooks/getMinutes";
import getRoleLabel from "../hooks/getRoleLabel";
import getTypeLabel from "../hooks/getTypeLabel";
import type { TimeRecorderType } from "../types";

type RecordToShowTrProps = {
  record: TimeRecorderType;
  index: number;
  showDiffs: boolean;
  matchedShift?: TimeRecorderType[];
};

type differenceTextType = {
  datetimeDiff: string | null;
  roleDiff: string | null;
  typeDiff: string | null;
};

const RecordToShowTr = ({
  record,
  index,
  showDiffs,
  matchedShift,
}: RecordToShowTrProps) => {
  const getDifferenceTexts = (record: TimeRecorderType, index: number) => {
    let differenceTexts: differenceTextType = {
      datetimeDiff: null,
      roleDiff: null,
      typeDiff: null,
    };

    if (!matchedShift || matchedShift.length === 0) return differenceTexts;
    if (index > matchedShift.length - 1) return differenceTexts;

    if (record.type !== matchedShift[index].type) {
      differenceTexts.typeDiff = ` (シフトでは${getTypeLabel(
        matchedShift[index]
      )})`;
    }

    if (record.role !== matchedShift[index].role)
      differenceTexts.roleDiff = ` (シフトでは${getRoleLabel(
        matchedShift[index]
      )})`;

    const recordMinute = getMinutes(record.datetime);
    const shiftMinute = getMinutes(matchedShift[index].datetime);
    const differenceMin = shiftMinute - recordMinute;
    if (differenceMin !== 0) {
      const datetimeDiffText =
        differenceMin > 0
          ? `(シフトより${formatTimeFromMillis(differenceMin * 60 * 1000)}早い)`
          : `(シフトより${formatTimeFromMillis(
              Math.abs(differenceMin * 60 * 1000)
            )}遅い)`;
      differenceTexts.datetimeDiff = datetimeDiffText;
    }
    return differenceTexts;
  };

  return (
    <tr key={index}>
      <td className="detail-logs-td">
        <div>
          <span>{getTypeLabel(record)}</span>
          {showDiffs && (
            <span className="differenceText">
              {getDifferenceTexts(record, index).typeDiff}
            </span>
          )}
        </div>
      </td>
      <td className="detail-logs-td">
        {record.type !== "clock_out" && record.type !== "break_begin" ? (
          <div>
            <span>{getRoleLabel(record)}</span>
            {showDiffs && (
              <span className="differenceText">
                {getDifferenceTexts(record, index).roleDiff}
              </span>
            )}
          </div>
        ) : (
          "-"
        )}
      </td>
      <td className="detail-logs-td">
        <div className="flex gap-small justify-center align-baseline">
          <span>{formatTime(record.datetime)}</span>
          {showDiffs && (
            <span className="differenceText">
              {getDifferenceTexts(record, index).datetimeDiff}
            </span>
          )}
        </div>
      </td>
      <td className="detail-logs-td">{record.note || "-"}</td>
    </tr>
  );
};

export default RecordToShowTr;
