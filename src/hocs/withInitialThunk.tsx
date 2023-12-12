import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AsyncThunkAction } from '@reduxjs/toolkit';

import { AppDispatch, RootState } from '@/store';

export const withInitialThunk = function <P, R extends any, A extends any>(
  component: FC<P>,
  thunk: AsyncThunkAction<
    R,
    A | undefined,
    {
      state: RootState;
      rejectValue: any;
      dispatch: AppDispatch;
    }
  >
) {
  return (props: P) => {
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
      dispatch(thunk);
    }, []);

    return component(props);
  };
};
