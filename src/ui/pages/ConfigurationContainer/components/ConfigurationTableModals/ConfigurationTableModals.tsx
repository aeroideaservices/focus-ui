import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { Box, Modal, Text } from '@mantine/core';

import { getLimitInURL } from '@/utils/getLimitInURL';
import { getOffsetInURL } from '@/utils/getOffsetInURL';

import ModalConfirm from '@/ui/organisms/ModalConfirm/ModalConfirm';

import FormNewOption from '../FormNewOption/FormNewOption';

import { AppDispatch } from '@/store';
import {
  fetchDelConfigurationOptionAction,
  selectConfigurationOption,
  selectDelConfigurationOptionModal,
  selectEditConfigurationOptionModal,
  setDelConfigurationOptionModalOpened,
  setEditConfigurationOptionModalOpened,
} from '@/store/slices/configuration/configurationOption';
import { fetchGetConfigurationOptionsAction } from '@/store/slices/configuration/configurationOptions';
import { selectCurrentService } from '@/store/slices/service/service';

const ConfigurationTableModals: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const configurationOption = useSelector(selectConfigurationOption);
  const delConfigurationOptionModal = useSelector(selectDelConfigurationOptionModal);
  const editConfigurationOptionModal = useSelector(selectEditConfigurationOptionModal);
  const service = useSelector(selectCurrentService);

  const delConfirmHandler = async () => {
    const { confId } = params;
    const optId = configurationOption?.id;

    if (confId && optId && service) {
      await dispatch(fetchDelConfigurationOptionAction({ confId, optId }));
      await dispatch(
        fetchGetConfigurationOptionsAction({
          id: confId,
          params: {
            offset: getOffsetInURL(searchParams),
            limit: getLimitInURL(searchParams),
          },
        })
      );
    }
  };

  return (
    <>
      <ModalConfirm
        title="Вы уверены?"
        text="Восстановить данные после удаления не получится"
        opened={delConfigurationOptionModal}
        onClose={() => dispatch(setDelConfigurationOptionModalOpened(false))}
        confirmHandler={() => delConfirmHandler()}
      />

      <Modal
        centered
        size={'lg'}
        opened={editConfigurationOptionModal}
        onClose={() => dispatch(setEditConfigurationOptionModalOpened(false))}
        title={
          <Box>
            <Text fz={22} fw={700}>
              Изменение настройки
            </Text>
            <Text
              sx={(theme) => ({ fontWeight: 700, color: theme.colors.gray[6] })}
            >{`ID ${configurationOption?.id}`}</Text>
          </Box>
        }
      >
        <FormNewOption type="edit" element={configurationOption} />
      </Modal>
    </>
  );
};

export default ConfigurationTableModals;
