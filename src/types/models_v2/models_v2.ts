import { HTTPMethodEnum } from '..';

export enum FormFieldTypeEnum {
  NONE = 'none',
  CHECKBOX = 'checkbox',
  INTINPUT = 'intInput',
  UINTINPUT = 'uintInput',
  FLOATINPUT = 'floatInput',
  RATING = 'rating',
  SELECT = 'select',
  DATEPICKERINPUT = 'datePickerInput',
  DATETIMEPICKER = 'dateTimePicker',
  TEXTAREA = 'textarea',
  TEXTINPUT = 'textInput',
  WYSIWYG = 'wysiwyg',
  EDITORJS = 'editorJs',
  MEDIA = 'media',
  PHONEINPUT = 'phoneInput',
  EMAILINPUT = 'emailInput',
  KLADRSELECT = 'kladrSelect',
  COLORSINPUT = 'colorsInput',
  TIMEPICKERINPUT = 'timePickerInput',
}

export enum InputUtilsEnum {
  SLUGIFY = 'slugify',
}

export type TAny = string | number | boolean | number[] | string[] | Date | Date[];

export type TObject = Record<string, TAny>;

export type TAnyOf = TAny | TObject | TObject[];

export type TInputUtils = {
  code: InputUtilsEnum;
  field: string;
};

export type TRequest = {
  uri: string;
  meth: HTTPMethodEnum;
  body: {
    fields?: string[];
    description?: string;
  };
  paginated: boolean;
  display?: string[];
  identifier?: string;
  save?: string;
  service?: string;
};

export type TSelectData = {
  value: string;
  label: string;
  code?: string;
};

export type TProductsHints = {
  identifier: string;
  display: string[];
  request: TRequest;
};

export type TMediaUpload = {
  request: TRequest;
};

export type TExtraField = {
  utils?: TInputUtils[];
  request?: TRequest;
  selectData?: TSelectData[];
  productsHints?: TProductsHints;
  mediaUpload?: TMediaUpload;
  folderId?: string;
  identifier?: string;
  display?: string[];
  kladrSelect?: {
    fromBound: string;
    toBound: string;
  };
  range?: boolean;
};

export type TFormField = {
  code: string;
  name: string;
  type: FormFieldTypeEnum;
  multiple?: boolean;
  sortable?: boolean;
  block?: string;
  hidden?: boolean;
  disabled?: boolean;
  extra?: TExtraField;
  checked?: boolean;
  value?: TAny;
  step?: number;
  precision?: number;
};

export type TValidationField = {
  type: FormFieldTypeEnum;
  title: string;
  description?: string;
  required?: boolean;
  nullable?: boolean;
  properties?: Record<string, unknown>;
  items?: Record<string, unknown>;
  min?: number;
  max?: number;
  email?: boolean;
  uri?: boolean;
  phone?: boolean;
  unique?: boolean;
};

export type TModelTableElement = {
  code: string;
  name: string;
  sortable: boolean;
  isTime: boolean;
};

export interface IModelView {
  formFields: TFormField[];
}

export interface IModelViewValidation extends IModelView {
  validation: Record<string, TValidationField>;
}

export interface IModelViewList {
  fields: TModelTableElement[];
}

export type TModelItem = {
  name: string;
  code: string;
};

export interface IModelViews {
  create: IModelViewValidation;
  update: IModelViewValidation;
  list: IModelViewList;
  filter: IModelView;
}

export type TModel = {
  name: string;
  code: string;
  identifierCode: string;
  views: IModelViews;
};

export interface IListRes<T> {
  items: T[];
  total: number;
}
