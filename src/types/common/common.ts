import { FlexProps } from '@mantine/core';
import { Dispatch } from 'redux';

export type TQueryParams<F = Record<string, unknown>> = {
  offset: number;
  limit: number;
  sort?: string;
  order?: string;
  query?: string;
  filter?: F;
  parentFolderId?: string;
  page?: number;
};

export type TQueryParamsNew = {
  params?: {
    offset: number;
    limit: number;
    sort?: string;
    order?: string;
    query?: string;
    filter?: Record<string, unknown>;
    parentFolderId?: string;
    page?: number;
  };
};

export type TElementsRes<T> = {
  total: number;
  items: T[];
};

export type TBreadcrumbsExtItem = {
  name: string;
  url?: string;
  icon?: JSX.Element;
};

export type TTableConfig = {
  code: string;
  name: string;
  trimming?: boolean;
  maxWidth?: number;
  minWidth?: number;
  align?: FlexProps['align'];
};

export interface IServiceIcons {
  [index: string]: JSX.Element;
}

export type TCancellablePromise<T = unknown> = Promise<T> & { abort: () => void };

export type AsyncThunkConfig = {
  /** return type for `thunkApi.getState` */
  state?: unknown;
  /** type for `thunkApi.dispatch` */
  dispatch?: Dispatch;
  /** type of the `extra` argument for the thunk middleware, which will be passed in as `thunkApi.extra` */
  extra?: unknown;
  /** type to be passed into `rejectWithValue`'s first argument that will end up on `rejectedAction.payload` */
  rejectValue?: unknown;
  /** return type of the `serializeError` option callback */
  serializedErrorType?: unknown;
  /** type to be returned from the `getPendingMeta` option callback & merged into `pendingAction.meta` */
  pendingMeta?: unknown;
  /** type to be passed into the second argument of `fulfillWithValue` to finally be merged into `fulfilledAction.meta` */
  fulfilledMeta?: unknown;
  /** type to be passed into the second argument of `rejectWithValue` to finally be merged into `rejectedAction.meta` */
  rejectedMeta?: unknown;
};
