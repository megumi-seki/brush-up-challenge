import { GRAPH_START_HOUR } from "../constants/appConfig";

const getMinutes = (datetimeString: string): number => {
  const datetime = new Date(datetimeString);
  const minutes =
    (datetime.getHours() - GRAPH_START_HOUR) * 60 + datetime.getMinutes();
  return minutes;
};

export default getMinutes;
