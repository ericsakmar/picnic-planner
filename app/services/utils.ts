// TODO test these?

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
