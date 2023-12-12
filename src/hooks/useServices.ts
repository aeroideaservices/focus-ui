import { IService } from '@/types/services/services';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useMatch, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@mantine/hooks';

import { getDefaultPlugin } from '@/utils/getDefaultPlugin';

import { PLUGIN_PATHS, PluginCode, PLUGINS_ORDER } from '@/constants/plugins';
import { LS_KEY, ServiceCode } from '@/constants/services';

import { AppDispatch } from '@/store';
import {
  selectCurrentPlugin,
  selectCurrentService,
  selectServices,
  selectServicesMap,
  setCurrentService,
} from '@/store/slices/service/service';

const isPluginAvailable = (service: IService, plugin: PluginCode) =>
  service.plugins.includes(plugin);

export const useServices = () => {
  const servicesMap = useSelector(selectServicesMap);
  const servicesArr = useSelector(selectServices);
  const currentService = useSelector(selectCurrentService);
  const currentPlugin = useSelector(selectCurrentPlugin);
  const match = useMatch('/:plugin/:slug');
  const navigate = useNavigate();

  const [, saveServiceToLS] = useLocalStorage<ServiceCode>({
    key: LS_KEY,
  });

  const dispatch: AppDispatch = useDispatch();

  const availablePlugins = useMemo(
    () =>
      currentService
        ? PLUGINS_ORDER.filter((plugin) => isPluginAvailable(currentService, plugin))
        : [],
    [currentService]
  );

  const setService = (serviceCode: ServiceCode) => {
    const newService = servicesMap[serviceCode];

    if (!newService) return;

    dispatch(setCurrentService(serviceCode));
    saveServiceToLS(serviceCode);

    if (newService && currentPlugin) {
      if (match?.params.slug) {
        navigate(PLUGIN_PATHS[currentPlugin]);
      }

      if (availablePlugins.includes(currentPlugin)) {
        navigate(PLUGIN_PATHS[getDefaultPlugin(newService)]);
      }
    }
  };

  return {
    currentService,
    services: servicesArr,
    servicesMap: servicesMap,
    availablePlugins,
    setCurrentService: setService,
  };
};
