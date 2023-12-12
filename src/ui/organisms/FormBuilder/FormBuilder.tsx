import { TConfigurationOption, TypeEnum } from '@/types';

import { FC } from 'react';
import { Box, Button, Checkbox, Group, NumberInput, TextInput } from '@mantine/core';
import { DatePickerInput, DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';

import 'dayjs/locale/ru';

import { FileInput } from '../FileInput/FileInput';
import TextEditor from '../TextEditor/TextEditor';

import { getInitialValuesFromOptions } from './utils/getInitialValuesFromOptions';

interface IFormBuilder {
  options: TConfigurationOption[];
  onSubmit: (values: Record<string, unknown>) => void;
}

const FormBuilder: FC<IFormBuilder> = ({ options, onSubmit }) => {
  const form = useForm({
    initialValues: {
      fields: getInitialValuesFromOptions(options),
    },
  });

  const fields = form.values.fields.map((item, index) => (
    <Box key={item.key}>
      {item.type === TypeEnum.STRING && (
        <TextInput
          mb={24}
          label={item.label}
          placeholder={item.label}
          {...form.getInputProps(`fields.${index}.value`)}
        />
      )}

      {item.type === TypeEnum.CHECKBOX && (
        <Checkbox
          label={item.label}
          mb={24}
          {...form.getInputProps(`fields.${index}.checked`, { type: 'checkbox' })}
        />
      )}

      {item.type === TypeEnum.TEXT && (
        <TextEditor
          mb={24}
          label={item.label}
          content={item.value}
          error={form.getInputProps(`fields.${index}.value`).error}
          onChange={(value) => form.setFieldValue(`fields.${index}.value`, value)}
        />
      )}

      {item.type === TypeEnum.DATE && (
        <DatePickerInput
          mb={24}
          locale="ru"
          valueFormat="DD.MM.YYYY"
          label={item.label}
          placeholder={item.label}
          popoverProps={{ withinPortal: true }}
          {...form.getInputProps(`fields.${index}.value`)}
        />
      )}

      {item.type === TypeEnum.DATETIME && (
        <DateTimePicker
          mb={24}
          label={item.label}
          placeholder={item.label}
          locale="ru"
          valueFormat="DD.MM.YYYY HH:mm"
          popoverProps={{ withinPortal: true }}
          error={form.getInputProps(`fields.${index}.value`).error}
          {...form.getInputProps(`fields.${index}.value`)}
        />
      )}

      {(item.type === TypeEnum.FILE || item.type === TypeEnum.IMAGE) && (
        <Box mb={24}>
          <FileInput label={item.label} {...form.getInputProps(`fields.${index}.value`)} />
        </Box>
      )}

      {item.type === TypeEnum.INTEGER && (
        <NumberInput
          mb={24}
          label={item.label}
          placeholder={item.label}
          {...form.getInputProps(`fields.${index}.value`)}
        />
      )}
    </Box>
  ));

  const submitHandler = (values: Record<string, unknown>) => {
    onSubmit(values);
  };

  return (
    <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
      {fields}

      <Group position="right">
        <Button type={'submit'}>Сохранить</Button>
      </Group>
    </form>
  );
};

export default FormBuilder;
