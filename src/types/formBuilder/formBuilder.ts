import { DataTypeEnum, FormFieldTypeEnum, HTTPMethodEnum } from '..';

export type TFormBuilderRequest = {
  uri: string;
  meth: HTTPMethodEnum;
  service: string;
  save: string;
  display: string[];
  paginated: boolean;
  body: Record<string, unknown>;
};

export interface TFormField<T> {
  code: FormFieldTypeEnum;
  dataType: DataTypeEnum;
  multiple: boolean;
  opts: T;
}
