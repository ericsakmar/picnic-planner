import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getSettings, saveSettings } from "~/services/settingsService.client";
import type { Route } from "./+types/settings";
import { settingsSchema, type Settings } from "~/types/settings";
import InputField from "~/components/InputField";
import { redirect, useSubmit } from "react-router";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  var settings = getSettings();
  return { settings };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const formDataObject = Object.fromEntries(formData);
  const validationRes = settingsSchema.safeParse(formDataObject);

  if (!validationRes.success) {
    return {
      success: false,
    };
  }

  saveSettings(validationRes.data);

  return redirect("/forecast");
}

export default function Settings({ loaderData }: Route.ComponentProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: loaderData.settings ?? {
      latitude: 40.440624, // pittsburgh
      longitude: -79.995888,
      idealTempMin: 70,
      idealTempMax: 80,
      fairTempMin: 60,
      fairTempMax: 85,
      idealPrecipMax: 20,
      fairPrecipMax: 50,
    },
  });

  const submit = useSubmit();

  const onSubmit = async (formValues: Settings) => {
    submit(formValues, { method: "POST" });
  };

  const disabled = isSubmitting;

  return (
    <>
      <h1 className="text-xl">Settings</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputField
          name="latitude"
          label="Latitude"
          type="number"
          register={register}
          errors={errors}
          disabled={disabled}
        />

        <InputField
          name="longitude"
          label="Longitude"
          type="number"
          register={register}
          errors={errors}
          disabled={disabled}
        />

        <InputField
          name="idealTempMin"
          label="Ideal Temperature Minimum"
          type="number"
          register={register}
          errors={errors}
          disabled={disabled}
        />

        <InputField
          name="idealTempMax"
          label="Ideal Temperature Maximum"
          type="number"
          register={register}
          errors={errors}
          disabled={disabled}
        />

        <InputField
          name="fairTempMin"
          label="Fair Temperature Minimum"
          type="number"
          register={register}
          errors={errors}
          disabled={disabled}
        />

        <InputField
          name="fairTempMax"
          label="Fair Temperature Maximum"
          type="number"
          register={register}
          errors={errors}
          disabled={disabled}
        />

        <InputField
          name="idealPrecipMax"
          label="Ideal Chance of Precipitation Maximum"
          type="number"
          register={register}
          errors={errors}
          disabled={disabled}
        />

        <InputField
          name="fairPrecipMax"
          label="Fair Chance of Precipitation Maximum"
          type="number"
          register={register}
          errors={errors}
          disabled={disabled}
        />

        <button
          type="submit"
          disabled={disabled}
          className="mt-4 bg-gray-600 rounded px-4 py-1"
        >
          Save and Continue
        </button>
      </form>
    </>
  );
}
