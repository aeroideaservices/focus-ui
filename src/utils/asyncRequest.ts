import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';

import { axiosErrorHandler } from './axiosErrorHandler';

export function createThunkRequest<R = unknown, P = unknown>(
  type: string,
  request: (params: P) => Promise<R>
): ReturnType<typeof createAsyncThunk<R, P>>;

export function createThunkRequest<R = unknown, P = unknown, T = unknown>(
  prefix: string,
  request: (params: P) => Promise<R>,
  mapFn: (value: R, params: P) => T | Promise<T>
): ReturnType<typeof createAsyncThunk<T, P>>;

export function createThunkRequest<R = unknown, P = unknown, T = unknown>(
  prefix: string,
  request: (params: P) => Promise<R>,
  mapFn?: (value: R, params: P) => T
): ReturnType<typeof createAsyncThunk<T | R, P>> {
  return createAsyncThunk<R | T, P>(prefix, async (params: P, { rejectWithValue }) => {
    const promise = request(params);
    try {
      const res: R = await promise;
      if (!res) return rejectWithValue(res);
      if (mapFn) {
        const mappedRes = mapFn(res, params);
        if (mappedRes instanceof Promise) return await mappedRes;
        return mappedRes;
      }
      return res;
    } catch (e) {
      axiosErrorHandler(e as AxiosError<{ message: string; error_description: string }>);
      return rejectWithValue(null);
    }
  });
}

export const createAxiosThunk = <R = unknown, P = undefined>(
  type: string,
  request: (params: P) => Promise<AxiosResponse<R>>
) => createThunkRequest(type, request, ({ data }) => data);
