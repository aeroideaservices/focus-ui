import { TAddMenusReq } from '@/types/api/menu';

import { FC, ReactNode, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Group, LoadingOverlay, TextInput } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';

import { transliteration } from '@/utils/transliteration';

import { NEW_MENU_FORM } from '@/constants/validationSchemas';
import { useBlockingDispatch } from '@/hooks/useBlockingDispatch';

import { selectConfigurationsOffset } from '@/store/slices/configuration/configurations';
import { fetchPutMenuAction } from '@/store/slices/menu/menu';
import { fetchAddMenusAction, fetchMenusAction } from '@/store/slices/menu/menus';

interface IFormNewMenu {
  type: 'new' | 'edit';
  element?: Record<string, ReactNode> | null;
}

const FormNewMenu: FC<IFormNewMenu> = ({ type, element }) => {
  const { dispatch, blocked } = useBlockingDispatch();
  const confId = element?.id as string;
  const configurationsOffset = useSelector(selectConfigurationsOffset);
  const [allowTransliteration, setAllowTransliteration] = useState(true);

  const form = useForm({
    validate: yupResolver(NEW_MENU_FORM),
    initialValues: {
      name: (element?.name as string) || '',
      code: (element?.code as string) || '',
    },
  });

  const submitHandler = async (data: TAddMenusReq) => {
    if (type === 'new') {
      await dispatch(fetchAddMenusAction({ data }));
    }

    if (confId && type === 'edit') {
      await dispatch(fetchPutMenuAction({ id: confId, data }));
    }

    await dispatch(fetchMenusAction({ params: { offset: configurationsOffset, limit: '100' } }));
  };

  return (
    <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
      <TextInput
        placeholder="Введите название"
        label="Название"
        required
        mb={24}
        onInput={(el) =>
          type === 'new' && allowTransliteration
            ? form.setFieldValue(
                'code',
                transliteration(el.currentTarget.value, { onlyLower: true })
              )
            : {}
        }
        {...form.getInputProps('name')}
      />
      <TextInput
        placeholder="Введите код"
        label="Код"
        required
        mb={24}
        disabled={type === 'edit'}
        onInput={(el) => {
          setAllowTransliteration(false);
          form.setFieldValue('code', el.currentTarget.value);
        }}
        {...form.getInputProps('code')}
      />

      {type === 'new' && (
        <Box
          sx={{
            display: 'flex',
          }}
        ></Box>
      )}

      <Group position="right">
        <Button type={'submit'} disabled={blocked}>
          Сохранить
        </Button>
      </Group>
      <LoadingOverlay visible={blocked} />
    </form>
  );
};

export default FormNewMenu;
