import { IFileType, IFolderType, ResourceType } from '@/types';

export function isFileType(value: IFileType | IFolderType): value is IFileType {
  return value.resourceType === ResourceType.FILE;
}
