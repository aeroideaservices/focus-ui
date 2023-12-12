import { TConfiguration } from '@/types';

import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Group, TextInput } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';

import { EDIT_CONFIGURATION_FORM, NEW_CONFIGURATION_FORM } from '@/constants/validationSchemas';
import { useTranslitForm } from '@/hooks/useTranslitForm';
import { useURLPagination } from '@/hooks/useUrlPagination';

import { AppDispatch } from '@/store';
import { fetchPutConfigurationAction } from '@/store/slices/configuration/configuration';
import {
  fetchAddConfigurationsAction,
  fetchConfigurationsAction,
  selectConfigurationsTotal,
} from '@/store/slices/configuration/configurations';
import { selectCurrentService } from '@/store/slices/service/service';

interface IFormNewConfiguration {
  type: 'new' | 'edit';
  element?: TConfiguration | null;
}

const FormNewConfiguration: FC<IFormNewConfiguration> = ({ type, element }) => {
  const dispatch: AppDispatch = useDispatch();
  const confId = element?.id;
  const configurationsTotal = useSelector(selectConfigurationsTotal);
  const { currentLimit, currentOffset } = useURLPagination(configurationsTotal || 0);
  const service = useSelector(selectCurrentService);
  const isCreateMode = type === 'new';
  const isEditMode = type === 'edit';

  const form = useForm({
    validate: isEditMode
      ? yupResolver(EDIT_CONFIGURATION_FORM)
      : yupResolver(NEW_CONFIGURATION_FORM),
    initialValues: {
      name: element?.name || '',
      code: element?.code || '',
    },
  });

  const { setOriginalHandler } = useTranslitForm({
    inputNames: {
      original: 'name',
      translit: 'code',
    },
    opts: { onlyLower: true },
    form,
    active: isCreateMode,
  });

  const submitHandler = async (data: { code: string; name: string }) => {
    if (type === 'new' && service) {
      await dispatch(fetchAddConfigurationsAction({ data }));
    }

    if (confId && type === 'edit' && service) {
      await dispatch(fetchPutConfigurationAction({ id: confId, data }));
    }

    if (service) {
      await dispatch(
        fetchConfigurationsAction({
          params: { offset: currentOffset, limit: currentLimit },
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
        {...form.getInputProps('name')}
      />
      <TextInput
        placeholder="Введите код"
        label="Символьный код"
        mb={24}
        disabled={isEditMode}
        {...form.getInputProps('code')}
      />

      <Group position="right">
        <Button type={'submit'}>Сохранить</Button>
      </Group>
    </form>
  );
};

export default FormNewConfiguration;
