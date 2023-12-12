import { FormFieldTypeEnum, TFormField, TValidationField } from '@/types/models_v2/models_v2';

import InputMask from 'react-input-mask';
import {
  Box,
  Checkbox,
  ColorInput,
  createStyles,
  Input,
  NumberInput,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { DatePickerInput, DateTimePicker, TimeInput } from '@mantine/dates';
import { UseFormReturnType } from '@mantine/form';
import { IconCalendar, IconClock, IconMail, IconPhone, IconSearch } from '@tabler/icons-react';

import ColorsInput from '@/ui/organisms/ColorsInput/ColorsInput';
import EditorJSComponent from '@/ui/organisms/EditorJSComponent/EditorJSComponent';
import { FileInput } from '@/ui/organisms/FileInput/FileInput';
import RatingInput from '@/ui/organisms/RatingInput/RatingInput';
import SearchableDnD from '@/ui/organisms/SearchableDnD/SearchableDnD';
import SearchableSelectV2 from '@/ui/organisms/SearchableSelectV2/SearchableSelectV2';
import TextEditor from '@/ui/organisms/TextEditor/TextEditor';

import { addTransliteration } from './addTransliteration';
import { isRequired } from './isRequired';

const useStyles = createStyles({
  hidden: {
    display: 'none',
  },
});

export const GetFieldsView = (
  form: UseFormReturnType<
    {
      fields: TFormField[];
    },
    (values: { fields: TFormField[] }) => {
      fields: TFormField[];
    }
  >,
  validation: Record<string, TValidationField> | undefined,
  type: 'new' | 'edit'
) => {
  const { classes, cx } = useStyles();

  const fieldsView = form.values.fields.map((item, index) => {
    return (
      <Box key={item.code}>
        {item.block && (
          <Title order={4} mb={12}>
            {form.values.fields[index - 1].block !== item.block ? item.block : null}
          </Title>
        )}

        {item.type === FormFieldTypeEnum.CHECKBOX && (
          <Checkbox
            id={`fields.${index}.value`}
            mb={24}
            className={cx({ [classes.hidden]: item.hidden })}
            label={item.name}
            hidden={item.hidden}
            disabled={item.disabled}
            required={isRequired(validation, item.code)}
            {...form.getInputProps(`fields.${index}.checked`, { type: 'checkbox' })}
          />
        )}

        {item.type === FormFieldTypeEnum.INTINPUT && (
          <NumberInput
            id={`fields.${index}.value`}
            mb={24}
            className={cx({ [classes.hidden]: item.hidden })}
            label={item.name}
            placeholder={item.name}
            hidden={item.hidden}
            disabled={item.disabled}
            required={isRequired(validation, item.code)}
            {...form.getInputProps(`fields.${index}.value`)}
          />
        )}

        {item.type === FormFieldTypeEnum.UINTINPUT && (
          <NumberInput
            id={`fields.${index}.value`}
            mb={24}
            className={cx({ [classes.hidden]: item.hidden })}
            label={item.name}
            placeholder={item.name}
            hidden={item.hidden}
            disabled={item.disabled}
            min={0}
            required={isRequired(validation, item.code)}
            {...form.getInputProps(`fields.${index}.value`)}
          />
        )}

        {item.type === FormFieldTypeEnum.FLOATINPUT && (
          <NumberInput
            id={`fields.${index}.value`}
            mb={24}
            className={cx({ [classes.hidden]: item.hidden })}
            label={item.name}
            placeholder={item.name}
            hidden={item.hidden}
            disabled={item.disabled}
            step={item.step}
            precision={item.precision}
            required={isRequired(validation, item.code)}
            {...form.getInputProps(`fields.${index}.value`)}
          />
        )}

        {item.type === FormFieldTypeEnum.RATING && (
          <RatingInput
            id={`fields.${index}.value`}
            mb={24}
            className={cx({ [classes.hidden]: item.hidden })}
            label={item.name}
            ratingProps={{ ...form.getInputProps(`fields.${index}.value`) }}
          />
        )}

        {item.type === FormFieldTypeEnum.SELECT && (
          <>
            {item.sortable ? (
              <SearchableDnD
                id={`fields.${index}.value`}
                mb={24}
                icon={<IconSearch size="1.1rem" />}
                label={item.name}
                placeholder={item.name}
                hidden={item.hidden}
                disabled={item.disabled}
                field={item}
                required={isRequired(validation, item.code)}
                {...form.getInputProps(`fields.${index}.value`)}
              />
            ) : (
              <SearchableSelectV2
                id={`fields.${index}.value`}
                mb={24}
                icon={<IconSearch size="1.1rem" />}
                label={item.name}
                placeholder={item.name}
                hidden={item.hidden}
                disabled={item.disabled}
                field={item}
                required={isRequired(validation, item.code)}
                {...form.getInputProps(`fields.${index}.value`)}
              />
            )}
          </>
        )}

        {item.type === FormFieldTypeEnum.KLADRSELECT && (
          <SearchableSelectV2
            id={`fields.${index}.value`}
            mb={24}
            icon={<IconSearch size="1.1rem" />}
            label={item.name}
            placeholder={item.name}
            hidden={item.hidden}
            disabled={item.disabled}
            field={item}
            required={isRequired(validation, item.code)}
            {...form.getInputProps(`fields.${index}.value`)}
          />
        )}

        {item.type === FormFieldTypeEnum.DATEPICKERINPUT && (
          <DatePickerInput
            id={`fields.${index}.value`}
            mb={24}
            locale="ru"
            clearable
            className={cx({ [classes.hidden]: item.hidden })}
            icon={<IconCalendar size="1.1rem" />}
            label={item.name}
            placeholder={item.name}
            hidden={item.hidden}
            disabled={item.disabled}
            required={isRequired(validation, item.code)}
            {...form.getInputProps(`fields.${index}.value`)}
          />
        )}

        {item.type === FormFieldTypeEnum.DATETIMEPICKER && (
          <DateTimePicker
            id={`fields.${index}.value`}
            mb={24}
            locale="ru"
            clearable
            className={cx({ [classes.hidden]: item.hidden })}
            icon={<IconCalendar size="1.1rem" />}
            label={item.name}
            placeholder={item.name}
            hidden={item.hidden}
            disabled={item.disabled}
            valueFormat="DD.MM.YYYY HH:mm"
            required={isRequired(validation, item.code)}
            {...form.getInputProps(`fields.${index}.value`)}
          />
        )}

        {item.type === FormFieldTypeEnum.TEXTAREA && (
          <Textarea
            id={`fields.${index}.value`}
            mb={24}
            autosize
            minRows={4}
            className={cx({ [classes.hidden]: item.hidden })}
            label={item.name}
            placeholder={item.name}
            hidden={item.hidden}
            disabled={item.disabled}
            required={isRequired(validation, item.code)}
            {...form.getInputProps(`fields.${index}.value`)}
          />
        )}

        {item.type === FormFieldTypeEnum.TEXTINPUT && (
          <TextInput
            id={`fields.${index}.value`}
            mb={24}
            className={cx({ [classes.hidden]: item.hidden })}
            label={item.name}
            placeholder={item.name}
            hidden={item.hidden}
            disabled={item.disabled}
            required={isRequired(validation, item.code)}
            onInput={addTransliteration(form, type, item.extra)}
            {...form.getInputProps(`fields.${index}.value`)}
          />
        )}

        {item.type === FormFieldTypeEnum.WYSIWYG && (
          <TextEditor
            id={`fields.${index}.value`}
            mb={24}
            label={item.name}
            error={form.getInputProps(`fields.${index}.value`).error}
            required={isRequired(validation, item.code)}
            content={item.value as string}
            onChange={(value) => form.setFieldValue(`fields.${index}.value`, value)}
          />
        )}

        {item.type === FormFieldTypeEnum.EDITORJS && (
          <EditorJSComponent
            id={`fields.${index}.value`}
            mb={24}
            label={item.name}
            name={item.name}
            required={isRequired(validation, item.code)}
            error={form.errors[`fields.${index}.value`]}
            useForm={form}
            formField={item}
            fieldName={`fields.${index}.value`}
          />
        )}

        {item.type === FormFieldTypeEnum.MEDIA && (
          <FileInput
            id={`fields.${index}.value`}
            mb={24}
            label={item.name}
            required={isRequired(validation, item.code)}
            multiple={item.multiple}
            folderId={item.extra?.folderId}
            {...form.getInputProps(`fields.${index}.value`)}
          />
        )}

        {item.type === FormFieldTypeEnum.PHONEINPUT && (
          <Input.Wrapper
            mb={24}
            className={cx({ [classes.hidden]: item.hidden })}
            label={item.name}
            error={form.errors[`fields.${index}.value`]}
          >
            <Input
              id={`fields.${index}.value`}
              component={InputMask}
              mask={'+7 999 999-99-99'}
              autoComplete="off"
              placeholder={item.name}
              hidden={item.hidden}
              disabled={item.disabled}
              icon={<IconPhone size="1.1rem" />}
              required={isRequired(validation, item.code)}
              {...form.getInputProps(`fields.${index}.value`)}
            />
          </Input.Wrapper>
        )}

        {item.type === FormFieldTypeEnum.EMAILINPUT && (
          <TextInput
            id={`fields.${index}.value`}
            mb={24}
            className={cx({ [classes.hidden]: item.hidden })}
            label={item.name}
            placeholder={item.name}
            hidden={item.hidden}
            disabled={item.disabled}
            type="email"
            icon={<IconMail size="1.1rem" />}
            required={isRequired(validation, item.code)}
            {...form.getInputProps(`fields.${index}.value`)}
          />
        )}

        {item.type === FormFieldTypeEnum.COLORSINPUT && (
          <>
            {item.multiple ? (
              <ColorsInput
                id={`fields.${index}.value`}
                mb={24}
                className={cx({ [classes.hidden]: item.hidden })}
                label={item.name}
                placeholder={item.name}
                hidden={item.hidden}
                disabled={item.disabled}
                required={isRequired(validation, item.code)}
                {...form.getInputProps(`fields.${index}.value`)}
              />
            ) : (
              <ColorInput
                id={`fields.${index}.value`}
                mb={24}
                className={cx({ [classes.hidden]: item.hidden })}
                label={item.name}
                placeholder={item.name}
                hidden={item.hidden}
                disabled={item.disabled}
                required={isRequired(validation, item.code)}
                {...form.getInputProps(`fields.${index}.value`)}
              />
            )}
          </>
        )}

        {item.type === FormFieldTypeEnum.TIMEPICKERINPUT && (
          <TimeInput
            id={`fields.${index}.value`}
            mb={24}
            withSeconds
            icon={<IconClock size="1rem" stroke={1.5} />}
            className={cx({ [classes.hidden]: item.hidden })}
            label={item.name}
            placeholder={item.name}
            hidden={item.hidden}
            disabled={item.disabled}
            required={isRequired(validation, item.code)}
            {...form.getInputProps(`fields.${index}.value`)}
          />
        )}
      </Box>
    );
  });

  return fieldsView;
};
