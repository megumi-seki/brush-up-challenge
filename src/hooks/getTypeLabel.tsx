import { DEFAULT_TYPE_OPTIONS } from "../constants/appConfig";
import type { CorrectionTimeRecordType, TimeRecorderType } from "../types";

const getTypeLabel = (
  record: TimeRecorderType | CorrectionTimeRecordType | string
) => {
  let value: string | null = null;

  if (typeof record === "string") { // 打刻種別の文字列が直接渡された場合
    value = record;
  } else if ( // CorrectionTimeRecordTypeの場合
    typeof record.type === "object" &&
    record.type !== null &&
    "value" in record.type
  ) {
    value = record.type.value;
  } else { // TimeRecorderTypeの場合
    value = record.type;
  }

  const label = DEFAULT_TYPE_OPTIONS.find(
    (option) => option.value === value
  )?.label;

  return label;
};

export default getTypeLabel;
