import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Group, Pagination } from '@mantine/core';

import { LIMIT } from '@/constants/common';
import { TABLE_MODELS } from '@/constants/tableHeaders';
import { useServices } from '@/hooks/useServices';
import { useURLPagination } from '@/hooks/useUrlPagination';

import ShowElements from '@/ui/organisms/ShowElements/ShowElements';
import TableExt from '@/ui/organisms/TableExt/TableExt';
import PageBody from '@/ui/templates/Page/components/PageBody/PageBody';
import PageFooter from '@/ui/templates/Page/components/PageFooter/PageFooter';
import PageHeader from '@/ui/templates/Page/components/PageHeader/PageHeader';
import PageLoader from '@/ui/templates/Page/components/PageLoader/PageLoader';
import Page from '@/ui/templates/Page/Page';

import ModelsTableButtons from './components/ModelsTableButtons/ModelsTableButtons';

import { AppDispatch } from '@/store';
import {
  fetchGetModelsAction,
  selectFetchingGetModels,
  selectModels,
  selectModelsTotal,
  setModels,
} from '@/store/slices/models/models';

const ModelsContainerV2: FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const fetchingModels = useSelector(selectFetchingGetModels);
  const models = useSelector(selectModels);
  const modelsTotal = useSelector(selectModelsTotal);
  const { currentService } = useServices();
  const { currentLimit, currentOffset, currentPage, pagesCount, setLimit, setPage } =
    useURLPagination(modelsTotal);

  useEffect(() => {
    dispatch(fetchGetModelsAction({ limit: currentLimit, offset: currentOffset }));

    return () => {
      dispatch(setModels(null));
    };
  }, [currentLimit, currentOffset, currentService]);

  return (
    <Page>
      <PageHeader title="Модели" />
      <PageBody>
        {(!models || models.length === 0 || fetchingModels) && (
          <PageLoader loading={fetchingModels} text="У вас пока нет моделей" />
        )}

        {models && models.length > 0 && (
          <>
            <Group mb={24} position="right" grow>
              <ShowElements defaultValue={LIMIT} changeCallback={setLimit} />
            </Group>

            <Box sx={{ flex: '1 0 0' }}>
              <TableExt config={TABLE_MODELS} rows={models} buttons={ModelsTableButtons} />
            </Box>
          </>
        )}

        <PageFooter>
          {pagesCount > 1 && (
            <Pagination
              position={'right'}
              value={currentPage}
              total={pagesCount}
              onChange={setPage}
            />
          )}
        </PageFooter>
      </PageBody>
    </Page>
  );
};

export default ModelsContainerV2;
