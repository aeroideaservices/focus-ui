import { FileSizeEnum } from '@/types';

export const getFileSize = (fileSize: number, type: FileSizeEnum): number => {
  switch (type) {
    case FileSizeEnum.KB:
      return fileSize / 1024;
    case FileSizeEnum.MB:
      return fileSize / 1024 / 1024;
    case FileSizeEnum.GB:
      return fileSize / 1024 / 1024 / 1024;
    case FileSizeEnum.TB:
      return fileSize / 1024 / 1024 / 1024 / 1024;
    default:
      return fileSize;
  }
};
