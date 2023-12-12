import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Group, TextInput } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';

import { ADD_DOMAIN } from '@/constants/validationSchemas';

import { AppDispatch } from '@/store';
import { fetchAddDomainAction, selectFetchingAddDomain } from '@/store/slices/menu/menus';

const AddDomainForm: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const fetchingAddDomain = useSelector(selectFetchingAddDomain);

  const form = useForm({
    validate: yupResolver(ADD_DOMAIN),
    initialValues: {
      domain: '',
    },
  });

  const submitHandler = async (values: Record<string, string>) => {
    await dispatch(fetchAddDomainAction(values));
  };

  return (
    <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
      <TextInput
        placeholder="Введите домен"
        label="Домен"
        mb={24}
        withAsterisk
        {...form.getInputProps('domain')}
      />

      <Group position="right">
        <Button type={'submit'} disabled={fetchingAddDomain}>
          Отправить
        </Button>
      </Group>
    </form>
  );
};

export default AddDomainForm;
