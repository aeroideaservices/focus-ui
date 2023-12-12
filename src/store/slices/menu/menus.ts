import { TConfiguration } from '@/types';
import { TMenu } from '@/types/menu/menu';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { apiAddDomain, apiGetDomains } from '@/api/menu/domains';
import { apiAddMenus, apiGetMenu } from '@/api/menu/menus';

import { createAxiosThunk } from '@/utils/asyncRequest';
import notify from '@/utils/notify';

import { LIMIT, OFFSET } from '@/constants/common';

interface IMenuState {
  modals: {
    newMenusOpened: boolean;
    addDomainModal: boolean;
  };
  status: {
    fetchingGetMenus: boolean;
    fetchingAddMenus: boolean;
    fetchingAddDomain: boolean;
    fetchingGetDomains: boolean;
  };
  menus: TMenu[] | null;
  total: number | null;
  limit: number;
  offset: number;
  currentMenu: TMenu | null;
  domains: Record<string, string>[] | null;
}

const initialState: IMenuState = {
  modals: {
    newMenusOpened: false,
    addDomainModal: false,
  },
  status: {
    fetchingGetMenus: false,
    fetchingAddMenus: false,
    fetchingAddDomain: false,
    fetchingGetDomains: false,
  },
  menus: null,
  total: null,
  limit: LIMIT,
  offset: OFFSET,
  currentMenu: null,
  domains: null,
};

export const fetchMenusAction = createAxiosThunk('/menus', apiGetMenu);
export const fetchAddMenusAction = createAxiosThunk('/menus/add', apiAddMenus);
export const fetchGetDomainsAction = createAxiosThunk('/menus/domains', apiGetDomains);
export const fetchAddDomainAction = createAxiosThunk('/menus/domain', apiAddDomain);

export const menusSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenusLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setMenusOffset: (state, action: PayloadAction<number>) => {
      state.offset = action.payload;
    },
    setModalNewMenusOpened: (state, action: PayloadAction<boolean>) => {
      state.modals.newMenusOpened = action.payload;
    },
    setCurrentMenu: (state, action: PayloadAction<TConfiguration>) => {
      state.currentMenu = action.payload;
    },
    setAddDomainModalOpen: (state, action: PayloadAction<boolean>) => {
      state.modals.addDomainModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenusAction.pending, (state) => {
        state.status.fetchingGetMenus = true;
      })
      .addCase(fetchMenusAction.fulfilled, (state, action) => {
        state.status.fetchingGetMenus = false;
        state.menus = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchMenusAction.rejected, (state) => {
        state.status.fetchingGetMenus = false;
      });
    builder
      .addCase(fetchAddMenusAction.pending, (state) => {
        state.status.fetchingAddMenus = true;
      })
      .addCase(fetchAddMenusAction.fulfilled, (state) => {
        state.status.fetchingAddMenus = false;
        state.modals.newMenusOpened = false;

        notify({ message: 'Меню добавленно', type: 'success' });
      })
      .addCase(fetchAddMenusAction.rejected, (state) => {
        state.status.fetchingAddMenus = false;
      });
    builder
      .addCase(fetchAddDomainAction.pending, (state) => {
        state.status.fetchingAddDomain = true;
      })
      .addCase(fetchAddDomainAction.fulfilled, (state) => {
        state.status.fetchingAddDomain = false;
        state.modals.addDomainModal = false;

        notify({ message: 'Домен добавлен', type: 'success' });
      })
      .addCase(fetchAddDomainAction.rejected, (state) => {
        state.status.fetchingAddDomain = false;
      });
    builder
      .addCase(fetchGetDomainsAction.pending, (state) => {
        state.status.fetchingGetDomains = true;
      })
      .addCase(fetchGetDomainsAction.fulfilled, (state, action) => {
        state.status.fetchingGetDomains = false;
        state.domains = action.payload.items;
      })
      .addCase(fetchGetDomainsAction.rejected, (state) => {
        state.status.fetchingGetDomains = false;
      });
  },
});

type TSelectorState = { menus: IMenuState };

export const selectFetchingGetMenus = (state: TSelectorState) =>
  state.menus.status.fetchingGetMenus;
export const selectFetchingAddDomain = (state: TSelectorState) =>
  state.menus.status.fetchingAddDomain;

export const selectModalNewMenus = (state: TSelectorState) => state.menus.modals.newMenusOpened;
export const selectAddDomainModal = (state: TSelectorState) => state.menus.modals.addDomainModal;

export const selectCurrentMenu = (state: TSelectorState) => state.menus.currentMenu;
export const selectMenus = (state: TSelectorState) => state.menus.menus;
export const selectMenusTotal = (state: TSelectorState) => state.menus.total;
export const selectMenusLimit = (state: TSelectorState) => state.menus.limit;
export const selectMenusOffset = (state: TSelectorState) => state.menus.offset;
export const selectDomains = (state: TSelectorState) => state.menus.domains;

export const {
  setCurrentMenu,
  setMenusLimit,
  setMenusOffset,
  setModalNewMenusOpened,
  setAddDomainModalOpen,
} = menusSlice.actions;

export default menusSlice.reducer;
