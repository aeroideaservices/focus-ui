import { HTTPMethodEnum } from '@/types';
import { FormFieldTypeEnum, TFormField, TSelectData } from '@/types/models_v2/models_v2';

import { FC, useEffect, useState } from 'react';
import React from 'react';
import { Loader, MultiSelect, MultiSelectProps, Select, SelectProps } from '@mantine/core';
import { debounce, isArray } from 'lodash';

import { notificationText } from '@/constants/notificationText';

import { MultiSelectDataProps } from '../SearchableSelect/utils/getSearchData';

import SelectItem from './components/SelectItem/SelectItem';
import { fetching } from './utils/fetching';
import { fetchingKLADR } from './utils/fetchingKLADR';
import { getSelectData } from './utils/getSelectData';
import { getSelectDataKLADR } from './utils/getSelectDataKLADR';
import { getSelectValue } from './utils/getSelectValue';
import { getSelectValueKLADR } from './utils/getSelectValueKLADR';

export interface SearchableSelectProps extends Omit<SelectProps, 'data'> {
  field: TFormField;
  getSelectedData?: (data: TSelectData[]) => void;
  customSelect?: boolean;
}
export interface SearchableMultiSelectProps extends Omit<MultiSelectProps, 'data'> {
  field: TFormField;
  getSelectedData?: (data: TSelectData[]) => void;
  customSelect?: boolean;
}

const SearchableSelectV2: FC<SearchableSelectProps | SearchableMultiSelectProps> = ({
  field,
  getSelectedData,
  customSelect,
  ...props
}) => {
  const { extra } = field;
  const [searchFetching, setSearchFetching] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<TSelectData[]>([]);
  const [selectData, setSelectData] = useState<TSelectData[]>([]);

  const handleSearch = (value: string) => {
    if (value.length >= 3 && extra?.request) {
      setSearchFetching(true);

      fetching(extra.request, value, {}, (res) => {
        const data = getSelectData(res.items, {
          valueID: extra.identifier,
          labelID: extra.display && extra.display[0],
          codeID: extra.display && extra.display[1],
        });

        setSearchData(data);
      }).finally(() => setSearchFetching(false));
    }

    if (field.type === FormFieldTypeEnum.KLADRSELECT && value.length >= 3) {
      setSearchFetching(true);

      fetchingKLADR(
        'suggests',
        HTTPMethodEnum.POST,
        value,
        (res) => setSearchData(getSelectDataKLADR(res)),
        { count: 20, ...extra?.kladrSelect }
      ).finally(() => setSearchFetching(false));
    }
  };

  const handleChange = (value: string & string[]) => {
    let selectedData = null;

    if (isArray(value)) {
      const tempArr = [...selectData, ...searchData];
      const tempSelectData: TSelectData[] = [];
      let tempSearchData: TSelectData[] = [...selectData, ...searchData];

      value.forEach((item) => {
        tempSelectData.push(...tempArr.filter((el) => el.value === item));
        tempSearchData = tempSearchData.filter((el) => el.value !== item);
      });

      setSelectData(tempSelectData);
      setSearchData(tempSearchData);
    } else {
      selectedData = searchData.filter((el) => el.value === value);
    }

    if (getSelectedData && selectedData) getSelectedData(selectedData);

    if (props.onChange) props.onChange(value);
  };

  const multiSelectFilter = (value: string, selected: boolean, item: MultiSelectDataProps) => {
    return (
      !selected &&
      (item.label.toLowerCase().includes(value.toLowerCase().trim()) ||
        item.value.toLowerCase().includes(value.toLowerCase().trim()) ||
        item.code.toLowerCase().includes(value.toLowerCase().trim()))
    );
  };

  const selectFilter = (value: string, item: TSelectData) => {
    return (
      item.label.toLowerCase().includes(value.toLowerCase().trim()) ||
      item.value.toLowerCase().includes(value.toLowerCase().trim()) ||
      (String(item.code)
        ? String(item.code).toLowerCase().includes(value.toLowerCase().trim())
        : false)
    );
  };

  useEffect(() => {
    if (props.value && field.type === FormFieldTypeEnum.SELECT) {
      getSelectValue(field, props.value).then((res) => {
        setSearchData(res);

        const selectedData = res.filter((el) => el.value === props.value);

        if (getSelectedData && selectedData) getSelectedData(selectedData);
      });
    }
    if (props.value && field.type === FormFieldTypeEnum.KLADRSELECT) {
      getSelectValueKLADR(field, props.value).then((res) => {
        setSelectData(res);
      });
    }
  }, []);

  return field.multiple ? (
    <MultiSelect
      nothingFound={notificationText.SEARCH_NOTHING}
      {...(props as Omit<MultiSelectProps, 'data'>)}
      icon={!searchFetching ? props.icon : <Loader size="sm" />}
      searchable
      clearable
      onChange={handleChange}
      onSearchChange={debounce(handleSearch, 500)}
      filter={multiSelectFilter}
      value={(props.value as string[]) || []}
      data={[...selectData, ...searchData]}
    />
  ) : (
    <Select
      nothingFound={notificationText.SEARCH_NOTHING}
      {...(props as Omit<SelectProps, 'data'>)}
      icon={!searchFetching ? props.icon : <Loader size="sm" />}
      itemComponent={customSelect ? SelectItem : undefined}
      searchable
      clearable
      onChange={handleChange}
      onSearchChange={debounce(handleSearch, 500)}
      filter={selectFilter}
      value={(props.value as string) || ''}
      data={[...searchData]}
    />
  );
};

export default SearchableSelectV2;
