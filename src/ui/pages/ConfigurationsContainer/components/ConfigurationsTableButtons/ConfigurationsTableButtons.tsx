import { TConfiguration } from '@/types';

import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ActionIcon, Group } from '@mantine/core';
import { IconAlignRight, IconFileDescription, IconPencil, IconTrash } from '@tabler/icons-react';

import { AppDispatch } from '@/store';
import {
  setEditConfigurationModalOpen,
  setOpenDelConfigurationModal,
} from '@/store/slices/configuration/configuration';
import {
  fetchGetConfigurationOptionsAction,
  selectConfigurationOptionsLimit,
  selectConfigurationOptionsOffset,
  setFillConfigurationOptionsModalOpen,
} from '@/store/slices/configuration/configurationOptions';
import { setCurrentConfiguration } from '@/store/slices/configuration/configurations';
import { selectCurrentService, setServiceChanged } from '@/store/slices/service/service';

const ConfigurationsTableButtons: FC<TConfiguration> = ({ ...props }) => {
  const dispatch: AppDispatch = useDispatch();
  const service = useSelector(selectCurrentService);
  const configurationOptionsLimit = useSelector(selectConfigurationOptionsLimit);
  const configurationOptionsOffset = useSelector(selectConfigurationOptionsOffset);

  const fillHandler = () => {
    dispatch(setCurrentConfiguration({ ...props }));
    dispatch(setFillConfigurationOptionsModalOpen(true));
    if (service) {
      dispatch(
        fetchGetConfigurationOptionsAction({
          id: props.id,
          params: { limit: configurationOptionsLimit, offset: configurationOptionsOffset },
        })
      );
    }
  };

  const editHandler = () => {
    dispatch(setCurrentConfiguration({ ...props }));
    dispatch(setEditConfigurationModalOpen(true));
  };

  const delHandler = () => {
    dispatch(setCurrentConfiguration({ ...props }));
    dispatch(setOpenDelConfigurationModal(true));
  };

  return (
    <Group position={'right'} noWrap>
      <ActionIcon
        title="Опции"
        component={Link}
        to={`${props.id}`}
        onClick={() => dispatch(setServiceChanged(false))}
      >
        <IconAlignRight size={20} color="gray" />
      </ActionIcon>

      <ActionIcon name="Заполнить" title="Заполнить" onClick={() => fillHandler()}>
        <IconFileDescription size={20} color="gray" />
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

export default ConfigurationsTableButtons;
