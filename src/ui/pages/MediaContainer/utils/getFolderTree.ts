import { IFolderTree, IFolderType } from '@/types';

function buildTree(folders: IFolderType[]) {
  const map = new Map(folders.map((item) => [item.folderFields.id, { ...item }]));

  for (let item of map.values()) {
    if (!item.folderFields.parentFolderId || !map.has(item.folderFields.parentFolderId)) {
      continue;
    }

    const parent = map.get(item.folderFields.parentFolderId) as IFolderTree;

    if (!parent) continue;
    const child = item as IFolderTree;

    if (parent.children) parent.children.push(child);
    else parent.children = [child];
  }

  return [...map.values()].filter((item) => !item.folderFields.parentFolderId);
}

export const getFolderTree = (folders: IFolderType[] | null) => {
  if (!folders) return null;

  return buildTree(folders);
};
