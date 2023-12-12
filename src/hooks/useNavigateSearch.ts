import { createSearchParams, URLSearchParamsInit, useNavigate } from 'react-router-dom';

export const useNavigateSearch = () => {
  const navigate = useNavigate();

  return (pathname: string, params: URLSearchParamsInit) =>
    navigate({ pathname, search: `?${createSearchParams(params)}` });
};
