import { TToken } from '@/types';

import { apiAuthByRefresh } from '@/api/auth/auth';

import { getCookie, setCookie } from '@/utils/cookie';

import { CLIENT_ID, CLIENT_SECRET, REFRESH_CHECK_TIMEOUT } from '@/constants/token';

export const tokenGetAndRefresh = async (): Promise<string | null> => {
  if (getCookie('token')) {
    const now = Date.now();
    const parsedToken = getCookie('token') as string;
    const tokenInfo = JSON.parse(parsedToken);

    if (
      tokenInfo.expiresAt &&
      now < tokenInfo.expiresAt &&
      now + REFRESH_CHECK_TIMEOUT < tokenInfo.expiresAt
    ) {
      return JSON.parse(parsedToken);
    }

    if (tokenInfo.refreshExpiresAt && now < tokenInfo.refreshExpiresAt) {
      const dataToSend = {
        grant_type: 'refresh_token',
        refresh_token: tokenInfo.refresh_token,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      };
      const { data: refreshedToken } = await apiAuthByRefresh(dataToSend);

      setCookie(
        'token',
        JSON.stringify({
          ...refreshedToken,
          expiresAt: Date.now() + refreshedToken.expires_in * 1000,
          refreshExpiresAt: Date.now() + refreshedToken.refresh_expires_in * 1000,
        })
      );

      return refreshedToken.token;
    }
  }
  return null;
};

export const saveToken = (token: TToken) => {
  setCookie(
    'token',
    JSON.stringify({
      ...token,
      expiresAt: Date.now() + token.expires_in * 1000,
      refreshExpiresAt: Date.now() + token.refresh_expires_in * 1000,
    }),
    { path: '/' }
  );
};
