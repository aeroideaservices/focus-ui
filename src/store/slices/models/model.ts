import { IModelExportRes } from '@/types/api/models_v2';
import { IModelViews, TObject } from '@/types/models_v2/models_v2';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  apiDelModelElement,
  apiGetModelElement,
  apiPutModelElement,
} from '@/api/models/modelElement';
import {
  apiAddModelElements,
  apiDelModelElements,
  apiGetModelElementsList,
} from '@/api/models/modelElements';
import { apiGetModelExport, apiPostModelExport } from '@/api/models/modelExport';
import { apiGetModel } from '@/api/models/models';

import { createAxiosThunk } from '@/utils/asyncRequest';
import notify from '@/utils/notify';

import { downloadModalExport } from '@/ui/pages/ModelContainer/utils/downloadModalExport';

interface IModelState {
  status: {
    fetchingGetModel: boolean;
    fetchingGetModelElements: boolean;
    fetchingDelModelElements: boolean;
    fetchingAddModelElement: boolean;
    fetchingGetModelElement: boolean;
    fetchingPutModelElement: boolean;
    fetchingDelModelElement: boolean;
    fetchingGetExportModel: boolean;
  };
  modals: {
    delModelElementModal: boolean;
    newModelElementModal: boolean;
    editModelElementModal: boolean;
  };
  modelName: string | null;
  modelViews: IModelViews | null;
  modelElements: TObject[] | null;
  modelElementsTotal: number;
  modelElementsSelected: Record<string, string>[] | null;
  currentModelElement: Record<string, string> | null;
  currentModelElementData: TObject | null;
  modelExport: IModelExportRes | null;
}

const initialState: IModelState = {
  status: {
    fetchingGetModel: false,
    fetchingGetModelElements: false,
    fetchingDelModelElements: false,
    fetchingAddModelElement: false,
    fetchingGetModelElement: false,
    fetchingPutModelElement: false,
    fetchingDelModelElement: false,
    fetchingGetExportModel: false,
  },
  modals: {
    delModelElementModal: false,
    newModelElementModal: false,
    editModelElementModal: false,
  },
  modelName: null,
  modelViews: null,
  modelElements: null,
  modelElementsTotal: 0,
  modelElementsSelected: null,
  currentModelElement: null,
  currentModelElementData: null,
  modelExport: null,
};

export const fetchGetModelAction = createAxiosThunk('getModels', apiGetModel);
export const fetchGetModelElementsAction = createAxiosThunk(
  'getModelElements',
  apiGetModelElementsList
);
export const fetchDelModelElementsAction = createAxiosThunk(
  'deleteModelElements',
  apiDelModelElements
);
export const fetchAddModelElementAction = createAxiosThunk('addModelElement', apiAddModelElements);
export const fetchGetModelElementAction = createAxiosThunk('getModelElement', apiGetModelElement);
export const fetchPutModelElementAction = createAxiosThunk('putModelElement', apiPutModelElement);
export const fetchDelModelElementAction = createAxiosThunk('delModelElement', apiDelModelElement);
export const fetchGetExportModel = createAxiosThunk('getModelExport', apiGetModelExport);
export const fetchPostExportModel = createAxiosThunk('postModelExport', apiPostModelExport);

export const modelSlice = createSlice({
  name: 'model',
  initialState,
  reducers: {
    setCurrentModelElement: (state, action: PayloadAction<Record<string, string> | null>) => {
      state.currentModelElement = action.payload;
    },
    setCurrentModelElementData: (state, action: PayloadAction<Record<string, string> | null>) => {
      state.currentModelElementData = action.payload;
    },
    setModelElementsSelected: (state, action: PayloadAction<Record<string, string>[] | null>) => {
      state.modelElementsSelected = action.payload;
    },
    setModelExport: (state, action: PayloadAction<IModelExportRes | null>) => {
      state.modelExport = action.payload;
    },
    setOpenDelModelElementModal: (state, action: PayloadAction<boolean>) => {
      state.modals.delModelElementModal = action.payload;
    },
    setOpenNewModelElementModal: (state, action: PayloadAction<boolean>) => {
      state.modals.newModelElementModal = action.payload;
    },
    setOpenEditModelElementModal: (state, action: PayloadAction<boolean>) => {
      state.modals.editModelElementModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetModelAction.pending, (state) => {
        state.status.fetchingGetModel = true;
        state.modelName = null;
        state.modelViews = null;
        state.modelElements = null;
        state.modelElementsTotal = 0;
        state.modelElementsSelected = null;
        state.currentModelElement = null;
        state.currentModelElementData = null;
      })
      .addCase(fetchGetModelAction.fulfilled, (state, action) => {
        state.status.fetchingGetModel = false;

        state.modelName = action.payload.name;
        state.modelViews = action.payload.views;
      })
      .addCase(fetchGetModelAction.rejected, (state) => {
        state.status.fetchingGetModel = false;
      });
    builder
      .addCase(fetchGetModelElementsAction.pending, (state) => {
        state.status.fetchingGetModelElements = true;
      })
      .addCase(fetchGetModelElementsAction.fulfilled, (state, action) => {
        state.status.fetchingGetModelElements = false;
        state.modelElements = action.payload.items;
        state.modelElementsTotal = action.payload.total;
      })
      .addCase(fetchGetModelElementsAction.rejected, (state) => {
        state.status.fetchingGetModelElements = false;
      });
    builder
      .addCase(fetchDelModelElementsAction.pending, (state) => {
        state.status.fetchingDelModelElements = true;
      })
      .addCase(fetchDelModelElementsAction.fulfilled, (state) => {
        state.status.fetchingDelModelElements = false;
        state.modelElementsSelected = null;
        state.modals.delModelElementModal = false;
      })
      .addCase(fetchDelModelElementsAction.rejected, (state) => {
        state.modals.delModelElementModal = false;
        state.status.fetchingDelModelElements = false;
      });
    builder
      .addCase(fetchAddModelElementAction.pending, (state) => {
        state.status.fetchingAddModelElement = true;
      })
      .addCase(fetchAddModelElementAction.fulfilled, (state) => {
        state.status.fetchingAddModelElement = false;
        state.modals.newModelElementModal = false;
      })
      .addCase(fetchAddModelElementAction.rejected, (state) => {
        state.status.fetchingAddModelElement = false;
      });
    builder
      .addCase(fetchGetModelElementAction.pending, (state) => {
        state.status.fetchingGetModelElement = true;
      })
      .addCase(fetchGetModelElementAction.fulfilled, (state, action) => {
        state.status.fetchingGetModelElement = false;
        state.currentModelElementData = action.payload;
      })
      .addCase(fetchGetModelElementAction.rejected, (state) => {
        state.status.fetchingGetModelElement = false;
      });
    builder
      .addCase(fetchPutModelElementAction.pending, (state) => {
        state.status.fetchingPutModelElement = true;
      })
      .addCase(fetchPutModelElementAction.fulfilled, (state) => {
        state.status.fetchingPutModelElement = false;
        state.modals.editModelElementModal = false;

        notify({ message: 'Элемент успешно изменён', type: 'success' });
      })
      .addCase(fetchPutModelElementAction.rejected, (state) => {
        state.status.fetchingPutModelElement = false;
      });
    builder
      .addCase(fetchDelModelElementAction.pending, (state) => {
        state.status.fetchingDelModelElement = true;
      })
      .addCase(fetchDelModelElementAction.fulfilled, (state, action) => {
        state.status.fetchingDelModelElement = false;
        state.modals.delModelElementModal = false;

        if (
          state?.modelElementsSelected &&
          state?.modelElementsSelected.length > 1 &&
          state.modelElementsSelected?.includes(action.payload.id)
        ) {
          state!.modelElementsSelected = state?.modelElementsSelected.filter(
            (item) => item !== action.payload.id
          );
        } else {
          state.modelElementsSelected = null;
        }

        notify({ message: 'Элемент модели удалён', type: 'success' });
      })
      .addCase(fetchDelModelElementAction.rejected, (state) => {
        state.status.fetchingDelModelElement = false;
      });
    builder
      .addCase(fetchGetExportModel.pending, (state) => {
        state.status.fetchingGetExportModel = true;
      })
      .addCase(fetchGetExportModel.fulfilled, (state, action) => {
        state.status.fetchingGetExportModel = false;
        state.modelExport = action.payload;

        downloadModalExport(action.payload);
      })
      .addCase(fetchGetExportModel.rejected, (state) => {
        state.status.fetchingGetExportModel = false;
      });
  },
});

type TSelectorState = { model: IModelState };

export const selectFetchingGetModel = (state: TSelectorState) =>
  state.model.status.fetchingGetModel;
export const selectFetchingGetModelElements = (state: TSelectorState) =>
  state.model.status.fetchingGetModelElements;
export const selectFetchingDelModelElements = (state: TSelectorState) =>
  state.model.status.fetchingDelModelElements;
export const selectFetchingAddModelElement = (state: TSelectorState) =>
  state.model.status.fetchingAddModelElement;
export const selectFetchingGetModelElement = (state: TSelectorState) =>
  state.model.status.fetchingGetModelElement;
export const selectFetchingPutModelElement = (state: TSelectorState) =>
  state.model.status.fetchingPutModelElement;
export const selectFetchingDelModelElement = (state: TSelectorState) =>
  state.model.status.fetchingDelModelElement;
export const selectFetchingGetExportModel = (state: TSelectorState) =>
  state.model.status.fetchingGetExportModel;

export const selectDelModelElementModal = (state: TSelectorState) =>
  state.model.modals.delModelElementModal;
export const selectNewModelElementModal = (state: TSelectorState) =>
  state.model.modals.newModelElementModal;
export const selectEditModelElementModal = (state: TSelectorState) =>
  state.model.modals.editModelElementModal;

export const selectModelName = (state: TSelectorState) => state.model.modelName;
export const selectModelViewsList = (state: TSelectorState) => state.model.modelViews?.list.fields;
export const selectModelViewsCreate = (state: TSelectorState) => state.model.modelViews?.create;
export const selectModelViewsUpdate = (state: TSelectorState) => state.model.modelViews?.update;
export const selectModelViewsFilter = (state: TSelectorState) => state.model.modelViews?.filter;
export const selectModelElements = (state: TSelectorState) => state.model.modelElements;
export const selectModelElementsTotal = (state: TSelectorState) => state.model.modelElementsTotal;
export const selectModelElementsSelected = (state: TSelectorState) =>
  state.model.modelElementsSelected;
export const selectCurrentModelElement = (state: TSelectorState) => state.model.currentModelElement;
export const selectCurrentModelElementData = (state: TSelectorState) =>
  state.model.currentModelElementData;
export const selectModelExport = (state: TSelectorState) => state.model.modelExport;

export const {
  setCurrentModelElement,
  setCurrentModelElementData,
  setModelElementsSelected,
  setOpenDelModelElementModal,
  setOpenEditModelElementModal,
  setOpenNewModelElementModal,
  setModelExport,
} = modelSlice.actions;

export default modelSlice.reducer;
