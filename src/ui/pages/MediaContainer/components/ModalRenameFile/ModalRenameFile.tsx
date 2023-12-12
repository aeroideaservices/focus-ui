import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Text } from '@mantine/core';

import FormRenameFile from '../FormRenameFile/FormRenameFile';

import { AppDispatch } from '@/store';
import { selectRenameFileModal, setRenameFileModalOpened } from '@/store/slices/media/mediaFiles';

const ModalRenameFile: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const opened = useSelector(selectRenameFileModal);

  return (
    <Modal
      centered
      opened={opened}
      onClose={() => dispatch(setRenameFileModalOpened(false))}
      title={
        <Text fz={22} fw={700}>
          Переименовать
        </Text>
      }
    >
      <FormRenameFile />
    </Modal>
  );
};

export default ModalRenameFile;
