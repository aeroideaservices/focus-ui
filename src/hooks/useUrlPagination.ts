import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import qs from 'qs';

import { LIMIT } from '@/constants/common';

import { getFilterFromRouter } from '@/ui/pages/ModelContainer/utils/getFilterFromRouter';

/**
 * @callback SetPageHandler - Callback for changing the page
 * @param {number} page - new page number
 */

/**
 * @callback SetLimitHandler - Callback for changing the page
 * @param {number} limit - new limit value
 */

/**
 * @typedef {Object} PaginationState
 * @property {number} currentPage curent page
 * @property {number} pagesCount total pages count
 * @property {number} curentOffset current offset
 * @property {number} currentLimit current page items count
 * @property {SetPageHandler} setPage callback for changing the page
 * @property {SetLimitHandler} setLimit callback for changing items count
 */

/**
 * Hook for pagination based on `limit` and `offset` GET params
 * @param {number} total Total elements count
 * @param {number} [initialLimit=] initial limit
 * @returns {PaginationState} current pagination state
 *
 * @example
 *
 * import { useURLPagination } from '@/utils/useUrlPagination';
 * import { Pagination } from '@mantine/core';
 * import { selectModelElementsTotal } from '@/store/slices/models/model';\
 *
 * const PaginationDemo = () => {
 *   const modelElementsTotal = useSelector(selectModelElementsTotal);
 *   const { currentPage, setPage, pagesCount } = useURLPagination(modelElementsTotal);
 *   return <Pagination
              position={'right'}
              page={currentPage}
              total={pagesCount}
              onChange={setPage}
            />
 * }
 */
export const useURLPagination = (total: number, initialLimit?: number) => {
  const [params, setParams] = useSearchParams();
  const [currentLimit, setCurrentLimit] = useState(
    initialLimit || Number(params.get('limit')) || LIMIT
  );

  const currentFilters = getFilterFromRouter(params);

  const currentOffset = Number(params.get('offset')) || 0;

  const currentPage = useMemo(
    () => Math.ceil(currentOffset / currentLimit) + 1,
    [currentLimit, currentOffset]
  );

  const pagesCount = useMemo(
    () => Math.max(Math.ceil(total / currentLimit), currentPage),
    [total, currentLimit, currentPage]
  );

  const setPage = (page: number) => {
    const nextPage = page < 1 ? 1 : page;
    const nextOfsset = (nextPage - 1) * currentLimit;

    const newParams = {
      ...currentFilters,
      offset: nextOfsset,
      limit: currentLimit,
    };
    const URLParams = qs.stringify(newParams, { indices: false });

    setParams(URLParams);
  };

  const setLimit = (newLimit: number) => {
    const newParams = {
      ...currentFilters,
      offset: currentOffset,
      limit: newLimit,
    };
    const URLParams = qs.stringify(newParams, { indices: false });

    setParams(URLParams);
    setCurrentLimit(newLimit);
  };

  useEffect(() => {
    if (!total) return;
    if (currentOffset >= total) {
      const newOffset = Math.max(currentOffset - currentLimit, 0);
      const newParams = {
        ...currentFilters,
        offset: newOffset,
        limit: currentLimit,
      };
      const URLParams = qs.stringify(newParams, { indices: false });

      setParams(URLParams);
    }
  }, [total, currentOffset]);

  return { currentPage, setPage, pagesCount, currentOffset, currentLimit, setLimit };
};
