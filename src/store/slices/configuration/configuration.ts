import { TConfiguration } from '@/types';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  apiDelConfiguration,
  apiGetConfiguration,
  apiPutConfiguration,
} from '@/api/configuration/configuration';

import { createAxiosThunk } from '@/utils/asyncRequest';
import notify from '@/utils/notify';

interface IConfigurationState {
  status: {
    fetchingGetConfiguration: boolean;
    fetchingPutConfiguration: boolean;
    fetchingDelConfiguration: boolean;
  };
  modals: {
    delConfigurationModal: boolean;
    editConfigurationModal: boolean;
  };
  configuration: TConfiguration | null;
}

const initialState: IConfigurationState = {
  status: {
    fetchingGetConfiguration: false,
    fetchingPutConfiguration: false,
    fetchingDelConfiguration: false,
  },
  modals: {
    delConfigurationModal: false,
    editConfigurationModal: false,
  },
  configuration: null,
};

export const fetchGetConfigurationAction = createAxiosThunk(
  '/getConfiguration',
  apiGetConfiguration
);
export const fetchPutConfigurationAction = createAxiosThunk(
  '/putConfiguration',
  apiPutConfiguration
);
export const fetchDelConfigurationAction = createAxiosThunk(
  '/delConfiguration',
  apiDelConfiguration
);

export const configurationSlice = createSlice({
  name: 'configurationItem',
  initialState,
  reducers: {
    setOpenDelConfigurationModal: (state, action: PayloadAction<boolean>) => {
      state.modals.delConfigurationModal = action.payload;
    },
    setEditConfigurationModalOpen: (state, action: PayloadAction<boolean>) => {
      state.modals.editConfigurationModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetConfigurationAction.pending, (state) => {
        state.status.fetchingGetConfiguration = true;
      })
      .addCase(fetchGetConfigurationAction.fulfilled, (state, action) => {
        state.status.fetchingGetConfiguration = false;
        state.configuration = action.payload;
      })
      .addCase(fetchGetConfigurationAction.rejected, (state) => {
        state.status.fetchingGetConfiguration = false;
      });
    builder
      .addCase(fetchPutConfigurationAction.pending, (state) => {
        state.status.fetchingPutConfiguration = true;
      })
      .addCase(fetchPutConfigurationAction.fulfilled, (state) => {
        state.status.fetchingPutConfiguration = false;
        state.modals.editConfigurationModal = false;

        notify({ message: 'Конфигурация изменена', type: 'success' });
      })
      .addCase(fetchPutConfigurationAction.rejected, (state) => {
        state.status.fetchingPutConfiguration = false;
      });
    builder
      .addCase(fetchDelConfigurationAction.pending, (state) => {
        state.status.fetchingDelConfiguration = true;
      })
      .addCase(fetchDelConfigurationAction.fulfilled, (state) => {
        state.status.fetchingDelConfiguration = false;
        state.modals.delConfigurationModal = false;

        notify({ message: 'Конфигурация удалена', type: 'success' });
      })
      .addCase(fetchDelConfigurationAction.rejected, (state) => {
        state.status.fetchingDelConfiguration = false;
        state.modals.delConfigurationModal = false;
      });
  },
});

type TSelectorState = { configuration: IConfigurationState };

export const selectFetchingGetConfiguration = (state: TSelectorState) =>
  state.configuration.status.fetchingGetConfiguration;
export const selectFetchingPutConfiguration = (state: TSelectorState) =>
  state.configuration.status.fetchingPutConfiguration;
export const selectFetchingDelConfiguration = (state: TSelectorState) =>
  state.configuration.status.fetchingDelConfiguration;

export const selectDelConfigurationModal = (state: TSelectorState) =>
  state?.configuration?.modals?.delConfigurationModal;
export const selectEditConfigurationModal = (state: TSelectorState) =>
  state?.configuration?.modals?.editConfigurationModal;

export const selectConfiguration = (state: TSelectorState) => state?.configuration?.configuration;

export const { setOpenDelConfigurationModal, setEditConfigurationModalOpen } =
  configurationSlice.actions;

export default configurationSlice.reducer;
