import { ModelExportStatusEnum, ViewTypeEnum } from '..';

export type TModel = {
  name: string;
  code: string;
  primary?: boolean;
  formField?: any;
  block?: string;
  disabled?: boolean;
  viewType?: ViewTypeEnum;
  filterable?: boolean;
  shownInList?: boolean;
  sortable?: boolean;
  associationCode?: string;
  value?: string;
  required?: boolean;
  sluggableOn?: string;
};

export type TModelField = {
  code: string;
  value: string;
};

export type TModelElement = {
  items?: any;
  fieldValues: TModelField[];
};

export type TModelExport = {
  id: string;
  modelCode: string;
  filepath: string;
  status: ModelExportStatusEnum;
  time: string;
};
