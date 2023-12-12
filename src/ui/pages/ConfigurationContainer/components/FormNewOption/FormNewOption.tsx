import { TConfigurationOption, TypeEnum } from '@/types';

import { FC, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, Group, Select, TextInput } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';

import {
  EDIT_CONFIGURATION_FORM,
  NEW_OPTION_CONFIGURATION_FORM,
} from '@/constants/validationSchemas';
import { useTranslitForm } from '@/hooks/useTranslitForm';

import { AppDispatch } from '@/store';
import { fetchPutConfigurationOptionAction } from '@/store/slices/configuration/configurationOption';
import {
  fetchAddConfigurationOptionsAction,
  fetchGetConfigurationOptionsAction,
  selectConfigurationOptionsLimit,
  selectConfigurationOptionsOffset,
} from '@/store/slices/configuration/configurationOptions';
import { selectCurrentService } from '@/store/slices/service/service';

interface IFormNewOption {
  type: 'new' | 'edit';
  element?: Record<string, ReactNode> | null;
}

const FormNewOption: FC<IFormNewOption> = ({ type, element }) => {
  const dispatch: AppDispatch = useDispatch();
  const params = useParams();
  const confId = params.confId;
  const optId = element?.id as string;
  const service = useSelector(selectCurrentService);
  const configurationOptionsLimit = useSelector(selectConfigurationOptionsLimit);
  const configurationOptionsOffset = useSelector(selectConfigurationOptionsOffset);
  const isEditMode = type === 'edit';
  const isCreateMode = type === 'new';

  const form = useForm({
    validate: isEditMode
      ? yupResolver(EDIT_CONFIGURATION_FORM)
      : yupResolver(NEW_OPTION_CONFIGURATION_FORM),
    initialValues: {
      name: (element?.name as string) || '',
      code: (element?.code as string) || '',
      type: (element?.type as TypeEnum) || TypeEnum.STRING,
    },
  });

  const { setOriginalHandler } = useTranslitForm({
    inputNames: {
      original: 'name',
      translit: 'code',
    },
    form,
    opts: { onlyLower: true },
    active: isCreateMode,
  });

  const submitHandler = async (values: TConfigurationOption) => {
    if (confId && isCreateMode && service) {
      await dispatch(fetchAddConfigurationOptionsAction({ id: confId, option: values }));
    }

    if (confId && optId && isEditMode && service) {
      await dispatch(
        fetchPutConfigurationOptionAction({ params: { confId, optId }, data: values })
      );
    }

    if (confId && service) {
      await dispatch(
        fetchGetConfigurationOptionsAction({
          id: confId,
          params: {
            offset: configurationOptionsOffset,
            limit: configurationOptionsLimit,
          },
        })
      );
    }
  };

  return (
    <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
      <TextInput
        placeholder="Введите название"
        label="Название"
        mb={24}
        onInput={setOriginalHandler}
        withAsterisk
        {...form.getInputProps('name')}
      />
      <TextInput
        placeholder="Введите код"
        label="Символьный код"
        mb={24}
        withAsterisk
        disabled={type === 'edit'}
        {...form.getInputProps('code')}
      />

      <Select
        disabled={type === 'edit'}
        label="Тип"
        placeholder="Выберите вариант"
        data={[
          { value: TypeEnum.STRING, label: 'Строка' },
          { value: TypeEnum.TEXT, label: 'Текст' },
          { value: TypeEnum.CHECKBOX, label: 'Чекбокс' },
          { value: TypeEnum.FILE, label: 'Файл' },
          { value: TypeEnum.IMAGE, label: 'Изображение' },
          { value: TypeEnum.DATE, label: 'Дата' },
          { value: TypeEnum.DATETIME, label: 'Дата и время' },
          { value: TypeEnum.INTEGER, label: 'Число' },
        ]}
        mb={24}
        withAsterisk
        withinPortal={true}
        {...form.getInputProps('type')}
      />

      <Group position="right">
        <Button type={'submit'}>Сохранить</Button>
      </Group>
    </form>
  );
};

export default FormNewOption;
