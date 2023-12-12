import { TConfigurationOption } from '@/types';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  apiDelConfigurationOption,
  apiGetConfigurationOption,
  apiPutConfigurationOption,
} from '@/api';

import { createAxiosThunk } from '@/utils/asyncRequest';
import notify from '@/utils/notify';

interface IConfigurationOptionState {
  status: {
    fetchingGetConfigurationOption: boolean;
    fetchingPutConfigurationOption: boolean;
    fetchingDelConfigurationOption: boolean;
  };
  modals: {
    editConfigurationOptionModal: boolean;
    delConfigurationOptionModal: boolean;
  };
  configurationOption: TConfigurationOption | null;
}

const initialState: IConfigurationOptionState = {
  status: {
    fetchingGetConfigurationOption: false,
    fetchingDelConfigurationOption: false,
    fetchingPutConfigurationOption: false,
  },
  modals: {
    editConfigurationOptionModal: false,
    delConfigurationOptionModal: false,
  },
  configurationOption: null,
};

export const fetchGetConfigurationOptionAction = createAxiosThunk(
  'GetConfigurationOption',
  apiGetConfigurationOption
);
export const fetchDelConfigurationOptionAction = createAxiosThunk(
  'DelConfigurationOption',
  apiDelConfigurationOption
);
export const fetchPutConfigurationOptionAction = createAxiosThunk(
  'PutConfigurationOption',
  apiPutConfigurationOption
);

export const configurationOptionSlice = createSlice({
  name: 'configurationOption',
  initialState,
  reducers: {
    setEditConfigurationOptionModalOpened: (state, action: PayloadAction<boolean>) => {
      state.modals.editConfigurationOptionModal = action.payload;
    },
    setDelConfigurationOptionModalOpened: (state, action: PayloadAction<boolean>) => {
      state.modals.delConfigurationOptionModal = action.payload;
    },
    setConfigurationOption: (state, action: PayloadAction<TConfigurationOption | null>) => {
      state.configurationOption = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetConfigurationOptionAction.pending, (state) => {
        state.status.fetchingGetConfigurationOption = true;
      })
      .addCase(fetchGetConfigurationOptionAction.fulfilled, (state) => {
        state.status.fetchingGetConfigurationOption = false;
      })
      .addCase(fetchGetConfigurationOptionAction.rejected, (state) => {
        state.status.fetchingGetConfigurationOption = false;
      });
    builder
      .addCase(fetchDelConfigurationOptionAction.pending, (state) => {
        state.status.fetchingDelConfigurationOption = true;
      })
      .addCase(fetchDelConfigurationOptionAction.fulfilled, (state) => {
        state.status.fetchingDelConfigurationOption = false;
        state.modals.delConfigurationOptionModal = false;

        notify({ message: 'Опция удалена', type: 'success' });
      })
      .addCase(fetchDelConfigurationOptionAction.rejected, (state) => {
        state.status.fetchingDelConfigurationOption = false;
      });
    builder
      .addCase(fetchPutConfigurationOptionAction.pending, (state) => {
        state.status.fetchingPutConfigurationOption = true;
      })
      .addCase(fetchPutConfigurationOptionAction.fulfilled, (state) => {
        state.status.fetchingPutConfigurationOption = false;
        state.modals.editConfigurationOptionModal = false;

        notify({ message: 'Опция изменена', type: 'success' });
      })
      .addCase(fetchPutConfigurationOptionAction.rejected, (state) => {
        state.status.fetchingPutConfigurationOption = false;
      });
  },
});

type TSelectorState = { configurationOption: IConfigurationOptionState };

export const selectFetchingGetConfigurationOption = (state: TSelectorState) =>
  state.configurationOption.status.fetchingGetConfigurationOption;
export const selectFetchingDelConfigurationOption = (state: TSelectorState) =>
  state.configurationOption.status.fetchingDelConfigurationOption;
export const selectFetchingPutConfigurationOption = (state: TSelectorState) =>
  state.configurationOption.status.fetchingPutConfigurationOption;

export const selectDelConfigurationOptionModal = (state: TSelectorState) =>
  state.configurationOption.modals.delConfigurationOptionModal;
export const selectEditConfigurationOptionModal = (state: TSelectorState) =>
  state.configurationOption.modals.editConfigurationOptionModal;

export const selectConfigurationOption = (state: TSelectorState) =>
  state.configurationOption.configurationOption;

export const {
  setDelConfigurationOptionModalOpened,
  setEditConfigurationOptionModalOpened,
  setConfigurationOption,
} = configurationOptionSlice.actions;

export default configurationOptionSlice.reducer;
