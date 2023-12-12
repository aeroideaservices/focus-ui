import { LIMIT } from '@/constants/common';

export const getLimitInURL = (searchParams: URLSearchParams, constLimit?: number): number => {
  const limit = searchParams.get('limit');

  return limit && limit !== '0' ? Number(limit) : constLimit ? constLimit : LIMIT;
};
