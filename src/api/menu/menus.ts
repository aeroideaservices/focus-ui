import { TElementsRes, TMenu } from '@/types';

import { URLS } from '@/api/urls';

import api from '../instance';

export const apiGetMenu = (data: any) =>
  api.get<TElementsRes<TMenu>>(URLS.menus.getMenu, { params: data.params });

export const apiPutMenu = ({ id, data }: any) => api.put(URLS.menus.putMenusById(id), { ...data });

export const apiAddMenus = (conf: any) =>
  api.post<{ id: string }>(URLS.menus.addMenus, { ...conf.data });

export const apiDelMenu = (data: any) => api.delete(URLS.menus.delMenuById(data.id));
