import formatTime from "../hooks/formatTime";
import getLabel from "../hooks/getLabel";
import type { CorrectionTimeRecordType } from "../types";

type CorrectionRequestedRecordTrProps = {
  record: CorrectionTimeRecordType;
  index: number;
};

const CorrectionRequestedRecordTr = ({
  record,
  index,
}: CorrectionRequestedRecordTrProps) => {
  return (
    <tr key={index}>
      <td className="detail-logs-td">{getLabel(record, "type")}</td>
      <td
        className={
          record.role.label
            ? "detail-logs-td modified-record-td"
            : "detail-logs-td"
        }
      >
        {record.type !== "clock_out" && record.type !== "break_begin" ? (
          <span>{getLabel(record, "role")}</span>
        ) : (
          "-"
        )}
      </td>
      <td
        className={
          record.datetime.label
            ? "detail-logs-td modified-record-td"
            : "detail-logs-td"
        }
      >
        {formatTime(record.datetime.value)}
      </td>
      <td
        className={
          record.note.label
            ? "detail-logs-td modified-record-td"
            : "detail-logs-td"
        }
      >
        {record.note.value || "-"}
      </td>
    </tr>
  );
};

export default CorrectionRequestedRecordTr;
