import { TAddMenuItems, TDelMenuItem, TMoveMenuItems, TPutMenuItems } from '@/types';

import { tryAction } from '@/api/tryAction';
import { URLS } from '@/api/urls';

import api from '../instance';

export const apiGetMenuItems = (data: any) => {
  return api.get<any>(URLS.menus.getMenuItemsById(data.id), { params: data?.params });
};

export const apiAddMenuItems = ({ id, data, params }: TAddMenuItems) => {
  return api.post(URLS.menus.addMenuItemsById(id), { ...data }, { params });
};

export const apiPutMenuItem = ({ params, data }: TPutMenuItems) => {
  const { menuId, menuItemId } = params;

  return api.put(URLS.menus.putMenuItemById(menuId, menuItemId), { ...data });
};

export const apiDelMenuItem = (params: TDelMenuItem) => {
  const { menuId, menuItemId } = params;

  return api.delete(URLS.menus.delMenuItemById(menuId, menuItemId));
};

export const apiGetMenuItem = (params: TDelMenuItem) => {
  const { menuId, menuItemId } = params;

  return api.get(URLS.menus.getMenuItemById(menuId, menuItemId));
};

export const apiMoveMenuItem = ({ params, data }: TMoveMenuItems) => {
  const { menuId, menuItemId } = params;

  return api.post(URLS.menus.moveMenuItem(menuId, menuItemId), { ...data });
};

/*TRY ...CATCH */
export const tryAddMenuItems = ({ id, data, params }: TAddMenuItems) =>
  tryAction(apiAddMenuItems({ id, data, params }));
