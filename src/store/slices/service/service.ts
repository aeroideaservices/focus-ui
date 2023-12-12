import { TServicesMap } from '@/types/services/services';

import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { apiGetServices } from '@/api/service/service';

import { createAxiosThunk } from '@/utils/asyncRequest';
import notify from '@/utils/notify';

import { PluginCode } from '@/constants/plugins';
import { ServiceCode } from '@/constants/services';

interface IServiceState {
  services: TServicesMap;
  currentServiceCode: ServiceCode | null;
  currentPluginCode: PluginCode | null;
  hasServiceChanged: boolean;
}

const initialState: IServiceState = {
  services: {},
  currentPluginCode: null,
  currentServiceCode: null,
  hasServiceChanged: false,
};

export const fetchServiceAction = createAxiosThunk('/service', apiGetServices);

export const serviceSlice = createSlice({
  name: 'configurations',
  initialState,
  reducers: {
    setCurrentService: (state, action: PayloadAction<ServiceCode>) => {
      state.currentServiceCode = action.payload;
    },
    setServiceChanged: (state, action: PayloadAction<boolean>) => {
      state.hasServiceChanged = action.payload;
    },
    setCurrentPlugin: (state, action: PayloadAction<PluginCode>) => {
      state.currentPluginCode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceAction.fulfilled, (state, action) => {
        if (!action.payload?.length) return;

        const services = action.payload?.reduce<TServicesMap>(
          (obj, item) => ({ ...obj, [item.code]: item }),
          {}
        );

        const service = localStorage.getItem('service')?.replace(/"/g, '');

        if (!service) {
          localStorage.setItem('service', action.payload[0].code);
        }

        state.services = services;
      })
      .addCase(fetchServiceAction.rejected, () => {
        notify({ message: 'Приложение сейчас недоступно. Попробуйте позже', type: 'error' });
      });
  },
});

type TSelectorState = { service: IServiceState };

export const selectCurrentService = (state: TSelectorState) =>
  state.service.currentServiceCode
    ? state.service.services[state.service.currentServiceCode]
    : null;
export const selectCurrentPlugin = (state: TSelectorState) => state.service.currentPluginCode;
export const selectServicesMap = (state: TSelectorState) => state.service.services;
export const selectServices = createSelector([selectServicesMap], (services) =>
  Object.values(services)
);
export const selectServiceChanged = (state: TSelectorState) => state.service.hasServiceChanged;

export const { setCurrentPlugin, setCurrentService, setServiceChanged } = serviceSlice.actions;

export default serviceSlice.reducer;
