import { FileSizeEnum } from '@/types';

import { getFileSize } from './getFileSize';

export const getFilesSize = (files: File[], type: FileSizeEnum): number => {
  let size = 0;

  files.map((file) => {
    size = size + getFileSize(file.size, type);
  });

  return size;
};
