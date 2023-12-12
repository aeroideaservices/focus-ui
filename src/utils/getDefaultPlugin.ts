import { IService } from '@/types/services/services';

import { PLUGINS_ORDER } from '@/constants/plugins';

export const getDefaultPlugin = (service: IService) =>
  PLUGINS_ORDER.filter((item) => service.plugins.includes(item))[0];
