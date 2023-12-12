import { TQueryParams } from '../common/common';
import { TAnyOf } from '../models_v2/models_v2';

export interface IModelReq {
  modelCode: string;
  params?: TQueryParams;
}

export interface IModelFieldValuesReq extends IModelReq {
  fieldCode: string;
}

export interface IModelElementsReq<T> extends IModelReq {
  data?: T;
}

export interface IModelElementReq<T> extends IModelElementsReq<T> {
  modelCode: string;
  modelElementId: string;
}

export interface IModelElementsBodyReq {
  fields?: string;
  filter?: TAnyOf;
}

export interface IDelodelElementsBodyReq {
  pKeys: string[] | number[];
}

export interface IModelExportRes {
  id: string;
  modelCode: string;
  filepath: string;
  status: string;
  time: string;
}
