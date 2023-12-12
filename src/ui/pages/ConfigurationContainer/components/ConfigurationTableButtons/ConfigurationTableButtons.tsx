import { TConfigurationOption } from '@/types';

import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { ActionIcon, Group } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';

import { AppDispatch } from '@/store';
import {
  setConfigurationOption,
  setDelConfigurationOptionModalOpened,
  setEditConfigurationOptionModalOpened,
} from '@/store/slices/configuration/configurationOption';

const ConfigurationTableButtons: FC<TConfigurationOption> = ({ ...props }) => {
  const dispatch: AppDispatch = useDispatch();

  const editHandler = () => {
    dispatch(setConfigurationOption({ ...props }));
    dispatch(setEditConfigurationOptionModalOpened(true));
  };

  const delHandler = () => {
    dispatch(setConfigurationOption({ ...props }));
    dispatch(setDelConfigurationOptionModalOpened(true));
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

export default ConfigurationTableButtons;
