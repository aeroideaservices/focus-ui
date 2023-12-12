import { TMenuItem } from '@/types';

import { FC, ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  ActionIcon,
  Button,
  Group,
  LoadingOverlay,
  Select,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { IconPlus } from '@tabler/icons-react';
import { cloneDeep } from 'lodash';

import { tryAddMenuItems } from '@/api/menu/menuItem';

import notify from '@/utils/notify';

import { NEW_ITEM_MENU_FORM } from '@/constants/validationSchemas';
import { useBlockingDispatch } from '@/hooks/useBlockingDispatch';

import { transformData } from '@/ui/pages/MenuContainer/components/FormNewItems/utils/transformData';

import {
  fetchAddMenuItemsAction,
  fetchGetMenuItemAction,
  fetchGetMenuItemsAction,
  fetchGetMenuItemsChildrenAction,
  fetchMoveMenuItemsAction,
  fetchPutMenuItemsAction,
  selectCurrentPath,
  selectFullMenuItem,
  selectParentId,
  selectTreeData,
  setAddMenuItemsModalOpened,
} from '@/store/slices/menu/menuItems';
import { fetchGetDomainsAction, selectDomains } from '@/store/slices/menu/menus';

interface IFormNewOption {
  type: 'new' | 'edit';
  element?: Record<string, ReactNode> | null;
}

const FormNewItems: FC<IFormNewOption> = ({ type, element }) => {
  const fullMenuItem = useSelector(selectFullMenuItem);
  const params = useParams();
  const menuId = params.menuId;
  const parentId = useSelector(selectParentId);
  const currentPath = useSelector(selectCurrentPath);
  const treeData = useSelector(selectTreeData);
  const { dispatch, blocked } = useBlockingDispatch();
  const domainData = useSelector(selectDomains);

  const form = useForm({
    validate: yupResolver(NEW_ITEM_MENU_FORM),
    initialValues: {
      name: (fullMenuItem?.name as any) || '',
      domainId: (fullMenuItem?.domainId as any) || null,
      url: (fullMenuItem?.url as any) || '',
      additionalFields: (fullMenuItem?.additionalFields as any) || [],
    },
  });

  useEffect(() => {
    dispatch(fetchGetDomainsAction({ offset: 0, limit: 100 }));

    if (type === 'edit') {
      const menuItemId = element?.id as string;

      if (menuId && menuItemId) {
        dispatch(fetchGetMenuItemAction({ menuId, menuItemId }));
      }
    }
  }, []);

  useEffect(() => {
    if (fullMenuItem && type === 'edit') {
      form.setFieldValue('name', fullMenuItem?.name);
      form.setFieldValue('url', fullMenuItem?.url?.replace(/^\//, ''));
      form.setFieldValue('domainId', fullMenuItem?.domainId);

      if (fullMenuItem.additionalFields && fullMenuItem.additionalFields.length) {
        const fields = cloneDeep(fullMenuItem.additionalFields);

        form.setFieldValue('additionalFields', [...fields]);
      }
    }
  }, [fullMenuItem]);

  const submitHandler = async (values: TMenuItem) => {
    const filteredAddValues = values?.additionalFields?.filter(
      (item: any) => item.value && item.code
    );
    values.additionalFields = filteredAddValues;

    if (menuId && type === 'new') {
      if (parentId) {
        const addedId = await tryAddMenuItems({ id: menuId, data: { ...values } });

        await dispatch(
          fetchMoveMenuItemsAction({
            params: { menuId: menuId, menuItemId: addedId.id },
            data: { position: 1, parentMenuItemId: parentId },
          })
        );

        await dispatch(
          fetchGetMenuItemsChildrenAction({
            id: menuId,
            oldTreeData: treeData,
            path: currentPath,
            params: { parentMenuItemId: parentId },
            itemId: parentId,
          })
        );

        if (addedId) notify({ message: 'Пункт меню добавлен', type: 'success' });

        dispatch(setAddMenuItemsModalOpened(false));
      } else {
        await dispatch(fetchAddMenuItemsAction({ id: menuId, data: values }));
        await dispatch(fetchGetMenuItemsAction({ id: menuId }));
      }
    }

    if (menuId && element?.id && type === 'edit') {
      await dispatch(
        fetchPutMenuItemsAction({
          params: { menuId: menuId, menuItemId: element?.id.toString() },
          data: values,
        })
      );

      if (parentId) {
        await dispatch(
          fetchGetMenuItemsChildrenAction({
            id: menuId,
            oldTreeData: treeData,
            path: currentPath,
            params: { parentMenuItemId: parentId },
            itemId: parentId,
          })
        );
      } else {
        await dispatch(fetchGetMenuItemsAction({ id: menuId }));
        await dispatch(
          fetchGetMenuItemsChildrenAction({
            id: menuId,
            oldTreeData: treeData,
            path: currentPath,
            params: { parentMenuItemId: element.id },
            itemId: element.id,
          })
        );
      }
    }
  };

  return (
    <form
      onSubmit={form.onSubmit((values: TMenuItem) => submitHandler(values))}
      style={{ position: 'relative' }}
    >
      <TextInput
        placeholder="Введите название"
        label="Название"
        required
        mb={24}
        {...form.getInputProps('name')}
      />

      <Select
        label="Домен"
        clearable
        placeholder="Выберите вариант"
        data={transformData(domainData)}
        mb={24}
        {...form.getInputProps('domainId')}
      />

      <TextInput placeholder="Введите url" label="URL" mb={24} {...form.getInputProps('url')} />

      <Title order={5} mb={24}>
        Дополнительные опции
      </Title>

      {form?.values?.additionalFields?.map((item: any, index: number) => (
        <Group key={`${item.name}${index}`} grow mb={24}>
          <TextInput
            placeholder="Введите название"
            label="Название параметра"
            required={
              form.getInputProps(`additionalFields.${index}.code`).value ||
              form.getInputProps(`additionalFields.${index}.value`).value
                ? true
                : false
            }
            {...form.getInputProps(`additionalFields.${index}.code`)}
          />

          <TextInput
            placeholder="Введите значение"
            label="Значение"
            required={
              form.getInputProps(`additionalFields.${index}.code`).value ||
              form.getInputProps(`additionalFields.${index}.value`).value
                ? true
                : false
            }
            {...form.getInputProps(`additionalFields.${index}.value`)}
          />
        </Group>
      ))}

      <Group position="right" mb={24} align="center" spacing={10}>
        <Text fz={'sm'}>Ещё параметр</Text>

        <ActionIcon
          variant="outline"
          size={'lg'}
          onClick={() => form.insertListItem('additionalFields', { value: '', code: '' })}
        >
          <IconPlus />
        </ActionIcon>
      </Group>

      <Group position="right">
        <Button type={'submit'} disabled={blocked}>
          Подтвердить
        </Button>
      </Group>

      <LoadingOverlay visible={blocked} />
    </form>
  );
};

export default FormNewItems;
