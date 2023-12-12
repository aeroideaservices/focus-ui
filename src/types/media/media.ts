import { ResourceType, TElementsRes } from '..';

export interface IFolder {
  name: string;
  parentFolderId: string | null;
  id: string;
  depthLevel?: number;
  size?: string;
}

export interface IFolderFetch {
  values: {
    name: string;
    parentFolderId: string | null;
    id?: string;
    depthLevel?: number;
    size?: string;
  };
}

export interface IFolderTree extends IFolderType {
  children?: IFolderTree[];
}

export interface IFolderType {
  resourceType: ResourceType.FOLDER;
  folderFields: IFolder;
}

export interface IBreadcrumb {
  folderId: IFolder['id'];
  name: IFolder['name'];
}

export type TMediaRes = TElementsRes<IFolderType | IFileType> & {
  breadcrumbs: IBreadcrumb[];
};

export interface IFile {
  id: string;
  name: string;
  size: string;
  updatedAt: string;
  url: string;
  ext: string;
  contentType: string;
  folderId?: string;
  alt?: string;
  title?: string;
}

export interface IFileType {
  resourceType: ResourceType.FILE;
  fileFields: IFile;
}
