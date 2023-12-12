import { ReactNode } from 'react';
import {
  IconAdjustmentsHorizontal,
  IconGridDots,
  IconHierarchy2,
  IconPlayerPlay,
} from '@tabler/icons-react';

export enum PluginCode {
  MODELS = 'models-v2',
  MEDIA = 'media',
  MENUS = 'menus',
  CONFIGURATIONS = 'configurations',
}

export const PLUGIN_NAMES: { [key in PluginCode]: string } = {
  [PluginCode.MODELS]: 'Модели',
  [PluginCode.MEDIA]: 'Медиа',
  [PluginCode.MENUS]: 'Меню',
  [PluginCode.CONFIGURATIONS]: 'Конфигурации',
};

export const PLUGIN_PATHS: { [key in PluginCode]: string } = {
  [PluginCode.MODELS]: '/models-v2',
  [PluginCode.MEDIA]: '/media',
  [PluginCode.MENUS]: '/menus',
  [PluginCode.CONFIGURATIONS]: '/configurations',
};

export const PLUGIN_ICONS: { [key in PluginCode]: ReactNode } = {
  [PluginCode.MODELS]: <IconHierarchy2 size={24} />,
  [PluginCode.MEDIA]: <IconPlayerPlay size={24} />,
  [PluginCode.MENUS]: <IconGridDots size={24} />,
  [PluginCode.CONFIGURATIONS]: <IconAdjustmentsHorizontal size={24} />,
};

export const PLUGINS_ORDER: PluginCode[] = [
  PluginCode.MODELS,
  PluginCode.MEDIA,
  PluginCode.MENUS,
  PluginCode.CONFIGURATIONS,
];
