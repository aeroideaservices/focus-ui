import { FC, useMemo } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Group, Modal, Pagination, Text } from '@mantine/core';

import { LIMIT, OFFSET } from '@/constants/common';
import { PluginCode } from '@/constants/plugins';
import { TABLE_CONFIGURATIONS } from '@/constants/tableHeaders';
import { withInitialThunk } from '@/hocs/withInitialThunk';
import { useServices } from '@/hooks/useServices';
import { useURLPagination } from '@/hooks/useUrlPagination';

import SearchInput from '@/ui/organisms/SearchInput/SearchInput';
import ShowElements from '@/ui/organisms/ShowElements/ShowElements';
import TableExt from '@/ui/organisms/TableExt/TableExt';
import PageBody from '@/ui/templates/Page/components/PageBody/PageBody';
import PageFooter from '@/ui/templates/Page/components/PageFooter/PageFooter';
import PageHeader from '@/ui/templates/Page/components/PageHeader/PageHeader';
import PageLoader from '@/ui/templates/Page/components/PageLoader/PageLoader';
import Page from '@/ui/templates/Page/Page';

import ConfigurationsTableButtons from './components/ConfigurationsTableButtons/ConfigurationsTableButtons';
import ConfigurationsTableModals from './components/ConfigurationsTableModals/ConfigurationsTableModals';
import FormNewConfiguration from './components/FormNewConfiguration/FormNewConfiguration';

import { AppDispatch } from '@/store';
import {
  fetchConfigurationsAction,
  selectConfigurationsItems,
  selectConfigurationsTotal,
  selectFetchingConfigurationsStatus,
  selectModalNewConfiguration,
  setModalNewConfigurationsOpened,
} from '@/store/slices/configuration/configurations';
import { setServiceChanged } from '@/store/slices/service/service';

const ConfigurationsContainer: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const configurationsItems = useSelector(selectConfigurationsItems);
  const configurationsTotal = useSelector(selectConfigurationsTotal);
  const configurationsFetch = useSelector(selectFetchingConfigurationsStatus);
  const configurationsModalNew = useSelector(selectModalNewConfiguration);
  const { availablePlugins, currentService } = useServices();
  const { currentPage, pagesCount, setPage, currentLimit, currentOffset, setLimit } =
    useURLPagination(configurationsTotal || 0);
  const isConfigsAvailable = useMemo(
    () => availablePlugins.includes(PluginCode.CONFIGURATIONS),
    [availablePlugins]
  );

  const params = useMemo(
    () => ({
      limit: currentLimit,
      offset: currentOffset,
    }),
    [currentLimit, currentOffset]
  );

  useEffect(() => {
    dispatch(setServiceChanged(false));
  }, []);

  useEffect(() => {
    if (!isConfigsAvailable) return;
    dispatch(
      fetchConfigurationsAction({
        params,
      })
    );
  }, [currentLimit, currentOffset, currentService]);

  const searchAction = (query: string) => {
    if (currentService) {
      dispatch(
        fetchConfigurationsAction({
          params: { offset: currentOffset, limit: currentLimit, query },
        })
      );
    }
  };

  return (
    <Page>
      <PageHeader
        title="Конфигурации"
        rightButton={
          <Button onClick={() => dispatch(setModalNewConfigurationsOpened(true))}>
            Новая конфигурация
          </Button>
        }
      />

      <PageBody>
        {!Boolean(configurationsItems?.length) ||
          (configurationsFetch && (
            <PageLoader zIndex={100} loading={configurationsFetch} text="У вас нет конфигураций" />
          ))}

        {configurationsItems && Boolean(configurationsItems?.length) && (
          <>
            <Group mb={24} position="apart" grow>
              <SearchInput searchAction={searchAction} />
              <ShowElements defaultValue={params.limit} changeCallback={setLimit} />
            </Group>

            <Box h={0} sx={{ flex: '1 0 0' }}>
              <TableExt
                config={TABLE_CONFIGURATIONS}
                rows={configurationsItems}
                buttons={ConfigurationsTableButtons}
              />
            </Box>

            <PageFooter>
              {pagesCount > 1 && (
                <Pagination
                  position={'right'}
                  total={pagesCount}
                  value={currentPage}
                  onChange={setPage}
                />
              )}
            </PageFooter>
          </>
        )}
      </PageBody>

      <Modal
        centered
        size={'lg'}
        opened={configurationsModalNew}
        onClose={() => dispatch(setModalNewConfigurationsOpened(false))}
        title={
          <Text fz={22} fw={700}>
            Новая конфигурация
          </Text>
        }
      >
        <FormNewConfiguration type="new" />
      </Modal>

      <ConfigurationsTableModals />
    </Page>
  );
};

export default withInitialThunk(
  ConfigurationsContainer,
  fetchConfigurationsAction({
    params: { offset: OFFSET, limit: LIMIT },
  })
);
