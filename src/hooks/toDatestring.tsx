import formatDateToJst from "./formatDateToJst";

const toDatestring = (date: Date): string =>
  formatDateToJst(date).split("T")[0];

export default toDatestring;
