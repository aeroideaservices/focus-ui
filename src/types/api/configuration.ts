import { TQueryParams } from '../common/common';
import { TConfigurationOption, TConfigurationOptionsItem } from '../configurations/configurations';

export type TGetConfigurationReq = {
  confId: string;
};

export type TAddConfigurationsReq = {
  data: {
    code: string;
    name: string;
  };
};

export type TPutConfigurationReq = {
  id: string;
  data: {
    code: string;
    name: string;
  };
};

export type TDeleteConfigurationReq = {
  id: string;
};

export type TGetConfigurationOptionsReq = {
  id: string;
  params: TQueryParams;
};

export type TGetConfigurationOptionsRes = {
  total: number;
  items: TConfigurationOption[];
};

export type TAddConfigurationOptionsReq = {
  id: string;
  option: TConfigurationOption;
};

export type TPutConfigurationOptionsReq = {
  id: string;
  options: TConfigurationOptionsItem[];
};

export type TConfigurationOptionParams = {
  confId: string;
  optId: string;
};

export type TPutConfigurationOptionReq = {
  params: TConfigurationOptionParams;
  data: TConfigurationOption;
};
