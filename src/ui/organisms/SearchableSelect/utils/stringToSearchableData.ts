import { MultiSelectDataProps } from './getSearchData';
import stringToSearchableValues from './stringToSearchableValues';

const stringToSearchableData = (value: string): MultiSelectDataProps[] => {
  const result: MultiSelectDataProps[] = [];
  const tempValuesArr: string[] = stringToSearchableValues(value);

  tempValuesArr.map((item) => {
    result.push({ label: item, value: item, code: item });
  });

  return result;
};

export default stringToSearchableData;
