import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Modal, Text } from '@mantine/core';

import AddDomainForm from '../AddDomainForm/AddDomainForm';

import { AppDispatch } from '@/store';
import { selectAddDomainModal, setAddDomainModalOpen } from '@/store/slices/menu/menus';

const AddDomainModal: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const addDomainModal = useSelector(selectAddDomainModal);

  return (
    <Modal
      centered
      size={'lg'}
      opened={addDomainModal}
      onClose={() => dispatch(setAddDomainModalOpen(false))}
      title={
        <Text fw={700} fz={22}>
          Добавить домен
        </Text>
      }
    >
      <AddDomainForm />
    </Modal>
  );
};

export default AddDomainModal;
