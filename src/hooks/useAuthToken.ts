import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { getCookie } from '@/utils/cookie';
import { tokenGetAndRefresh } from '@/utils/token';

import { REFRESH_CHECK_TIMEOUT } from '@/constants/token';

import { AppDispatch } from '@/store';
import { setUserToken } from '@/store/slices/auth/auth';

export const useAuthToken = () => {
  const dispatch: AppDispatch = useDispatch();
  const token = getCookie('token');

  useEffect(() => {
    dispatch(setUserToken(token));

    const Interval = setInterval(async () => {
      const updateToken = await tokenGetAndRefresh();

      if (updateToken) dispatch(setUserToken(updateToken));
    }, REFRESH_CHECK_TIMEOUT);

    return () => {
      clearInterval(Interval);
    };
  }, [token]);
};
