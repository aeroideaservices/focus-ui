import { IFolder, TMediaRes, TQueryParamsNew } from '@/types';

import api from '../instance';
import { URLS } from '../urls';

export const apiGetMedia = (params: TQueryParamsNew) =>
  api.get<TMediaRes>(URLS.media.getMedia, { params: params.params });

export const apiGetFolders = () => api.get<IFolder[]>(URLS.media.getFolders);
