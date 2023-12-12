import { TConfiguration } from '@/types';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { apiAddConfigurations, apiGetConfigurations } from '@/api/configuration/configurations';

import { createAxiosThunk } from '@/utils/asyncRequest';
import notify from '@/utils/notify';

import { LIMIT, OFFSET } from '@/constants/common';

interface IConfigurationsState {
  status: {
    fetchingConfigurations: boolean;
    fetchingAddConfiguration: boolean;
  };
  modals: {
    newConfigurationsOpened: boolean;
  };
  items: TConfiguration[] | null;
  total: number | null;
  limit: number;
  offset: number;
  currentConfiguration: TConfiguration | null;
}

const initialState: IConfigurationsState = {
  status: {
    fetchingConfigurations: false,
    fetchingAddConfiguration: false,
  },
  modals: {
    newConfigurationsOpened: false,
  },
  items: null,
  total: null,
  limit: LIMIT,
  offset: OFFSET,
  currentConfiguration: null,
};

export const fetchConfigurationsAction = createAxiosThunk('/configurations', apiGetConfigurations);
export const fetchAddConfigurationsAction = createAxiosThunk(
  '/configurations/add',
  apiAddConfigurations
);

export const configurationsSlice = createSlice({
  name: 'configurations',
  initialState,
  reducers: {
    setConfigurationsLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setConfigurationsOffset: (state, action: PayloadAction<number>) => {
      state.offset = action.payload;
    },
    setModalNewConfigurationsOpened: (state, action: PayloadAction<boolean>) => {
      state.modals.newConfigurationsOpened = action.payload;
    },
    setCurrentConfiguration: (state, action: PayloadAction<TConfiguration>) => {
      state.currentConfiguration = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfigurationsAction.pending, (state) => {
        state.status.fetchingConfigurations = true;
      })
      .addCase(fetchConfigurationsAction.fulfilled, (state, action) => {
        state.status.fetchingConfigurations = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.offset = action.payload.total === state.offset ? 0 : state.offset;
      })
      .addCase(fetchConfigurationsAction.rejected, (state) => {
        state.status.fetchingConfigurations = false;
      });
    builder
      .addCase(fetchAddConfigurationsAction.pending, (state) => {
        state.status.fetchingAddConfiguration = true;
      })
      .addCase(fetchAddConfigurationsAction.fulfilled, (state) => {
        state.status.fetchingAddConfiguration = false;
        state.modals.newConfigurationsOpened = false;

        notify({ message: 'Конфигурация добавлена', type: 'success' });
      })
      .addCase(fetchAddConfigurationsAction.rejected, (state) => {
        state.status.fetchingAddConfiguration = false;
      });
  },
});

type TSelectorState = { configurations: IConfigurationsState };

export const selectFetchingConfigurationsStatus = (state: TSelectorState) =>
  state.configurations.status.fetchingConfigurations;

export const selectModalNewConfiguration = (state: TSelectorState) =>
  state.configurations.modals.newConfigurationsOpened;

export const selectConfigurationsItems = (state: TSelectorState) => state.configurations.items;
export const selectConfigurationsTotal = (state: TSelectorState) => state.configurations.total;
export const selectConfigurationsLimit = (state: TSelectorState) => state.configurations.limit;
export const selectConfigurationsOffset = (state: TSelectorState) => state.configurations.offset;
export const selectCurrentConfiguration = (state: TSelectorState) =>
  state.configurations.currentConfiguration;

export const {
  setConfigurationsLimit,
  setConfigurationsOffset,
  setModalNewConfigurationsOpened,
  setCurrentConfiguration,
} = configurationsSlice.actions;

export default configurationsSlice.reducer;
