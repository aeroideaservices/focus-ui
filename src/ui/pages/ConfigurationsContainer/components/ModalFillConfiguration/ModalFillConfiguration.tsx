import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Modal, ModalProps, Text } from '@mantine/core';

import FormBuilder from '@/ui/organisms/FormBuilder/FormBuilder';
import { LoaderOverlay } from '@/ui/organisms/LoaderOverlay/LoaderOverlay';

import { getConfigurationOptions } from './utils/getConfigurationOptions';

import { AppDispatch } from '@/store';
import {
  fetchPutConfigurationOptionsAction,
  selectConfigurationOptions,
  selectFetchingGetConfigurationOptions,
} from '@/store/slices/configuration/configurationOptions';
import { selectCurrentService } from '@/store/slices/service/service';

interface IModalFillConfiguration extends ModalProps {
  title: string;
  confId: string | null;
}

const ModalFillConfiguration: FC<IModalFillConfiguration> = ({ title, confId, ...props }) => {
  const dispatch: AppDispatch = useDispatch();
  const fetchingOptions = useSelector(selectFetchingGetConfigurationOptions);
  const options = useSelector(selectConfigurationOptions);
  const service = useSelector(selectCurrentService);

  const formSubmit = (values: Record<string, unknown>) => {
    if (confId && service)
      dispatch(
        fetchPutConfigurationOptionsAction({
          id: confId,
          options: getConfigurationOptions(values),
        })
      );
  };

  return (
    <Modal
      centered
      size={'lg'}
      {...props}
      title={
        <Box>
          <Text fz={22} fw={700}>
            {title}
          </Text>
          <Text weight={'bold'} color="dimmed">{`ID ${confId}`}</Text>
        </Box>
      }
    >
      {fetchingOptions ? (
        <LoaderOverlay visible={fetchingOptions} />
      ) : options && options?.length > 0 ? (
        <FormBuilder options={options} onSubmit={formSubmit} />
      ) : (
        <Text align="center">Опций не найдено</Text>
      )}
    </Modal>
  );
};

export default ModalFillConfiguration;
