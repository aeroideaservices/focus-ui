import { TFormBuilderRequest, TFormField } from '@/types';

import { FC, memo, useState } from 'react';
import { MultiSelect, MultiSelectProps, Select, SelectItem, SelectProps } from '@mantine/core';
import { debounce } from 'lodash';

import { notificationText } from '@/constants/notificationText';

import fetchingSearch from './utils/fetchingSearch';
import { MultiSelectDataProps } from './utils/getSearchData';

interface SearchableMultiSelectProps<T> extends Omit<MultiSelectProps, 'data'> {
  formField: TFormField<{ request: T }>;
  inputProps?: Record<string, any>;
  selectedCallback?: (selectData: MultiSelectDataProps[]) => void;
  data?: MultiSelectDataProps[];
  multi?: false;
  initialValue?: string[];
}

interface SearchableSelectprops<T> extends Omit<SelectProps, 'data'> {
  formField: TFormField<{ request: T }>;
  inputProps?: Record<string, any>;
  selectedCallback?: (selectData: MultiSelectDataProps[]) => void;
  data?: MultiSelectDataProps[];
  multi?: true;
  initialValue?: SelectItem['value'];
}

const SearchableSelect: FC<
  SearchableSelectprops<TFormBuilderRequest> | SearchableMultiSelectProps<TFormBuilderRequest>
> = memo(({ formField, inputProps, selectedCallback, data, initialValue = '', ...props }) => {
  const [searchData, setSearchData] = useState<MultiSelectDataProps[]>([]);
  const [selectData, setSelectData] = useState<MultiSelectDataProps[]>([]);
  const { opts } = formField;

  const getSelectData = (values: string[] | null): MultiSelectDataProps[] => {
    if (!values) return [];
    const selectedValues: MultiSelectDataProps[] = [];
    const tempArrValues: string[] = [];
    const tempArr: MultiSelectDataProps[] =
      data && selectData.length === 0 ? [...data, ...searchData] : [...selectData, ...searchData];

    values.map((value) => {
      selectedValues.push(...tempArr.filter((item) => item.value === value));
    });

    const result = selectedValues.filter((item) => {
      if (tempArrValues.indexOf(item.value) < 0) {
        tempArrValues.push(item.value);
        return true;
      }
      return false;
    });

    return result;
  };

  const handleSearch = async (value: string) => {
    if (value.length >= 3) {
      await fetchingSearch(value, opts.request, (values) => setSearchData(values));
    }
  };

  const handleChange = (value: string[] | string | null) => {
    const isString = typeof value === 'string';
    const newValue = isString ? [value] : value;

    if (data && initialValue && selectData.length === 0) {
      if (selectedCallback) selectedCallback(getSelectData(newValue));
    } else {
      setSelectData(getSelectData(newValue));
    }

    if (inputProps) inputProps.onChange(value);
  };

  const filter = (value: string, selected: boolean, item: MultiSelectDataProps) => {
    return (
      !selected &&
      (item.label.toLowerCase().includes(value.toLowerCase().trim()) ||
        item.value.toLowerCase().includes(value.toLowerCase().trim()) ||
        item.code.toLowerCase().includes(value.toLowerCase().trim()))
    );
  };

  return formField.multiple ? (
    <MultiSelect
      nothingFound={notificationText.SEARCH_NOTHING}
      {...(props as Omit<MultiSelectProps, 'data'>)}
      styles={{ input: { zIndex: 'initial' } }}
      searchable
      onSearchChange={debounce(handleSearch, 500)}
      onChange={handleChange}
      onDropdownClose={() => setSearchData([])}
      filter={filter}
      value={initialValue as string[]}
      data={
        data && selectData.length === 0 ? [...data, ...searchData] : [...selectData, ...searchData]
      }
    />
  ) : (
    <Select
      nothingFound={notificationText.SEARCH_NOTHING}
      {...(props as Omit<SelectProps, 'data'>)}
      searchable
      clearable
      onSearchChange={debounce(handleSearch, 500)}
      onChange={handleChange}
      onDropdownClose={() => setSearchData([])}
      value={(props.value as string) || ''}
      data={data && selectData.length === 0 ? [...data, ...searchData] : [...selectData]}
    />
  );
});

export default SearchableSelect;
