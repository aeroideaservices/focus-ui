import { IService } from '@/types/services/services';

import { URLS } from '@/api/urls';

import api from '../instance';

export const apiGetServices = () => api.get<IService[]>(URLS.admin.service);
