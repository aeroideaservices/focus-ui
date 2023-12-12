import { IFile } from '@/types';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  apiAddFile,
  apiAddFiles,
  apiDelFile,
  apiGetFileInfo,
  apiMoveFile,
  apiRenameFile,
} from '@/api';

import { createAxiosThunk } from '@/utils/asyncRequest';
import notify from '@/utils/notify';

interface IMediaFilesState {
  status: {
    fetchingAddFile: boolean;
    fetchingGetFileInfo: boolean;
    fetchingDelFile: boolean;
    fetchingMoveFile: boolean;
    fetchingRenameFile: boolean;
  };
  modals: {
    addFileModal: boolean;
    delFileModal: boolean;
    renameFileModal: boolean;
    moveFoleModal: boolean;
  };
  current: IFile | null;
}

const initialState: IMediaFilesState = {
  status: {
    fetchingAddFile: false,
    fetchingGetFileInfo: false,
    fetchingDelFile: false,
    fetchingMoveFile: false,
    fetchingRenameFile: false,
  },
  modals: {
    addFileModal: false,
    delFileModal: false,
    renameFileModal: false,
    moveFoleModal: false,
  },
  current: null,
};

export const fetchAddFile = createAxiosThunk('addFile', apiAddFile);
export const fetchAddFiles = createAxiosThunk('addFiles', apiAddFiles);
export const fetchGetFileInfo = createAxiosThunk('getFileInfo', apiGetFileInfo);
export const fetchDelFile = createAxiosThunk('delFile', apiDelFile);
export const fetchRenameFile = createAxiosThunk('renameFile', apiRenameFile);
export const fetchMoveFile = createAxiosThunk('moveFile', apiMoveFile);

export const mediaFilesSlice = createSlice({
  name: 'mediaFiles',
  initialState,
  reducers: {
    setAddFileModalOpened: (state, action: PayloadAction<boolean>) => {
      state.modals.addFileModal = action.payload;
    },
    setDelFileModalOpened: (state, action: PayloadAction<boolean>) => {
      state.modals.delFileModal = action.payload;
    },
    setRenameFileModalOpened: (state, action: PayloadAction<boolean>) => {
      state.modals.renameFileModal = action.payload;
    },
    setMoveFileModalOpened: (state, action: PayloadAction<boolean>) => {
      state.modals.moveFoleModal = action.payload;
    },
    setCurrentFile: (state, action: PayloadAction<IFile | null>) => {
      state.current = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddFile.pending, (state) => {
        state.status.fetchingAddFile = true;
      })
      .addCase(fetchAddFile.fulfilled, (state) => {
        state.status.fetchingAddFile = false;
      })
      .addCase(fetchAddFile.rejected, (state) => {
        state.status.fetchingAddFile = false;
      });
    builder
      .addCase(fetchAddFiles.pending, (state) => {
        state.status.fetchingAddFile = true;
      })
      .addCase(fetchAddFiles.fulfilled, (state) => {
        state.status.fetchingAddFile = false;
      })
      .addCase(fetchAddFiles.rejected, (state) => {
        state.status.fetchingAddFile = false;
      });
    builder
      .addCase(fetchGetFileInfo.pending, (state) => {
        state.status.fetchingGetFileInfo = true;
      })
      .addCase(fetchGetFileInfo.fulfilled, (state, action) => {
        state.status.fetchingGetFileInfo = false;
        state.current = action.payload;
      })
      .addCase(fetchGetFileInfo.rejected, (state) => {
        state.status.fetchingGetFileInfo = false;
      });
    builder
      .addCase(fetchDelFile.pending, (state) => {
        state.status.fetchingDelFile = true;
      })
      .addCase(fetchDelFile.fulfilled, (state) => {
        state.status.fetchingDelFile = false;
        state.modals.delFileModal = false;
        state.current = null;

        notify({ message: 'Файл удален', type: 'success' });
      })
      .addCase(fetchDelFile.rejected, (state) => {
        state.status.fetchingDelFile = false;
      });
    builder
      .addCase(fetchRenameFile.pending, (state) => {
        state.status.fetchingRenameFile = true;
      })
      .addCase(fetchRenameFile.fulfilled, (state) => {
        state.status.fetchingRenameFile = false;
        state.modals.renameFileModal = false;
        state.current = null;

        notify({ message: 'Файл переименован', type: 'success' });
      })
      .addCase(fetchRenameFile.rejected, (state) => {
        state.status.fetchingRenameFile = false;
      });
    builder
      .addCase(fetchMoveFile.pending, (state) => {
        state.status.fetchingMoveFile = true;
      })
      .addCase(fetchMoveFile.fulfilled, (state) => {
        state.status.fetchingMoveFile = false;
        state.current = null;

        notify({ message: 'Файл перемещён', type: 'success' });
      })
      .addCase(fetchMoveFile.rejected, (state) => {
        state.status.fetchingMoveFile = false;
      });
  },
});

type TSelectorState = { mediaFiles: IMediaFilesState };

export const selectFetchingAddFile = (state: TSelectorState) =>
  state.mediaFiles.status.fetchingAddFile;
export const selectFetchingGetFileInfo = (state: TSelectorState) =>
  state.mediaFiles.status.fetchingGetFileInfo;
export const selectFetchingDelFile = (state: TSelectorState) =>
  state.mediaFiles.status.fetchingDelFile;
export const selectFetchingMoveFile = (state: TSelectorState) =>
  state.mediaFiles.status.fetchingMoveFile;
export const selectFetchingRenameFile = (state: TSelectorState) =>
  state.mediaFiles.status.fetchingRenameFile;

export const selectAddFileModal = (state: TSelectorState) => state.mediaFiles.modals.addFileModal;
export const selectDelFileModal = (state: TSelectorState) => state.mediaFiles.modals.delFileModal;
export const selectRenameFileModal = (state: TSelectorState) =>
  state.mediaFiles.modals.renameFileModal;
export const selectMoveFoleModal = (state: TSelectorState) => state.mediaFiles.modals.moveFoleModal;

export const selectCurrentFile = (state: TSelectorState) => state.mediaFiles.current;

export const {
  setAddFileModalOpened,
  setDelFileModalOpened,
  setRenameFileModalOpened,
  setMoveFileModalOpened,
  setCurrentFile,
} = mediaFilesSlice.actions;

export default mediaFilesSlice.reducer;
