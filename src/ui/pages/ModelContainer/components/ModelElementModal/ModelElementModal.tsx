import { FC, useContext } from 'react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Modal, ModalProps, Text } from '@mantine/core';

import { LoaderOverlay } from '@/ui/organisms/LoaderOverlay/LoaderOverlay';

import { getFileds } from '../../utils/getFileds';
import { ModelContext } from '../../utils/modelContext';
import ModelFormBuilder from '../ModelFormBuilder/ModelFormBuilder';

import { AppDispatch } from '@/store';
import {
  fetchAddModelElementAction,
  fetchPutModelElementAction,
  selectCurrentModelElement,
  selectCurrentModelElementData,
  selectFetchingAddModelElement,
  selectFetchingGetModelElement,
  selectModelViewsCreate,
  selectModelViewsUpdate,
} from '@/store/slices/models/model';
import { selectCurrentService } from '@/store/slices/service/service';

interface IModelElementModal extends ModalProps {
  title: string;
  type: 'new' | 'edit';
}

const ModelElementModal: FC<IModelElementModal> = ({ title, type, ...props }) => {
  const dispatch: AppDispatch = useDispatch();
  const { modelCode } = useParams<{ modelCode: string }>();
  const modelViewsCreate = useSelector(selectModelViewsCreate);
  const modelViewsUpdate = useSelector(selectModelViewsUpdate);
  const fetchingGetModelElement = useSelector(selectFetchingGetModelElement);
  const fetchingAddModelElement = useSelector(selectFetchingAddModelElement);
  const currentModelElement = useSelector(selectCurrentModelElement);
  const currentModelElementData = useSelector(selectCurrentModelElementData);
  const service = useSelector(selectCurrentService);
  const reloadCallback = useContext(ModelContext);

  const submitHandler = async (values: any) => {
    if (modelCode && service && type === 'new') {
      await dispatch(fetchAddModelElementAction({ modelCode, data: values }));

      reloadCallback();
    }

    if (modelCode && service && type === 'edit') {
      const { id: modelElementId } = currentModelElement as Record<string, string>;

      await dispatch(fetchPutModelElementAction({ modelCode, modelElementId, data: values }));

      reloadCallback();
    }
  };

  return (
    <Modal
      centered
      size={765}
      {...props}
      title={
        <Text fw={700} fz="xl">
          {title}
        </Text>
      }
    >
      <LoaderOverlay visible={fetchingGetModelElement} />

      {modelViewsCreate && type === 'new' && (
        <ModelFormBuilder
          fields={modelViewsCreate.formFields}
          validation={modelViewsCreate.validation}
          onSubmit={submitHandler}
          loading={fetchingAddModelElement}
        />
      )}

      {modelViewsUpdate && type === 'edit' && (
        <ModelFormBuilder
          fields={getFileds(modelViewsUpdate.formFields, currentModelElementData)}
          validation={modelViewsUpdate.validation}
          onSubmit={submitHandler}
          loading={fetchingAddModelElement}
          type={type}
        />
      )}
    </Modal>
  );
};

export default ModelElementModal;
