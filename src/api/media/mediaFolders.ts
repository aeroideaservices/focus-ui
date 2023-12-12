import { IFolder, IFolderFetch, TGetFileInfo, TMoveFolderReq, TRenameReq } from '@/types';

import api from '../instance';
import { URLS } from '../urls';

export const apiAddFolder = (folder: IFolderFetch) => {
  const { values } = folder;

  return api.post<{ id: string }>(URLS.media.addFolder, { ...values });
};

export const apiGetFolderInfo = (data: TGetFileInfo) =>
  api.get<IFolder>(URLS.media.getFolderInfo(data.id));

export const apiDelFolder = (data: TGetFileInfo) => api.delete(URLS.media.delFolder(data.id));

export const apiMoveFolder = (data: TMoveFolderReq) => {
  const { id, parentFolderId } = data;

  return api.patch(URLS.media.moveFolder(id), { parentFolderId });
};

export const apiRenameFolder = (data: TRenameReq) => {
  const { values } = data;

  return api.patch(URLS.media.renameFolder(values.id), { name: values.name });
};
