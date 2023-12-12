import { FC, memo, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { ActionIcon, Flex, TextInput } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

import { DEFAULT_DATE_FORMAT } from '@/constants/common';

import { FilterTypes, TDateRangeValue, TFilterProps } from '../types';
import { useActiveFilters } from '../utils/useActiveFilters';

interface IResetButtonProps {
  onClick?: () => void;
}

const ResetButton: FC<IResetButtonProps> = ({ onClick }) => (
  <ActionIcon onClick={onClick}>
    <IconX size={16} />
  </ActionIcon>
);

export const DateRangeFilter: FC<TFilterProps<FilterTypes.IFilterDateRange>> = memo(
  ({
    code,
    name,
    initialValue = [null, null] as TDateRangeValue,
    value = initialValue,
    placeholder = 'Укажите период',
    showTime = false,
    inputProps,
  }) => {
    const { onChange } = useActiveFilters(code, initialValue);

    const changeHandler = (newValue: TDateRangeValue) => {
      if (newValue instanceof Array) onChange(newValue);
      else onChange([newValue, value[1]]);
    };

    const showResetButton = useMemo(() => value.some((part) => Boolean(part)), [value]);

    const reset = () => onChange(initialValue);

    return (
      <Flex direction="column">
        <label style={{ fontWeight: 500, fontSize: 14, lineHeight: '1.7' }}>{name}</label>
        <DatePicker
          {...inputProps}
          placeholderText={placeholder}
          dateFormat={inputProps?.dateFormat || DEFAULT_DATE_FORMAT}
          showTimeSelect={showTime}
          selected={value[0]}
          onChange={changeHandler}
          startDate={value[0]}
          endDate={value[1]}
          selectsRange
          autoComplete="off"
          customInput={
            <TextInput
              styles={{
                input: {
                  paddingRight: '36px',
                },
              }}
              rightSection={showResetButton ? <ResetButton onClick={reset} /> : null}
            />
          }
        />
      </Flex>
    );
  }
);
