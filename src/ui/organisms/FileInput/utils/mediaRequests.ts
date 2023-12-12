import { IFile, IFolder, TGetFileInfo, TMediaRes } from '@/types';

import { URLS } from '@/api/urls';

import apiInstance from '@/utils/apiInstance';

import { LIMIT } from '@/constants/common';
import { ServiceCode } from '@/constants/services';

export const getFolder = async (service: ServiceCode, folder?: string | null, offset = 0) => {
  const items = await apiInstance.get<TMediaRes>(URLS.media.getMedia, {
    params: {
      limit: LIMIT,
      offset,
      parentFolderId: folder || undefined,
      sort: 'name',
    },
    headers: {
      ['service-code']: service,
    },
  });

  return items.data || [];
};

export const getFileInfo = async (service: ServiceCode, fileId: string) => {
  const file = await apiInstance.get<IFile>(URLS.media.getFileInfo(fileId), {
    headers: {
      ['service-code']: service,
    },
  });

  return file.data;
};

export const getFolderInfo = async (service: ServiceCode, folderId: string) => {
  const file = await apiInstance.get<IFolder>(URLS.media.getFolderInfo(folderId), {
    headers: {
      ['service-code']: service,
    },
  });

  return file.data;
};

export const getAllFolders = async (service: ServiceCode) => {
  const file = await apiInstance.get<
    Pick<IFolder, 'id' | 'name' | 'parentFolderId' | 'depthLevel'>[]
  >(URLS.media.getFolders, {
    headers: {
      ['service-code']: service,
    },
  });

  return file.data;
};

export const savefile = async (
  file: File,
  serviceCode: ServiceCode,
  controller: AbortController,
  folderId?: string
) => {
  const data = new FormData();
  data.append('file', file);

  if (folderId) data.append('folderId', folderId);

  const res = await apiInstance.post<TGetFileInfo>(URLS.media.addFile, data, {
    signal: controller.signal,
    headers: {
      'service-code': serviceCode,
      'Content-Type': 'multipart/form-data',
    },
  });

  if (res) return res.data;

  return null;
};
