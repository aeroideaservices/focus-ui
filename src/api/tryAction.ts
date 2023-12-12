import { AxiosResponse } from 'axios';

import { axiosErrorHandler } from '@/utils/axiosErrorHandler';

export const tryAction = <R = unknown>(response: Promise<AxiosResponse<R, unknown>>) =>
  response.then((res) => res.data).catch(axiosErrorHandler);
