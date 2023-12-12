import { combineReducers } from 'redux';

import authReducer from '@/store/slices/auth/auth';
import configurationReducer from '@/store/slices/configuration/configuration';
import configurationOptionReducer from '@/store/slices/configuration/configurationOption';
import configurationOptionsReducer from '@/store/slices/configuration/configurationOptions';
import configurationsReducer from '@/store/slices/configuration/configurations';
import mediaReducer from '@/store/slices/media/media';
import mediaFilesReducer from '@/store/slices/media/mediaFiles';
import mediaFoldersReducer from '@/store/slices/media/mediaFolders';
import menuReducer from '@/store/slices/menu/menu';
import menuItems from '@/store/slices/menu/menuItems';
import menusReducer from '@/store/slices/menu/menus';
import modelReducer from '@/store/slices/models/model';
import modelsReducer from '@/store/slices/models/models';
import serviceReducer from '@/store/slices/service/service';

const rootReducer = combineReducers({
  configurations: configurationsReducer,
  configuration: configurationReducer,
  configurationOptions: configurationOptionsReducer,
  configurationOption: configurationOptionReducer,
  media: mediaReducer,
  mediaFiles: mediaFilesReducer,
  mediaFolders: mediaFoldersReducer,
  model: modelReducer,
  models: modelsReducer,
  service: serviceReducer,
  menu: menuReducer,
  menus: menusReducer,
  menuItems: menuItems,
  auth: authReducer,
});

export default rootReducer;
export type IRootReducer = ReturnType<typeof rootReducer>;
