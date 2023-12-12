import { useDispatch } from 'react-redux';

import { getCookie } from '@/utils/cookie';
import { tokenGetAndRefresh } from '@/utils/token';

import { AppDispatch } from '@/store';
import { logout } from '@/store/slices/auth/auth';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const dispatch: AppDispatch = useDispatch();
  const now = Date.now();
  const parsedToken = getCookie('token') as string;
  const tokenInfo = parsedToken ? JSON.parse(parsedToken) : null;

  if (!parsedToken) {
    dispatch(logout(null));
  }

  if (tokenInfo && tokenInfo.refreshExpiresAt && now > tokenInfo.refreshExpiresAt) {
    dispatch(logout(null));
  } else {
    tokenGetAndRefresh();
  }

  return children;
};
export default RequireAuth;
