import { ModelExportStatusEnum } from '@/types';
import { IModelExportRes } from '@/types/api/models_v2';

import notify from '@/utils/notify';

export const downloadModalExport = (modelExport: IModelExportRes) => {
  switch (modelExport.status) {
    case ModelExportStatusEnum.SUCCEED:
      window.open(modelExport.filepath);

      return notify({ message: 'Отчёт готов', type: 'success' });
    case ModelExportStatusEnum.PENDING:
      return notify({ message: 'Идет формирование отчёта', type: 'info' });
    case ModelExportStatusEnum.ERROR:
      return notify({ message: 'Произошла ошибка. Попробуйте позже', type: 'error' });
    default:
      return null;
  }
};
