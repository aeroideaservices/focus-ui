import { PluginCode } from '@/constants/plugins';

export interface IPlugin {
  code: PluginCode;
  name: string;
}

export type TPluginsMap = {
  [key in PluginCode]: IPlugin;
};
