import { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { useLocalStorage } from '@mantine/hooks';
import qs from 'qs';

import { getLimitInURL } from '@/utils/getLimitInURL';
import { getOffsetInURL } from '@/utils/getOffsetInURL';

import ModalConfirm from '@/ui/organisms/ModalConfirm/ModalConfirm';

import { getFilterFromRouter } from '../../utils/getFilterFromRouter';
import ModelElementModal from '../ModelElementModal/ModelElementModal';
import { removeModelFromFilter } from '../ModelFiltersBuilder/utils/removeModelFromFilter';

import { AppDispatch } from '@/store';
import {
  fetchDelModelElementAction,
  selectCurrentModelElement,
  selectDelModelElementModal,
  selectEditModelElementModal,
  selectNewModelElementModal,
  setCurrentModelElement,
  setCurrentModelElementData,
  setOpenDelModelElementModal,
  setOpenEditModelElementModal,
  setOpenNewModelElementModal,
} from '@/store/slices/models/model';

const ModelTableModals: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { modelCode } = useParams<{ modelCode: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentModelElement = useSelector(selectCurrentModelElement);
  const delModelElementModal = useSelector(selectDelModelElementModal);
  const newModelElementModel = useSelector(selectNewModelElementModal);
  const editModelElementModel = useSelector(selectEditModelElementModal);
  const [service] = useLocalStorage({ key: 'service' });

  const filter = useMemo(() => getFilterFromRouter(searchParams), [searchParams]);

  const delConfirmHandler = async () => {
    const modelElementId = currentModelElement?.id;

    if (modelCode && modelElementId && service) {
      await dispatch(fetchDelModelElementAction({ modelCode, modelElementId }));

      const newFilters = removeModelFromFilter(currentModelElement, filter);
      const newParams = {
        offset: getOffsetInURL(searchParams),
        limit: getLimitInURL(searchParams),
        ...newFilters,
      };
      const URLParams = qs.stringify(newParams, { indices: false });

      setSearchParams(URLParams);
    }
  };

  return (
    <>
      <ModalConfirm
        title="Вы уверены?"
        text="Восстановить данные после удаления не получится"
        opened={delModelElementModal}
        onClose={() => {
          dispatch(setOpenDelModelElementModal(false));
          dispatch(setCurrentModelElement(null));
          dispatch(setCurrentModelElementData(null));
        }}
        confirmHandler={() => delConfirmHandler()}
      />

      <ModelElementModal
        type="new"
        title="Новый элемент"
        opened={newModelElementModel}
        onClose={() => dispatch(setOpenNewModelElementModal(false))}
      />

      <ModelElementModal
        type="edit"
        title="Изменить элемент"
        opened={editModelElementModel}
        onClose={() => {
          dispatch(setOpenEditModelElementModal(false));
          dispatch(setCurrentModelElement(null));
          dispatch(setCurrentModelElementData(null));
        }}
      />
    </>
  );
};

export default ModelTableModals;
