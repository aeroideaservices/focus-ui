import { FC, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { Box, Button, Modal, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

import { TABLE_CONFIGURATION } from '@/constants/tableHeaders';

import TableExt from '@/ui/organisms/TableExt/TableExt';
import PageBody from '@/ui/templates/Page/components/PageBody/PageBody';
import PageHeader from '@/ui/templates/Page/components/PageHeader/PageHeader';
import PageLoader from '@/ui/templates/Page/components/PageLoader/PageLoader';
import Page from '@/ui/templates/Page/Page';

import ConfigurationTableButtons from './components/ConfigurationTableButtons/ConfigurationTableButtons';
import ConfigurationTableModals from './components/ConfigurationTableModals/ConfigurationTableModals';
import FormNewOption from './components/FormNewOption/FormNewOption';

import { AppDispatch } from '@/store';
import {
  fetchGetConfigurationAction,
  selectConfiguration,
} from '@/store/slices/configuration/configuration';
import {
  fetchGetConfigurationOptionsAction,
  selectAddConfigurationOptionsModal,
  selectConfigurationOptions,
  selectConfigurationOptionsLimit,
  selectConfigurationOptionsOffset,
  selectFetchingGetConfigurationOptions,
  setAddConfigurationOptionsModalOpened,
} from '@/store/slices/configuration/configurationOptions';
import { selectServiceChanged } from '@/store/slices/service/service';

const ConfigurtationContainer: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const params = useParams();
  const configuration = useSelector(selectConfiguration);
  const configurationOptions = useSelector(selectConfigurationOptions);
  const configurationOptionsLimit = useSelector(selectConfigurationOptionsLimit);
  const configurationOptionsOffset = useSelector(selectConfigurationOptionsOffset);
  const configurationOptionsFetch = useSelector(selectFetchingGetConfigurationOptions);
  const configurationOptionsModalNew = useSelector(selectAddConfigurationOptionsModal);
  const serviceChanged = useSelector(selectServiceChanged);
  const [service] = useLocalStorage({ key: 'service' });
  const [, setReloadPage] = useState<any>(null);

  const showConfigurationTitle = useMemo(
    () => !configurationOptionsFetch && configuration?.name?.length,
    [configurationOptionsFetch, configuration]
  );

  const isEmpty = useMemo(() => configurationOptions?.length === 0, [configurationOptions]);

  useEffect(() => {
    if (configuration) setReloadPage(true);
  }, [configuration]);

  useEffect(() => {
    if (params.confId && service && !serviceChanged)
      dispatch(fetchGetConfigurationAction({ confId: params.confId }));
  }, [params, service]);

  useEffect(() => {
    if (params.confId && service) {
      dispatch(
        fetchGetConfigurationOptionsAction({
          id: params.confId,
          params: {
            offset: configurationOptionsOffset,
            limit: configurationOptionsLimit,
          },
        })
      );
    }
  }, [configurationOptionsOffset, configurationOptionsLimit, service]);

  const breadcrumbs = [
    {
      name: 'Конфигурации',
      url: '/configurations',
    },
    {
      name: `Настройки конфигурации: ${showConfigurationTitle ? `: ${configuration?.name}` : ''}`,
    },
  ];

  return (
    <Page>
      <PageHeader
        title={`Настройки конфигурации${showConfigurationTitle ? `: ${configuration?.name}` : ''}`}
        subTitle={
          !configurationOptionsFetch && configuration?.id ? `ID ${configuration?.id}` : undefined
        }
        backLink="/configurations"
        breadcrumbs={breadcrumbs}
        rightButton={
          <Button onClick={() => dispatch(setAddConfigurationOptionsModalOpened(true))}>
            Новая настройка
          </Button>
        }
      />

      {serviceChanged && <Navigate to="/configurations" />}

      <PageBody>
        {(configurationOptionsFetch || isEmpty) && (
          <PageLoader zIndex={100} loading={configurationOptionsFetch} text="Опций не найдено" />
        )}

        {configurationOptions && configurationOptions.length > 0 && (
          <Box h={0} sx={{ flex: '1 0 0' }}>
            <TableExt
              config={TABLE_CONFIGURATION}
              rows={configurationOptions}
              buttons={ConfigurationTableButtons}
            />
          </Box>
        )}
      </PageBody>

      <Modal
        centered
        size={'lg'}
        opened={configurationOptionsModalNew}
        onClose={() => dispatch(setAddConfigurationOptionsModalOpened(false))}
        title={
          <Text fz={22} fw={700}>
            Новая настройка
          </Text>
        }
      >
        <FormNewOption type="new" />
      </Modal>

      <ConfigurationTableModals />
    </Page>
  );
};

export default ConfigurtationContainer;
