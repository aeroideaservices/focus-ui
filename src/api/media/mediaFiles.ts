import { IFile, TAddFileReq, TAddFilesReq, TGetFileInfo, TMoveFileReq, TRenameReq } from '@/types';

import api from '../instance';
import { URLS } from '../urls';

export const apiAddFile = (data: TAddFileReq) =>
  api.post<{ id: string }>(
    URLS.media.addFile,
    { ...data },
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

export const apiAddFiles = (data: TAddFilesReq) => {
  return api.post<{ id: string }[]>(
    URLS.media.addFiles,
    { ...data },
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
};

export const apiUploadFile = (data: TAddFileReq) => {
  return api.post(
    URLS.media.uploadFile,
    { ...data },
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
};

export const apiGetFileInfo = (data: TGetFileInfo) =>
  api.get<IFile>(URLS.media.getFileInfo(data.id));

export const apiDelFile = (data: TGetFileInfo) => api.delete(URLS.media.delFile(data.id));

export const apiMoveFile = (data: TMoveFileReq) => {
  const { id, folderId } = data;

  return api.patch(URLS.media.moveFile(id), { folderId });
};

export const apiRenameFile = (data: TRenameReq) => {
  const { id, name } = data.values;

  return api.patch(URLS.media.renameFile(id), { name });
};
