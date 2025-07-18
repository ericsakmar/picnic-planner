// TODO test these?

export function formDataToObject(formData: FormData): unknown {
  const entries = [...formData.entries()];

  return entries.reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: value,
    };
  }, {});
}
