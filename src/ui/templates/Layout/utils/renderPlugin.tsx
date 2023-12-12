import { PluginCode } from '@/constants/plugins';

import { ConfsPage, MediaPage, MenusPage, ModelPage } from './pluginPages';

import RequireAuth from '@/services/RequireAuth/RequireAuth';

const pluginPagesMap: { [key in PluginCode]: JSX.Element } = {
  [PluginCode.MODELS]: ModelPage,
  [PluginCode.MEDIA]: MediaPage,
  [PluginCode.MENUS]: MenusPage,
  [PluginCode.CONFIGURATIONS]: ConfsPage,
};

export const renderPlugin = (plugin: PluginCode) => (
  <RequireAuth>{pluginPagesMap[plugin]}</RequireAuth>
);
