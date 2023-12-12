import { IFolder } from '@/types';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  apiAddFolder,
  apiDelFolder,
  apiGetFolderInfo,
  apiMoveFolder,
  apiRenameFolder,
} from '@/api';

import { createAxiosThunk } from '@/utils/asyncRequest';
import notify from '@/utils/notify';

interface IMediaFoldersState {
  status: {
    fetchingGetFolders: boolean;
    fetchingAddFolder: boolean;
    fetchingGetFolderInfo: boolean;
    fetchingDelFolder: boolean;
    fetchingMoveFolder: boolean;
    fetchingRenameFolder: boolean;
  };
  modals: {
    addFolderModal: boolean;
    delFolderModal: boolean;
    renameFolderModal: boolean;
  };
  current: IFolder | null;
  rootFolder: IFolder | null;
}

const initialState: IMediaFoldersState = {
  status: {
    fetchingGetFolders: false,
    fetchingAddFolder: false,
    fetchingGetFolderInfo: false,
    fetchingDelFolder: false,
    fetchingMoveFolder: false,
    fetchingRenameFolder: false,
  },
  modals: {
    addFolderModal: false,
    delFolderModal: false,
    renameFolderModal: false,
  },
  current: null,
  rootFolder: null,
};

export const fetchGetFolderInfo = createAxiosThunk('getFoldersInfo', apiGetFolderInfo);
export const fetchGetRootFolderInfo = createAxiosThunk('getRootFoldersInfo', apiGetFolderInfo);
export const fetchAddFolder = createAxiosThunk('addFolder', apiAddFolder);
export const fetchDelFolder = createAxiosThunk('delFolder', apiDelFolder);
export const fetchRenameFolder = createAxiosThunk('renameFolder', apiRenameFolder);
export const fetchMoveFolder = createAxiosThunk('moveFolder', apiMoveFolder);

export const mediaFoldersSlice = createSlice({
  name: 'mediaFolders',
  initialState,
  reducers: {
    setAddFolderModalOpened: (state, action: PayloadAction<boolean>) => {
      state.modals.addFolderModal = action.payload;
    },
    setDelFolderModalOpened: (state, action: PayloadAction<boolean>) => {
      state.modals.delFolderModal = action.payload;
    },
    setRenameFodlerModalOpened: (state, action: PayloadAction<boolean>) => {
      state.modals.renameFolderModal = action.payload;
    },
    setCurrentFolder: (state, action: PayloadAction<IFolder | null>) => {
      state.current = action.payload;
    },
    setRootFolder: (state, action: PayloadAction<IFolder | null>) => {
      state.rootFolder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetFolderInfo.pending, (state) => {
        state.status.fetchingGetFolderInfo = true;
      })
      .addCase(fetchGetFolderInfo.fulfilled, (state, action) => {
        state.status.fetchingGetFolderInfo = false;
        state.current = action.payload;
      })
      .addCase(fetchGetFolderInfo.rejected, (state) => {
        state.status.fetchingGetFolderInfo = false;
      });
    builder
      .addCase(fetchGetRootFolderInfo.pending, (state) => {
        state.status.fetchingGetFolderInfo = true;
      })
      .addCase(fetchGetRootFolderInfo.fulfilled, (state, action) => {
        state.status.fetchingGetFolderInfo = false;
        state.rootFolder = action.payload;
        state.current = null;
      })
      .addCase(fetchGetRootFolderInfo.rejected, (state) => {
        state.status.fetchingGetFolderInfo = false;
      });
    builder
      .addCase(fetchAddFolder.pending, (state) => {
        state.status.fetchingAddFolder = true;
      })
      .addCase(fetchAddFolder.fulfilled, (state) => {
        state.status.fetchingAddFolder = false;
        state.modals.addFolderModal = false;
        state.current = null;

        notify({ message: 'Папка добавлена', type: 'success' });
      })
      .addCase(fetchAddFolder.rejected, (state) => {
        state.status.fetchingAddFolder = false;
      });
    builder
      .addCase(fetchDelFolder.pending, (state) => {
        state.status.fetchingDelFolder = true;
      })
      .addCase(fetchDelFolder.fulfilled, (state) => {
        state.status.fetchingDelFolder = false;
        state.modals.delFolderModal = false;
        state.current = null;

        notify({ message: 'Папка удалена', type: 'success' });
      })
      .addCase(fetchDelFolder.rejected, (state) => {
        state.status.fetchingDelFolder = false;
      });
    builder
      .addCase(fetchRenameFolder.pending, (state) => {
        state.status.fetchingRenameFolder = true;
      })
      .addCase(fetchRenameFolder.fulfilled, (state) => {
        state.status.fetchingRenameFolder = false;
        state.modals.renameFolderModal = false;
        state.current = null;

        notify({ message: 'Папка переименована', type: 'success' });
      })
      .addCase(fetchRenameFolder.rejected, (state) => {
        state.status.fetchingRenameFolder = false;
      });
    builder
      .addCase(fetchMoveFolder.pending, (state) => {
        state.status.fetchingMoveFolder = true;
      })
      .addCase(fetchMoveFolder.fulfilled, (state) => {
        state.status.fetchingMoveFolder = false;
        state.current = null;

        notify({ message: 'Папка перемещена', type: 'success' });
      })
      .addCase(fetchMoveFolder.rejected, (state) => {
        state.status.fetchingMoveFolder = false;
      });
  },
});

type TSelectorState = { mediaFolders: IMediaFoldersState };

export const selectFetchingGetFolders = (state: TSelectorState) =>
  state.mediaFolders.status.fetchingGetFolders;
export const selectFetchingAddFolder = (state: TSelectorState) =>
  state.mediaFolders.status.fetchingAddFolder;
export const selectFetchingGetFolderInfo = (state: TSelectorState) =>
  state.mediaFolders.status.fetchingGetFolderInfo;
export const selectFetchingDelFolder = (state: TSelectorState) =>
  state.mediaFolders.status.fetchingDelFolder;
export const selectFetchingMoveFolder = (state: TSelectorState) =>
  state.mediaFolders.status.fetchingMoveFolder;
export const selectFetchingRenameFolder = (state: TSelectorState) =>
  state.mediaFolders.status.fetchingRenameFolder;

export const selectDelFolderModal = (state: TSelectorState) =>
  state.mediaFolders.modals.delFolderModal;
export const selectAddFolderModal = (state: TSelectorState) =>
  state.mediaFolders.modals.addFolderModal;
export const selectRenameFolderModal = (state: TSelectorState) =>
  state.mediaFolders.modals.renameFolderModal;

export const selectCurrentFolder = (state: TSelectorState) => state.mediaFolders.current;
export const selectRootFolder = (state: TSelectorState) => state.mediaFolders.rootFolder;

export const {
  setDelFolderModalOpened,
  setAddFolderModalOpened,
  setRenameFodlerModalOpened,
  setCurrentFolder,
  setRootFolder,
} = mediaFoldersSlice.actions;

export default mediaFoldersSlice.reducer;
