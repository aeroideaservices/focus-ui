import { IFileType, IFolderTree, IFolderType, ResourceType, TBreadcrumbsExtItem } from '@/types';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { apiGetFolders, apiGetMedia } from '@/api';

import { createAxiosThunk } from '@/utils/asyncRequest';

import { FOLDER_ICON, MAX_BREADCRUMBS_LENGTH } from '@/constants/media';
import { PATHS } from '@/constants/paths';

interface IMediaState {
  status: {
    fetchingGetMedia: boolean;
    fetchingGetFolders: boolean;
  };
  media: (IFolderType | IFileType)[] | null;
  breadcrumbs?: TBreadcrumbsExtItem[];
  level: number;
  mediaTotal: number;
  folders: IFolderType[] | null;
  moveInFolder: IFolderTree | null | string;
  selectedId: string | null;
}

const initialState: IMediaState = {
  status: {
    fetchingGetMedia: false,
    fetchingGetFolders: false,
  },
  media: null,
  mediaTotal: 0,
  folders: null,
  moveInFolder: null,
  level: 0,
  selectedId: null,
};

const rootBreadcrumbsItem = {
  name: 'Медиа',
  url: PATHS.media,
};

const ellipsisBreadcrumbsItem = {
  name: '\u2026',
};

/**
 * Adds get params to file previews. It disables image caching.
 *
 * @param {Array<IFolderType | IFileType>} items
 * @returns {Array<IFolderType | IFileType>}
 */
const getMappedMedia = (items: Array<IFolderType | IFileType>) => {
  const result: Array<IFolderType | IFileType> = [];

  if (items) {
    items.map((item) => {
      if (item.resourceType === ResourceType.FILE && item.fileFields.url) {
        result.push({
          ...item,
          fileFields: { ...item.fileFields, url: `${item.fileFields.url}?${item.fileFields.id}` },
        });
      } else {
        result.push(item);
      }
    });
  }

  return result;
};

export const fetchGetMedia = createAxiosThunk('getMedia', apiGetMedia);
export const fetchGetMediaMore = createAxiosThunk('getMediaMore', apiGetMedia);
export const fetchGetFolders = createAxiosThunk('getFolders', apiGetFolders);

export const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setMoveInFolder: (state, action: PayloadAction<IFolderTree | string | null>) => {
      state.moveInFolder = action.payload;
    },
    setMedia: (state, action: PayloadAction<(IFolderType & IFileType)[] | null>) => {
      state.media = action.payload;
    },
    setSelectedId: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetMedia.pending, (state) => {
        state.status.fetchingGetMedia = true;
      })
      .addCase(fetchGetMedia.fulfilled, (state, action) => {
        state.status.fetchingGetMedia = false;
        state.media = getMappedMedia(action.payload.items);
        state.mediaTotal = action.payload.total;
        state.level = action.payload.breadcrumbs.length;

        state.breadcrumbs = action.payload.breadcrumbs
          .slice(-MAX_BREADCRUMBS_LENGTH)
          .map(({ folderId, name }) => ({
            name,
            url: PATHS.mediaFolder(folderId),
            icon: FOLDER_ICON,
          }));

        if (action.payload.breadcrumbs.length > MAX_BREADCRUMBS_LENGTH)
          state.breadcrumbs.unshift(ellipsisBreadcrumbsItem);
        if (action.payload.breadcrumbs.length) state.breadcrumbs.unshift(rootBreadcrumbsItem);
      })
      .addCase(fetchGetMedia.rejected, (state) => {
        state.status.fetchingGetMedia = false;
        state.media = null;
      });
    builder
      .addCase(fetchGetMediaMore.pending, (state) => {
        state.status.fetchingGetMedia = true;
      })
      .addCase(fetchGetMediaMore.fulfilled, (state, action) => {
        state.status.fetchingGetMedia = false;
        state.mediaTotal = action.payload.total;

        if (state.media) {
          state.media = [...state.media, ...getMappedMedia(action.payload.items)];
        } else {
          state.media = getMappedMedia(action.payload.items);
        }
      })
      .addCase(fetchGetMediaMore.rejected, (state) => {
        state.status.fetchingGetMedia = false;

        if (state.media) {
          state.media = [...state.media];
          state.mediaTotal = state.media.length;
        } else {
          state.media = null;
          state.mediaTotal = 0;
        }
      });
    builder
      .addCase(fetchGetFolders.pending, (state) => {
        state.status.fetchingGetFolders = true;
      })
      .addCase(fetchGetFolders.fulfilled, (state, action) => {
        state.status.fetchingGetFolders = false;
        state.folders = action.payload
          ? action.payload.map((folder) => ({
              resourceType: ResourceType.FOLDER,
              folderFields: folder,
            }))
          : null;
      })
      .addCase(fetchGetFolders.rejected, (state) => {
        state.status.fetchingGetFolders = false;
        state.folders = null;
      });
  },
});

type TSelectorState = { media: IMediaState };

export const selectFetchingGetMedia = (state: TSelectorState) =>
  state.media.status.fetchingGetMedia;
export const selectFetchingGetFolders = (state: TSelectorState) =>
  state.media.status.fetchingGetFolders;

export const selectMedia = (state: TSelectorState) => state.media.media;
export const selectMediaTotal = (state: TSelectorState) => state.media.mediaTotal;
export const selectFolders = (state: TSelectorState) => state.media.folders;
export const selectMoveInFolder = (state: TSelectorState) => state.media.moveInFolder;
export const selectBreadcrumbs = (state: TSelectorState) => state.media.breadcrumbs;
export const selectSelectedId = (state: TSelectorState) => state.media.selectedId;

export const { setMoveInFolder, setMedia, setSelectedId } = mediaSlice.actions;

export default mediaSlice.reducer;
