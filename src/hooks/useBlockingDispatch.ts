import { AsyncThunkConfig } from '@/types';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Action, AsyncThunkAction } from '@reduxjs/toolkit';
import { isFunction } from 'lodash';

import { AppDispatch } from '@/store';

export const useBlockingDispatch = () => {
  const dispatch: AppDispatch = useDispatch();
  const [blocked, setBlocked] = useState(false);

  const dispatchWithUIBlock = async (
    action: AsyncThunkAction<unknown, unknown, AsyncThunkConfig> | Action
  ) => {
    if (isFunction(action)) setBlocked(true);
    await dispatch(action);
    setBlocked(false);
  };

  return {
    dispatch: dispatchWithUIBlock,
    blocked,
  };
};
