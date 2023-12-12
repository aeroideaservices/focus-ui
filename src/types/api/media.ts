export type TMoveFolderReq = {
  id: string;
  parentFolderId: string | null;
};

export type TRenameReq = {
  values: { id: string; name: string };
};

export type TAddFileReq = {
  file: File;
  alt?: string;
  title?: string;
  folderId?: string;
};

export type TAddFilesReq = {
  files: File[];
  folderId?: string;
};

export type TMoveFileReq = {
  id: string;
  folderId: string | null;
};

export type TGetFileInfo = {
  id: string;
};
