import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getSettings, saveSettings } from "~/services/settingsService";
import type { Route } from "./+types/settings";
import { settingsSchema, type Settings } from "~/types/settings";
import InputField from "~/components/InputField";
import { formDataToObject } from "~/services/utils";
import { redirect, useSubmit } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Picnic Planner" }];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  var settings = getSettings();
  return { settings };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const formDataObject = formDataToObject(formData);
  const validationRes = settingsSchema.safeParse(formDataObject);

  if (!validationRes.success) {
    return {
      success: false,
    };
  }

  saveSettings(validationRes.data);

  return redirect("/forecast");
}

// pittsburgh is 40.440624 -79.995888

export default function Settings({ loaderData }: Route.ComponentProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: loaderData.settings ?? undefined,
  });

  const submit = useSubmit();

  const onSubmit = async (formValues: Settings) => {
    submit(formValues, { method: "POST" });
  };

  const disabled = isSubmitting;

  return (
    <>
      <h1>hello settings</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          name="latitude"
          label="Latitude"
          register={register}
          errors={errors}
          disabled={disabled}
        />

        <InputField
          name="longitude"
          label="Longitude"
          register={register}
          errors={errors}
          disabled={disabled}
        />

        <button type="submit" disabled={disabled}>
          save and continue
        </button>
      </form>
    </>
  );
}
