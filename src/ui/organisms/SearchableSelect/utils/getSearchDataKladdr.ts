import { MultiSelectDataProps } from './getSearchData';

const getSearchDataKladdr = (items: Record<string, any>[]): MultiSelectDataProps[] => {
  const result: MultiSelectDataProps[] = [];

  items.map((item) => {
    const itemData: MultiSelectDataProps = {
      value: '',
      label: '',
      code: '',
    };

    itemData.value = item.kladrId;
    itemData.label = item.value;
    itemData.code = item.fiasId;

    result.push(itemData);
  });

  return result;
};

export default getSearchDataKladdr;
