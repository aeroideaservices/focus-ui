import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { PLUGIN_PATHS, PluginCode } from '@/constants/plugins';

import { AppDispatch } from '@/store';
import {
  selectCurrentPlugin,
  selectCurrentService,
  setCurrentPlugin,
} from '@/store/slices/service/service';

export const usePluginNavigation = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const currentPlugin = useSelector(selectCurrentPlugin);
  const currentService = useSelector(selectCurrentService);
  const { plugin } = useParams<{ plugin: PluginCode }>();

  const setPlugin = (newPlugin: PluginCode) => dispatch(setCurrentPlugin(newPlugin));

  useEffect(() => {
    if (plugin) setPlugin(plugin);
  }, [plugin]);

  useEffect(() => {
    if (!currentPlugin || !currentService) return;
    if (!currentService?.plugins.includes(currentPlugin))
      navigate(PLUGIN_PATHS[currentService.plugins[0]]);
  }, [currentService]);

  return {
    currentPlugin,
    setCurrentPlugin: setPlugin,
  };
};
