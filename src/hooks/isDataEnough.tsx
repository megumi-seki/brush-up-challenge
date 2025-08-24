import type { GroupedTimeRecorderType } from "../types";

const isDataEnough = (record: GroupedTimeRecorderType) => {
  const { clock_in, clock_out, break_begin, break_end } = record;
  if (
    (clock_in.datetime &&
      break_begin.datetime &&
      break_end.datetime &&
      clock_out.datetime) ||
    (clock_in.datetime && clock_out.datetime && !break_begin.datetime)
  )
    return true;
  return false;
};

export default isDataEnough;
