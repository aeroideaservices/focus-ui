import { FilterViewTypeEnum } from '@/types';

import { MultiSelectProps, NumberInputProps, SelectProps, TextInputProps } from '@mantine/core';
import { DatePickerProps } from '@mantine/dates';

export interface SelectItem {
  value: string;
  label: string;
}

export interface IDatePeriod {
  from?: Date;
  to?: Date;
}

export type TDateRangeValue = [Date | null, Date | null];

export namespace FilterTypes {
  export interface IFilterBase<T extends unknown, I extends any = any> {
    name: string;
    code: string;
    initialValue?: T;
    placeholder?: string;
    inputProps?: Partial<I>;
  }

  export interface IFilterNumeric extends IFilterBase<number | undefined, NumberInputProps> {
    viewType: FilterViewTypeEnum.NUMERIC;
  }

  export interface IFilterMultiSelect extends IFilterBase<string[], MultiSelectProps> {
    viewType: FilterViewTypeEnum.MULTISELECT;
    data: (string | SelectItem)[];
    showOptionAll?: boolean;
  }

  export interface IFilterDate extends IFilterBase<string | null, DatePickerProps> {
    viewType: FilterViewTypeEnum.DATE;
  }

  export interface IFilterDateRange extends IFilterBase<TDateRangeValue | undefined> {
    viewType: FilterViewTypeEnum.DATE_RANGE;
    inputFormat?: string;
    showTime?: boolean;
  }

  export interface IFilterCheckbox extends IFilterBase<boolean, SelectProps> {
    viewType: FilterViewTypeEnum.CHECKBOX;
    onChange: (value: boolean) => void;
  }

  export interface IFilterString extends IFilterBase<string, TextInputProps> {
    viewType: FilterViewTypeEnum.STRING;
  }
}

export type TFilter =
  | FilterTypes.IFilterNumeric
  | FilterTypes.IFilterMultiSelect
  | FilterTypes.IFilterDate
  | FilterTypes.IFilterDateRange
  | FilterTypes.IFilterCheckbox
  | FilterTypes.IFilterString;

export type TFilterProps<F extends FilterTypes.IFilterBase<any, any>> = F & {
  value: F['initialValue'];
};

export type TFiltersConfig = TFilter[];

export type ActiveFilter<
  C extends TFilter['code'] = TFilter['code'],
  V extends TFilter['initialValue'] = TFilter['initialValue']
> = { code: C; value: V };
export type ActiveFiltersMap = { [key: string]: ActiveFilter };
export type FilterChangeHandler = (
  value: ActiveFilter['value'],
  initialValue: TFilter['initialValue'],
  code: ActiveFilter['code']
) => void;
