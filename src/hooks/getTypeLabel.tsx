import { DEFAULT_TYPE_OPTIONS } from "../constants/appConfig";
import type { CorrectionTimeRecordType, TimeRecorderType } from "../types";

const getTypeLabel = (
  record: TimeRecorderType | CorrectionTimeRecordType | string
) => {
  let value: string | null = null;

  if (typeof record === "string") {
    value = record;
  } else if (
    typeof record.role === "object" &&
    record.role !== null &&
    "value" in record.role
  ) {
    value = record.role.value;
  } else {
    value = record.role;
  }

  const label = DEFAULT_TYPE_OPTIONS.find(
    (option) => option.value === value
  )?.label;

  return label;
};

export default getTypeLabel;
