export type MultiSelectDataProps = {
  value: string;
  label: string;
  code: string;
};

export const getSearchData = (items: Record<string, any>[]): MultiSelectDataProps[] => {
  const result: MultiSelectDataProps[] = [];

  items.map((item) => {
    const itemData: MultiSelectDataProps = {
      value: '',
      label: '',
      code: '',
    };

    itemData.value = item.fieldValues[0].value;
    itemData.label = item.fieldValues[1].value;
    itemData.code = item.fieldValues[2] ? item.fieldValues[2].value : '';

    result.push(itemData);
  });

  return result;
};
