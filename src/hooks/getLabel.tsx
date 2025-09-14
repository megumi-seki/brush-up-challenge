import {
  DEFAULT_ROLE_OPTIONS,
  DEFAULT_TYPE_OPTIONS,
} from "../constants/appConfig";
import type { CorrectionTimeRecordType, TimeRecorderType } from "../types";

const getLabel = (
  record: TimeRecorderType | CorrectionTimeRecordType | string,
  recordType: "type" | "role"
) => {
  const defaultOptions =
    recordType === "type" ? DEFAULT_TYPE_OPTIONS : DEFAULT_ROLE_OPTIONS;

  let value: string | null = null;

  if (typeof record === "string") {
    value = record;
  } else if (
    typeof record[recordType] === "object" &&
    record[recordType] !== null &&
    "value" in record[recordType]
  ) {
    value = record[recordType].value;
  } else {
    value = record[recordType];
  }

  const label = defaultOptions.find((option) => option.value === value)?.label;

  return label;
};

export default getLabel;
