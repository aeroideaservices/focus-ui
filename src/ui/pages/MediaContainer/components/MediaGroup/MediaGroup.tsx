import { IFileType, IFolderType, ResourceType, TCancellablePromise } from '@/types';

import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ScrollArea, SimpleGrid } from '@mantine/core';

import { PLUGIN_PATHS, PluginCode } from '@/constants/plugins';

import MediaItem from '../MediaItem/MediaItem';

import { AppDispatch } from '@/store';
import { selectSelectedId, setMedia, setSelectedId } from '@/store/slices/media/media';
import { fetchGetFileInfo, setCurrentFile } from '@/store/slices/media/mediaFiles';
import { fetchGetFolderInfo, setCurrentFolder } from '@/store/slices/media/mediaFolders';

interface IMediaGroup {
  height: string | number;
  items: (IFolderType | IFileType)[];
}

const MediaGroup: FC<IMediaGroup> = ({ height, items }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [fileFetchPromise, setFileFetchPromise] = useState<TCancellablePromise | null>(null);
  const [folderFetchPromise, setFolderFetchPromise] = useState<TCancellablePromise | null>(null);
  const selectedItemId = useSelector(selectSelectedId);

  const clickOutsideItemHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const element = e.target as HTMLDivElement;
    const classes = element.classList;

    let outside = false;

    classes.forEach((cl) => {
      if (cl.indexOf('ScrollArea') !== -1) outside = true;
      if (cl.indexOf('SimpleGrid') !== -1) outside = true;
    });

    if (outside) {
      dispatch(setSelectedId(null));
      dispatch(setCurrentFolder(null));
      dispatch(setCurrentFile(null));
    }
  };

  const cancelRequests = () => {
    if (fileFetchPromise) fileFetchPromise.abort();
    if (folderFetchPromise) folderFetchPromise.abort();
  };

  const handleSelectItem = (id: string, type: ResourceType) => {
    if (id === selectedItemId) return;
    cancelRequests();
    dispatch(setSelectedId(id));
    dispatch(setCurrentFolder(null));
    dispatch(setCurrentFile(null));

    if (type === ResourceType.FILE) setFileFetchPromise(dispatch(fetchGetFileInfo({ id })));
    if (type === ResourceType.FOLDER) setFolderFetchPromise(dispatch(fetchGetFolderInfo({ id })));
  };

  const handleSubmitItem = (id: string, type: ResourceType) => {
    if (type === ResourceType.FOLDER) {
      cancelRequests();
      dispatch(setCurrentFolder(null));
      dispatch(setSelectedId(null));
      dispatch(setMedia(null));
      dispatch(setCurrentFile(null));

      navigate(`${PLUGIN_PATHS[PluginCode.MEDIA]}/${id}`);
    }
  };

  const getResource = (item: IFolderType | IFileType) => {
    return item.resourceType === ResourceType.FOLDER ? item.folderFields : item.fileFields;
  };

  return (
    <ScrollArea sx={{ height }} onClick={(e) => clickOutsideItemHandler(e)}>
      <SimpleGrid cols={3} spacing="md" p="md">
        {items.map((item) => (
          <MediaItem
            key={getResource(item).id}
            type={item.resourceType}
            item={getResource(item)}
            onSelect={handleSelectItem}
            onSubmit={handleSubmitItem}
            selected={getResource(item).id === selectedItemId}
          />
        ))}
      </SimpleGrid>
    </ScrollArea>
  );
};

export default React.memo(MediaGroup);
