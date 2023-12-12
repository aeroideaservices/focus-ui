import { TFormField, TValidationField } from '@/types/models_v2/models_v2';

import React, { FC } from 'react';
import { Button, Group } from '@mantine/core';
import { FormErrors, useForm } from '@mantine/form';

import 'dayjs/locale/ru';

import { formValidate } from './utils/formValidate';
import { GetFieldsView } from './utils/GetFieldsView';
import { getInitialValues } from './utils/getInitialValues';
import { getTransformedFormValues } from './utils/getTransformedFormValues';

interface IModelFormBuilder {
  fields: TFormField[];
  onSubmit: (values: Record<string, unknown>) => void;
  validation?: Record<string, TValidationField>;
  type?: 'new' | 'edit';
  loading?: boolean;
}

const ModelFormBuilder: FC<IModelFormBuilder> = ({
  fields,
  onSubmit,
  validation,
  type = 'new',
  loading = false,
}) => {
  const form = useForm({
    initialValues: {
      fields: getInitialValues(fields),
    },
    validate: {
      fields: {
        value: (value, array, path) => formValidate(value, array, path, validation),
      },
    },
  });

  const fieldsView = GetFieldsView(form, validation, type);

  const submitHandler = (values: TFormField[]) => {
    onSubmit(getTransformedFormValues(values));
  };

  const onError = (errors: FormErrors) => {
    const errorsArray = Object.keys(errors);

    if (errorsArray.length) {
      const firstErrorElement: HTMLElement | null = document.getElementById(errorsArray[0]);

      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: `smooth`, block: 'center' });
      }
    }
  };

  return (
    <form
      onSubmit={form.onSubmit((values) => submitHandler([...values.fields]), onError)}
      noValidate
    >
      {fieldsView}

      <Group position="right">
        <Button type={'submit'} disabled={loading}>
          Сохранить
        </Button>
      </Group>
    </form>
  );
};

export default React.memo(ModelFormBuilder);
