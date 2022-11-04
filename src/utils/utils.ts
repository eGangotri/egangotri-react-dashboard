import { format } from "date-fns";
import {
  HOUR_MIN_FORMAT,
  SECONDARY_DATE_FORMAT,
} from "utils/date-constants";

export const formatWithTInMiddle = (date: Date, startOfDay = true) => {
    const formattedTime = format(date, SECONDARY_DATE_FORMAT);
    const withAppendage = `${formattedTime}${startOfDay?"T00:00":"T23:59"}`;
    console.log(`formatWithTInMiddle ${withAppendage}`);
  return withAppendage;
};

export const formatWithTInMiddle2 = (date: Date) => {
    return format(date, SECONDARY_DATE_FORMAT);
  };
  
