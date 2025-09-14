import { DEFAULT_TYPE_OPTIONS } from "../constants/appConfig";
import type { CorrectionTimeRecordType, TimeRecorderType } from "../types";

const getTypeLabel = (
  record: TimeRecorderType | CorrectionTimeRecordType | string
) => {
  let value: string | null = null;

  if (typeof record === "string") {
    value = record;
  } else {
    value = record.type;
  }

  const label = DEFAULT_TYPE_OPTIONS.find(
    (option) => option.value === value
  )?.label;

  return label;
};

export default getTypeLabel;
