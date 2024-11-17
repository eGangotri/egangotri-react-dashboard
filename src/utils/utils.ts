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

export async function checkUrlValidity(url: string): Promise<boolean> {
  try {
    const response = await fetch(getBackendServer() + url, { method: 'HEAD' });

    // Check if the response status code indicates success (2xx) or redirection (3xx)
    if (response.ok || (response.status >= 300 && response.status < 400)) {
      return true; // The URL is valid
    } else {
      return false; // The URL is invalid
    }
  } catch (error) {
    return false; // An error occurred, so the URL is invalid
  }
}
