import { TFilter } from '@/ui/organisms/FiltersBuilder/types';

import { TQueryParams } from '../common/common';
import { TModel, TModelElement } from '../models/models';

export type FilterableItem = {
  code: string;
  name: string;
  viewType: string;
};

export type TGetModelSettingsRes = {
  filterable: TFilter[];
  shownInList: TModel[];
  sortable: TModel[];
};

export type TGetModelElementsReq = {
  modelCode: string;
  params: TQueryParams;
  data?: Record<string, unknown> | any;
};

export type TChangeModelElementsReq = {
  modelCode: string;
  elementId: string;
  data?: Record<string, unknown>;
  params?: TQueryParams;
};

export type TModelElementReq = {
  modelCode: string;
  elementId: string;
};

export type TModelElementValuesReq = {
  modelCode: string;
  fieldCode: string;
};

export type TDelModelElementsReq = {
  modelCode: string;
  data: {
    ids: string[];
  };
};

export type TModelElementFieldsReq = {
  modelCode: string;
};

export type TAddModelElementReq = {
  modelCode: string;
  data: TModelElement;
};

export type TCodeAndHeaders = {
  code: string;
};
