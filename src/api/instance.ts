import axios from 'axios';
import qs from 'qs';

import { getCookie, setCookie } from '@/utils/cookie';
import { tokenGetAndRefresh } from '@/utils/token';

const api = axios.create({
  baseURL: process.env.PUBLIC_API_URL,
  paramsSerializer: (params) => qs.stringify(params, { indices: false }),
});

export const objectToJson = (obj: Record<string, unknown>): string => {
  return JSON.stringify(obj, null, 0);
};

const requestMiddleware = async (config: any) => {
  const now = Date.now();
  const cookiesToken = getCookie('token') as string;
  const tokenInfo = cookiesToken ? JSON.parse(cookiesToken) : null;
  let accessToken = null;

  if (!(window.location.pathname === '/auth')) {
    if (!cookiesToken) {
      setCookie('token', '');
      window.location.assign('/auth');
    }

    if (tokenInfo && tokenInfo.refreshExpiresAt && now > tokenInfo.refreshExpiresAt) {
      setCookie('token', '');
      window.location.assign('/auth');
    } else {
      await tokenGetAndRefresh();
    }
  }

  if (cookiesToken) {
    accessToken = JSON.parse(cookiesToken).access_token;
  }

  const tokenFromHeaders = { Authorization: `Bearer ${accessToken}` };

  return {
    ...config,
    headers: {
      ...config.headers,
      ...tokenFromHeaders,
    },
  };
};

api.interceptors.request.use((config) => {
  const service = localStorage.getItem('service')?.replace(/"/g, '');

  if (config.headers) {
    if (!config?.headers['Service-Code']) {
      config.headers['Service-Code'] = service ? service : 'content';
    }
  }
  return config;
});

api.interceptors.request.use(requestMiddleware, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
