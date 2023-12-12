import { IFile, IFolder } from '@/types';

export function isFile(value: IFile | IFolder): value is IFile {
  return 'ext' in value;
}
