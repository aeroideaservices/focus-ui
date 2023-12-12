export const transformData = (data: Record<string, string>[] | null) => {
  if (!data) return [];

  const result: { value: string; label: string }[] = [];

  data.map((item) => {
    const selectItem = { value: '', label: '' };

    selectItem.value = item.id;
    selectItem.label = item.domain;

    result.push(selectItem);
  });

  return result;
};
