import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ActionIcon, Group } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';

import { AppDispatch } from '@/store';
import {
  fetchGetModelElementAction,
  setCurrentModelElement,
  setOpenDelModelElementModal,
  setOpenEditModelElementModal,
} from '@/store/slices/models/model';
import { selectCurrentService } from '@/store/slices/service/service';

const ModelTableButtons: FC = ({ ...props }) => {
  const dispatch: AppDispatch = useDispatch();
  const urlParams = useParams();
  const modelCode = urlParams.modelCode;
  const service = useSelector(selectCurrentService);

  const changeHandler = async () => {
    const { id: modelElementId } = props as Record<string, string>;

    if (modelCode && service) {
      await dispatch(fetchGetModelElementAction({ modelCode, modelElementId }));
      dispatch(setCurrentModelElement({ ...props }));
      dispatch(setOpenEditModelElementModal(true));
    }
  };

  const deleteHandler = () => {
    dispatch(setCurrentModelElement({ ...props }));
    dispatch(setOpenDelModelElementModal(true));
  };

  return (
    <Group position={'right'} noWrap>
      <ActionIcon name="Изменить" title="Изменить" onClick={changeHandler}>
        <IconPencil size={20} color="gray" />
      </ActionIcon>

      <ActionIcon name="Удалить" title="Удалить" onClick={deleteHandler}>
        <IconTrash size={20} color="gray" />
      </ActionIcon>
    </Group>
  );
};

export default ModelTableButtons;
