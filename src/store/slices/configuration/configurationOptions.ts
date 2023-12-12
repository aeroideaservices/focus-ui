import { TConfigurationOption } from '@/types';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  apiAddConfigurationOptions,
  apiGetConfigurationOptions,
  apiPutConfigurationOptions,
} from '@/api';

import { createAxiosThunk } from '@/utils/asyncRequest';
import notify from '@/utils/notify';

import { CONFIGURATION_OPTIONS_LIMIT, OFFSET } from '@/constants/common';

interface IConfigurationOptionsState {
  status: {
    fetchingGetConfigurationOptions: boolean;
    fetchingAddConfigurationOptions: boolean;
    fetchingPutConfigurationOptions: boolean;
  };
  modals: {
    addConfigurationOptionsModal: boolean;
    fillConfigurationOptionsModal: boolean;
  };
  options: TConfigurationOption[] | null;
  total: number | null;
  limit: number;
  offset: number;
}

const initialState: IConfigurationOptionsState = {
  status: {
    fetchingGetConfigurationOptions: false,
    fetchingAddConfigurationOptions: false,
    fetchingPutConfigurationOptions: false,
  },
  modals: {
    addConfigurationOptionsModal: false,
    fillConfigurationOptionsModal: false,
  },
  options: null,
  total: null,
  limit: CONFIGURATION_OPTIONS_LIMIT,
  offset: OFFSET,
};

export const fetchGetConfigurationOptionsAction = createAxiosThunk(
  '/GetConfigurationOptions',
  apiGetConfigurationOptions
);
export const fetchAddConfigurationOptionsAction = createAxiosThunk(
  '/AddConfigurationOptions',
  apiAddConfigurationOptions
);
export const fetchPutConfigurationOptionsAction = createAxiosThunk(
  '/PutConfigurationOptions',
  apiPutConfigurationOptions
);

export const configurationOptionsSlice = createSlice({
  name: 'configurationOptions',
  initialState,
  reducers: {
    setConfigurationOptionsLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setConfigurationOptionsOffset: (state, action: PayloadAction<number>) => {
      state.offset = action.payload;
    },
    setAddConfigurationOptionsModalOpened: (state, action: PayloadAction<boolean>) => {
      state.modals.addConfigurationOptionsModal = action.payload;
    },
    setFillConfigurationOptionsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.modals.fillConfigurationOptionsModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetConfigurationOptionsAction.pending, (state) => {
        state.status.fetchingGetConfigurationOptions = true;
      })
      .addCase(fetchGetConfigurationOptionsAction.fulfilled, (state, action) => {
        state.status.fetchingGetConfigurationOptions = false;
        state.options = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchGetConfigurationOptionsAction.rejected, (state) => {
        state.status.fetchingGetConfigurationOptions = false;
      });
    builder
      .addCase(fetchAddConfigurationOptionsAction.pending, (state) => {
        state.status.fetchingAddConfigurationOptions = true;
      })
      .addCase(fetchAddConfigurationOptionsAction.fulfilled, (state) => {
        state.status.fetchingAddConfigurationOptions = false;
        state.modals.addConfigurationOptionsModal = false;

        notify({ message: 'Опция добавлена', type: 'success' });
      })
      .addCase(fetchAddConfigurationOptionsAction.rejected, (state) => {
        state.status.fetchingAddConfigurationOptions = false;
      });
    builder
      .addCase(fetchPutConfigurationOptionsAction.pending, (state) => {
        state.status.fetchingPutConfigurationOptions = true;
      })
      .addCase(fetchPutConfigurationOptionsAction.fulfilled, (state) => {
        state.status.fetchingPutConfigurationOptions = false;
        state.modals.fillConfigurationOptionsModal = false;

        notify({ message: 'Настройки сохранены', type: 'success' });
      })
      .addCase(fetchPutConfigurationOptionsAction.rejected, (state) => {
        state.status.fetchingPutConfigurationOptions = false;
      });
  },
});

type TSelectorState = { configurationOptions: IConfigurationOptionsState };

export const selectFetchingGetConfigurationOptions = (state: TSelectorState) =>
  state.configurationOptions.status.fetchingGetConfigurationOptions;
export const selectFetchingAddConfigurationOptions = (state: TSelectorState) =>
  state.configurationOptions.status.fetchingAddConfigurationOptions;
export const selectFetchingPutConfigurationOptions = (state: TSelectorState) =>
  state.configurationOptions.status.fetchingPutConfigurationOptions;

export const selectAddConfigurationOptionsModal = (state: TSelectorState) =>
  state.configurationOptions.modals.addConfigurationOptionsModal;
export const selectFillConfigurationOptionsModal = (state: TSelectorState) =>
  state.configurationOptions.modals.fillConfigurationOptionsModal;

export const selectConfigurationOptions = (state: TSelectorState) =>
  state.configurationOptions.options;
export const selectConfigurationOptionsLimit = (state: TSelectorState) =>
  state.configurationOptions.limit;
export const selectConfigurationOptionsOffset = (state: TSelectorState) =>
  state.configurationOptions.offset;

export const {
  setAddConfigurationOptionsModalOpened,
  setConfigurationOptionsLimit,
  setConfigurationOptionsOffset,
  setFillConfigurationOptionsModalOpen,
} = configurationOptionsSlice.actions;

export default configurationOptionsSlice.reducer;
