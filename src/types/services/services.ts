import { PluginCode } from '@/constants/plugins';
import { ServiceCode } from '@/constants/services';

export interface IService {
  code: ServiceCode;
  name: string;
  plugins: PluginCode[];
  icon: string;
}

export type TServicesMap = { [key in ServiceCode]?: IService };
