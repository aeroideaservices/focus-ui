import { FormFieldTypeEnum, TFormField } from '@/types/models_v2/models_v2';

import React, { useEffect } from 'react';
import { FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, createStyles } from '@mantine/core';
import { DatePickerInput, DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconCalendar, IconSearch } from '@tabler/icons-react';
import { isEqual } from 'lodash';
import qs from 'qs';

import { LIMIT } from '@/constants/common';

import SearchableFilter from '@/ui/organisms/SearchableFilter/SearchableFilter';

import { filterIsChange } from './utils/filterIsChange';
import { getInitialValues } from './utils/getInitialValues';
import { getModelFiltersValues } from './utils/getModelFiltersValues';

interface ModelFiltersBuilderProps {
  fields: TFormField[];
}

const useStyles = createStyles({
  form: {
    width: '100%',
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 15,
  },
});

const ModelFiltersBuilder: FC<ModelFiltersBuilderProps> = ({ fields }) => {
  const { classes } = useStyles();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialValues = getInitialValues(fields, searchParams);

  const form = useForm({
    initialValues: {
      fields: initialValues,
    },
  });

  useEffect(() => {
    const currentFiltersValues = getModelFiltersValues(form.values.fields);

    const newParams = {
      offset: filterIsChange(initialValues, form.values.fields)
        ? 0
        : searchParams.get('offset') || 0,
      limit: searchParams.get('limit') || LIMIT,
      ...currentFiltersValues,
    };

    const URLParams = qs.stringify(newParams, { indices: false });

    setSearchParams(URLParams);
  }, [form.values]);

  useEffect(() => {
    const prevValues = form.values.fields;
    const nextValues = getInitialValues(fields, searchParams);

    if (!isEqual(prevValues, nextValues)) {
      form.setValues({ fields: nextValues });
    }
  }, [searchParams]);

  const fieldsView = form.values.fields.map((item, index) => {
    return (
      <Box key={item.code} w={'calc(20% - 15px)'} miw={235}>
        {item.type === FormFieldTypeEnum.SELECT && (
          <SearchableFilter
            field={item}
            label={item.name}
            placeholder={item.name}
            hidden={item.hidden}
            disabled={item.disabled}
            icon={item.extra && item.extra.request && <IconSearch size="1.1rem" />}
            cb={(values) => form.setFieldValue(`fields.${index}.value`, values)}
            {...form.getInputProps(`fields.${index}.value`)}
          />
        )}

        {item.type === FormFieldTypeEnum.DATEPICKERINPUT && (
          <DatePickerInput
            locale="ru"
            clearable
            icon={<IconCalendar size="1.1rem" />}
            label={item.name}
            placeholder={item.name}
            hidden={item.hidden}
            disabled={item.disabled}
            {...form.getInputProps(`fields.${index}.value`)}
          />
        )}

        {item.type === FormFieldTypeEnum.DATETIMEPICKER && (
          <>
            {item.extra && item.extra.range ? (
              <DatePickerInput
                type="range"
                locale="ru"
                clearable
                icon={<IconCalendar size="1.1rem" />}
                label={item.name}
                placeholder={item.name}
                hidden={item.hidden}
                disabled={item.disabled}
                valueFormat="DD.MM.YYYY"
                {...form.getInputProps(`fields.${index}.value`)}
              />
            ) : (
              <DateTimePicker
                locale="ru"
                clearable
                icon={<IconCalendar size="1.1rem" />}
                label={item.name}
                placeholder={item.name}
                hidden={item.hidden}
                disabled={item.disabled}
                valueFormat="DD.MM.YYYY HH:mm"
                {...form.getInputProps(`fields.${index}.value`)}
              />
            )}
          </>
        )}
      </Box>
    );
  });

  return (
    <form noValidate className={classes.form}>
      <Box className={classes.wrapper} w={'100%'}>
        {fieldsView}
      </Box>
    </form>
  );
};

export default React.memo(ModelFiltersBuilder);
