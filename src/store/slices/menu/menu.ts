import { TMenu } from '@/types';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { apiGetMenu } from '@/api/menu/menu';
import { apiDelMenu, apiPutMenu } from '@/api/menu/menus';

import { createAxiosThunk } from '@/utils/asyncRequest';
import notify from '@/utils/notify';

interface IMenuState {
  modals: {
    delMenuModal: boolean;
    editMenuModal: boolean;
  };
  status: {
    fetchingPutMenu: boolean;
    fetchingDelMenu: boolean;
    fetchingGetMenu: boolean;
  };
  menu: TMenu | null;
}

const initialState: IMenuState = {
  modals: {
    delMenuModal: false,
    editMenuModal: false,
  },
  status: {
    fetchingPutMenu: false,
    fetchingDelMenu: false,
    fetchingGetMenu: false,
  },
  menu: null,
};

export const fetchGetMenuAction = createAxiosThunk('/getMenu', apiGetMenu);
export const fetchPutMenuAction = createAxiosThunk('/putMenu', apiPutMenu);
export const fetchDelMenuAction = createAxiosThunk('/delMenu', apiDelMenu);

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setEditMenuModalOpen: (state, action: PayloadAction<boolean>) => {
      state.modals.editMenuModal = action.payload;
    },
    setDelMenuModalOpen: (state, action: PayloadAction<boolean>) => {
      state.modals.delMenuModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetMenuAction.pending, (state) => {
        state.status.fetchingGetMenu = true;
      })
      .addCase(fetchGetMenuAction.fulfilled, (state, action) => {
        state.status.fetchingGetMenu = false;
        state.menu = action.payload;
      })
      .addCase(fetchGetMenuAction.rejected, (state) => {
        state.status.fetchingGetMenu = false;
      });
    builder
      .addCase(fetchPutMenuAction.pending, (state) => {
        state.status.fetchingPutMenu = true;
      })
      .addCase(fetchPutMenuAction.fulfilled, (state) => {
        state.modals.editMenuModal = false;

        notify({ message: 'Меню изменено', type: 'success' });
      })
      .addCase(fetchPutMenuAction.rejected, (state) => {
        state.status.fetchingPutMenu = false;
      });
    builder
      .addCase(fetchDelMenuAction.pending, (state) => {
        state.status.fetchingDelMenu = true;
      })
      .addCase(fetchDelMenuAction.fulfilled, (state) => {
        state.status.fetchingDelMenu = false;
        state.modals.delMenuModal = false;

        notify({ message: 'Меню удалено', type: 'success' });
      })
      .addCase(fetchDelMenuAction.rejected, (state) => {
        state.status.fetchingDelMenu = false;
        state.modals.delMenuModal = false;
      });
  },
});

type TSelectorState = { menu: IMenuState };

export const selectEditMenuModal = (state: TSelectorState) => state.menu.modals.editMenuModal;
export const selectDelMenuModal = (state: TSelectorState) => state.menu.modals.delMenuModal;
export const selectMenu = (state: TSelectorState) => state.menu.menu;

export const { setDelMenuModalOpen, setEditMenuModalOpen } = menuSlice.actions;

export default menuSlice.reducer;
