import formatTime from "../hooks/formatTime";
import getRoleLabel from "../hooks/getRoleLabel";
import getTypeLabel from "../hooks/getTypeLabel";
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
    <tr
      key={index}
      className={
        record.deleted ? "deleted-tr" : record.added ? "modified-record-td" : ""
      }
    >
      <td
        className={
          !record.deleted && record.role.label
            ? "detail-logs-td modified-record-td"
            : "detail-logs-td"
        }
      >
        {record.added ? `(追加) ${getTypeLabel(record)}` : getTypeLabel(record)}
      </td>
      <td
        className={
          !record.deleted && record.role.label
            ? "detail-logs-td modified-record-td"
            : "detail-logs-td"
        }
      >
        {record.type.value !== "clock_out" &&
        record.type.value !== "break_begin" ? (
          <span>{getRoleLabel(record)}</span>
        ) : (
          "-"
        )}
      </td>
      <td
        className={
          !record.deleted && record.datetime.label
            ? "detail-logs-td modified-record-td"
            : "detail-logs-td"
        }
      >
        {formatTime(record.datetime.value)}
      </td>
      <td
        className={
          !record.deleted && record.note.label
            ? "detail-logs-td modified-record-td"
            : "detail-logs-td"
        }
      >
        {record.note.value || "-"}
      </td>
      <td>
        <div>
          <label htmlFor="delete-record-checkbox" className="hidden">
            打刻を削除
          </label>
          <input
            id="delete-record-checkbox"
            disabled={true}
            type="checkbox"
            checked={record.deleted}
          />
        </div>
      </td>
    </tr>
  );
};

export default CorrectionRequestedRecordTr;
