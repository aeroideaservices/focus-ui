import { TMenu } from '@/types';

import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ActionIcon, Group } from '@mantine/core';
import { IconAlignRight, IconPencil, IconTrash } from '@tabler/icons-react';

import { AppDispatch } from '@/store';
import { setDelMenuModalOpen, setEditMenuModalOpen } from '@/store/slices/menu/menu';
import { setCurrentMenu } from '@/store/slices/menu/menus';

const MenusTableButtons: FC<TMenu> = ({ ...props }) => {
  const dispatch: AppDispatch = useDispatch();

  const editHandler = () => {
    dispatch(setCurrentMenu({ ...props }));
    dispatch(setEditMenuModalOpen(true));
  };

  const delHandler = () => {
    dispatch(setCurrentMenu({ ...props }));
    dispatch(setDelMenuModalOpen(true));
  };

  return (
    <Group position={'right'}>
      <ActionIcon title="Опции" component={Link} to={`${props.id}`}>
        <IconAlignRight size={20} color="gray" />
      </ActionIcon>

      <ActionIcon name="Изменить" title="Изменить" onClick={() => editHandler()}>
        <IconPencil size={20} color="gray" />
      </ActionIcon>

      <ActionIcon name="Удалить" title="Удалить" onClick={() => delHandler()}>
        <IconTrash size={20} color="gray" />
      </ActionIcon>
    </Group>
  );
};

export default MenusTableButtons;
