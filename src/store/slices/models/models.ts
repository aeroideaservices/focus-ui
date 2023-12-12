import { TModelItem } from '@/types/models_v2/models_v2';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { apiGetModels } from '@/api/models/models';

import { createAxiosThunk } from '@/utils/asyncRequest';

interface IModelsState {
  status: {
    fetchingGetModels: boolean;
  };
  models: TModelItem[] | null;
  total: number;
}

const initialState: IModelsState = {
  status: {
    fetchingGetModels: false,
  },
  models: null,
  total: 0,
};

export const fetchGetModelsAction = createAxiosThunk('getModels', apiGetModels);

export const modelsSlice = createSlice({
  name: 'models',
  initialState,
  reducers: {
    setModels: (state, action: PayloadAction<TModelItem[] | null>) => {
      state.models = action.payload;
      if (action.payload?.length) {
        state.total = action.payload.length;
      } else {
        state.total = 0;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetModelsAction.pending, (state) => {
        state.status.fetchingGetModels = true;
      })
      .addCase(fetchGetModelsAction.fulfilled, (state, action) => {
        state.status.fetchingGetModels = false;
        state.models = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchGetModelsAction.rejected, (state) => {
        state.status.fetchingGetModels = false;
      });
  },
});

type TSelectorState = { models: IModelsState };

export const selectFetchingGetModels = (state: TSelectorState) =>
  state.models.status.fetchingGetModels;

export const selectModels = (state: TSelectorState) => state.models.models;
export const selectModelsTotal = (state: TSelectorState) => state.models.total;

export const { setModels } = modelsSlice.actions;

export default modelsSlice.reducer;
