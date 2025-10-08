import { DEFAULT_ROLE_OPTIONS } from "../constants/appConfig";
import type { CorrectionTimeRecordType, TimeRecorderType } from "../types";

const getRoleLabel = (
  recordProp: TimeRecorderType | CorrectionTimeRecordType | string
) => {
  let value: string | null = null;

  if (typeof recordProp === "string") { // 役割の文字列が直接渡された場合
    value = recordProp;
  } else if (  // CorrectionTimeRecordTypeの場合
    typeof recordProp.role === "object" &&
    recordProp.role !== null &&
    "value" in recordProp.role  
  ) {
    value = recordProp.role.value;
  } else {  // TimeRecorderTypeの場合
    value = recordProp.role;
  }

  const label =
    DEFAULT_ROLE_OPTIONS.find((option) => option.value === value)?.label ??
    null;

  return label;
};

export default getRoleLabel;
