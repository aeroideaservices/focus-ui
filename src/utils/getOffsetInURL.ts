import { OFFSET } from '@/constants/common';

export const getOffsetInURL = (searchParams: URLSearchParams, constOffset?: number): number => {
  const offset = searchParams.get('offset');

  return offset ? Number(offset) : constOffset ? constOffset : OFFSET;
};
