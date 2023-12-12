import { TypeEnum } from '..';

export type TConfiguration = {
  id: string;
  code: string;
  name: string;
};

export type TConfigurationOption = {
  code: string;
  name: string;
  type: TypeEnum;
  value?: string;
  id?: string;
  map?: any;
};

export type TConfigurationOptionsItem = {
  code: string;
  value: string;
};
