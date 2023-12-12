import { IAuthParams, TTokenRefresh } from '@/types';

import axios from 'axios';
import qs from 'qs';

import { tryAction } from '@/api/tryAction';
import { URLS } from '@/api/urls';

const api = axios.create({
  baseURL: process.env.PUBLIC_API_URL,
  paramsSerializer: (params) => {
    return qs.stringify(params, { indices: false });
  },
});

export const apiPostAuth = (data: IAuthParams) =>
  api.post(
    `${process.env.AUTH_URL}${URLS.auth.postAuth(process.env.REALM as string)}`,
    qs.stringify(data),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

export const apiAuthByRefresh = (data: TTokenRefresh) => {
  return api.post<{ token: string; expires_in: number; refresh_expires_in: number }>(
    `${process.env.AUTH_URL}${URLS.auth.postAuth(process.env.REALM as string)}`,
    qs.stringify(data),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
};

export const tryPostAuth = (data: IAuthParams) => tryAction(apiPostAuth(data));
