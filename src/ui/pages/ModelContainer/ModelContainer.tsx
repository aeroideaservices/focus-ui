import { TObject } from '@/types/models_v2/models_v2';

import { FC, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { Box, Button, Flex, Group, Pagination } from '@mantine/core';
import qs from 'qs';

import { useURLPagination } from '@/hooks/useUrlPagination';

import SelectedCounter from '@/ui/organisms/SelectedCounter/SelectedCounter';
import ShowElements from '@/ui/organisms/ShowElements/ShowElements';
import TableExt from '@/ui/organisms/TableExt/TableExt';
import PageBody from '@/ui/templates/Page/components/PageBody/PageBody';
import PageFooter from '@/ui/templates/Page/components/PageFooter/PageFooter';
import PageHeader from '@/ui/templates/Page/components/PageHeader/PageHeader';
import PageLoader from '@/ui/templates/Page/components/PageLoader/PageLoader';
import Page from '@/ui/templates/Page/Page';

import ModelFiltersBuilder from './components/ModelFiltersBuilder/ModelFiltersBuilder';
import { removeModelFromFilter } from './components/ModelFiltersBuilder/utils/removeModelFromFilter';
import ModelTableButtons from './components/ModelTableButtons/ModelTableButtons';
import ModelTableModals from './components/ModelTableModals/ModelTableModals';
import { generateElements } from './utils/generateElements';
import { getFilterFromRouter } from './utils/getFilterFromRouter';
import { getSortableKeys } from './utils/getSortableKeys';
import { ModelContext } from './utils/modelContext';

import { AppDispatch } from '@/store';
import {
  fetchDelModelElementsAction,
  fetchGetExportModel,
  fetchGetModelAction,
  fetchGetModelElementsAction,
  fetchPostExportModel,
  selectFetchingGetModelElements,
  selectModelElements,
  selectModelElementsSelected,
  selectModelElementsTotal,
  selectModelName,
  selectModelViewsFilter,
  selectModelViewsList,
  setModelElementsSelected,
  setOpenNewModelElementModal,
} from '@/store/slices/models/model';

const ModelContainerV2: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { modelCode } = useParams<{ modelCode: string }>();
  const [modelExportLoading, setModelExportLoading] = useState<boolean>(false);
  const modelName = useSelector(selectModelName);
  const modelViewsList = useSelector(selectModelViewsList);
  const modelViewsFilter = useSelector(selectModelViewsFilter);
  const fetchingModelElements = useSelector(selectFetchingGetModelElements);
  const modelElements = useSelector(selectModelElements);
  const modelElementsTotal = useSelector(selectModelElementsTotal);
  const modelElementsSelected = useSelector(selectModelElementsSelected);
  const { currentPage, setPage, pagesCount, currentOffset, currentLimit, setLimit } =
    useURLPagination(modelElementsTotal);

  const params = useMemo(
    () => ({
      limit: currentLimit,
      offset: currentOffset,
    }),
    [currentLimit, currentOffset]
  );

  const filter = useMemo(() => getFilterFromRouter(searchParams), [searchParams]);

  const breadcrumbs = [
    {
      name: 'Модели',
      url: '/models-v2',
    },
    {
      name: `Элементы модели${modelName ? `: ${modelName}` : ''}`,
    },
  ];

  const reloadHandler = () => {
    if (!modelCode) return;

    dispatch(
      fetchGetModelElementsAction({
        modelCode,
        params,
        data: { filter: filter as TObject },
      })
    );
  };

  const showSelectedCounter = () => {
    if (modelElementsSelected && modelElementsSelected.length > 0) return true;

    return false;
  };

  const delElementsHandler = async () => {
    if (modelCode && modelElementsSelected) {
      await dispatch(
        fetchDelModelElementsAction({
          modelCode,
          data: { pKeys: modelElementsSelected.map((el) => el.id) },
        })
      );

      const newFilters = filter;

      modelElementsSelected.forEach((el) => {
        removeModelFromFilter(el, newFilters);
      });

      const newParams = {
        ...params,
        ...newFilters,
      };
      const URLParams = qs.stringify(newParams, { indices: false });

      setSearchParams(URLParams);
    }
  };

  const newModalElementHandler = () => {
    dispatch(setOpenNewModelElementModal(true));
  };

  const handleExportModel = (code?: string) => {
    if (code) {
      dispatch(fetchPostExportModel({ modelCode: code })).then(() => {
        setModelExportLoading(true);

        setTimeout(() => {
          dispatch(fetchGetExportModel({ modelCode: code })).finally(() => {
            setModelExportLoading(false);
          });
        }, 2000);
      });
    }
  };

  const getRightButton = (code?: string) => {
    switch (code) {
      case 'subscriptions':
      case 'partnership-requests':
      case 'category-requests':
        return (
          <Button onClick={() => handleExportModel(code)} loading={modelExportLoading}>
            Сохранить файл
          </Button>
        );
      default:
        return <Button onClick={newModalElementHandler}>Новый элемент</Button>;
    }
  };

  useEffect(() => {
    if (modelCode) {
      dispatch(fetchGetModelAction(modelCode));
    }
  }, []);

  useEffect(() => {
    reloadHandler();
  }, [searchParams]);

  return (
    <Page>
      <ModelContext.Provider value={reloadHandler}>
        <PageHeader
          title={`Элементы модели${modelName ? `: ${modelName}` : ''}`}
          backLink="/models-v2"
          breadcrumbs={breadcrumbs}
          rightButton={getRightButton(modelCode)}
        />

        <PageBody>
          <Flex align="flex-start" justify="space-between" mb={24} gap={15}>
            <Flex align="stretch" w={'100%'}>
              {modelViewsFilter && modelViewsFilter.formFields && (
                <ModelFiltersBuilder fields={modelViewsFilter.formFields} />
              )}
            </Flex>
            <ShowElements
              pt={modelViewsFilter && modelViewsFilter.formFields ? 23 : 0}
              defaultValue={params.limit}
              changeCallback={setLimit}
            />
          </Flex>

          {(!modelElements || modelElements.length === 0 || fetchingModelElements) && (
            <PageLoader loading={fetchingModelElements} text="У модели пока нет элементов" />
          )}

          {modelViewsList && modelElements && (
            <Box h={0} sx={{ flex: '1 0 0' }}>
              <TableExt
                config={modelViewsList}
                buttons={ModelTableButtons}
                rows={generateElements(modelElements, modelViewsList)}
                selectCallback={(values) => dispatch(setModelElementsSelected(values))}
                sortableKeys={getSortableKeys(modelViewsList)}
                selectable
              />
            </Box>
          )}

          <PageFooter>
            <Group position="apart" grow>
              {showSelectedCounter() && (
                <SelectedCounter
                  count={modelElementsSelected && modelElementsSelected.length}
                  buttonText="Удалить"
                  callback={delElementsHandler}
                />
              )}

              {pagesCount > 1 && (
                <Pagination
                  position={'right'}
                  value={currentPage}
                  total={pagesCount}
                  onChange={setPage}
                />
              )}
            </Group>
          </PageFooter>
        </PageBody>
        <ModelTableModals />
      </ModelContext.Provider>
    </Page>
  );
};

export default ModelContainerV2;
