import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Modal, Text } from '@mantine/core';

import { useURLPagination } from '@/hooks/useUrlPagination';

import ModalConfirm from '@/ui/organisms/ModalConfirm/ModalConfirm';

import FormNewConfiguration from '../FormNewConfiguration/FormNewConfiguration';
import ModalFillConfiguration from '../ModalFillConfiguration/ModalFillConfiguration';

import { AppDispatch } from '@/store';
import {
  fetchDelConfigurationAction,
  selectDelConfigurationModal,
  selectEditConfigurationModal,
  setEditConfigurationModalOpen,
  setOpenDelConfigurationModal,
} from '@/store/slices/configuration/configuration';
import {
  selectFillConfigurationOptionsModal,
  setFillConfigurationOptionsModalOpen,
} from '@/store/slices/configuration/configurationOptions';
import {
  fetchConfigurationsAction,
  selectConfigurationsTotal,
  selectCurrentConfiguration,
} from '@/store/slices/configuration/configurations';
import { selectCurrentService } from '@/store/slices/service/service';

const ConfigurationsTableModals: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const currentConfiguration = useSelector(selectCurrentConfiguration);
  const configurationsTotal = useSelector(selectConfigurationsTotal);
  const configurationsModalFill = useSelector(selectFillConfigurationOptionsModal);
  const configurationsModalDel = useSelector(selectDelConfigurationModal);
  const configurationsModalEdit = useSelector(selectEditConfigurationModal);
  const service = useSelector(selectCurrentService);
  const { currentLimit, currentOffset } = useURLPagination(configurationsTotal || 0);

  const delConfirmHandler = async () => {
    if (currentConfiguration && service) {
      await dispatch(fetchDelConfigurationAction({ id: currentConfiguration.id }));
    }
    if (service) {
      await dispatch(
        fetchConfigurationsAction({
          params: { offset: currentOffset, limit: currentLimit },
        })
      );
    }
  };

  return (
    <>
      <ModalConfirm
        title="Вы уверены?"
        text="Восстановить данные после удаления не получится"
        opened={configurationsModalDel}
        onClose={() => dispatch(setOpenDelConfigurationModal(false))}
        confirmHandler={delConfirmHandler}
      />

      <Modal
        centered
        size={'lg'}
        opened={configurationsModalEdit}
        onClose={() => dispatch(setEditConfigurationModalOpen(false))}
        title={
          <Box>
            <Text fz={22} fw={700}>
              Изменения конфигурации
            </Text>
            <Text
              sx={(theme) => ({ fontWeight: 700, color: theme.colors.gray[6] })}
            >{`ID ${currentConfiguration?.id}`}</Text>
          </Box>
        }
      >
        <FormNewConfiguration type="edit" element={currentConfiguration} />
      </Modal>

      <ModalFillConfiguration
        title="Настройка конфигурации"
        confId={currentConfiguration?.id as string}
        opened={configurationsModalFill}
        onClose={() => dispatch(setFillConfigurationOptionsModalOpen(false))}
      />
    </>
  );
};

export default ConfigurationsTableModals;
