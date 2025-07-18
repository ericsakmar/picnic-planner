import z from "zod";

const formNumber = z.preprocess(
  (val) => (val === "" ? undefined : val),
  z.coerce.number("Please enter a number")
);

export const settingsSchema = z
  .object({
    latitude: formNumber,
    longitude: formNumber,
    idealTempMin: formNumber,
    idealTempMax: formNumber,
    fairTempMin: formNumber,
    fairTempMax: formNumber,
    idealPrecipMax: formNumber,
    fairPrecipMax: formNumber,
  })
  .refine((data) => data.idealTempMin < data.idealTempMax, {
    message:
      "Ideal Temperature Minimum must be less than Ideal Temperature Maximum",
    path: ["idealTempMin"],
  })
  .refine((data) => data.fairTempMin < data.idealTempMin, {
    message:
      "Fair Temperature Minimum must be less than Ideal Temperature Minimum",
    path: ["fairTempMin"],
  })
  .refine((data) => data.fairTempMax > data.idealTempMax, {
    message: "Fair Temp Maximum must be greater than Ideal Temperature Maximum",
    path: ["fairTempMax"],
  })
  .refine((data) => data.fairPrecipMax > data.idealPrecipMax, {
    message:
      "Fair Precipitation Maximum must be greater than Ideal Precipitation Maximum",
    path: ["fairPrecipMax"],
  });

export type Settings = z.infer<typeof settingsSchema>;
