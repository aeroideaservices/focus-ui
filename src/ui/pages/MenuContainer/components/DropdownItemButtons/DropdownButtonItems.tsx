import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { ActionIcon, Group } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';

import { AppDispatch } from '@/store';
import {
  setCurrentPath,
  setDelMenuItemModalOpened,
  setEditMenuItemModalOpened,
  setFullMenuItem,
  setMenuItem,
  setParentId,
} from '@/store/slices/menu/menuItems';

interface IDropdownButtonItems {
  item: any;
  path: any;
}

const DropdownButtonItems: FC<IDropdownButtonItems> = ({ item, path }) => {
  const dispatch: AppDispatch = useDispatch();

  const editHandler = () => {
    dispatch(setMenuItem(item));
    dispatch(setFullMenuItem(item));
    dispatch(setEditMenuItemModalOpened(true));

    if (!path) {
      dispatch(setParentId(''));
      dispatch(setCurrentPath(item.id));
    } else {
      const splittedPath = path.split('.');

      dispatch(setParentId(splittedPath[splittedPath.length - 1]));
      dispatch(setCurrentPath(path));
    }
  };

  const delHandler = () => {
    if (!path) dispatch(setParentId(''));
    else {
      const splittedPath = path.split('.');
      dispatch(setParentId(splittedPath[splittedPath.length - 1]));
      dispatch(setCurrentPath(path));
    }
    dispatch(setMenuItem(item));
    dispatch(setDelMenuItemModalOpened(true));
  };

  return (
    <Group position={'right'}>
      <ActionIcon name="Изменить" title="Изменить" onClick={() => editHandler()}>
        <IconPencil size={20} color="gray" />
      </ActionIcon>

      <ActionIcon name="Удалить" title="Удалить" onClick={() => delHandler()}>
        <IconTrash size={20} color="gray" />
      </ActionIcon>
    </Group>
  );
};

export default DropdownButtonItems;
