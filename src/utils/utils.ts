import { format } from "date-fns";
import {
  SECONDARY_DATE_FORMAT,
} from "utils/date-constants";
import { getBackendServer } from "./constants";

export const formatWithTInMiddle = (date: Date, startOfDay = true):string => {
  const formattedTime = format(date, SECONDARY_DATE_FORMAT);
  const withAppendage = `${formattedTime}${startOfDay ? "T00:00" : "T23:59"}`;
  console.log(`formatWithTInMiddle ${withAppendage}`);
  return withAppendage;
};

export const formatWithTInMiddle2 = (date: Date):string => {
  return format(date, SECONDARY_DATE_FORMAT);
};


export const DD_MM_YYYY_FORMAT = 'DD-MMM-YYYY'
export const DD_MM_YYYY_WITH_TIME_FORMAT = 'DD-MMM-YYYY HH:MM'
