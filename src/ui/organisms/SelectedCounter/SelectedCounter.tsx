import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Group, Text } from '@mantine/core';

import ModalConfirm from '../ModalConfirm/ModalConfirm';

import { AppDispatch } from '@/store';
import {
  selectDelModelElementModal,
  setOpenDelModelElementModal,
} from '@/store/slices/models/model';

interface ISelectedCounter {
  count: number | null;
  buttonText?: string;
  callback?: () => void;
}

const SelectedCounter: FC<ISelectedCounter> = ({ count, buttonText, callback }) => {
  const dispatch: AppDispatch = useDispatch();
  const delModelElementModal = useSelector(selectDelModelElementModal);

  const clickHandler = () => {
    if (callback) callback();
  };

  return (
    <Group spacing={'xs'}>
      <Text color={'dimmed'}>Выбрано:</Text>
      <Text>{count ? count : 0}</Text>

      {buttonText && (
        <Button
          variant="outline"
          color="red"
          size="xs"
          onClick={() => dispatch(setOpenDelModelElementModal(true))}
        >
          {buttonText}
        </Button>
      )}

      <ModalConfirm
        title="Вы уверены?"
        text="Восстановить данные после удаления не получится"
        opened={delModelElementModal}
        onClose={() => dispatch(setOpenDelModelElementModal(false))}
        confirmHandler={() => clickHandler()}
      />
    </Group>
  );
};

export default SelectedCounter;
