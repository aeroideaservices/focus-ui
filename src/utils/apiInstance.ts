import axios from 'axios';
import qs from 'qs';

import { PUBLIC_API_URL } from '@/constants/common';

import { getCookie } from './cookie';

const apiInstance = axios.create({
  baseURL: PUBLIC_API_URL,
  paramsSerializer: (params) => {
    return qs.stringify(params, { indices: false });
  },
});

const requestMiddleware = async (config: any) => {
  const cookiesToken = getCookie('token') as string;
  let accessToken = null;

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

apiInstance.interceptors.request.use(
  (config) => {
    return requestMiddleware(config);
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiInstance;
