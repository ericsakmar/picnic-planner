// TODO test these?

import { getDate, getMonth, type DateArg } from "date-fns";
import { formatISOWithOptions } from "date-fns/fp";

export function formDataToObject(formData: FormData): unknown {
  const entries = [...formData.entries()];

  return entries.reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: value,
    };
  }, {});
}

export const toISODateString = formatISOWithOptions({ representation: "date" });

// checks if only the month and day match for two dates
export function isSameMonthAndDay(d1: DateArg<Date>, d2: DateArg<Date>) {
  return getMonth(d1) === getMonth(d2) && getDate(d1) === getDate(d2);
}
