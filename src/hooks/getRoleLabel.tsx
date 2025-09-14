import { DEFAULT_ROLE_OPTIONS } from "../constants/appConfig";
import type { CorrectionTimeRecordType, TimeRecorderType } from "../types";

const getRoleLabel = (
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

  const label =
    DEFAULT_ROLE_OPTIONS.find((option) => option.value === value)?.label ??
    null;

  return label;
};

export default getRoleLabel;
