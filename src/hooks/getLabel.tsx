import {
  defaultRoleOptions,
  defaultTypeOptions,
} from "../components/TimeRecorderForm";
import type { TimeRecorderType } from "../types";

const getLabel = (record: TimeRecorderType, recordType: "type" | "role") => {
  const defaultOptions =
    recordType === "type" ? defaultTypeOptions : defaultRoleOptions;
  const label = defaultOptions.find(
    (option) => option.value === record[recordType]
  )?.label;

  return label;
};

export default getLabel;
