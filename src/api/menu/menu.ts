import { TConfiguration } from '@/types';

import { URLS } from '@/api/urls';

import api from '../instance';

export const apiGetMenu = (id: string) => api.get<TConfiguration>(URLS.menus.getMenusById(id));
